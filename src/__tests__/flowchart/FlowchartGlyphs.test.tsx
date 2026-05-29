import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FlowchartGlyph } from "../../glyph/type/flowchart/FlowchartGlyph";
import { FlowStart, FlowEnd, FlowProcess, FlowIo, FlowDecision } from "../../glyph/type/flowchart/FlowBasic";

const renderInSvg = (ui: React.ReactElement) => render(<svg>{ui}</svg>);

// ── FlowchartGlyph dispatcher ─────────────────────────────────────────────────
describe("FlowchartGlyph dispatcher", () => {
  const allTypes = [
    "flow-start",
    "flow-end",
    "flow-process",
    "flow-io",
    "flow-decision",
    "flow-action",
    "flow-document",
    "flow-multidocument",
    "flow-multi-document",
    "flow-data",
    "flow-sorted-data",
    "flow-database",
    "flow-internal-storage",
    "flow-magnetic-tape",
    "flow-card",
    "flow-subroutine",
    "flow-predefinedprocess",
    "flow-predefined-process",
    "flow-delay",
    "flow-preparation",
    "flow-display",
    "flow-collate",
    "flow-manualinput",
    "flow-manual-input",
    "flow-manual-operation",
    "flow-manual-loop",
    "flow-loop-limit",
    "flow-multiinput",
    "flow-connector",
    "flow-offpageconnector",
    "flow-on-page-connector",
    "flow-off-page-connector",
    "flow-merge",
    "flow-extract",
    "flow-summarize",
    "flow-decision-alt",
    "flow-split",
    "flow-arrow",
    "flow-sentiment",
    "flow-server",
  ] as const;

  it.each(allTypes)('renders type "%s" inside a <g>', (type) => {
    const { container } = renderInSvg(
      <FlowchartGlyph type={type} width={40} height={40} />
    );
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("renders fallback rect for unknown type", () => {
    const { container } = renderInSvg(
      <FlowchartGlyph type="flow-unknown-xyz" width={40} height={40} />
    );
    const rect = container.querySelector("rect");
    expect(rect).toBeTruthy();
    expect(rect!.getAttribute("fill")).toBe("#eee");
  });

  it("passes width and height to child components", () => {
    const { container } = renderInSvg(
      <FlowchartGlyph type="flow-start" width={80} height={60} />
    );
    // FlowStart renders an ellipse with cx/cy derived from width/height
    const ellipse = container.querySelector("ellipse");
    expect(ellipse).toBeTruthy();
    // cx = (20/40)*80 = 40
    expect(parseFloat(ellipse!.getAttribute("cx")!)).toBeCloseTo(40);
  });

  it("uses default width=40 and height=40 when not provided", () => {
    const { container } = renderInSvg(<FlowchartGlyph type="flow-start" />);
    expect(container.querySelector("g")).toBeTruthy();
  });
});

// ── FlowStart ─────────────────────────────────────────────────────────────────
describe("FlowStart", () => {
  it("renders a single green ellipse", () => {
    const { container } = renderInSvg(<FlowStart width={40} height={40} />);
    const ellipses = container.querySelectorAll("ellipse");
    expect(ellipses).toHaveLength(1);
    expect(ellipses[0].getAttribute("fill")).toBe("#bbf7d0");
  });

  it("ellipse is centred in the bounding box", () => {
    const { container } = renderInSvg(<FlowStart width={80} height={60} />);
    const e = container.querySelector("ellipse")!;
    // cx = (20/40)*80 = 40, cy = (20/40)*60 = 30
    expect(parseFloat(e.getAttribute("cx")!)).toBeCloseTo(40);
    expect(parseFloat(e.getAttribute("cy")!)).toBeCloseTo(30);
  });
});

// ── FlowEnd ───────────────────────────────────────────────────────────────────
describe("FlowEnd", () => {
  it("renders two concentric ellipses", () => {
    const { container } = renderInSvg(<FlowEnd width={40} height={40} />);
    expect(container.querySelectorAll("ellipse")).toHaveLength(2);
  });

  it("outer ellipse has red fill", () => {
    const { container } = renderInSvg(<FlowEnd width={40} height={40} />);
    expect(container.querySelectorAll("ellipse")[0].getAttribute("fill")).toBe("#fca5a5");
  });

  it("inner ellipse has white fill", () => {
    const { container } = renderInSvg(<FlowEnd width={40} height={40} />);
    expect(container.querySelectorAll("ellipse")[1].getAttribute("fill")).toBe("#fff");
  });
});

// ── FlowProcess ───────────────────────────────────────────────────────────────
describe("FlowProcess", () => {
  it("renders a rounded rect with light-blue fill", () => {
    const { container } = renderInSvg(<FlowProcess width={40} height={40} />);
    const rect = container.querySelector("rect")!;
    expect(rect).toBeTruthy();
    expect(rect.getAttribute("fill")).toBe("#e0e7ef");
  });
});

// ── FlowIo ────────────────────────────────────────────────────────────────────
describe("FlowIo", () => {
  it("renders a parallelogram polygon", () => {
    const { container } = renderInSvg(<FlowIo width={40} height={40} />);
    const poly = container.querySelector("polygon")!;
    expect(poly).toBeTruthy();
    expect(poly.getAttribute("fill")).toBe("#bae6fd");
  });
});

// ── FlowDecision ──────────────────────────────────────────────────────────────
describe("FlowDecision", () => {
  it("renders a diamond shape (polygon or path) inside a <g>", () => {
    const { container } = renderInSvg(<FlowDecision width={40} height={40} />);
    expect(container.querySelector("g")).toBeTruthy();
    // FlowDecision is a diamond — it uses a polygon
    const poly = container.querySelector("polygon");
    const path = container.querySelector("path");
    expect(poly ?? path).toBeTruthy();
  });
});
