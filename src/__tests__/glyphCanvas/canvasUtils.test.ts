// Tests for canvasUtils pure functions
import { describe, it, expect } from "vitest";
import {
  getConnectionPath,
  computeGlyphSize,
  getConnectors,
  getConnectorPos,
  getConnectionPathMulti,
} from "../../glyphCanvas/canvasUtils";
import { Glyph } from "../../glyph/Glyph";

// Helper: create a glyph with auto-generated ports
const makeGlyph = (
  id: string,
  type = "rect",
  x = 0,
  y = 0,
  inputs = 1,
  outputs = 1,
  label = "",
  width?: number,
  height?: number
) =>
  new Glyph(id, type, x, y, [], {}, label, inputs, outputs, [], [], width ?? 120, height ?? 80);

// ─── getConnectionPath ────────────────────────────────────────────────────────

describe("getConnectionPath", () => {
  it("returns a straight line for type='line'", () => {
    const path = getConnectionPath({ x: 0, y: 0 }, { x: 100, y: 50 }, "line");
    expect(path).toBe("M0,0 L100,50");
  });

  it("returns a horizontal-first manhattan path when dx > dy", () => {
    const path = getConnectionPath({ x: 0, y: 0 }, { x: 100, y: 10 }, "manhattan");
    // dx=100, dy=10 → horizontal first, midX=50
    expect(path).toBe("M0,0 L50,0 L50,10 L100,10");
  });

  it("returns a vertical-first manhattan path when dy >= dx", () => {
    const path = getConnectionPath({ x: 0, y: 0 }, { x: 10, y: 100 }, "manhattan");
    // dx=10, dy=100 → vertical first, midY=50
    expect(path).toBe("M0,0 L0,50 L10,50 L10,100");
  });

  it("returns a bezier curve by default", () => {
    const path = getConnectionPath({ x: 0, y: 0 }, { x: 100, y: 100 });
    expect(path).toMatch(/^M0,0 C/);
    expect(path).toContain("100,100");
  });

  it("returns a bezier curve for type='bezier'", () => {
    const path = getConnectionPath({ x: 10, y: 20 }, { x: 110, y: 80 }, "bezier");
    expect(path).toMatch(/^M10,20 C/);
    // c1x = 10 + (110-10)*0.3 = 10 + 30 = 40
    // c2x = 110 - (110-10)*0.3 = 110 - 30 = 80
    expect(path).toContain("40,20");
    expect(path).toContain("80,80");
    expect(path).toContain("110,80");
  });

  it("handles same source and destination (degenerate bezier)", () => {
    const path = getConnectionPath({ x: 50, y: 50 }, { x: 50, y: 50 }, "bezier");
    expect(path).toContain("M50,50");
  });
});

// ─── computeGlyphSize ────────────────────────────────────────────────────────

describe("computeGlyphSize", () => {
  it("returns explicit dims for text glyph when width/height set", () => {
    const g = makeGlyph("t1", "text", 0, 0, 0, 0, "Hello", 200, 50);
    const { w, h } = computeGlyphSize(g);
    expect(w).toBe(200);
    expect(h).toBe(50);
  });

  it("calculates text glyph size from label + fontSize when no explicit dims", () => {
    const g = new Glyph("t2", "text", 0, 0, [], { fontSize: 20 }, "Hi");
    // width: max(60, 2 * (20*0.6) + 32) = max(60, 56) = 60
    // height: max(20*2, 40) = 40
    const { w, h } = computeGlyphSize(g);
    expect(w).toBeGreaterThanOrEqual(60);
    expect(h).toBeGreaterThanOrEqual(40);
  });

  it("calculates size based on label length for generic glyph", () => {
    const label = "A".repeat(20); // long label
    const g = makeGlyph("r1", "rect", 0, 0, 1, 1, label);
    // Clear explicit dims so computeGlyphSize uses label-based calculation
    g.width = undefined as unknown as number;
    g.height = undefined as unknown as number;
    const { w } = computeGlyphSize(g);
    // labelWidth = max(60, 20*10+32) = 232; w = max(232, 100) = 232
    expect(w).toBe(232);
  });

  it("returns explicit dims for resizable-rectangle", () => {
    const g = makeGlyph("rr1", "resizable-rectangle", 0, 0, 1, 1, "", 300, 200);
    const { w, h } = computeGlyphSize(g);
    expect(w).toBe(300);
    expect(h).toBe(200);
  });

  it("returns default resizable-rectangle dims when no width/height", () => {
    const g = new Glyph("rr2", "resizable-rectangle", 0, 0, [], {}, "", 1, 1);
    g.width = undefined as unknown as number;
    g.height = undefined as unknown as number;
    const { w, h } = computeGlyphSize(g);
    expect(w).toBe(120); // default 120
    expect(h).toBe(80); // default 80
  });

  it("returns explicit dims for generic glyph when set", () => {
    const g = makeGlyph("c1", "circle", 0, 0, 1, 1, "X", 80, 80);
    const { w, h } = computeGlyphSize(g);
    expect(w).toBe(80);
    expect(h).toBe(80);
  });

  it("factors attribute count into height", () => {
    const attrs = [
      { name: "a", type: "string" as const, visibility: "public" as const },
      { name: "b", type: "string" as const, visibility: "public" as const },
    ];
    const g = new Glyph("a1", "uml-class", 0, 0, [], {}, "Foo", 1, 1, attrs);
    g.width = undefined as unknown as number;
    g.height = undefined as unknown as number;
    // attrHeight = 2*18 + 60 = 96; h = max(96, 60) = 96
    const { h } = computeGlyphSize(g);
    expect(h).toBe(96);
  });

  it("returns at least h=60 for glyph with no attributes", () => {
    const g = new Glyph("r2", "rect", 0, 0, [], {}, "", 1, 1);
    g.width = undefined as unknown as number;
    g.height = undefined as unknown as number;
    const { h } = computeGlyphSize(g);
    expect(h).toBeGreaterThanOrEqual(60);
  });
});

// ─── getConnectors ───────────────────────────────────────────────────────────

describe("getConnectors", () => {
  it("places input connectors on the left edge", () => {
    const g = makeGlyph("g1", "rect", 0, 0, 2, 0);
    const conns = getConnectors(g, 120, 80);
    const inputs = conns.filter(c => c.type === "input");
    expect(inputs).toHaveLength(2);
    inputs.forEach(c => expect(c.cx).toBe(0));
  });

  it("places output connectors on the right edge", () => {
    const g = makeGlyph("g1", "rect", 0, 0, 0, 2);
    const conns = getConnectors(g, 120, 80);
    const outputs = conns.filter(c => c.type === "output");
    expect(outputs).toHaveLength(2);
    outputs.forEach(c => expect(c.cx).toBe(120));
  });

  it("spaces connectors evenly along the height", () => {
    const g = makeGlyph("g1", "rect", 0, 0, 1, 0);
    const conns = getConnectors(g, 120, 80);
    const input = conns.find(c => c.type === "input")!;
    // cy = height * (1 / (numInputs + 1)) = 80 * (1/2) = 40
    expect(input.cy).toBeCloseTo(40);
  });

  it("generates attribute-outbound connectors for uml-class with self-defined attrs", () => {
    const attrs = [{ name: "x", type: "self-defined" as const, visibility: "public" as const }];
    const g = new Glyph("u1", "uml-class", 0, 0, [], {}, "Cls", 1, 1, attrs);
    const conns = getConnectors(g, 120, 80);
    const attrConns = conns.filter(c => c.type === "attribute-outbound");
    expect(attrConns).toHaveLength(1);
    expect(attrConns[0].cx).toBe(120); // right edge
    expect(attrConns[0].id).toBe("attr-outbound-0");
  });

  it("does not generate attribute-outbound connectors for non-uml-class glyph", () => {
    const attrs = [{ name: "x", type: "self-defined" as const, visibility: "public" as const }];
    const g = new Glyph("r1", "rect", 0, 0, [], {}, "Foo", 1, 1, attrs);
    const conns = getConnectors(g, 120, 80);
    const attrConns = conns.filter(c => c.type === "attribute-outbound");
    expect(attrConns).toHaveLength(0);
  });

  it("returns empty array for glyph with no ports", () => {
    const g = makeGlyph("g0", "rect", 0, 0, 0, 0);
    const conns = getConnectors(g, 120, 80);
    expect(conns).toHaveLength(0);
  });
});

// ─── getConnectorPos ─────────────────────────────────────────────────────────

describe("getConnectorPos", () => {
  it("returns absolute position for a valid portId", () => {
    const g = makeGlyph("g1", "rect", 50, 100, 1, 1);
    const portId = g.ports[0].id; // first port (input)
    const pos = getConnectorPos(g, portId, 120, 80);
    // The input connector is at cx=0, cy = 80*(1/2) = 40
    // Absolute: x = 50+0 = 50, y = 100+40 = 140
    expect(pos.x).toBe(50);
    expect(pos.y).toBeCloseTo(140);
  });

  it("falls back to glyph origin when portId not found", () => {
    const g = makeGlyph("g1", "rect", 10, 20, 1, 1);
    const pos = getConnectorPos(g, "nonexistent-port", 120, 80);
    expect(pos).toEqual({ x: 10, y: 20 });
  });
});

// ─── getConnectionPathMulti ──────────────────────────────────────────────────

describe("getConnectionPathMulti", () => {
  it("produces a path through intermediate points", () => {
    const path = getConnectionPathMulti(
      { x: 0, y: 0 },
      [{ x: 50, y: 25 }, { x: 100, y: 50 }],
      { x: 150, y: 75 }
    );
    expect(path).toBe("M0,0 L50,25 L100,50 L150,75");
  });

  it("produces a direct path with empty points array", () => {
    const path = getConnectionPathMulti({ x: 0, y: 0 }, [], { x: 100, y: 100 });
    expect(path).toBe("M0,0 L100,100");
  });

  it("accepts type parameter without affecting output (always polyline)", () => {
    const path1 = getConnectionPathMulti({ x: 0, y: 0 }, [{ x: 50, y: 50 }], { x: 100, y: 100 }, "bezier");
    const path2 = getConnectionPathMulti({ x: 0, y: 0 }, [{ x: 50, y: 50 }], { x: 100, y: 100 }, "manhattan");
    expect(path1).toBe(path2);
  });
});
