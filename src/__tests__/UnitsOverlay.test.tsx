import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { UnitsOverlay } from "../UnitsOverlay";

describe("UnitsOverlay", () => {
  it("renders an SVG element", () => {
    const { container } = render(<UnitsOverlay />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("SVG has position:absolute style for overlay positioning", () => {
    const { container } = render(<UnitsOverlay />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg.style.position).toBe("absolute");
  });

  it("renders horizontal unit text labels (every 2nd index → gridSize multiples)", () => {
    const { container } = render(<UnitsOverlay />);
    const texts = Array.from(container.querySelectorAll("text"));
    // gridSize=32, count=40, even indices only → 20 horizontal + 20 vertical = 40 texts
    expect(texts.length).toBeGreaterThan(0);
  });

  it("renders text labels starting with 0", () => {
    const { container } = render(<UnitsOverlay />);
    const firstText = container.querySelector("text");
    expect(firstText!.textContent).toBe("0");
  });

  it("renders text labels for even indices (0, 64, 128, ...)", () => {
    const { container } = render(<UnitsOverlay />);
    const texts = Array.from(container.querySelectorAll("text"));
    const values = texts.map(t => t.textContent);
    // gridSize=32, even indices: 0*32=0, 2*32=64, 4*32=128
    expect(values).toContain("0");
    expect(values).toContain("64");
    expect(values).toContain("128");
  });

  it("SVG fills 100% width and height", () => {
    const { container } = render(<UnitsOverlay />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg.style.width).toBe("100%");
    expect(svg.style.height).toBe("100%");
  });

  it("SVG has pointerEvents:none so it does not block interactions", () => {
    const { container } = render(<UnitsOverlay />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg.style.pointerEvents).toBe("none");
  });

  it("renders exactly 40 text labels (20 horizontal + 20 vertical, even indices only)", () => {
    const { container } = render(<UnitsOverlay />);
    const texts = container.querySelectorAll("text");
    // count=40, even indices from 0..38 → 20 horizontal + 20 vertical = 40 total
    expect(texts.length).toBe(40);
  });
});
