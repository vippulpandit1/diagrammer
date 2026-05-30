import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MCPGlyph } from "../../glyph/type/mcp/MCPGlyph_";

describe("MCPGlyph class", () => {
  it("sets default values when constructed with empty object", () => {
    const g = new MCPGlyph({});
    expect(g.id).toBeTruthy(); // crypto.randomUUID()
    expect(g.type).toBe("default");
    expect(g.x).toBe(0);
    expect(g.y).toBe(0);
    expect(g.label).toBe("New Glyph");
    expect(g.data).toEqual({});
    expect(g.ports).toEqual([]);
    expect(g.attributes).toEqual([]);
    expect(g.methods).toEqual([]);
  });

  it("uses provided values over defaults", () => {
    const g = new MCPGlyph({
      id: "custom-id",
      type: "mcp-tool",
      x: 10,
      y: 20,
      width: 120,
      height: 80,
      label: "My Tool",
      data: { key: "value" },
    });
    expect(g.id).toBe("custom-id");
    expect(g.type).toBe("mcp-tool");
    expect(g.x).toBe(10);
    expect(g.y).toBe(20);
    expect(g.width).toBe(120);
    expect(g.height).toBe(80);
    expect(g.label).toBe("My Tool");
    expect(g.data).toEqual({ key: "value" });
  });

  it("onUpdate mutates the glyph in-place", () => {
    const g = new MCPGlyph({ id: "g1", label: "Before" });
    g.onUpdate("g1", { label: "After", type: "updated" });
    expect(g.label).toBe("After");
    expect(g.type).toBe("updated");
  });

  it("onRender returns a React element containing an svg", () => {
    const g = new MCPGlyph({ id: "g1", width: 100, height: 60, label: "Test" });
    const element = g.onRender();
    const { container } = render(element);
    expect(container.querySelector("svg")).toBeTruthy();
    expect(container.querySelector("rect")).toBeTruthy();
    expect(container.querySelector("text")?.textContent).toBe("Test");
  });

  it("onRender falls back to 100x100 when width/height are not set", () => {
    const g = new MCPGlyph({ id: "g2", label: "NoSize" });
    const element = g.onRender();
    const { container } = render(element);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("100");
    expect(svg?.getAttribute("height")).toBe("100");
  });

  it("stores groupId, ports, attributes, methods when provided", () => {
    const g = new MCPGlyph({
      id: "g3",
      groupId: "grp-1",
      ports: [{ id: "p1", type: "input" }],
      attributes: [{ name: "x", type: "string" }],
      methods: [{ name: "run", returnType: "void" }],
    });
    expect(g.groupId).toBe("grp-1");
    expect(g.ports).toHaveLength(1);
    expect(g.attributes).toHaveLength(1);
    expect(g.methods).toHaveLength(1);
  });
});
