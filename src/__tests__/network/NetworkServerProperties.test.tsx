import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NetworkServerProperties } from "../../glyph/type/network/NetworkServerProperties";
import { Glyph } from "../../glyph/Glyph";

const makeGlyph = (ip = "192.168.1.1") =>
  new Glyph("g1", "network-server", 0, 0, [], { ip }, "Server", 1, 1);

describe("NetworkServerProperties", () => {
  it("renders the IP Address label", () => {
    render(<NetworkServerProperties glyph={makeGlyph()} onUpdate={vi.fn()} />);
    expect(screen.getByText("IP Address")).toBeTruthy();
  });

  it("input is pre-filled with glyph.data.ip", () => {
    render(<NetworkServerProperties glyph={makeGlyph("10.0.0.5")} onUpdate={vi.fn()} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("10.0.0.5");
  });

  it("onChange calls onUpdate with the new ip value", () => {
    const onUpdate = vi.fn();
    render(<NetworkServerProperties glyph={makeGlyph("192.168.1.1")} onUpdate={onUpdate} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "172.16.0.1" } });
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate.mock.calls[0][0].data.ip).toBe("172.16.0.1");
  });
});
