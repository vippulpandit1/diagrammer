import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MCPProperties } from "../../glyph/type/mcp/MCPProperties";
import { Glyph } from "../../glyph/Glyph";

const makeGlyph = (ip = "192.168.1.1") =>
  new Glyph("g1", "mcp-glyph", 0, 0, [], { ip }, "MCP Server");

describe("MCPProperties", () => {
  it("renders an IP Address label", () => {
    render(<MCPProperties glyph={makeGlyph()} onUpdate={vi.fn()} />);
    expect(screen.getByText("IP Address")).toBeTruthy();
  });

  it("renders an input pre-filled with glyph.data.ip", () => {
    render(<MCPProperties glyph={makeGlyph("10.0.0.5")} onUpdate={vi.fn()} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("10.0.0.5");
  });

  it("calls onUpdate with updated ip when input changes", () => {
    const onUpdate = vi.fn();
    const glyph = makeGlyph("192.168.0.1");
    render(<MCPProperties glyph={glyph} onUpdate={onUpdate} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "10.10.10.10" } });

    expect(onUpdate).toHaveBeenCalledTimes(1);
    const updatedGlyph = onUpdate.mock.calls[0][0];
    expect(updatedGlyph.data.ip).toBe("10.10.10.10");
  });

  it("preserves other glyph.data fields when updating ip", () => {
    const onUpdate = vi.fn();
    const glyph = new Glyph("g1", "mcp-glyph", 0, 0, [], { ip: "1.2.3.4", port: 8080 }, "Server");
    render(<MCPProperties glyph={glyph} onUpdate={onUpdate} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "5.6.7.8" } });

    const updatedGlyph = onUpdate.mock.calls[0][0];
    expect(updatedGlyph.data.port).toBe(8080);
  });
});
