import { describe, it, expect } from "vitest";
import { glyphRegistry } from "../glyph/type/GlyphRegistry";

describe("glyphRegistry", () => {
  // ── Shape ────────────────────────────────────────────────────────────────
  it("is a non-null object", () => {
    expect(glyphRegistry).toBeDefined();
    expect(typeof glyphRegistry).toBe("object");
    expect(glyphRegistry).not.toBeNull();
  });

  it("contains at least 10 registered glyph types", () => {
    expect(Object.keys(glyphRegistry).length).toBeGreaterThanOrEqual(10);
  });

  // ── Network entries ───────────────────────────────────────────────────────
  it("network-server entry has required fields", () => {
    const entry = glyphRegistry["network-server"];
    expect(entry).toBeDefined();
    expect(entry.name).toBe("Network Server");
    expect(entry.description).toBeTruthy();
    expect(entry.icon).toBeTruthy();
    expect(entry.defaultProps).toBeDefined();
    expect(entry.defaultProps.width).toBeGreaterThan(0);
    expect(entry.defaultProps.height).toBeGreaterThan(0);
  });

  it("network-router entry exists with correct defaultProps", () => {
    const entry = glyphRegistry["network-router"];
    expect(entry.name).toBe("Network Router");
    expect((entry.defaultProps as { data?: { model?: string } }).data?.model).toBe("RTX-1000");
  });

  it("network-switch entry has 24 ports in defaultProps", () => {
    const entry = glyphRegistry["network-switch"];
    expect((entry.defaultProps as { data?: { ports?: number } }).data?.ports).toBe(24);
  });

  // ── MCP entry ─────────────────────────────────────────────────────────────
  it("mcp-glyph entry has correct default dimensions", () => {
    const entry = glyphRegistry["mcp-glyph"];
    expect(entry.name).toBe("MCP Glyph");
    expect(entry.defaultProps.width).toBe(120);
    expect(entry.defaultProps.height).toBe(80);
  });

  // ── BPMN entries ──────────────────────────────────────────────────────────
  it("bpmn-task entry is registered with correct name", () => {
    const entry = glyphRegistry["bpmn-task"];
    expect(entry.name).toBe("Task");
    expect(entry.defaultProps.width).toBe(120);
    expect(entry.defaultProps.height).toBe(60);
  });

  it("bpmn-exclusive-gateway entry is registered", () => {
    const entry = glyphRegistry["bpmn-exclusive-gateway"];
    expect(entry.name).toBe("Exclusive Gateway");
    expect(entry.icon).toBe("diamond");
  });

  it("bpmn-pool has large default dimensions for swimlane", () => {
    const entry = glyphRegistry["bpmn-pool"];
    expect(entry.defaultProps.width).toBe(600);
    expect(entry.defaultProps.height).toBe(160);
  });

  it("bpmn-lane has correct default dimensions", () => {
    const entry = glyphRegistry["bpmn-lane"];
    expect(entry.defaultProps.width).toBe(600);
    expect(entry.defaultProps.height).toBe(80);
  });

  // ── All BPMN event types are registered ──────────────────────────────────
  it.each([
    "bpmn-start-event",
    "bpmn-end-event",
    "bpmn-intermediate-event",
    "bpmn-start-message",
    "bpmn-end-message",
    "bpmn-task",
    "bpmn-subprocess",
    "bpmn-user-task",
    "bpmn-service-task",
    "bpmn-exclusive-gateway",
    "bpmn-parallel-gateway",
    "bpmn-data-object",
    "bpmn-data-store",
  ])('"%s" is registered in the registry', (type) => {
    expect(glyphRegistry[type as keyof typeof glyphRegistry]).toBeDefined();
  });

  // ── propertiesComponent ───────────────────────────────────────────────────
  it("network-server has a component reference for propertiesComponent", () => {
    const entry = glyphRegistry["network-server"];
    // propertiesComponent should be a React component (function), not a string
    expect(typeof entry.propertiesComponent).toBe("function");
  });

  it("mcp-glyph has a component reference for propertiesComponent", () => {
    const entry = glyphRegistry["mcp-glyph"];
    expect(typeof entry.propertiesComponent).toBe("function");
  });
});
