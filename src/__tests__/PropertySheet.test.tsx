import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PropertySheet } from "../PropertySheet";
import { Glyph } from "../glyph/Glyph";
import { Connection } from "../glyph/Connection";

vi.mock("../glyph/type/GlyphRegistry", () => ({
  glyphRegistry: {},
}));

vi.mock("uuid", () => ({ v4: () => "test-uuid" }));

const makeGlyph = (overrides: Partial<Glyph> = {}) =>
  Object.assign(
    new Glyph("g1", "rect", 10, 20, [], { fill: "#fff" }, "My Label", 1, 1),
    overrides
  );

const makeConnection = (): Connection => {
  const c = new Connection("from-port", "to-port", "c1", "g1", "g2");
  c.label = "My Connection";
  c.view = { connectionType: "line", color: "#000000", thickness: 2, dashed: false };
  return c;
};

// ── Empty state (no glyph, no connection) ──────────────────────────────────
describe("PropertySheet — empty state", () => {
  it("renders 'Nothing selected' when no glyph or connection is provided", () => {
    render(<PropertySheet onClose={vi.fn()} />);
    expect(screen.getAllByText("Nothing selected").length).toBeGreaterThan(0);
  });

  it("does not render an Apply button in empty state", () => {
    render(<PropertySheet onClose={vi.fn()} />);
    expect(screen.queryByText("Apply")).toBeNull();
  });
});

// ── Connection mode ────────────────────────────────────────────────────────
describe("PropertySheet — connection selected", () => {
  it("renders 'Connection Properties' heading", () => {
    render(<PropertySheet connection={makeConnection()} onClose={vi.fn()} />);
    expect(screen.getByText("Connection Properties")).toBeTruthy();
  });

  it("renders an Apply button", () => {
    render(<PropertySheet connection={makeConnection()} onClose={vi.fn()} />);
    expect(screen.getByText("Apply")).toBeTruthy();
  });

  it("close button (×) calls onClose", () => {
    const onClose = vi.fn();
    render(<PropertySheet connection={makeConnection()} onClose={onClose} />);
    fireEvent.click(screen.getByText("×"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders connection label input pre-filled with connection label", () => {
    render(<PropertySheet connection={makeConnection()} onClose={vi.fn()} />);
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    const labelInput = inputs.find(i => i.value === "My Connection");
    expect(labelInput).toBeTruthy();
  });
});

// ── Glyph mode ─────────────────────────────────────────────────────────────
describe("PropertySheet — glyph selected", () => {
  it("renders 'Properties' heading", () => {
    render(<PropertySheet glyph={makeGlyph()} onClose={vi.fn()} />);
    expect(screen.getByText("Properties")).toBeTruthy();
  });

  it("pre-fills the Label input with the glyph label", () => {
    render(<PropertySheet glyph={makeGlyph()} onClose={vi.fn()} />);
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    const labelInput = inputs.find(i => i.value === "My Label");
    expect(labelInput).toBeTruthy();
  });

  it("renders an Apply button", () => {
    render(<PropertySheet glyph={makeGlyph()} onClose={vi.fn()} />);
    expect(screen.getByText("Apply")).toBeTruthy();
  });

  it("close button calls onClose", () => {
    const onClose = vi.fn();
    const { container } = render(<PropertySheet glyph={makeGlyph()} onClose={onClose} />);
    const closeBtn = container.querySelector(".close-btn") as HTMLElement;
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("updating the label input changes its displayed value", () => {
    render(<PropertySheet glyph={makeGlyph()} onClose={vi.fn()} />);
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    const labelInput = inputs.find(i => i.value === "My Label")!;
    fireEvent.change(labelInput, { target: { value: "Renamed" } });
    expect((screen.getAllByRole("textbox") as HTMLInputElement[]).find(i => i.value === "Renamed")).toBeTruthy();
  });

  it("calls onUpdateGlyph when Apply is clicked", () => {
    const onUpdateGlyph = vi.fn();
    render(
      <PropertySheet glyph={makeGlyph()} onClose={vi.fn()} onUpdateGlyph={onUpdateGlyph} />
    );
    fireEvent.click(screen.getByText("Apply"));
    expect(onUpdateGlyph).toHaveBeenCalledTimes(1);
    expect(onUpdateGlyph.mock.calls[0][0]).toBe("g1");
  });

  it("syncs label state when a new glyph prop is passed", () => {
    const g1 = makeGlyph();
    const g2 = Object.assign(new Glyph("g2", "rect", 0, 0, [], {}, "Other Label"), {});
    const { rerender } = render(<PropertySheet glyph={g1} onClose={vi.fn()} />);

    rerender(<PropertySheet glyph={g2} onClose={vi.fn()} />);
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    expect(inputs.find(i => i.value === "Other Label")).toBeTruthy();
  });
});
