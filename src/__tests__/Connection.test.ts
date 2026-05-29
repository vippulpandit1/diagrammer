import { describe, it, expect } from "vitest";
import { Connection, CONNECTION_TYPE_INDEX } from "../glyph/Connection";

describe("Connection", () => {
  // ── Constructor ────────────────────────────────────────────────────────────
  it("creates a connection with required fields", () => {
    const c = new Connection("c1", "g1", "p1", "g2", "p2");
    expect(c.id).toBe("c1");
    expect(c.fromGlyphId).toBe("g1");
    expect(c.fromPortId).toBe("p1");
    expect(c.toGlyphId).toBe("g2");
    expect(c.toPortId).toBe("p2");
    expect(c.type).toBe("default");
    expect(c.label).toBe("");
    expect(c.view).toEqual({});
  });

  it("stores optional label and type", () => {
    const c = new Connection("c2", "g1", "p1", "g2", "p2", "my label", "inheritance");
    expect(c.label).toBe("my label");
    expect(c.type).toBe("inheritance");
  });

  it("stores view properties", () => {
    const c = new Connection("c3", "g1", "p1", "g2", "p2", "", "default", { color: "red" });
    expect(c.view).toEqual({ color: "red" });
  });

  it("generates a uuid id when none is provided", () => {
    const c = new Connection(undefined as unknown as string, "g1", "p1", "g2", "p2");
    expect(typeof c.id).toBe("string");
    expect(c.id!.length).toBeGreaterThan(0);
  });

  // ── fromJSON ────────────────────────────────────────────────────────────────
  it("deserialises a plain object via fromJSON", () => {
    const json = {
      id: "c4",
      fromGlyphId: "g1",
      fromPortId: "p1",
      toGlyphId: "g2",
      toPortId: "p2",
      type: "association",
      label: "link",
    };
    const c = Connection.fromJSON(json);
    expect(c.id).toBe("c4");
    expect(c.type).toBe("association");
    expect(c.label).toBe("link");
  });

  it("fromJSON defaults type to default when missing", () => {
    const json = { id: "c5", fromGlyphId: "g1", fromPortId: "p1", toGlyphId: "g2", toPortId: "p2" };
    const c = Connection.fromJSON(json);
    expect(c.type).toBe("default");
  });

  // ── Constants ──────────────────────────────────────────────────────────────
  it("exports CONNECTION_TYPE_INDEX constant", () => {
    expect(CONNECTION_TYPE_INDEX).toBe("connectionType");
  });
});
