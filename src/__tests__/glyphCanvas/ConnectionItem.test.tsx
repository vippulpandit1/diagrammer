// Tests for ConnectionItem component
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConnectionItem } from "../../glyphCanvas/ConnectionItem";
import { Glyph } from "../../glyph/Glyph";
import { Connection } from "../../glyph/Connection";

// Helper factories
const makeGlyph = (id: string, x = 0, y = 0) =>
  new Glyph(id, "rect", x, y, [], {}, id, 1, 1, [], [], 120, 80);

const makeConn = (
  id: string,
  fromGlyphId: string,
  toGlyphId: string,
  extra: Partial<Connection> = {}
): Connection => {
  const c = new Connection(id, fromGlyphId, "port-1", toGlyphId, "port-2");
  Object.assign(c, extra);
  return c;
};

const baseCallbacks = {
  onSelect: vi.fn(),
  onDoubleClick: vi.fn(),
  onMouseEnter: vi.fn(),
  onMouseLeave: vi.fn(),
  onContextMenu: vi.fn(),
  onPointPointerDown: vi.fn(),
};

const renderItem = (overrides: Partial<React.ComponentProps<typeof ConnectionItem>> = {}) => {
  const g1 = makeGlyph("g1", 0, 0);
  const g2 = makeGlyph("g2", 200, 200);
  const conn = makeConn("c1", "g1", "g2");

  return render(
    <ConnectionItem
      conn={conn}
      i={0}
      renderIdx={1}
      selectedConn={null}
      hoveredConn={null}
      glyphsToRender={[g1, g2]}
      connectorType="bezier"
      {...baseCallbacks}
      {...overrides}
    />
  );
};

describe("ConnectionItem", () => {
  describe("null rendering", () => {
    it("renders null when fromGlyph is not found in glyphsToRender", () => {
      const g2 = makeGlyph("g2", 200, 200);
      const conn = makeConn("c1", "missing-glyph", "g2");
      const { container } = render(
        <ConnectionItem
          conn={conn}
          i={0}
          renderIdx={1}
          selectedConn={null}
          hoveredConn={null}
          glyphsToRender={[g2]}
          connectorType="bezier"
          {...baseCallbacks}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it("renders null when toGlyph is not found in glyphsToRender", () => {
      const g1 = makeGlyph("g1", 0, 0);
      const conn = makeConn("c1", "g1", "missing-glyph");
      const { container } = render(
        <ConnectionItem
          conn={conn}
          i={0}
          renderIdx={1}
          selectedConn={null}
          hoveredConn={null}
          glyphsToRender={[g1]}
          connectorType="bezier"
          {...baseCallbacks}
        />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe("basic rendering", () => {
    it("renders an svg element with a path inside", () => {
      const { container } = renderItem();
      const svg = container.querySelector("svg");
      expect(svg).not.toBeNull();
      const path = container.querySelector("path");
      expect(path).not.toBeNull();
    });

    it("positions svg absolutely using computed bounding box", () => {
      const { container } = renderItem();
      const svg = container.querySelector("svg")!;
      expect(svg.style.position).toBe("absolute");
    });

    it("renders with line connectorType", () => {
      const { container } = renderItem({ connectorType: "line" });
      const path = container.querySelector("path")!;
      expect(path.getAttribute("d")).toMatch(/^M/);
    });

    it("renders with manhattan connectorType", () => {
      const { container } = renderItem({ connectorType: "manhattan" });
      const path = container.querySelector("path")!;
      expect(path.getAttribute("d")).toMatch(/^M/);
    });
  });

  describe("selection state", () => {
    it("applies red stroke when connection is selected", () => {
      const { container } = renderItem({ selectedConn: 0 });
      const path = container.querySelector("path")!;
      expect(path.getAttribute("stroke")).toBe("#f87171");
    });

    it("applies blue stroke when connection is hovered", () => {
      const { container } = renderItem({ hoveredConn: 0 });
      const path = container.querySelector("path")!;
      expect(path.getAttribute("stroke")).toBe("#2563eb");
    });

    it("applies increased stroke width when selected", () => {
      const { container } = renderItem({ selectedConn: 0 });
      const path = container.querySelector("path")!;
      expect(path.getAttribute("stroke-width")).toBe("5");
    });

    it("uses custom connection color from view", () => {
      const g1 = makeGlyph("g1", 0, 0);
      const g2 = makeGlyph("g2", 200, 200);
      const conn = makeConn("c1", "g1", "g2", { view: { color: "#00ff00" } });
      const { container } = render(
        <ConnectionItem
          conn={conn}
          i={0}
          renderIdx={1}
          selectedConn={null}
          hoveredConn={null}
          glyphsToRender={[g1, g2]}
          connectorType="bezier"
          {...baseCallbacks}
        />
      );
      const path = container.querySelector("path")!;
      expect(path.getAttribute("stroke")).toBe("#00ff00");
    });
  });

  describe("event callbacks", () => {
    it("calls onSelect with connection index when path is clicked", () => {
      const onSelect = vi.fn();
      const { container } = renderItem({ onSelect });
      const path = container.querySelector("path")!;
      fireEvent.click(path);
      expect(onSelect).toHaveBeenCalledWith(0);
    });

    it("calls onDoubleClick with connection and index on double-click", () => {
      const onDoubleClick = vi.fn();
      const g1 = makeGlyph("g1", 0, 0);
      const g2 = makeGlyph("g2", 200, 200);
      const conn = makeConn("c1", "g1", "g2");
      render(
        <ConnectionItem
          conn={conn}
          i={0}
          renderIdx={1}
          selectedConn={null}
          hoveredConn={null}
          glyphsToRender={[g1, g2]}
          connectorType="bezier"
          {...baseCallbacks}
          onDoubleClick={onDoubleClick}
        />
      );
      const path = document.querySelector("path")!;
      fireEvent.doubleClick(path);
      expect(onDoubleClick).toHaveBeenCalledWith(conn, 0);
    });

    it("calls onMouseEnter with index on mouse enter", () => {
      const onMouseEnter = vi.fn();
      const { container } = renderItem({ onMouseEnter });
      const path = container.querySelector("path")!;
      fireEvent.mouseEnter(path);
      expect(onMouseEnter).toHaveBeenCalledWith(0);
    });

    it("calls onMouseLeave on mouse leave", () => {
      const onMouseLeave = vi.fn();
      const { container } = renderItem({ onMouseLeave });
      const path = container.querySelector("path")!;
      fireEvent.mouseLeave(path);
      expect(onMouseLeave).toHaveBeenCalled();
    });

    it("calls onContextMenu with connId when context menu fired on group", () => {
      const onContextMenu = vi.fn();
      const { container } = renderItem({ onContextMenu });
      const g = container.querySelector("g.connection")!;
      fireEvent.contextMenu(g);
      expect(onContextMenu).toHaveBeenCalledWith("c1", expect.any(Number), expect.any(Number));
    });
  });

  describe("label rendering", () => {
    it("renders label text and background rect when label is set", () => {
      const g1 = makeGlyph("g1", 0, 0);
      const g2 = makeGlyph("g2", 200, 200);
      const conn = makeConn("c1", "g1", "g2", { label: "test-label" });
      const { getByText } = render(
        <ConnectionItem
          conn={conn}
          i={0}
          renderIdx={1}
          selectedConn={null}
          hoveredConn={null}
          glyphsToRender={[g1, g2]}
          connectorType="bezier"
          {...baseCallbacks}
        />
      );
      expect(getByText("test-label")).not.toBeNull();
    });

    it("does not render label text when label is empty", () => {
      const { container } = renderItem();
      const text = container.querySelector("text");
      expect(text).toBeNull();
    });
  });

  describe("intermediate points", () => {
    it("renders circles for each intermediate point", () => {
      const g1 = makeGlyph("g1", 0, 0);
      const g2 = makeGlyph("g2", 200, 200);
      const conn = makeConn("c1", "g1", "g2", { points: [{ x: 100, y: 100 }, { x: 150, y: 150 }] });
      const { container } = render(
        <ConnectionItem
          conn={conn}
          i={0}
          renderIdx={1}
          selectedConn={null}
          hoveredConn={null}
          glyphsToRender={[g1, g2]}
          connectorType="bezier"
          {...baseCallbacks}
        />
      );
      const circles = container.querySelectorAll("circle");
      expect(circles).toHaveLength(2);
    });

    it("calls onPointPointerDown when intermediate point circle is pressed", () => {
      const onPointPointerDown = vi.fn();
      const g1 = makeGlyph("g1", 0, 0);
      const g2 = makeGlyph("g2", 200, 200);
      const conn = makeConn("c1", "g1", "g2", { points: [{ x: 100, y: 100 }] });
      const { container } = render(
        <ConnectionItem
          conn={conn}
          i={0}
          renderIdx={1}
          selectedConn={null}
          hoveredConn={null}
          glyphsToRender={[g1, g2]}
          connectorType="bezier"
          {...baseCallbacks}
          onPointPointerDown={onPointPointerDown}
        />
      );
      const circle = container.querySelector("circle")!;
      fireEvent.pointerDown(circle);
      expect(onPointPointerDown).toHaveBeenCalledWith("c1", 0, expect.any(Object));
    });
  });

  describe("connection view options", () => {
    it("applies dashed stroke when view.dashed is true", () => {
      const g1 = makeGlyph("g1", 0, 0);
      const g2 = makeGlyph("g2", 200, 200);
      const conn = makeConn("c1", "g1", "g2", { view: { dashed: true } });
      const { container } = render(
        <ConnectionItem
          conn={conn}
          i={0}
          renderIdx={1}
          selectedConn={null}
          hoveredConn={null}
          glyphsToRender={[g1, g2]}
          connectorType="bezier"
          {...baseCallbacks}
        />
      );
      const path = container.querySelector("path")!;
      expect(path.getAttribute("stroke-dasharray")).toBe("5,5");
    });

    it("uses connection type from conn.view when set", () => {
      const g1 = makeGlyph("g1", 0, 0);
      const g2 = makeGlyph("g2", 200, 200);
      const conn = makeConn("c1", "g1", "g2", { view: { connectionType: "line" } });
      const { container } = render(
        <ConnectionItem
          conn={conn}
          i={0}
          renderIdx={1}
          selectedConn={null}
          hoveredConn={null}
          glyphsToRender={[g1, g2]}
          connectorType="bezier"
          {...baseCallbacks}
        />
      );
      const path = container.querySelector("path")!;
      expect(path.getAttribute("d")).not.toBeNull();
    });

    it("uses custom thickness from view", () => {
      const g1 = makeGlyph("g1", 0, 0);
      const g2 = makeGlyph("g2", 200, 200);
      const conn = makeConn("c1", "g1", "g2", { view: { thickness: 4 } });
      const { container } = render(
        <ConnectionItem
          conn={conn}
          i={0}
          renderIdx={1}
          selectedConn={null}
          hoveredConn={null}
          glyphsToRender={[g1, g2]}
          connectorType="bezier"
          {...baseCallbacks}
        />
      );
      const path = container.querySelector("path")!;
      // Not selected, not hovered → uses connectionThickness=4
      expect(path.getAttribute("stroke-width")).toBe("4");
    });
  });
});
