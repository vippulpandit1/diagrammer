import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Stencil } from "../Stencil";

describe("Stencil", () => {
  it("renders all glyphs for a given stencil type", () => {
    render(<Stencil stencilType="flowchart" />);
    // Check for a few known glyph labels
    expect(screen.getByText("Process")).toBeInTheDocument();
    expect(screen.getByText("Decision")).toBeInTheDocument();
    expect(screen.getByText("Start")).toBeInTheDocument();
  });

  it("shows tooltip with description on hover", async () => {
    render(<Stencil stencilType="flowchart" />);
    const processGlyph = screen.getByText("Process").closest(".stencil-glyph");
    expect(processGlyph).toBeInTheDocument();

    fireEvent.mouseEnter(processGlyph!);
    // Tooltip should appear with explanation
    expect(await screen.findByText(/step or action/i)).toBeInTheDocument();
  });

  it("renders correct number of port dots for a glyph", () => {
    render(<Stencil stencilType="flowchart" />);
    // Decision has 1 input (left) and 2 outputs (right)
    const decisionGlyph = screen.getByText("Decision").closest(".stencil-glyph");
    expect(decisionGlyph).toBeInTheDocument();

    // Simulate rendering SVG and check for port circles
    const circles = decisionGlyph!.querySelectorAll("circle");
    // Should have 3 ports (1 input + 2 outputs)
    expect(circles.length).toBe(3);
  });
});