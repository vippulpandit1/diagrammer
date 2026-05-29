import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Toolbar } from "../Toolbar";

// Stub the Stencil component so tests don't need SVG rendering
vi.mock("../Stencil", () => ({
  Stencil: ({ stencilType }: { stencilType: string }) => (
    <div data-testid={`stencil-${stencilType}`} />
  ),
}));

const defaultProps = {
  stencilType: "basic" as const,
  setStencilType: vi.fn(),
  connectionType: "association",
  setConnectionType: vi.fn(),
};

describe("Toolbar", () => {
  // ── Stencil type selector ────────────────────────────────────────────────
  it("renders a select with all 8 stencil categories", () => {
    render(<Toolbar {...defaultProps} />);
    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option")).map(
      (o) => o.textContent
    );
    expect(options).toContain("Basic");
    expect(options).toContain("Logic Gates");
    expect(options).toContain("UML");
    expect(options).toContain("Network");
    expect(options).toContain("Flowchart");
    expect(options).toContain("BPMN");
    expect(options).toContain("MCP");
    expect(options).toContain("Debug");
    expect(options).toHaveLength(8);
  });

  it("shows the current stencilType as the selected value", () => {
    render(<Toolbar {...defaultProps} stencilType="uml" />);
    const select = screen.getAllByRole("combobox")[0];
    expect((select as HTMLSelectElement).value).toBe("uml");
  });

  it("calls setStencilType when a new option is selected", () => {
    const setStencilType = vi.fn();
    render(<Toolbar {...defaultProps} setStencilType={setStencilType} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "logic" } });
    expect(setStencilType).toHaveBeenCalledWith("logic");
  });

  // ── UML connection type selector ─────────────────────────────────────────
  it("does NOT show the connection type selector for non-UML stencils", () => {
    render(<Toolbar {...defaultProps} stencilType="basic" />);
    expect(screen.queryByText("Connection:")).not.toBeInTheDocument();
  });

  it("shows the connection type selector when stencilType is 'uml'", () => {
    render(<Toolbar {...defaultProps} stencilType="uml" />);
    expect(screen.getByText("Connection:")).toBeInTheDocument();
  });

  it("connection selector includes all UML relationship types", () => {
    render(<Toolbar {...defaultProps} stencilType="uml" />);
    const selects = screen.getAllByRole("combobox");
    const connectionSelect = selects[1]; // second select is connection type
    const options = Array.from(connectionSelect.querySelectorAll("option")).map(
      (o) => o.textContent
    );
    expect(options).toContain("Association");
    expect(options).toContain("Inheritance");
    expect(options).toContain("Realization");
    expect(options).toContain("Dependency");
    expect(options).toContain("Aggregation");
    expect(options).toContain("Composition");
  });

  it("calls setConnectionType when connection type changes", () => {
    const setConnectionType = vi.fn();
    render(
      <Toolbar
        {...defaultProps}
        stencilType="uml"
        setConnectionType={setConnectionType}
      />
    );
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[1], { target: { value: "inheritance" } });
    expect(setConnectionType).toHaveBeenCalledWith("inheritance");
  });

  // ── Stencil rendering ─────────────────────────────────────────────────────
  it("renders the Stencil component with the current stencilType", () => {
    render(<Toolbar {...defaultProps} stencilType="flowchart" />);
    expect(screen.getByTestId("stencil-flowchart")).toBeInTheDocument();
  });

  // ── Orientation ───────────────────────────────────────────────────────────
  it("applies flex-direction:row style when orientation is horizontal", () => {
    const { container } = render(
      <Toolbar {...defaultProps} orientation="horizontal" />
    );
    const outer = container.firstChild as HTMLElement;
    expect(outer.style.display).toBe("flex");
    expect(outer.style.flexDirection).toBe("row");
  });

  it("does not apply row style when orientation is vertical (default)", () => {
    const { container } = render(<Toolbar {...defaultProps} />);
    const outer = container.firstChild as HTMLElement;
    expect(outer.style.flexDirection).not.toBe("row");
  });
});
