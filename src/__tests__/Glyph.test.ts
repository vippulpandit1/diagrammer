import { describe, it, expect } from "vitest";
import { Glyph } from "../glyph/Glyph";

describe("Glyph", () => {
  // ── Constructor ────────────────────────────────────────────────────────────
  it("creates a glyph with default values", () => {
    const g = new Glyph("g1", "rect", 10, 20);
    expect(g.id).toBe("g1");
    expect(g.type).toBe("rect");
    expect(g.x).toBe(10);
    expect(g.y).toBe(20);
    expect(g.width).toBe(120);
    expect(g.height).toBe(80);
    expect(g.label).toBe("");
    expect(g.data).toEqual({});
  });

  it("stores custom label and data", () => {
    const g = new Glyph("g2", "circle", 0, 0, [], { color: "red" }, "My Circle");
    expect(g.label).toBe("My Circle");
    expect(g.data).toEqual({ color: "red" });
  });

  // ── Ports ──────────────────────────────────────────────────────────────────
  it("generates input and output ports based on counts", () => {
    const g = new Glyph("g3", "rect", 0, 0, [], {}, "", 2, 3);
    const inputs = g.ports.filter(p => p.type === "input");
    const outputs = g.ports.filter(p => p.type === "output");
    expect(inputs.length).toBe(2);
    expect(outputs.length).toBe(3);
  });

  it("always generates 1 input and 1 output for debug type", () => {
    const g = new Glyph("g4", "debug", 0, 0, [], {}, "", 5, 5);
    const inputs = g.ports.filter(p => p.type === "input");
    const outputs = g.ports.filter(p => p.type === "output");
    expect(inputs.length).toBe(1);
    expect(outputs.length).toBe(1);
  });

  it("assigns unique ids to all ports", () => {
    const g = new Glyph("g5", "rect", 0, 0, [], {}, "", 3, 3);
    const ids = g.ports.map(p => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("generates no ports when inputs and outputs are 0", () => {
    const g = new Glyph("g6", "text", 0, 0, [], {}, "", 0, 0);
    expect(g.ports.length).toBe(0);
  });

  // ── Dimensions ─────────────────────────────────────────────────────────────
  it("stores custom width and height", () => {
    const g = new Glyph("g7", "rect", 0, 0, [], {}, "", 2, 1, [], [], 200, 150);
    expect(g.width).toBe(200);
    expect(g.height).toBe(150);
  });

  // ── fromJSON ────────────────────────────────────────────────────────────────
  it("deserialises a plain object via fromJSON", () => {
    const json = {
      id: "g8",
      type: "circle",
      x: 50,
      y: 60,
      ports: [],
      data: { color: "blue" },
      label: "Blue Circle",
      inputs: 1,
      outputs: 2,
      attributes: [],
      methods: [],
      width: 90,
      height: 70,
    };
    const g = Glyph.fromJSON(json);
    expect(g.id).toBe("g8");
    expect(g.type).toBe("circle");
    expect(g.label).toBe("Blue Circle");
    expect(g.width).toBe(90);
    expect(g.height).toBe(70);
  });

  it("fromJSON uses defaults when optional fields are missing", () => {
    const g = Glyph.fromJSON({ id: "g9", type: "rect", x: 0, y: 0 });
    expect(g.label).toBe("");
    expect(g.data).toEqual({});
    expect(g.width).toBe(120);
    expect(g.height).toBe(80);
  });

  // ── groupId / icon ─────────────────────────────────────────────────────────
  it("stores optional groupId and icon", () => {
    const g = new Glyph("g10", "rect", 0, 0, [], {}, "", 1, 1, [], [], 120, 80, "icon.png");
    expect(g.icon).toBe("icon.png");
    g.groupId = "group-1";
    expect(g.groupId).toBe("group-1");
  });
});
