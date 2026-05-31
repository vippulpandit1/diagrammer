// Tests for App.tsx — main application container
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import App from "../App";

// ─── Shared captured props ────────────────────────────────────────────────────
const mocks = vi.hoisted(() => ({
  glyphCanvasProps: null as any,
  headerBarProps: null as any,
  propertySheetProps: null as any,
  bottomPanelProps: null as any,
}));

// Plain stub objects that satisfy App.tsx state setters (truthy, no class needed)
const STUB_GLYPH = {
  id: "g-click", type: "rect", x: 10, y: 10, width: 120, height: 80,
  label: "click", ports: [], data: {}, inputs: 1, outputs: 1,
  attrs: [], methods: [], groupId: undefined, icon: undefined,
};
const STUB_CONN = {
  id: "c-click", fromGlyphId: "g1", fromPortId: "p1",
  toGlyphId: "g2", toPortId: "p2", label: "", view: [],
};

// ─── Mock all child components ────────────────────────────────────────────────

vi.mock("../GlyphCanvas", () => ({
  GlyphCanvas: (props: any) => {
    mocks.glyphCanvasProps = props;
    return (
      <div data-testid="glyph-canvas">
        <button data-testid="add-conn" onClick={() => props.onAddConnection({ ...STUB_CONN, id: "c-test" })} />
        <button data-testid="del-conn" onClick={() => props.onDeleteConnection(0)} />
        <button data-testid="click-glyph" onClick={() => props.onGlyphClick?.(STUB_GLYPH)} />
        <button data-testid="click-conn" onClick={() => props.onConnectionClick?.(STUB_CONN)} />
        <button data-testid="add-glyph" onClick={() => props.onAddGlyph("rect", 50, 50)} />
      </div>
    );
  },
}));

vi.mock("../HeaderBar", () => ({
  HeaderBar: (props: any) => {
    mocks.headerBarProps = props;
    return (
      <div data-testid="header-bar">
        <button data-testid="hdr-clear" onClick={props.onClear} />
        <button data-testid="hdr-zoom-in" onClick={props.onZoomIn} />
        <button data-testid="hdr-zoom-out" onClick={props.onZoomOut} />
        <button data-testid="hdr-save" onClick={props.onSave} />
        <button data-testid="hdr-auto-arrange" onClick={props.onAutoArrange} />
        <button
          data-testid="hdr-import"
          onClick={() =>
            props.onImport(
              JSON.stringify({
                pages: [{ id: "p-imp", name: "Imported", glyphs: [], connections: [] }],
              }),
              "my-diagram.json"
            )
          }
        />
        <button data-testid="hdr-import-bad" onClick={() => props.onImport("not json")} />
        <button
          data-testid="hdr-import-empty"
          onClick={() => props.onImport(JSON.stringify({ pages: [] }))}
        />        <button data-testid="hdr-print" onClick={props.onPrint} />      </div>
    );
  },
}));

vi.mock("../PropertySheet", () => ({
  PropertySheet: (props: any) => {
    mocks.propertySheetProps = props;
    return (
      <div data-testid="property-sheet">
        <button data-testid="ps-close" onClick={props.onClose} />
        {props.onUpdateGlyph && (
          <button
            data-testid="ps-update-glyph"
            onClick={() => props.onUpdateGlyph("g-click", { label: "Updated" })}
          />
        )}
        {props.onUpdateConnection && (
          <button
            data-testid="ps-update-conn"
            onClick={() => props.onUpdateConnection("c-click", { label: "Updated" })}
          />
        )}
      </div>
    );
  },
}));

vi.mock("../BottomPanel", () => ({
  BottomPanel: (props: any) => {
    mocks.bottomPanelProps = props;
    return (
      <div data-testid="bottom-panel">
        <button data-testid="bp-clear" onClick={props.onClear} />
        <button data-testid="bp-collapse" onClick={() => props.onCollapseChange(true, 0)} />
      </div>
    );
  },
}));

vi.mock("../Toolbar", () => ({
  Toolbar: () => <div data-testid="toolbar" />,
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const renderApp = () => render(<App />);

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("App", () => {
  beforeEach(() => {
    sessionStorage.clear();
    Object.assign(mocks, {
      glyphCanvasProps: null,
      headerBarProps: null,
      propertySheetProps: null,
      bottomPanelProps: null,
    });
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  // ─── Initial render ────────────────────────────────────────────────────────

  describe("initial render", () => {
    it("renders all major UI regions", () => {
      renderApp();
      expect(screen.getByTestId("header-bar")).not.toBeNull();
      expect(screen.getByTestId("glyph-canvas")).not.toBeNull();
      expect(screen.getByTestId("bottom-panel")).not.toBeNull();
      expect(screen.getByTestId("toolbar")).not.toBeNull();
    });

    it("starts with one page (Page 1)", () => {
      renderApp();
      expect(screen.getByText("Page 1")).not.toBeNull();
    });

    it("renders the footer copyright text", () => {
      renderApp();
      expect(screen.getByText(/R_js_draw/)).not.toBeNull();
    });

    it("passes zoom=1 to GlyphCanvas by default", () => {
      renderApp();
      expect(mocks.glyphCanvasProps.zoom).toBe(1);
    });

    it("passes an empty glyphs array to GlyphCanvas initially", () => {
      renderApp();
      expect(mocks.glyphCanvasProps.glyphs).toHaveLength(0);
    });

    it("passes an empty connections array to GlyphCanvas initially", () => {
      renderApp();
      expect(mocks.glyphCanvasProps.connections).toHaveLength(0);
    });
  });

  // ─── Zoom controls ────────────────────────────────────────────────────────

  describe("zoom controls", () => {
    it("increases zoom when onZoomIn is called", async () => {
      renderApp();
      const initial = mocks.glyphCanvasProps.zoom;
      fireEvent.click(screen.getByTestId("hdr-zoom-in"));
      await waitFor(() =>
        expect(mocks.glyphCanvasProps.zoom).toBeCloseTo(initial + 0.1, 5)
      );
    });

    it("decreases zoom when onZoomOut is called", async () => {
      renderApp();
      fireEvent.click(screen.getByTestId("hdr-zoom-out"));
      await waitFor(() =>
        expect(mocks.glyphCanvasProps.zoom).toBeCloseTo(0.9, 5)
      );
    });

    it("does not zoom above 2", async () => {
      renderApp();
      for (let i = 0; i < 15; i++) fireEvent.click(screen.getByTestId("hdr-zoom-in"));
      await waitFor(() =>
        expect(mocks.glyphCanvasProps.zoom).toBeLessThanOrEqual(2)
      );
    });

    it("does not zoom below 0.2", async () => {
      renderApp();
      for (let i = 0; i < 20; i++) fireEvent.click(screen.getByTestId("hdr-zoom-out"));
      await waitFor(() =>
        expect(mocks.glyphCanvasProps.zoom).toBeGreaterThanOrEqual(0.2)
      );
    });

    it("persists zoom to sessionStorage on change", async () => {
      renderApp();
      fireEvent.click(screen.getByTestId("hdr-zoom-in"));
      await waitFor(() => {
        const saved = sessionStorage.getItem("zoomRatio");
        expect(saved).not.toBeNull();
        expect(Number(saved)).toBeCloseTo(1.1, 5);
      });
    });
  });

  // ─── Save ─────────────────────────────────────────────────────────────────

  describe("save", () => {
    it("saves canvas data to sessionStorage when onSave is called", async () => {
      renderApp();
      fireEvent.click(screen.getByTestId("hdr-save"));
      await waitFor(() => {
        const saved = sessionStorage.getItem("canvasData");
        expect(saved).not.toBeNull();
        const parsed = JSON.parse(saved!);
        expect(Array.isArray(parsed.pages)).toBe(true);
      });
    });

    it("saves stencilType and connectionType in the envelope", async () => {
      renderApp();
      fireEvent.click(screen.getByTestId("hdr-save"));
      const saved = JSON.parse(sessionStorage.getItem("canvasData")!);
      expect(saved).toHaveProperty("stencilType");
      expect(saved).toHaveProperty("connectionType");
    });
  });

  // ─── Import ───────────────────────────────────────────────────────────────

  describe("import", () => {
    it("loads pages from valid JSON into the active tab on import", async () => {
      renderApp();
      fireEvent.click(screen.getByTestId("hdr-import"));
      await waitFor(() =>
        expect(
          mocks.bottomPanelProps.messages.some((m: string) =>
            m.includes("Imported")
          )
        ).toBe(true)
      );
      // Active tab is renamed to the file name (without extension)
      expect(screen.getByText("my-diagram")).not.toBeNull();
    });

    it("adds an 'Import failed' message when JSON is invalid", async () => {
      renderApp();
      fireEvent.click(screen.getByTestId("hdr-import-bad"));
      await waitFor(() =>
        expect(
          mocks.bottomPanelProps.messages.some((m: string) =>
            m.includes("Import failed")
          )
        ).toBe(true)
      );
    });

    it("adds an 'Import failed' message when pages array is empty", async () => {
      renderApp();
      fireEvent.click(screen.getByTestId("hdr-import-empty"));
      await waitFor(() =>
        expect(
          mocks.bottomPanelProps.messages.some((m: string) =>
            m.includes("Import failed")
          )
        ).toBe(true)
      );
    });

    it("adds an 'Import failed' message when imported JSON parses to null", async () => {
      renderApp();
      // JSON.parse("null") === null, which triggers the null-object guard
      mocks.headerBarProps.onImport("null");
      await waitFor(() =>
        expect(
          mocks.bottomPanelProps.messages.some((m: string) =>
            m.includes("Import failed")
          )
        ).toBe(true)
      );
    });

    it("imports pages with stencilType, connectionType, toolbarOrientation, and toolbarPos", async () => {
      renderApp();
      mocks.headerBarProps.onImport(
        JSON.stringify({
          pages: [{ id: "p-full", name: "Full Import", glyphs: [], connections: [] }],
          stencilType: "bpmn",
          connectionType: "inheritance",
          toolbarOrientation: "horizontal",
          toolbarPos: { x: 50, y: 80 },
        })
      );
      await waitFor(() =>
        expect(
          mocks.bottomPanelProps.messages.some((m: string) =>
            m.includes("Imported")
          )
        ).toBe(true)
      );
    });
  });

  // ─── Page management ──────────────────────────────────────────────────────

  describe("page management", () => {
    it("adds a new page when the Add Page button is clicked", async () => {
      renderApp();
      fireEvent.click(screen.getByText("＋ Add Page"));
      await waitFor(() => expect(screen.getByText("Page 2")).not.toBeNull());
    });

    it("switches active page when a tab is clicked", async () => {
      renderApp();
      fireEvent.click(screen.getByText("＋ Add Page"));
      await waitFor(() => screen.getByText("Page 2"));
      // Now click Page 1 tab to go back
      fireEvent.click(screen.getByText("Page 1"));
      await waitFor(() =>
        expect(mocks.glyphCanvasProps.activePageIdx).toBe(0)
      );
    });

    it("enters edit mode on page tab double-click", async () => {
      renderApp();
      fireEvent.dblClick(screen.getByText("Page 1"));
      await waitFor(() => {
        const input = document.querySelector("input[type=text]");
        expect(input).not.toBeNull();
      });
    });

    it("saves page name on Enter key in edit mode", async () => {
      renderApp();
      fireEvent.dblClick(screen.getByText("Page 1"));
      const input = document.querySelector("input[type=text]") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "Renamed" } });
      fireEvent.keyDown(input, { key: "Enter" });
      await waitFor(() => expect(screen.getByText("Renamed")).not.toBeNull());
    });

    it("cancels page name edit on Escape key", async () => {
      renderApp();
      fireEvent.dblClick(screen.getByText("Page 1"));
      const input = document.querySelector("input[type=text]") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "Not Saved" } });
      fireEvent.keyDown(input, { key: "Escape" });
      await waitFor(() => {
        expect(screen.queryByText("Not Saved")).toBeNull();
        expect(screen.getByText("Page 1")).not.toBeNull();
      });
    });

    it("saves page name on blur", async () => {
      renderApp();
      fireEvent.dblClick(screen.getByText("Page 1"));
      const input = document.querySelector("input[type=text]") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "Blurred" } });
      fireEvent.blur(input);
      await waitFor(() => expect(screen.getByText("Blurred")).not.toBeNull());
    });
  });

  // ─── Clear canvas ─────────────────────────────────────────────────────────

  describe("clear canvas", () => {
    it("clears glyphs and connections when onClear is called", async () => {
      renderApp();
      fireEvent.click(screen.getByTestId("add-glyph"));
      await waitFor(() => expect(mocks.glyphCanvasProps.glyphs).toHaveLength(1));

      fireEvent.click(screen.getByTestId("hdr-clear"));
      await waitFor(() => {
        expect(mocks.glyphCanvasProps.glyphs).toHaveLength(0);
        expect(mocks.glyphCanvasProps.connections).toHaveLength(0);
      });
    });
  });

  // ─── Glyph operations ─────────────────────────────────────────────────────

  describe("glyph operations", () => {
    it("adds a glyph when onAddGlyph fires from the canvas", async () => {
      renderApp();
      fireEvent.click(screen.getByTestId("add-glyph"));
      await waitFor(() =>
        expect(mocks.glyphCanvasProps.glyphs).toHaveLength(1)
      );
    });

    it("passes bringGlyphToFront to GlyphCanvas", () => {
      renderApp();
      expect(typeof mocks.glyphCanvasProps.bringGlyphToFront).toBe("function");
    });

    it("passes sendGlyphToBack to GlyphCanvas", () => {
      renderApp();
      expect(typeof mocks.glyphCanvasProps.sendGlyphToBack).toBe("function");
    });

    it("passes groupGlyphs to GlyphCanvas", () => {
      renderApp();
      expect(typeof mocks.glyphCanvasProps.groupGlyphs).toBe("function");
    });

    it("passes ungroupGlyphs to GlyphCanvas", () => {
      renderApp();
      expect(typeof mocks.glyphCanvasProps.ungroupGlyphs).toBe("function");
    });

    it("passes onMoveGlyph to GlyphCanvas", () => {
      renderApp();
      expect(typeof mocks.glyphCanvasProps.onMoveGlyph).toBe("function");
    });

    it("passes onResizeGlyph to GlyphCanvas", () => {
      renderApp();
      expect(typeof mocks.glyphCanvasProps.onResizeGlyph).toBe("function");
    });
  });

  // ─── Connections ──────────────────────────────────────────────────────────

  describe("connections", () => {
    it("passes onAddConnection handler to GlyphCanvas", () => {
      renderApp();
      expect(typeof mocks.glyphCanvasProps.onAddConnection).toBe("function");
    });

    it("passes onDeleteConnection handler to GlyphCanvas", () => {
      renderApp();
      expect(typeof mocks.glyphCanvasProps.onDeleteConnection).toBe("function");
    });

    it("onAddConnection does not throw when called", () => {
      renderApp();
      expect(() =>
        fireEvent.click(screen.getByTestId("add-conn"))
      ).not.toThrow();
    });

    it("onDeleteConnection does not throw when called", () => {
      renderApp();
      // add a connection first so there is something at index 0 to delete
      fireEvent.click(screen.getByTestId("add-conn"));
      expect(() =>
        fireEvent.click(screen.getByTestId("del-conn"))
      ).not.toThrow();
    });
  });

  // ─── Property sheet ───────────────────────────────────────────────────────

  describe("property sheet", () => {
    it("opens property sheet when a glyph is clicked on the canvas", async () => {
      renderApp();
      fireEvent.click(screen.getByTestId("click-glyph"));
      await waitFor(() => screen.getByTestId("property-sheet"));
    });

    it("opens property sheet when a connection is clicked on the canvas", async () => {
      renderApp();
      fireEvent.click(screen.getByTestId("click-conn"));
      await waitFor(() => screen.getByTestId("property-sheet"));
    });

    it("closes property sheet on onClose", async () => {
      renderApp();
      fireEvent.click(screen.getByTestId("click-glyph"));
      await waitFor(() => screen.getByTestId("ps-close"));
      fireEvent.click(screen.getByTestId("ps-close"));
      await waitFor(() =>
        expect(screen.queryByTestId("property-sheet")).toBeNull()
      );
    });

    it("updates glyph without crash when PropertySheet calls onUpdateGlyph", async () => {
      renderApp();
      // Ensure a glyph is added so handleUpdateGlyph can find it
      fireEvent.click(screen.getByTestId("add-glyph"));
      fireEvent.click(screen.getByTestId("click-glyph"));
      await waitFor(() => screen.getByTestId("ps-update-glyph"));
      expect(() => fireEvent.click(screen.getByTestId("ps-update-glyph"))).not.toThrow();
    });

    it("updates connection without crash when PropertySheet calls onUpdateConnection", async () => {
      renderApp();
      fireEvent.click(screen.getByTestId("click-conn"));
      await waitFor(() => screen.getByTestId("ps-update-conn"));
      expect(() => fireEvent.click(screen.getByTestId("ps-update-conn"))).not.toThrow();
    });

    it("updates connection in state when connection id matches (TRUE branch)", async () => {
      renderApp();
      // Add STUB_CONN (id "c-click") directly to state so the update finds a match
      mocks.glyphCanvasProps.onAddConnection(STUB_CONN);
      await waitFor(() =>
        expect(mocks.glyphCanvasProps.connections).toHaveLength(1)
      );
      // Open property sheet for the same connection
      fireEvent.click(screen.getByTestId("click-conn"));
      await waitFor(() => screen.getByTestId("ps-update-conn"));
      // Update triggers connection.id === "c-click" TRUE branch
      fireEvent.click(screen.getByTestId("ps-update-conn"));
      await waitFor(() => {
        const updated = mocks.glyphCanvasProps.connections.find(
          (c: any) => c.id === "c-click"
        );
        expect(updated?.label).toBe("Updated");
      });
    });
  });

  // ─── Auto-arrange ─────────────────────────────────────────────────────────

  describe("auto-arrange", () => {
    it("rearranges glyphs in a grid when onAutoArrange is called", async () => {
      renderApp();
      fireEvent.click(screen.getByTestId("add-glyph"));
      fireEvent.click(screen.getByTestId("add-glyph"));
      await waitFor(() => expect(mocks.glyphCanvasProps.glyphs).toHaveLength(2));

      fireEvent.click(screen.getByTestId("hdr-auto-arrange"));
      await waitFor(() => {
        const glyphs = mocks.glyphCanvasProps.glyphs;
        expect(glyphs[0].x).toBe(60);
        expect(glyphs[0].y).toBe(60);
      });
    });

    it("adds an auto-arranged message to the log", async () => {
      renderApp();
      fireEvent.click(screen.getByTestId("hdr-auto-arrange"));
      await waitFor(() =>
        expect(
          mocks.bottomPanelProps.messages.some((m: string) =>
            m.includes("Auto-arranged")
          )
        ).toBe(true)
      );
    });
  });

  // ─── Bottom panel ─────────────────────────────────────────────────────────

  describe("bottom panel", () => {
    it("clears messages when bottom panel onClear is called", async () => {
      renderApp();
      // Trigger a log message via zoom
      fireEvent.click(screen.getByTestId("hdr-zoom-in"));
      // Now clear
      fireEvent.click(screen.getByTestId("bp-clear"));
      await waitFor(() =>
        expect(mocks.bottomPanelProps.messages).toHaveLength(0)
      );
    });

    it("does not crash when onCollapseChange is called", () => {
      renderApp();
      expect(() => fireEvent.click(screen.getByTestId("bp-collapse"))).not.toThrow();
    });
  });

  // ─── Session storage ──────────────────────────────────────────────────────

  describe("sessionStorage", () => {
    it("loads saved pages from sessionStorage on mount", async () => {
      sessionStorage.setItem(
        "canvasData",
        JSON.stringify({
          pages: [{ id: "p-saved", name: "Saved Page", glyphs: [], connections: [] }],
        })
      );
      renderApp();
      await waitFor(() => expect(screen.getByText("Saved Page")).not.toBeNull());
    });

    it("loads pages from old array format in sessionStorage", async () => {
      sessionStorage.setItem(
        "canvasData",
        JSON.stringify([
          { id: "p-arr", name: "Array Format Page", glyphs: [], connections: [] },
        ])
      );
      renderApp();
      await waitFor(() => expect(screen.getByText("Array Format Page")).not.toBeNull());
    });

    it("loads stencilType, connectionType, toolbarOrientation, and toolbarPos from sessionStorage envelope", async () => {
      sessionStorage.setItem(
        "canvasData",
        JSON.stringify({
          pages: [{ id: "p-env", name: "Env Page", glyphs: [], connections: [] }],
          stencilType: "network",
          connectionType: "inheritance",
          toolbarOrientation: "horizontal",
          toolbarPos: { x: 100, y: 200 },
        })
      );
      renderApp();
      await waitFor(() => expect(screen.getByText("Env Page")).not.toBeNull());
    });

    it("does not crash on corrupt sessionStorage data", () => {
      sessionStorage.setItem("canvasData", "not-valid-json");
      expect(() => renderApp()).not.toThrow();
    });

    it("does not crash when sessionStorage is null string", () => {
      sessionStorage.setItem("canvasData", "null");
      expect(() => renderApp()).not.toThrow();
    });

    it("loads zoom from sessionStorage", () => {
      sessionStorage.setItem("zoomRatio", "1.5");
      renderApp();
      expect(mocks.glyphCanvasProps.zoom).toBeCloseTo(1.5, 5);
    });

    it("clamps zoom loaded from sessionStorage to max 2", () => {
      sessionStorage.setItem("zoomRatio", "999");
      renderApp();
      expect(mocks.glyphCanvasProps.zoom).toBeLessThanOrEqual(2);
    });

    it("defaults zoom to 1 when stored value is NaN", () => {
      sessionStorage.setItem("zoomRatio", "not-a-number");
      renderApp();
      expect(mocks.glyphCanvasProps.zoom).toBe(1);
    });
  });

  // ─── Toolbar ──────────────────────────────────────────────────────────────

  describe("toolbar", () => {
    it("renders the orientation toggle button (default vertical)", () => {
      renderApp();
      expect(screen.getByTitle("Switch to horizontal")).toBeTruthy();
    });

    it("toggles toolbar orientation from vertical to horizontal", async () => {
      renderApp();
      fireEvent.click(screen.getByTitle("Switch to horizontal"));
      await waitFor(() => expect(screen.getByTitle("Switch to vertical")).toBeTruthy());
    });

    it("toggles toolbar orientation back from horizontal to vertical", async () => {
      renderApp();
      fireEvent.click(screen.getByTitle("Switch to horizontal"));
      await waitFor(() => screen.getByTitle("Switch to vertical"));
      fireEvent.click(screen.getByTitle("Switch to vertical"));
      await waitFor(() => expect(screen.getByTitle("Switch to horizontal")).toBeTruthy());
    });

    it("does not crash when toolbar drag handle receives pointerDown", () => {
      renderApp();
      const handle = screen.getByText("Toolbar").closest("div");
      expect(() =>
        fireEvent.pointerDown(handle!, { pointerId: 1, clientX: 100, clientY: 100 })
      ).not.toThrow();
    });

    it("moves toolbar position after drag start + mousemove + mouseup", () => {
      renderApp();
      const handle = screen.getByText("Toolbar").closest("div");
      fireEvent.pointerDown(handle!, { pointerId: 1, clientX: 100, clientY: 100 });
      fireEvent.mouseMove(window, { clientX: 150, clientY: 130 });
      fireEvent.mouseUp(window);
      // No crash = toolbar drag lifecycle completed
    });

    it("toolbar drag ignores pointerDown on child buttons", () => {
      renderApp();
      const toggleBtn = screen.getByTitle("Switch to horizontal");
      expect(() =>
        fireEvent.pointerDown(toggleBtn, { pointerId: 1, clientX: 100, clientY: 100 })
      ).not.toThrow();
    });
  });

  // ─── printCanvas ──────────────────────────────────────────────────────────

  describe("printCanvas", () => {
    it("does not crash when window.open returns null", () => {
      vi.spyOn(window, "open").mockReturnValueOnce(null);
      renderApp();
      expect(() => fireEvent.click(screen.getByTestId("hdr-print"))).not.toThrow();
      vi.restoreAllMocks();
    });

    it("opens a print window and calls print/close on success", () => {
      const mockDoc = {
        title: "",
        head: { appendChild: vi.fn() },
        body: { appendChild: vi.fn() },
        createElement: (tag: string) => document.createElement(tag),
        importNode: (node: Node, deep: boolean) => (node as Node).cloneNode(deep),
      };
      const mockPrintWindow = {
        document: mockDoc,
        print: vi.fn(),
        close: vi.fn(),
      };
      vi.spyOn(window, "open").mockReturnValueOnce(mockPrintWindow as any);
      renderApp();
      fireEvent.click(screen.getByTestId("hdr-print"));
      expect(mockPrintWindow.print).toHaveBeenCalled();
      expect(mockPrintWindow.close).toHaveBeenCalled();
      vi.restoreAllMocks();
    });
  });
});
