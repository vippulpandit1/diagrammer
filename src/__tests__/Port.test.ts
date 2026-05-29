import { describe, it, expect } from "vitest";
import { Port } from "../glyph/Port";

describe("Port", () => {
  it("creates an input port with an id", () => {
    const p = new Port("port-1", "input");
    expect(p.id).toBe("port-1");
    expect(p.type).toBe("input");
    expect(p.x).toBeUndefined();
    expect(p.y).toBeUndefined();
  });

  it("creates an output port with coordinates", () => {
    const p = new Port("port-2", "output", 100, 200);
    expect(p.type).toBe("output");
    expect(p.x).toBe(100);
    expect(p.y).toBe(200);
  });

  it("deserialises via fromJSON", () => {
    const p = Port.fromJSON({ id: "port-3", type: "input", x: 10, y: 20 });
    expect(p.id).toBe("port-3");
    expect(p.type).toBe("input");
    expect(p.x).toBe(10);
    expect(p.y).toBe(20);
  });

  it("fromJSON handles missing x/y", () => {
    const p = Port.fromJSON({ id: "port-4", type: "output" });
    expect(p.x).toBeUndefined();
    expect(p.y).toBeUndefined();
  });
});
