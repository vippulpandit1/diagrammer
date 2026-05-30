// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React from "react";
import { render, screen, fireEvent, createEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GlyphCanvas } from "../GlyphCanvas";
import { Glyph } from "../glyph/Glyph";
import { Connection } from "../glyph/Connection";
import type { Page } from "../glyph/Page";

// ─── Shared mock state ────────────────────────────────────────────────────────
// vi.hoisted ensures these refs are available inside vi.mock factory closures
const { glyphItemProps, connItemProps } = vi.hoisted(() => ({
  glyphItemProps: {} as Record<string, any>,
  connItemProps: {} as Record<string, any>,
}));

vi.mock("../glyphCanvas/GlyphItem", () => ({
  GlyphItem: (props: any) => {
    glyphItemProps[props.glyph.id] = props;
    return <div data-testid={`glyph-item-${props.glyph.id}`} />;
  },
}));

vi.mock("../glyphCanvas/ConnectionItem", () => ({
  ConnectionItem: (props: any) => {
    connItemProps[props.conn.id] = props;
    return <div data-testid={`conn-item-${props.conn.id}`} />;
  },
}));

vi.mock("../glyphCanvas/ContextMenus", () => ({
  ContextMenus: () => null,
}));

// ─── Factories ────────────────────────────────────────────────────────────────
const makeGlyph = (id: string, type = "rect", x = 100, y = 100) =>
  new Glyph(id, type, x, y, [], {}, id, 1, 1, [], [], 120, 80);

const makePage = (glyphs: Glyph[] = [], connections: Connection[] = []): Page => ({
  id: "p1",
  name: "Page 1",
  glyphs,
  connections,
});

const makeConnection = (id: string, fromId = "g1", toId = "g2") =>
  new Connection(id, fromId, "out-1", toId, "in-1");

const baseProps = {
  pages: [makePage()] as Page[],
  activePageIdx: 0,
  onPageChange: vi.fn(),
  glyphs: [] as Glyph[],
  connections: [] as Connection[],
  onMoveGlyph: vi.fn(),
  onAddConnection: vi.fn(),
  onDeleteConnection: vi.fn(),
  zoom: 1,
  onAddGlyph: vi.fn(),
  bringGlyphToFront: vi.fn(),
  sendGlyphToBack: vi.fn(),
  groupGlyphs: vi.fn(),
  ungroupGlyphs: vi.fn(),
  connectorType: "bezier" as const,
};

beforeEach(() => {
  for (const k in glyphItemProps) delete glyphItemProps[k];
  for (const k in connItemProps) delete connItemProps[k];
  vi.clearAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("GlyphCanvas", () => {
  // ── Rendering ───────────────────────────────────────────────────────────────
  describe("rendering", () => {
    it("renders a workspace-canvas container div", () => {
      render(<GlyphCanvas {...baseProps} />);
      expect(document.querySelector(".workspace-canvas")).toBeTruthy();
    });

    it("renders a GlyphItem for each glyph on the active page", () => {
      const glyphs = [makeGlyph("g1"), makeGlyph("g2")];
      const pages = [makePage(glyphs)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} />);
      expect(screen.getByTestId("glyph-item-g1")).toBeTruthy();
      expect(screen.getByTestId("glyph-item-g2")).toBeTruthy();
    });

    it("renders a ConnectionItem for each connection on the active page", () => {
      const glyphs = [makeGlyph("g1"), makeGlyph("g2")];
      const connections = [makeConnection("c1")];
      const pages = [makePage(glyphs, connections)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} connections={connections} />);
      expect(screen.getByTestId("conn-item-c1")).toBeTruthy();
    });

    it("does not render glyphs from an inactive page", () => {
      const activePage = makePage([makeGlyph("g-active")]);
      const inactivePage: Page = {
        id: "p2", name: "Page 2",
        glyphs: [makeGlyph("g-inactive")],
        connections: [],
      };
      render(<GlyphCanvas {...baseProps} pages={[activePage, inactivePage]} activePageIdx={0} glyphs={activePage.glyphs} />);
      expect(screen.getByTestId("glyph-item-g-active")).toBeTruthy();
      expect(screen.queryByTestId("glyph-item-g-inactive")).toBeNull();
    });

    it("passes the correct zoom to GlyphItem", () => {
      const glyphs = [makeGlyph("g1")];
      const pages = [makePage(glyphs)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} zoom={2} />);
      expect(glyphItemProps["g1"].zoom).toBe(2);
    });

    it("passes allGlyphs and allConnections to GlyphItem", () => {
      const glyphs = [makeGlyph("g1"), makeGlyph("g2")];
      const connections = [makeConnection("c1")];
      const pages = [makePage(glyphs, connections)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} connections={connections} />);
      expect(glyphItemProps["g1"].allGlyphs).toEqual(glyphs);
      expect(glyphItemProps["g1"].allConnections).toEqual(connections);
    });

    it("passes connectorType to ConnectionItem", () => {
      const glyphs = [makeGlyph("g1"), makeGlyph("g2")];
      const connections = [makeConnection("c1")];
      const pages = [makePage(glyphs, connections)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} connections={connections} connectorType="manhattan" />);
      expect(connItemProps["c1"].connectorType).toBe("manhattan");
    });
  });

  // ── Drag & Drop ──────────────────────────────────────────────────────────────
  describe("drag and drop", () => {
    it("prevents default on dragOver", () => {
      render(<GlyphCanvas {...baseProps} />);
      const canvas = document.querySelector(".workspace-canvas")!;
      const evt = createEvent.dragOver(canvas);
      Object.defineProperty(evt, "dataTransfer", {
        value: { dropEffect: "" },
        configurable: true,
        writable: true,
      });
      fireEvent(canvas, evt);
      expect(evt.defaultPrevented).toBe(true);
    });

    it("calls onAddGlyph with glyphType when a glyph is dropped", () => {
      const onAddGlyph = vi.fn();
      render(<GlyphCanvas {...baseProps} onAddGlyph={onAddGlyph} />);
      const canvas = document.querySelector(".workspace-canvas")!;

      const dropEvt = createEvent.drop(canvas);
      Object.defineProperty(dropEvt, "clientX", { value: 200, configurable: true });
      Object.defineProperty(dropEvt, "clientY", { value: 150, configurable: true });
      Object.defineProperty(dropEvt, "dataTransfer", {
        value: { getData: (k: string) => (k === "glyphType" ? "rect" : "") },
        configurable: true,
      });
      fireEvent(canvas, dropEvt);

      expect(onAddGlyph).toHaveBeenCalledWith("rect", 200, 150, undefined, undefined);
    });

    it("parses glyphJSON on drop and extracts type, inputs, outputs", () => {
      const onAddGlyph = vi.fn();
      render(<GlyphCanvas {...baseProps} onAddGlyph={onAddGlyph} />);
      const canvas = document.querySelector(".workspace-canvas")!;

      const json = JSON.stringify({ type: "circle", inputs: 3, outputs: 2 });
      const dropEvt = createEvent.drop(canvas);
      Object.defineProperty(dropEvt, "clientX", { value: 50, configurable: true });
      Object.defineProperty(dropEvt, "clientY", { value: 75, configurable: true });
      Object.defineProperty(dropEvt, "dataTransfer", {
        value: { getData: (k: string) => (k === "glyphJSON" ? json : "") },
        configurable: true,
      });
      fireEvent(canvas, dropEvt);

      expect(onAddGlyph).toHaveBeenCalledWith("circle", 50, 75, 3, 2);
    });

    it("uses text/plain as JSON fallback when glyphJSON is absent", () => {
      const onAddGlyph = vi.fn();
      render(<GlyphCanvas {...baseProps} onAddGlyph={onAddGlyph} />);
      const canvas = document.querySelector(".workspace-canvas")!;

      const json = JSON.stringify({ type: "triangle" });
      const dropEvt = createEvent.drop(canvas);
      Object.defineProperty(dropEvt, "clientX", { value: 10, configurable: true });
      Object.defineProperty(dropEvt, "clientY", { value: 10, configurable: true });
      Object.defineProperty(dropEvt, "dataTransfer", {
        value: { getData: (k: string) => (k === "text/plain" ? json : "") },
        configurable: true,
      });
      fireEvent(canvas, dropEvt);

      expect(onAddGlyph).toHaveBeenCalledWith("triangle", 10, 10, undefined, undefined);
    });

    it("does not call onAddGlyph when drop has no usable type data", () => {
      const onAddGlyph = vi.fn();
      render(<GlyphCanvas {...baseProps} onAddGlyph={onAddGlyph} />);
      const canvas = document.querySelector(".workspace-canvas")!;

      const dropEvt = createEvent.drop(canvas);
      Object.defineProperty(dropEvt, "dataTransfer", {
        value: { getData: () => "" },
      });
      fireEvent(canvas, dropEvt);

      expect(onAddGlyph).not.toHaveBeenCalled();
    });

    it("handles invalid JSON in drop data without throwing, falls back to glyphType", () => {
      const onAddGlyph = vi.fn();
      render(<GlyphCanvas {...baseProps} onAddGlyph={onAddGlyph} />);
      const canvas = document.querySelector(".workspace-canvas")!;

      const dropEvt = createEvent.drop(canvas);
      Object.defineProperty(dropEvt, "clientX", { value: 10, configurable: true });
      Object.defineProperty(dropEvt, "clientY", { value: 10, configurable: true });
      Object.defineProperty(dropEvt, "dataTransfer", {
        value: {
          getData: (k: string) => {
            if (k === "glyphType") return "text";
            if (k === "glyphJSON") return "BAD{JSON}";
            return "";
          },
        },
        configurable: true,
      });

      expect(() => fireEvent(canvas, dropEvt)).not.toThrow();
      expect(onAddGlyph).toHaveBeenCalledWith("text", 10, 10, undefined, undefined);
    });

    it("scales drop coordinates by zoom", () => {
      const onAddGlyph = vi.fn();
      render(<GlyphCanvas {...baseProps} onAddGlyph={onAddGlyph} zoom={2} />);
      const canvas = document.querySelector(".workspace-canvas")!;

      const dropEvt = createEvent.drop(canvas);
      Object.defineProperty(dropEvt, "clientX", { value: 400, configurable: true });
      Object.defineProperty(dropEvt, "clientY", { value: 300, configurable: true });
      Object.defineProperty(dropEvt, "dataTransfer", {
        value: { getData: (k: string) => (k === "glyphType" ? "rect" : "") },
        configurable: true,
      });
      fireEvent(canvas, dropEvt);

      // getBoundingClientRect returns {left:0, top:0} in JSDOM → x = 400/2 = 200, y = 300/2 = 150
      expect(onAddGlyph).toHaveBeenCalledWith("rect", 200, 150, undefined, undefined);
    });
  });

  // ── Keyboard events ──────────────────────────────────────────────────────────
  describe("keyboard events", () => {
    it("Delete calls onDeleteConnection when a connection is selected", () => {
      const onDeleteConnection = vi.fn();
      const glyphs = [makeGlyph("g1"), makeGlyph("g2")];
      const connections = [makeConnection("c1")];
      const pages = [makePage(glyphs, connections)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} connections={connections} onDeleteConnection={onDeleteConnection} />);

      act(() => { connItemProps["c1"].onSelect(0); });
      fireEvent.keyDown(window, { key: "Delete" });

      expect(onDeleteConnection).toHaveBeenCalledWith(0);
    });

    it("Backspace calls onDeleteConnection when a connection is selected", () => {
      const onDeleteConnection = vi.fn();
      const glyphs = [makeGlyph("g1"), makeGlyph("g2")];
      const connections = [makeConnection("c1")];
      const pages = [makePage(glyphs, connections)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} connections={connections} onDeleteConnection={onDeleteConnection} />);

      act(() => { connItemProps["c1"].onSelect(0); });
      fireEvent.keyDown(window, { key: "Backspace" });

      expect(onDeleteConnection).toHaveBeenCalledWith(0);
    });

    it("Delete does NOT call onDeleteConnection when no connection is selected", () => {
      const onDeleteConnection = vi.fn();
      render(<GlyphCanvas {...baseProps} onDeleteConnection={onDeleteConnection} />);
      fireEvent.keyDown(window, { key: "Delete" });
      expect(onDeleteConnection).not.toHaveBeenCalled();
    });

    it("Delete does NOT call onDeleteConnection when an INPUT element is focused", () => {
      const onDeleteConnection = vi.fn();
      const glyphs = [makeGlyph("g1"), makeGlyph("g2")];
      const connections = [makeConnection("c1")];
      const pages = [makePage(glyphs, connections)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} connections={connections} onDeleteConnection={onDeleteConnection} />);

      act(() => { connItemProps["c1"].onSelect(0); });

      const input = document.createElement("input");
      document.body.appendChild(input);
      input.focus();

      fireEvent.keyDown(window, { key: "Delete" });
      expect(onDeleteConnection).not.toHaveBeenCalled();
      document.body.removeChild(input);
    });

    it("Delete does NOT call onDeleteConnection when a TEXTAREA is focused", () => {
      const onDeleteConnection = vi.fn();
      const glyphs = [makeGlyph("g1"), makeGlyph("g2")];
      const connections = [makeConnection("c1")];
      const pages = [makePage(glyphs, connections)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} connections={connections} onDeleteConnection={onDeleteConnection} />);

      act(() => { connItemProps["c1"].onSelect(0); });

      const ta = document.createElement("textarea");
      document.body.appendChild(ta);
      ta.focus();

      fireEvent.keyDown(window, { key: "Delete" });
      expect(onDeleteConnection).not.toHaveBeenCalled();
      document.body.removeChild(ta);
    });

    it("deselects after Delete so a second keypress has no effect", () => {
      const onDeleteConnection = vi.fn();
      const glyphs = [makeGlyph("g1"), makeGlyph("g2")];
      const connections = [makeConnection("c1")];
      const pages = [makePage(glyphs, connections)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} connections={connections} onDeleteConnection={onDeleteConnection} />);

      act(() => { connItemProps["c1"].onSelect(0); });
      fireEvent.keyDown(window, { key: "Delete" });
      fireEvent.keyDown(window, { key: "Delete" }); // nothing selected now

      expect(onDeleteConnection).toHaveBeenCalledTimes(1);
    });

    it("toggling connection selection via onSelect deselects when same index re-selected", () => {
      const onDeleteConnection = vi.fn();
      const glyphs = [makeGlyph("g1"), makeGlyph("g2")];
      const connections = [makeConnection("c1")];
      const pages = [makePage(glyphs, connections)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} connections={connections} onDeleteConnection={onDeleteConnection} />);

      act(() => { connItemProps["c1"].onSelect(0); }); // select
      act(() => { connItemProps["c1"].onSelect(0); }); // toggle off (selectedConn === idx → null)
      fireEvent.keyDown(window, { key: "Delete" });

      expect(onDeleteConnection).not.toHaveBeenCalled();
    });
  });

  // ── Glyph selection ──────────────────────────────────────────────────────────
  describe("glyph selection", () => {
    it("onSelect from GlyphItem propagates selectedGlyphId to all GlyphItems", () => {
      const glyphs = [makeGlyph("g1"), makeGlyph("g2")];
      const pages = [makePage(glyphs)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} />);

      expect(glyphItemProps["g1"].selectedGlyphId).toBeNull();

      act(() => { glyphItemProps["g1"].onSelect("g1", false); });

      expect(glyphItemProps["g1"].selectedGlyphId).toBe("g1");
      expect(glyphItemProps["g2"].selectedGlyphId).toBe("g1");
    });

    it("multi-select adds glyphs to selectedGlyphIds without replacing existing", () => {
      const glyphs = [makeGlyph("g1"), makeGlyph("g2"), makeGlyph("g3")];
      const pages = [makePage(glyphs)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} />);

      act(() => { glyphItemProps["g1"].onSelect("g1", false); });
      act(() => { glyphItemProps["g2"].onSelect("g2", true); }); // shift/ctrl select

      const ids = glyphItemProps["g1"].selectedGlyphIds as string[];
      expect(ids).toContain("g1");
      expect(ids).toContain("g2");
    });

    it("clicking the canvas background clears selectedGlyphId", () => {
      const glyphs = [makeGlyph("g1")];
      const pages = [makePage(glyphs)];
      const { container } = render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} />);

      act(() => { glyphItemProps["g1"].onSelect("g1", false); });
      expect(glyphItemProps["g1"].selectedGlyphId).toBe("g1");

      // Click the background (inner scaled div)
      const innerDiv = container.querySelector(".workspace-canvas > div")!;
      fireEvent.click(innerDiv);

      expect(glyphItemProps["g1"].selectedGlyphId).toBeNull();
    });

    it("double-clicking a glyph calls onGlyphClick", () => {
      const onGlyphClick = vi.fn();
      const glyphs = [makeGlyph("g1")];
      const pages = [makePage(glyphs)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} onGlyphClick={onGlyphClick} />);

      act(() => { glyphItemProps["g1"].onDoubleClickGlyph(glyphs[0]); });

      expect(onGlyphClick).toHaveBeenCalledWith(glyphs[0]);
    });

    it("double-clicking a text glyph also sets editingTextId in GlyphItem props", () => {
      const glyphs = [makeGlyph("g1", "text")];
      const pages = [makePage(glyphs)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} />);

      act(() => { glyphItemProps["g1"].onDoubleClickGlyph(glyphs[0]); });

      expect(glyphItemProps["g1"].editingTextId).toBe("g1");
    });

    it("onGlyphClick is optional and does not throw when absent", () => {
      const glyphs = [makeGlyph("g1")];
      const pages = [makePage(glyphs)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} />);

      expect(() => {
        act(() => { glyphItemProps["g1"].onDoubleClickGlyph(glyphs[0]); });
      }).not.toThrow();
    });
  });

  // ── Glyph dragging ───────────────────────────────────────────────────────────
  describe("glyph dragging", () => {
    it("calls onMoveGlyph during mousemove after pointerDown on a glyph", () => {
      const onMoveGlyph = vi.fn();
      const glyphs = [makeGlyph("g1", "rect", 100, 100)];
      const pages = [makePage(glyphs)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} onMoveGlyph={onMoveGlyph} />);

      act(() => {
        glyphItemProps["g1"].onPointerDown(
          { clientX: 110, clientY: 110 } as React.PointerEvent,
          glyphs[0]
        );
      });

      // offsetX = 110 - 100 = 10, offsetY = 110 - 100 = 10
      fireEvent.mouseMove(window, { clientX: 250, clientY: 200 });
      expect(onMoveGlyph).toHaveBeenCalledWith("g1", 240, 190);
    });

    it("stops calling onMoveGlyph after mouseup", () => {
      const onMoveGlyph = vi.fn();
      const glyphs = [makeGlyph("g1")];
      const pages = [makePage(glyphs)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} onMoveGlyph={onMoveGlyph} />);

      act(() => {
        glyphItemProps["g1"].onPointerDown(
          { clientX: 110, clientY: 110 } as React.PointerEvent,
          glyphs[0]
        );
      });

      fireEvent.mouseMove(window, { clientX: 200, clientY: 200 });
      expect(onMoveGlyph).toHaveBeenCalledTimes(1);

      act(() => { fireEvent.mouseUp(window); });
      fireEvent.mouseMove(window, { clientX: 300, clientY: 300 });
      expect(onMoveGlyph).toHaveBeenCalledTimes(1); // no additional calls
    });
  });

  // ── Connection drag preview ───────────────────────────────────────────────────
  describe("connection drag preview", () => {
    it("shows a SVG path preview when port dragging starts", () => {
      const glyphs = [makeGlyph("g1")];
      const pages = [makePage(glyphs)];
      const { container } = render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} />);

      act(() => {
        glyphItemProps["g1"].onStartPortDrag("out-1", "g1", 220, 140);
      });

      expect(container.querySelector("path")).toBeTruthy();
    });

    it("removes the SVG path preview after mouseup", () => {
      const glyphs = [makeGlyph("g1")];
      const pages = [makePage(glyphs)];
      const { container } = render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} />);

      act(() => {
        glyphItemProps["g1"].onStartPortDrag("out-1", "g1", 220, 140);
      });
      expect(container.querySelector("path")).toBeTruthy();

      act(() => { fireEvent.mouseUp(window); });

      expect(container.querySelector("path")).toBeNull();
    });

    it("updates dragMouse position on mousemove during port drag", () => {
      const glyphs = [makeGlyph("g1")];
      const pages = [makePage(glyphs)];
      const { container } = render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} zoom={1} />);

      act(() => {
        glyphItemProps["g1"].onStartPortDrag("out-1", "g1", 0, 0);
      });

      // canvasRef.current?.getBoundingClientRect() returns zeros in JSDOM → mouseX = clientX / 1
      act(() => { fireEvent.mouseMove(window, { clientX: 400, clientY: 300 }); });

      // The path element should still be present
      expect(container.querySelector("path")).toBeTruthy();
    });
  });

  // ── Connection creation ──────────────────────────────────────────────────────
  describe("connection creation", () => {
    it("calls onAddConnection with correct data when completing a port drag", () => {
      const onAddConnection = vi.fn();
      const glyphs = [makeGlyph("g1"), makeGlyph("g2")];
      const pages = [makePage(glyphs)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} onAddConnection={onAddConnection} />);

      act(() => { glyphItemProps["g1"].onStartPortDrag("out-1", "g1", 220, 140); });
      act(() => { glyphItemProps["g2"].onCompleteConnection("g2", "in-1"); });

      expect(onAddConnection).toHaveBeenCalledWith(
        expect.objectContaining({
          fromGlyphId: "g1",
          fromPortId: "out-1",
          toGlyphId: "g2",
          toPortId: "in-1",
          type: "default",
        })
      );
    });

    it("does not call onAddConnection if no port drag is in progress", () => {
      const onAddConnection = vi.fn();
      const glyphs = [makeGlyph("g1"), makeGlyph("g2")];
      const pages = [makePage(glyphs)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} onAddConnection={onAddConnection} />);

      act(() => { glyphItemProps["g2"].onCompleteConnection("g2", "in-1"); });

      expect(onAddConnection).not.toHaveBeenCalled();
    });

    it("clears the drag preview after a connection is completed", () => {
      const glyphs = [makeGlyph("g1"), makeGlyph("g2")];
      const pages = [makePage(glyphs)];
      const { container } = render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} />);

      act(() => { glyphItemProps["g1"].onStartPortDrag("out-1", "g1", 220, 140); });
      expect(container.querySelector("path")).toBeTruthy();

      act(() => { glyphItemProps["g2"].onCompleteConnection("g2", "in-1"); });
      expect(container.querySelector("path")).toBeNull();
    });
  });

  // ── Canvas content dimensions ─────────────────────────────────────────────────
  describe("canvas content dimensions", () => {
    it("minWidth reflects the rightmost glyph position (x + width + padding)", () => {
      // CANVAS_PADDING = 200; glyph x=600, w=120 → min 920
      const glyphs = [makeGlyph("g1", "rect", 600, 50)];
      const pages = [makePage(glyphs)];
      const { container } = render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} />);

      const innerDiv = container.querySelector(".workspace-canvas > div") as HTMLElement;
      const minWidth = parseInt(innerDiv.style.minWidth);
      expect(minWidth).toBeGreaterThanOrEqual(600 + 120 + 200);
    });

    it("minHeight reflects the bottommost glyph position (y + height + padding)", () => {
      // CANVAS_PADDING = 200; glyph y=500, h=80 → min 780
      const glyphs = [makeGlyph("g1", "rect", 50, 500)];
      const pages = [makePage(glyphs)];
      const { container } = render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} />);

      const innerDiv = container.querySelector(".workspace-canvas > div") as HTMLElement;
      const minHeight = parseInt(innerDiv.style.minHeight);
      expect(minHeight).toBeGreaterThanOrEqual(500 + 80 + 200);
    });

    it("falls back to CANVAS_PADDING when the page has no glyphs", () => {
      const { container } = render(<GlyphCanvas {...baseProps} />);
      const innerDiv = container.querySelector(".workspace-canvas > div") as HTMLElement;
      // With no glyphs, reduce() returns CANVAS_PADDING (200)
      expect(parseInt(innerDiv.style.minWidth)).toBeGreaterThanOrEqual(200);
      expect(parseInt(innerDiv.style.minHeight)).toBeGreaterThanOrEqual(200);
    });

    it("uses the largest of multiple glyphs for min dimensions", () => {
      const glyphs = [
        makeGlyph("g1", "rect", 100, 100),
        makeGlyph("g2", "rect", 800, 600), // this one dominates
      ];
      const pages = [makePage(glyphs)];
      const { container } = render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} />);

      const innerDiv = container.querySelector(".workspace-canvas > div") as HTMLElement;
      expect(parseInt(innerDiv.style.minWidth)).toBeGreaterThanOrEqual(800 + 120 + 200);
      expect(parseInt(innerDiv.style.minHeight)).toBeGreaterThanOrEqual(600 + 80 + 200);
    });
  });

  // ── Port hover callbacks ──────────────────────────────────────────────────────
  describe("port hover", () => {
    it("hoveredPort is forwarded to all GlyphItems after onPortHover", () => {
      const glyphs = [makeGlyph("g1"), makeGlyph("g2")];
      const pages = [makePage(glyphs)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} />);

      expect(glyphItemProps["g1"].hoveredPort).toBeNull();

      act(() => { glyphItemProps["g1"].onPortHover("g1", 0); });

      expect(glyphItemProps["g1"].hoveredPort).toEqual({ glyphId: "g1", portIdx: 0 });
      expect(glyphItemProps["g2"].hoveredPort).toEqual({ glyphId: "g1", portIdx: 0 });
    });

    it("hoveredPort is cleared after onPortHoverEnd", () => {
      const glyphs = [makeGlyph("g1"), makeGlyph("g2")];
      const pages = [makePage(glyphs)];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={glyphs} />);

      act(() => { glyphItemProps["g1"].onPortHover("g1", 0); });
      act(() => { glyphItemProps["g1"].onPortHoverEnd(); });

      expect(glyphItemProps["g1"].hoveredPort).toBeNull();
    });
  });

  // ── Connection double-click and hover ────────────────────────────────────────
  describe("connection interactions", () => {
    it("double-clicking a connection calls onConnectionClick when not already selected", () => {
      const onConnectionClick = vi.fn();
      const g1 = makeGlyph("g1"), g2 = makeGlyph("g2");
      const conn = makeConnection("c1");
      const pages = [makePage([g1, g2], [conn])];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={[g1, g2]} connections={[conn]} onConnectionClick={onConnectionClick} />);

      act(() => { connItemProps["c1"].onDoubleClick(conn, 0); });

      expect(onConnectionClick).toHaveBeenCalledWith(conn);
    });

    it("double-clicking an already-selected connection does not call onConnectionClick", () => {
      const onConnectionClick = vi.fn();
      const g1 = makeGlyph("g1"), g2 = makeGlyph("g2");
      const conn = makeConnection("c1");
      const pages = [makePage([g1, g2], [conn])];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={[g1, g2]} connections={[conn]} onConnectionClick={onConnectionClick} />);

      // Select the connection first so selectedConn === 0
      act(() => { connItemProps["c1"].onSelect(0); });
      // Now double-click (selectedConn === idx, so onConnectionClick must NOT be called)
      act(() => { connItemProps["c1"].onDoubleClick(conn, 0); });

      expect(onConnectionClick).not.toHaveBeenCalled();
    });

    it("onMouseEnter on a connection sets hoveredConn", () => {
      const g1 = makeGlyph("g1"), g2 = makeGlyph("g2");
      const conn = makeConnection("c1");
      const pages = [makePage([g1, g2], [conn])];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={[g1, g2]} connections={[conn]} />);

      act(() => { connItemProps["c1"].onMouseEnter(0); });

      expect(connItemProps["c1"].hoveredConn).toBe(0);
    });

    it("onMouseLeave on a connection clears hoveredConn", () => {
      const g1 = makeGlyph("g1"), g2 = makeGlyph("g2");
      const conn = makeConnection("c1");
      const pages = [makePage([g1, g2], [conn])];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={[g1, g2]} connections={[conn]} />);

      act(() => { connItemProps["c1"].onMouseEnter(0); });
      act(() => { connItemProps["c1"].onMouseLeave(); });

      expect(connItemProps["c1"].hoveredConn).toBeNull();
    });
  });

  // ── handlePointPointerDown ───────────────────────────────────────────────────
  describe("handlePointPointerDown", () => {
    it("stops propagation when a connection midpoint is pointer-downed", () => {
      const g1 = makeGlyph("g1"), g2 = makeGlyph("g2");
      const conn = makeConnection("c1");
      const pages = [makePage([g1, g2], [conn])];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={[g1, g2]} connections={[conn]} />);

      const stopPropagation = vi.fn();
      act(() => {
        connItemProps["c1"].onPointPointerDown("c1", 0, { stopPropagation } as unknown as React.PointerEvent);
      });

      expect(stopPropagation).toHaveBeenCalled();
    });

    it("clears draggedPoint on pointerup after handlePointPointerDown", () => {
      const g1 = makeGlyph("g1"), g2 = makeGlyph("g2");
      const conn = makeConnection("c1");
      const pages = [makePage([g1, g2], [conn])];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={[g1, g2]} connections={[conn]} />);

      act(() => {
        connItemProps["c1"].onPointPointerDown("c1", 0, { stopPropagation: vi.fn() } as unknown as React.PointerEvent);
      });
      // pointerup should execute draggedPoint's handlePointerUp without throwing
      act(() => { window.dispatchEvent(new PointerEvent("pointerup")); });
    });
  });

  // ── Resizing ─────────────────────────────────────────────────────────────────
  describe("resizing", () => {
    it("pointermove with br handle calls onResizeGlyph with updated dimensions", () => {
      const onResizeGlyph = vi.fn();
      const g1 = makeGlyph("g1");
      const pages = [makePage([g1])];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={[g1]} onResizeGlyph={onResizeGlyph} />);

      act(() => {
        glyphItemProps["g1"].setResizing({
          id: "g1", handle: "br" as const,
          startX: 100, startY: 100,
          origX: 50, origY: 50,
          origW: 120, origH: 80,
        });
      });

      act(() => {
        window.dispatchEvent(new PointerEvent("pointermove", { clientX: 120, clientY: 120 }));
      });

      // dx=20, dy=20 → w=140, h=100; x,y unchanged
      expect(onResizeGlyph).toHaveBeenCalledWith("g1", 50, 50, 140, 100);
    });

    it("pointermove with tl handle adjusts x, y, width and height", () => {
      const onResizeGlyph = vi.fn();
      const g1 = makeGlyph("g1");
      const pages = [makePage([g1])];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={[g1]} onResizeGlyph={onResizeGlyph} />);

      act(() => {
        glyphItemProps["g1"].setResizing({
          id: "g1", handle: "tl" as const,
          startX: 100, startY: 100,
          origX: 50, origY: 50,
          origW: 120, origH: 80,
        });
      });

      act(() => {
        window.dispatchEvent(new PointerEvent("pointermove", { clientX: 110, clientY: 110 }));
      });

      // dx=10, dy=10 → x=60, y=60, w=110, h=70
      expect(onResizeGlyph).toHaveBeenCalledWith("g1", 60, 60, 110, 70);
    });

    it("minimum size is clamped to 40 when dragging far inward", () => {
      const onResizeGlyph = vi.fn();
      const g1 = makeGlyph("g1");
      const pages = [makePage([g1])];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={[g1]} onResizeGlyph={onResizeGlyph} />);

      act(() => {
        glyphItemProps["g1"].setResizing({
          id: "g1", handle: "br" as const,
          startX: 100, startY: 100,
          origX: 50, origY: 50,
          origW: 120, origH: 80,
        });
      });

      // dx=-90, dy=-90 → w=30 → clamped to 40; h=-10 → clamped to 40
      act(() => {
        window.dispatchEvent(new PointerEvent("pointermove", { clientX: 10, clientY: 10 }));
      });

      const [, , , w, h] = onResizeGlyph.mock.calls[0];
      expect(w).toBe(40);
      expect(h).toBe(40);
    });

    it("pointerup clears resizing so subsequent pointermove has no effect", () => {
      const onResizeGlyph = vi.fn();
      const g1 = makeGlyph("g1");
      const pages = [makePage([g1])];
      render(<GlyphCanvas {...baseProps} pages={pages} glyphs={[g1]} onResizeGlyph={onResizeGlyph} />);

      act(() => {
        glyphItemProps["g1"].setResizing({
          id: "g1", handle: "br" as const,
          startX: 100, startY: 100,
          origX: 50, origY: 50,
          origW: 120, origH: 80,
        });
      });

      act(() => { window.dispatchEvent(new PointerEvent("pointermove", { clientX: 110, clientY: 110 })); });
      expect(onResizeGlyph).toHaveBeenCalledTimes(1);

      // pointerup should clear resizing
      act(() => { window.dispatchEvent(new PointerEvent("pointerup")); });

      // Subsequent move must NOT fire onResizeGlyph again
      act(() => { window.dispatchEvent(new PointerEvent("pointermove", { clientX: 130, clientY: 130 })); });
      expect(onResizeGlyph).toHaveBeenCalledTimes(1);
    });
  });
});
