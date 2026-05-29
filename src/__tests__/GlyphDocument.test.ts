import { describe, it, expect } from "vitest";
import { GlyphDocument } from "../glyph/GlyphDocument";
import { Glyph } from "../glyph/Glyph";
import { Connection } from "../glyph/Connection";

describe("GlyphDocument", () => {
  // ── Constructor ─────────────────────────────────────────────────────────
  it("initialises with empty arrays by default", () => {
    const doc = new GlyphDocument();
    expect(doc.glyphs).toEqual([]);
    expect(doc.connections).toEqual([]);
  });

  it("stores provided glyphs and connections", () => {
    const g = new Glyph("g1", "rect", 10, 20);
    const c = new Connection("c1", "g1", "p1", "g2", "p2");
    const doc = new GlyphDocument([g], [c]);
    expect(doc.glyphs).toHaveLength(1);
    expect(doc.connections).toHaveLength(1);
    expect(doc.glyphs[0].id).toBe("g1");
    expect(doc.connections[0].id).toBe("c1");
  });

  // ── toJSON ──────────────────────────────────────────────────────────────
  it("toJSON returns object with glyphs and connections arrays", () => {
    const doc = new GlyphDocument();
    const json = doc.toJSON();
    expect(json).toHaveProperty("glyphs");
    expect(json).toHaveProperty("connections");
    expect(Array.isArray(json.glyphs)).toBe(true);
    expect(Array.isArray(json.connections)).toBe(true);
  });

  it("toJSON serialises glyphs correctly", () => {
    const g = new Glyph("g1", "circle", 50, 60);
    const doc = new GlyphDocument([g]);
    const json = doc.toJSON();
    expect(json.glyphs[0]).toMatchObject({ id: "g1", type: "circle", x: 50, y: 60 });
  });

  // ── fromJSON ─────────────────────────────────────────────────────────────
  it("fromJSON creates an empty document when given empty arrays", () => {
    const doc = GlyphDocument.fromJSON({ glyphs: [], connections: [] });
    expect(doc).toBeInstanceOf(GlyphDocument);
    expect(doc.glyphs).toHaveLength(0);
    expect(doc.connections).toHaveLength(0);
  });

  it("fromJSON handles missing glyphs/connections keys gracefully", () => {
    const doc = GlyphDocument.fromJSON({});
    expect(doc.glyphs).toHaveLength(0);
    expect(doc.connections).toHaveLength(0);
  });

  it("fromJSON deserialises glyphs", () => {
    const raw = {
      glyphs: [{ id: "g1", type: "rect", x: 10, y: 20, label: "Box", width: 120, height: 80, inputs: 1, outputs: 1, data: {}, ports: [] }],
      connections: [],
    };
    const doc = GlyphDocument.fromJSON(raw);
    expect(doc.glyphs).toHaveLength(1);
    expect(doc.glyphs[0]).toBeInstanceOf(Glyph);
    expect(doc.glyphs[0].id).toBe("g1");
    expect(doc.glyphs[0].type).toBe("rect");
  });

  it("fromJSON deserialises connections", () => {
    const raw = {
      glyphs: [],
      connections: [
        { id: "c1", fromGlyphId: "g1", fromPortId: "p1", toGlyphId: "g2", toPortId: "p2", label: "link", type: "default" },
      ],
    };
    const doc = GlyphDocument.fromJSON(raw);
    expect(doc.connections).toHaveLength(1);
    expect(doc.connections[0]).toBeInstanceOf(Connection);
    expect(doc.connections[0].id).toBe("c1");
    expect(doc.connections[0].label).toBe("link");
  });

  // ── Round-trip ───────────────────────────────────────────────────────────
  it("round-trips a document through JSON.stringify / fromJSON", () => {
    // Glyph constructor: (id, type, x, y, ports=[], data={}, label="", inputs=2, outputs=1, attrs=[], methods=[], width=120, height=80)
    const g = new Glyph("g1", "rect", 5, 10, [], {}, "MyLabel", 2, 1, [], [], 150, 90);
    const c = new Connection("c1", "g1", "out-0", "g2", "in-0", "edge", "dashed");
    const original = new GlyphDocument([g], [c]);

    const restored = GlyphDocument.fromJSON(JSON.parse(JSON.stringify(original.toJSON())));

    expect(restored.glyphs).toHaveLength(1);
    expect(restored.glyphs[0].label).toBe("MyLabel");
    expect(restored.glyphs[0].width).toBe(150);
    expect(restored.connections).toHaveLength(1);
    expect(restored.connections[0].label).toBe("edge");
    expect(restored.connections[0].type).toBe("dashed");
  });

  it("round-trip preserves multiple glyphs", () => {
    const glyphs = [
      new Glyph("g1", "rect", 0, 0),
      new Glyph("g2", "circle", 100, 100),
      new Glyph("g3", "text", 200, 200, "hello"),
    ];
    const doc = new GlyphDocument(glyphs);
    const restored = GlyphDocument.fromJSON(JSON.parse(JSON.stringify(doc.toJSON())));
    expect(restored.glyphs).toHaveLength(3);
    expect(restored.glyphs.map((g) => g.type)).toEqual(["rect", "circle", "text"]);
  });
});
