// Tests for GlyphItem component
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Glyph } from "../../glyph/Glyph";
import { Connection } from "../../glyph/Connection";

// Mock GlyphRenderer to avoid rendering all glyph SVG internals
vi.mock("../../glyph/GlyphRenderer", () => ({
  GlyphRenderer: ({ type, label }: { type: string; label: string }) => (
    <rect data-testid="glyph-renderer" data-type={type} data-label={label} />
  ),
}));

// Import AFTER mocks
import { GlyphItem } from "../../glyphCanvas/GlyphItem";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeGlyph = (
  id: string,
  type = "rect",
  x = 100,
  y = 150,
  inputs = 1,
  outputs = 1
) => new Glyph(id, type, x, y, [], {}, id, inputs, outputs, [], [], 120, 80);

const makeConn = (from: string, to: string) =>
  new Connection("c1", from, "p1", to, "p2");

const makeRef = () =>
  ({ current: document.createElement("div") } as React.RefObject<HTMLDivElement>);

const baseCallbacks = () => ({
  onPointerDown: vi.fn(),
  onSelect: vi.fn(),
  onDoubleClickGlyph: vi.fn(),
  onContextMenu: vi.fn(),
  onStartPortDrag: vi.fn(),
  onCompleteConnection: vi.fn(),
  onPortHover: vi.fn(),
  onPortHoverEnd: vi.fn(),
  setEditingTextId: vi.fn(),
  setEditingTextValue: vi.fn(),
  setResizing: vi.fn(),
  setSelectedConn: vi.fn(),
  onMoveGlyph: vi.fn(),
  onNotifyResize: vi.fn(),
});

const renderGlyphItem = (
  overrides: Partial<React.ComponentProps<typeof GlyphItem>> = {}
) => {
  const glyph = makeGlyph("g1");
  const cbs = baseCallbacks();

  return {
    ...render(
      <svg>
        <GlyphItem
          glyph={glyph}
          renderIdx={1}
          selectedGlyphId={null}
          selectedGlyphIds={[]}
          hoveredPort={null}
          dragConn={null}
          editingTextId={null}
          editingTextValue=""
          zoom={1}
          allGlyphs={[glyph]}
          allConnections={[]}
          canvasRef={makeRef()}
          {...cbs}
          {...overrides}
        />
      </svg>
    ),
    cbs,
    glyph,
  };
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("GlyphItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders an svg element for the glyph", () => {
      const { container } = renderGlyphItem();
      // GlyphItem returns an <svg>, which is nested inside the wrapper <svg>
      const svgs = container.querySelectorAll("svg");
      expect(svgs.length).toBeGreaterThanOrEqual(1);
    });

    it("positions the svg at the glyph coordinates", () => {
      const glyph = makeGlyph("g1", "rect", 100, 150);
      const { container } = renderGlyphItem({ glyph });
      // GlyphItem uses PAD=8 so the SVG is offset by -PAD to extend connector hit area
      const innerSvg = container.querySelectorAll("svg")[1]!;
      expect(innerSvg.style.left).toBe("92px");  // 100 - PAD(8)
      expect(innerSvg.style.top).toBe("142px");  // 150 - PAD(8)
    });

    it("renders GlyphRenderer inside the svg", () => {
      const { getByTestId } = renderGlyphItem();
      expect(getByTestId("glyph-renderer")).not.toBeNull();
    });

    it("renders highlight rect when glyph is selected", () => {
      const glyph = makeGlyph("g1");
      const { container } = renderGlyphItem({ glyph, selectedGlyphId: "g1" });
      // The highlight rect has a blue stroke
      const rects = container.querySelectorAll("rect");
      const highlightRect = Array.from(rects).find(
        r => r.getAttribute("stroke") === "#2563eb"
      );
      expect(highlightRect).not.toBeNull();
    });

    it("renders resize handles when glyph is selected", () => {
      const glyph = makeGlyph("g1");
      const { container } = renderGlyphItem({ glyph, selectedGlyphId: "g1" });
      // 8 resize handles rendered as <rect> elements with white fill
      const handleRects = Array.from(container.querySelectorAll("rect")).filter(
        r => r.getAttribute("fill") === "#fff" && r.getAttribute("stroke") === "#2563eb"
      );
      expect(handleRects.length).toBe(8);
    });

    it("renders port circles for input and output ports", () => {
      const glyph = makeGlyph("g1", "rect", 0, 0, 1, 1); // 1 input + 1 output
      const { container } = renderGlyphItem({ glyph });
      const circles = container.querySelectorAll("circle");
      expect(circles.length).toBe(2); // 1 input + 1 output
    });

    it("renders port label text for each port", () => {
      const glyph = makeGlyph("g1", "rect", 0, 0, 1, 1);
      const { container } = renderGlyphItem({ glyph });
      const texts = container.querySelectorAll("text");
      expect(texts.length).toBeGreaterThanOrEqual(2);
    });

    it("highlights port circle when hoveredPort matches", () => {
      const glyph = makeGlyph("g1", "rect", 0, 0, 1, 1);
      const { container } = renderGlyphItem({
        glyph,
        hoveredPort: { glyphId: "g1", portIdx: 0 },
      });
      const circles = container.querySelectorAll("circle");
      const hovered = Array.from(circles).find(c => c.getAttribute("fill") === "#38bdf8");
      expect(hovered).not.toBeNull();
    });

    it("renders glyph label text when glyph is not a text type", () => {
      const glyph = makeGlyph("g1", "rect");
      glyph.label = "Hello";
      const { container } = renderGlyphItem({ glyph });
      const labelTexts = Array.from(container.querySelectorAll("text")).filter(
        t => t.textContent === "Hello"
      );
      expect(labelTexts.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("interaction callbacks", () => {
    it("calls onPointerDown when svg is pressed", () => {
      const cbs = baseCallbacks();
      const glyph = makeGlyph("g1");
      render(
        <svg>
          <GlyphItem
            glyph={glyph}
            renderIdx={1}
            selectedGlyphId={null}
            selectedGlyphIds={[]}
            hoveredPort={null}
            dragConn={null}
            editingTextId={null}
            editingTextValue=""
            zoom={1}
            allGlyphs={[glyph]}
            allConnections={[]}
            canvasRef={makeRef()}
            {...cbs}
          />
        </svg>
      );
      const svgs = document.querySelectorAll("svg");
      const innerSvg = svgs[svgs.length - 1];
      fireEvent.pointerDown(innerSvg);
      expect(cbs.onPointerDown).toHaveBeenCalledWith(expect.any(Object), glyph);
    });

    it("calls onSelect with glyph id when svg is clicked", () => {
      const onSelect = vi.fn();
      const { container } = renderGlyphItem({ onSelect });
      const svgs = container.querySelectorAll("svg");
      fireEvent.click(svgs[1]);
      expect(onSelect).toHaveBeenCalledWith("g1", false);
    });

    it("calls onSelect with multiSelect=true when shift-clicked", () => {
      const onSelect = vi.fn();
      const { container } = renderGlyphItem({ onSelect });
      const svgs = container.querySelectorAll("svg");
      fireEvent.click(svgs[1], { shiftKey: true });
      expect(onSelect).toHaveBeenCalledWith("g1", true);
    });

    it("calls onDoubleClickGlyph on double-click", () => {
      const onDoubleClickGlyph = vi.fn();
      const setSelectedConn = vi.fn();
      const { container } = renderGlyphItem({ onDoubleClickGlyph, setSelectedConn });
      const svgs = container.querySelectorAll("svg");
      fireEvent.doubleClick(svgs[1]);
      expect(onDoubleClickGlyph).toHaveBeenCalledWith(expect.objectContaining({ id: "g1" }));
      expect(setSelectedConn).toHaveBeenCalledWith(null);
    });

    it("calls onContextMenu on right-click", () => {
      const onContextMenu = vi.fn();
      const { container } = renderGlyphItem({ onContextMenu });
      const svgs = container.querySelectorAll("svg");
      fireEvent.contextMenu(svgs[1]);
      expect(onContextMenu).toHaveBeenCalledWith("g1", expect.any(Number), expect.any(Number));
    });
  });

  describe("port interaction", () => {
    it("calls onPortHover when mouse enters a port circle", () => {
      const onPortHover = vi.fn();
      const glyph = makeGlyph("g1", "rect", 0, 0, 1, 1);
      const { container } = renderGlyphItem({ glyph, onPortHover });
      const circles = container.querySelectorAll("circle");
      fireEvent.mouseEnter(circles[0]);
      expect(onPortHover).toHaveBeenCalledWith("g1", 0);
    });

    it("calls onPortHoverEnd when mouse leaves a port circle", () => {
      const onPortHoverEnd = vi.fn();
      const glyph = makeGlyph("g1", "rect", 0, 0, 1, 1);
      const { container } = renderGlyphItem({ glyph, onPortHoverEnd });
      const circles = container.querySelectorAll("circle");
      fireEvent.mouseLeave(circles[0]);
      expect(onPortHoverEnd).toHaveBeenCalled();
    });

    it("calls onStartPortDrag when output port is pressed", () => {
      const onStartPortDrag = vi.fn();
      const glyph = makeGlyph("g1", "rect", 0, 0, 0, 1); // output only
      const { container } = renderGlyphItem({ glyph, onStartPortDrag });
      const circles = container.querySelectorAll("circle");
      fireEvent.pointerDown(circles[0]); // only port is output
      expect(onStartPortDrag).toHaveBeenCalled();
    });

    it("calls onCompleteConnection when input port gets mouseup during drag", () => {
      const onCompleteConnection = vi.fn();
      const glyph = makeGlyph("g1", "rect", 0, 0, 1, 0); // input only
      const { container } = renderGlyphItem({
        glyph,
        onCompleteConnection,
        dragConn: {
          fromPortId: "some-port",
          fromGlyphId: "other-glyph",
          fromPortIdx: "other-port",
          fromX: 0,
          fromY: 0,
        },
      });
      const circles = container.querySelectorAll("circle");
      fireEvent.mouseUp(circles[0]);
      expect(onCompleteConnection).toHaveBeenCalled();
    });
  });

  describe("text glyph editing", () => {
    it("renders input element when text glyph is in editing mode", () => {
      const glyph = makeGlyph("g1", "text");
      const { container } = renderGlyphItem({
        glyph,
        editingTextId: "g1",
        editingTextValue: "edit me",
      });
      const input = container.querySelector("input");
      expect(input).not.toBeNull();
      expect(input!.value).toBe("edit me");
    });

    it("does not render input when not in editing mode", () => {
      const glyph = makeGlyph("g1", "text");
      const { container } = renderGlyphItem({ glyph, editingTextId: null });
      expect(container.querySelector("input")).toBeNull();
    });

    it("sets grab cursor for non-text glyph", () => {
      const { container } = renderGlyphItem();
      const svgs = container.querySelectorAll("svg");
      expect(svgs[1].style.cursor).toBe("grab");
    });

    it("sets pointer cursor for text glyph not in edit mode", () => {
      const glyph = makeGlyph("g1", "text");
      const { container } = renderGlyphItem({ glyph });
      const svgs = container.querySelectorAll("svg");
      expect(svgs[1].style.cursor).toBe("pointer");
    });

    it("calls setEditingTextId(null) and onUpdate when input blurs with changed value", () => {
      const setEditingTextId = vi.fn();
      const onUpdate = vi.fn();
      const glyph = makeGlyph("g1", "text");
      glyph.label = "original";
      glyph.onUpdate = onUpdate;
      const { container } = renderGlyphItem({
        glyph,
        editingTextId: "g1",
        editingTextValue: "changed",
        setEditingTextId,
      });
      const input = container.querySelector("input")!;
      fireEvent.blur(input);
      expect(setEditingTextId).toHaveBeenCalledWith(null);
      expect(onUpdate).toHaveBeenCalledWith("g1", { label: "changed" });
    });

    it("calls setEditingTextId(null) but not onUpdate when blurs with same value", () => {
      const setEditingTextId = vi.fn();
      const onUpdate = vi.fn();
      const glyph = makeGlyph("g1", "text");
      glyph.label = "same";
      glyph.onUpdate = onUpdate;
      const { container } = renderGlyphItem({
        glyph,
        editingTextId: "g1",
        editingTextValue: "same",
        setEditingTextId,
      });
      const input = container.querySelector("input")!;
      fireEvent.blur(input);
      expect(setEditingTextId).toHaveBeenCalledWith(null);
      expect(onUpdate).not.toHaveBeenCalled();
    });

    it("calls setEditingTextId(null) and onUpdate on Enter key with changed value", () => {
      const setEditingTextId = vi.fn();
      const onUpdate = vi.fn();
      const glyph = makeGlyph("g1", "text");
      glyph.label = "original";
      glyph.onUpdate = onUpdate;
      const { container } = renderGlyphItem({
        glyph,
        editingTextId: "g1",
        editingTextValue: "new value",
        setEditingTextId,
      });
      const input = container.querySelector("input")!;
      fireEvent.keyDown(input, { key: "Enter" });
      expect(setEditingTextId).toHaveBeenCalledWith(null);
      expect(onUpdate).toHaveBeenCalledWith("g1", { label: "new value" });
    });

    it("calls setEditingTextId(null) and onUpdate on Escape key with changed value", () => {
      const setEditingTextId = vi.fn();
      const onUpdate = vi.fn();
      const glyph = makeGlyph("g1", "text");
      glyph.label = "original";
      glyph.onUpdate = onUpdate;
      const { container } = renderGlyphItem({
        glyph,
        editingTextId: "g1",
        editingTextValue: "escaped value",
        setEditingTextId,
      });
      const input = container.querySelector("input")!;
      fireEvent.keyDown(input, { key: "Escape" });
      expect(setEditingTextId).toHaveBeenCalledWith(null);
      expect(onUpdate).toHaveBeenCalledWith("g1", { label: "escaped value" });
    });

    it("does not call onUpdate on unrelated key press", () => {
      const setEditingTextId = vi.fn();
      const onUpdate = vi.fn();
      const glyph = makeGlyph("g1", "text");
      glyph.label = "original";
      glyph.onUpdate = onUpdate;
      const { container } = renderGlyphItem({
        glyph,
        editingTextId: "g1",
        editingTextValue: "typing",
        setEditingTextId,
      });
      const input = container.querySelector("input")!;
      fireEvent.keyDown(input, { key: "a" });
      expect(setEditingTextId).not.toHaveBeenCalled();
      expect(onUpdate).not.toHaveBeenCalled();
    });
  });

  describe("resize handle interaction", () => {
    it("calls setResizing on resize handle pointer down", () => {
      const setResizing = vi.fn();
      const glyph = makeGlyph("g1");
      const { container } = renderGlyphItem({ glyph, selectedGlyphId: "g1", setResizing });
      const handles = Array.from(container.querySelectorAll("rect")).filter(
        r => r.getAttribute("fill") === "#fff" && r.getAttribute("stroke") === "#2563eb"
      );
      expect(handles.length).toBe(8);
      fireEvent.pointerDown(handles[0]);
      expect(setResizing).toHaveBeenCalled();
    });
  });

  describe("group highlighting", () => {
    it("renders group highlight (sky blue stroke) when glyph is part of a selected group", () => {
      const groupId = "group-1";
      const g1 = makeGlyph("g1");
      const g2 = makeGlyph("g2");
      g1.groupId = groupId;
      g2.groupId = groupId;
      const { container } = render(
        <svg>
          <GlyphItem
            glyph={g1}
            renderIdx={1}
            selectedGlyphId={null}
            selectedGlyphIds={["g2"]} // g2 is selected
            hoveredPort={null}
            dragConn={null}
            editingTextId={null}
            editingTextValue=""
            zoom={1}
            allGlyphs={[g1, g2]}
            allConnections={[]}
            canvasRef={makeRef()}
            {...baseCallbacks()}
          />
        </svg>
      );
      const rects = Array.from(container.querySelectorAll("rect"));
      const groupHighlight = rects.find(r => r.getAttribute("stroke") === "#38bdf8");
      expect(groupHighlight).not.toBeNull();
    });
  });

  describe("debug glyph", () => {
    it("logs when debug glyph has connections", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const glyph = new Glyph("dbg1", "debug", 0, 0, [], {}, "Dbg", 1, 1, [], [], 120, 80);
      const conn = makeConn("dbg1", "g2");
      render(
        <svg>
          <GlyphItem
            glyph={glyph}
            renderIdx={1}
            selectedGlyphId={null}
            selectedGlyphIds={[]}
            hoveredPort={null}
            dragConn={null}
            editingTextId={null}
            editingTextValue=""
            zoom={1}
            allGlyphs={[glyph]}
            allConnections={[conn]}
            canvasRef={makeRef()}
            {...baseCallbacks()}
          />
        </svg>
      );
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Breakpoint triggered"));
      consoleSpy.mockRestore();
    });

    it("uses glyph.id in log when debug glyph label is empty (|| glyph.id fallback)", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const glyph = new Glyph("dbg2", "debug", 0, 0, [], {}, "", 1, 1, [], [], 120, 80);
      // Connection where this glyph is the TARGET (covers conn.toGlyphId === glyph.id branch)
      const conn = new Connection("c1", "g-other", "p1", "dbg2", "p2");
      render(
        <svg>
          <GlyphItem
            glyph={glyph}
            renderIdx={1}
            selectedGlyphId={null}
            selectedGlyphIds={[]}
            hoveredPort={null}
            dragConn={null}
            editingTextId={null}
            editingTextValue=""
            zoom={1}
            allGlyphs={[glyph]}
            allConnections={[conn]}
            canvasRef={makeRef()}
            {...baseCallbacks()}
          />
        </svg>
      );
      // label="" is falsy, so `glyph.label || glyph.id` resolves to glyph.id "dbg2"
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("dbg2"));
      consoleSpy.mockRestore();
    });
  });

  describe("label alignment", () => {
    it("renders label text anchor as 'start' when data.labelAlign is 'left'", () => {
      const glyph = makeGlyph("g1", "rect", 100, 150);
      glyph.data = { labelAlign: "left" };
      const { container } = renderGlyphItem({ glyph });
      const text = container.querySelector("text");
      expect(text?.getAttribute("text-anchor")).toBe("start");
    });

    it("renders label text anchor as 'end' when data.labelAlign is 'right'", () => {
      const glyph = makeGlyph("g1", "rect", 100, 150);
      glyph.data = { labelAlign: "right" };
      const { container } = renderGlyphItem({ glyph });
      const text = container.querySelector("text");
      expect(text?.getAttribute("text-anchor")).toBe("end");
    });
  });

  describe("port connection highlight", () => {
    it("highlights port circle red when selectedConnId matches a connection via fromPortId", () => {
      const glyph = makeGlyph("g1");
      const portId = glyph.ports[0].id; // actual UUID-based port id
      const conn = new Connection("c1", "g1", portId, "g2", "p-other");
      const { container } = renderGlyphItem({
        glyph,
        selectedConnId: "c1",
        allConnections: [conn],
        allGlyphs: [glyph],
      });
      const circles = container.querySelectorAll("circle");
      const redCircle = Array.from(circles).find(
        c => c.getAttribute("fill") === "#fecaca"
      );
      expect(redCircle).toBeTruthy();
    });
  });
});
