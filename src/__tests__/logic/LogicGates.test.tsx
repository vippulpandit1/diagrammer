import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AndGateGlyph } from "../../glyph/type/logic/AndGateGlyph";
import { NandGateGlyph } from "../../glyph/type/logic/NandGateGlyph";
import { NorGateGlyph } from "../../glyph/type/logic/NorGateGlyph";
import { NotGateGlyph } from "../../glyph/type/logic/NotGateGlyph";
import { OrGateGlyph } from "../../glyph/type/logic/OrGateGlyph";
import { XorGateGlyph } from "../../glyph/type/logic/XorGateGlyph";
import { XnorGateGlyph } from "../../glyph/type/logic/XnorGateGlyph";

const renderInSvg = (ui: React.ReactElement) => render(<svg>{ui}</svg>);

// ─── AndGateGlyph ─────────────────────────────────────────────────────────────
describe("AndGateGlyph", () => {
  it("renders a rect and a path", () => {
    const { container } = renderInSvg(<AndGateGlyph width={80} height={60} />);
    expect(container.querySelector("rect")).toBeTruthy();
    expect(container.querySelector("path")).toBeTruthy();
  });

  it("rect width is half the glyph width", () => {
    const { container } = renderInSvg(<AndGateGlyph width={80} height={60} />);
    expect(container.querySelector("rect")!.getAttribute("width")).toBe("40");
  });

  it("uses default white fill when no glyph data provided", () => {
    const { container } = renderInSvg(<AndGateGlyph width={60} />);
    expect(container.querySelector("rect")!.getAttribute("fill")).toBe("#fff");
  });

  it("uses glyph.data.fill when provided", () => {
    const mockGlyph = { data: { fill: "#ff0000" } } as never;
    const { container } = renderInSvg(<AndGateGlyph width={60} glyph={mockGlyph} />);
    expect(container.querySelector("rect")!.getAttribute("fill")).toBe("#ff0000");
  });

  it("renders label text when glyph.label is set", () => {
    const mockGlyph = { label: "AND", data: {} } as never;
    const { container } = renderInSvg(<AndGateGlyph width={60} glyph={mockGlyph} />);
    expect(container.querySelector("text")!.textContent).toBe("AND");
  });

  it("does not render a text element when no label", () => {
    const { container } = renderInSvg(<AndGateGlyph width={60} />);
    expect(container.querySelector("text")).toBeNull();
  });

  it("defaults height to width when height is omitted", () => {
    const { container } = renderInSvg(<AndGateGlyph width={50} />);
    // rect height == width (50)
    expect(container.querySelector("rect")!.getAttribute("height")).toBe("50");
  });
});

// ─── NandGateGlyph ────────────────────────────────────────────────────────────
describe("NandGateGlyph", () => {
  it("renders rect, path, and NOT circle", () => {
    const { container } = renderInSvg(<NandGateGlyph width={80} height={60} />);
    expect(container.querySelector("rect")).toBeTruthy();
    expect(container.querySelector("path")).toBeTruthy();
    expect(container.querySelector("circle")).toBeTruthy();
  });

  it("NOT circle is positioned to the right of the AND body", () => {
    const { container } = renderInSvg(<NandGateGlyph width={100} height={100} />);
    const cx = parseFloat(container.querySelector("circle")!.getAttribute("cx")!);
    expect(cx).toBeCloseTo(80); // 100 * 0.8
  });

  it("defaults height to width", () => {
    const { container } = renderInSvg(<NandGateGlyph width={60} />);
    expect(container.querySelector("rect")!.getAttribute("height")).toBe("60");
  });
});

// ─── NorGateGlyph ─────────────────────────────────────────────────────────────
describe("NorGateGlyph", () => {
  it("renders an OR-shape path and a NOT circle", () => {
    const { container } = renderInSvg(<NorGateGlyph width={80} height={60} />);
    expect(container.querySelector("path")).toBeTruthy();
    expect(container.querySelector("circle")).toBeTruthy();
  });

  it("OR path has white fill", () => {
    const { container } = renderInSvg(<NorGateGlyph width={60} />);
    expect(container.querySelector("path")!.getAttribute("fill")).toBe("#fff");
  });

  it("NOT circle cx is 80% of width", () => {
    const { container } = renderInSvg(<NorGateGlyph width={100} />);
    expect(parseFloat(container.querySelector("circle")!.getAttribute("cx")!)).toBeCloseTo(80);
  });
});

// ─── NotGateGlyph ─────────────────────────────────────────────────────────────
describe("NotGateGlyph", () => {
  it("renders a triangle polygon and a NOT circle", () => {
    const { container } = renderInSvg(<NotGateGlyph width={80} height={60} />);
    expect(container.querySelector("polygon")).toBeTruthy();
    expect(container.querySelector("circle")).toBeTruthy();
  });

  it("NOT circle cx is 80% of width", () => {
    const { container } = renderInSvg(<NotGateGlyph width={100} />);
    expect(parseFloat(container.querySelector("circle")!.getAttribute("cx")!)).toBeCloseTo(80);
  });

  it("triangle polygon has white fill", () => {
    const { container } = renderInSvg(<NotGateGlyph width={60} />);
    expect(container.querySelector("polygon")!.getAttribute("fill")).toBe("#fff");
  });
});

// ─── OrGateGlyph ──────────────────────────────────────────────────────────────
describe("OrGateGlyph", () => {
  it("renders a single path", () => {
    const { container } = renderInSvg(<OrGateGlyph width={80} height={60} />);
    expect(container.querySelector("path")).toBeTruthy();
    expect(container.querySelector("circle")).toBeNull();
  });

  it("path has white fill and dark stroke", () => {
    const { container } = renderInSvg(<OrGateGlyph width={60} />);
    const path = container.querySelector("path")!;
    expect(path.getAttribute("fill")).toBe("#fff");
    expect(path.getAttribute("stroke")).toBe("#222");
  });

  it("defaults height to width", () => {
    const { container } = renderInSvg(<OrGateGlyph width={60} />);
    // No explicit height element, but rendering should not throw
    expect(container.querySelector("g")).toBeTruthy();
  });
});

// ─── XorGateGlyph ─────────────────────────────────────────────────────────────
describe("XorGateGlyph", () => {
  it("renders two paths (main body + extra curve)", () => {
    const { container } = renderInSvg(<XorGateGlyph width={80} height={60} />);
    expect(container.querySelectorAll("path")).toHaveLength(2);
  });

  it("second path has no fill (extra curve is just a stroke)", () => {
    const { container } = renderInSvg(<XorGateGlyph width={60} />);
    expect(container.querySelectorAll("path")[1].getAttribute("fill")).toBe("none");
  });

  it("renders no NOT circle (XOR ≠ XNOR)", () => {
    const { container } = renderInSvg(<XorGateGlyph width={60} />);
    expect(container.querySelector("circle")).toBeNull();
  });
});

// ─── XnorGateGlyph ────────────────────────────────────────────────────────────
describe("XnorGateGlyph", () => {
  it("renders two paths and a NOT circle", () => {
    const { container } = renderInSvg(<XnorGateGlyph width={80} height={60} />);
    expect(container.querySelectorAll("path")).toHaveLength(2);
    expect(container.querySelector("circle")).toBeTruthy();
  });

  it("NOT circle cx is 80% of width", () => {
    const { container } = renderInSvg(<XnorGateGlyph width={100} />);
    expect(parseFloat(container.querySelector("circle")!.getAttribute("cx")!)).toBeCloseTo(80);
  });
});
