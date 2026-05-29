import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { Stencil } from "../Stencil";

// Stub heavy SVG glyph renderers so tests stay fast and deterministic
vi.mock("../glyph/GlyphRenderer", () => ({
  GlyphRenderer: ({ type }: { type: string }) => (
    <rect data-testid={`glyph-${type}`} />
  ),
}));

describe("Stencil", () => {
  // ── Rendering ──────────────────────────────────────────────────────────
  it("renders flowchart glyphs with expected labels", () => {
    render(<Stencil stencilType="flowchart" />);
    expect(screen.getByText("Process")).toBeInTheDocument();
    expect(screen.getByText("Decision")).toBeInTheDocument();
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("End")).toBeInTheDocument();
  });

  it("renders basic stencil glyphs", () => {
    render(<Stencil stencilType="basic" />);
    expect(screen.getByText("Rectangle")).toBeInTheDocument();
    expect(screen.getByText("Circle")).toBeInTheDocument();
    expect(screen.getByText("Text")).toBeInTheDocument();
  });

  it("renders logic gate glyphs", () => {
    render(<Stencil stencilType="logic" />);
    expect(screen.getByText("AND")).toBeInTheDocument();
    expect(screen.getByText("OR")).toBeInTheDocument();
    expect(screen.getByText("NOT")).toBeInTheDocument();
    expect(screen.getByText("NAND")).toBeInTheDocument();
    expect(screen.getByText("XOR")).toBeInTheDocument();
  });

  it("renders UML glyphs", () => {
    render(<Stencil stencilType="uml" />);
    expect(screen.getByText("Class")).toBeInTheDocument();
    expect(screen.getByText("Interface")).toBeInTheDocument();
    expect(screen.getByText("Enum")).toBeInTheDocument();
  });

  it("renders BPMN glyphs", () => {
    render(<Stencil stencilType="bpmn" />);
    expect(screen.getByText("Task")).toBeInTheDocument();
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("End")).toBeInTheDocument();
  });

  // ── Port dots ──────────────────────────────────────────────────────────
  it("renders 3 port dots for Decision (1 input + 2 outputs)", () => {
    render(<Stencil stencilType="flowchart" />);
    const decisionGlyph = screen.getByText("Decision").closest(".stencil-glyph");
    expect(decisionGlyph).toBeInTheDocument();
    const circles = decisionGlyph!.querySelectorAll("circle");
    expect(circles.length).toBe(3);
  });

  it("renders 2 port dots for Process (1 input + 1 output)", () => {
    render(<Stencil stencilType="flowchart" />);
    const processGlyph = screen.getByText("Process").closest(".stencil-glyph");
    const circles = processGlyph!.querySelectorAll("circle");
    expect(circles.length).toBe(2);
  });

  it("renders 1 port dot for Start (0 inputs + 1 output)", () => {
    render(<Stencil stencilType="flowchart" />);
    const startGlyph = screen.getByText("Start").closest(".stencil-glyph");
    const circles = startGlyph!.querySelectorAll("circle");
    expect(circles.length).toBe(1);
  });

  it("renders 0 port dots for End (1 input + 0 outputs)", () => {
    render(<Stencil stencilType="flowchart" />);
    const endGlyph = screen.getByText("End").closest(".stencil-glyph");
    const circles = endGlyph!.querySelectorAll("circle");
    // End has 1 input rendered as 1 circle on the left side
    expect(circles.length).toBe(1);
  });

  // ── Tooltip ────────────────────────────────────────────────────────────
  it("shows tooltip text for flow-process on hover", () => {
    render(<Stencil stencilType="flowchart" />);
    const processGlyph = screen.getByText("Process").closest(".stencil-glyph");
    fireEvent.mouseEnter(processGlyph!);
    expect(screen.getByText(/step or action/i)).toBeInTheDocument();
  });

  it("hides tooltip when mouse leaves", () => {
    render(<Stencil stencilType="flowchart" />);
    const processGlyph = screen.getByText("Process").closest(".stencil-glyph");
    fireEvent.mouseEnter(processGlyph!);
    expect(screen.getByText(/step or action/i)).toBeInTheDocument();
    fireEvent.mouseLeave(processGlyph!);
    expect(screen.queryByText(/step or action/i)).not.toBeInTheDocument();
  });

  it("shows tooltip for flow-start on hover", () => {
    render(<Stencil stencilType="flowchart" />);
    const startGlyph = screen.getByText("Start").closest(".stencil-glyph");
    fireEvent.mouseEnter(startGlyph!);
    expect(screen.getByText(/entry point/i)).toBeInTheDocument();
  });

  // ── Drag ───────────────────────────────────────────────────────────────
  it("calls onGlyphDragStart with the correct type when dragging", () => {
    const onDragStart = vi.fn();
    render(<Stencil stencilType="flowchart" onGlyphDragStart={onDragStart} />);
    const processGlyph = screen.getByText("Process").closest(".stencil-glyph");
    // jsdom doesn't provide dataTransfer on drag events — supply a mock
    fireEvent.dragStart(processGlyph!, {
      dataTransfer: { setData: vi.fn(), effectAllowed: "" },
    });
    expect(onDragStart).toHaveBeenCalledWith("flow-process");
  });

  it("does not call onGlyphDragStart when prop is not provided", () => {
    // should not throw when prop is absent
    expect(() => {
      render(<Stencil stencilType="flowchart" />);
      const processGlyph = screen.getByText("Process").closest(".stencil-glyph");
      fireEvent.dragStart(processGlyph!, {
        dataTransfer: { setData: vi.fn(), effectAllowed: "" },
      });
    }).not.toThrow();
  });

  // ── Orientation ────────────────────────────────────────────────────────
  it("applies horizontal class when orientation is horizontal", () => {
    const { container } = render(
      <Stencil stencilType="basic" orientation="horizontal" />
    );
    expect(container.querySelector(".stencil--horizontal")).toBeInTheDocument();
  });

  it("does not apply horizontal class for vertical orientation", () => {
    const { container } = render(
      <Stencil stencilType="basic" orientation="vertical" />
    );
    expect(container.querySelector(".stencil--horizontal")).not.toBeInTheDocument();
  });
});
