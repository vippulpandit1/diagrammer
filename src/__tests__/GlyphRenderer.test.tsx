import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GlyphRenderer } from "../glyph/GlyphRenderer";

// Stub all child glyph components so tests are fast and isolated
vi.mock("../glyph/type/basic/RectGlyph", () => ({
  RectGlyph: ({ size }: { size: number }) => <rect data-testid="rect-glyph" width={size} />,
}));
vi.mock("../glyph/type/basic/CircleGlyph", () => ({
  CircleGlyph: ({ size }: { size: number }) => <circle data-testid="circle-glyph" r={size} />,
}));
vi.mock("../glyph/type/basic/MultiPortGlyph", () => ({
  MultiPortGlyph: () => <rect data-testid="multi-port-glyph" />,
}));
vi.mock("../glyph/type/basic/TextGlyph", () => ({
  TextGlyph: ({ label }: { label?: string }) => <text data-testid="text-glyph">{label}</text>,
}));
vi.mock("../glyph/type/basic/ResizableRectangleGlyph", () => ({
  default: () => <rect data-testid="resizable-rectangle-glyph" />,
}));
vi.mock("../glyph/type/basic/PngGlyph", () => ({
  default: () => <image data-testid="png-glyph" />,
}));
vi.mock("../glyph/type/logic/AndGateGlyph", () => ({
  AndGateGlyph: () => <rect data-testid="and-gate-glyph" />,
}));
vi.mock("../glyph/type/logic/OrGateGlyph", () => ({
  OrGateGlyph: () => <rect data-testid="or-gate-glyph" />,
}));
vi.mock("../glyph/type/logic/NotGateGlyph", () => ({
  NotGateGlyph: () => <rect data-testid="not-gate-glyph" />,
}));
vi.mock("../glyph/type/logic/NandGateGlyph", () => ({
  NandGateGlyph: () => <rect data-testid="nand-gate-glyph" />,
}));
vi.mock("../glyph/type/logic/NorGateGlyph", () => ({
  NorGateGlyph: () => <rect data-testid="nor-gate-glyph" />,
}));
vi.mock("../glyph/type/logic/XorGateGlyph", () => ({
  XorGateGlyph: () => <rect data-testid="xor-gate-glyph" />,
}));
vi.mock("../glyph/type/logic/XnorGateGlyph", () => ({
  XnorGateGlyph: () => <rect data-testid="xnor-gate-glyph" />,
}));
vi.mock("../glyph/type/uml/UMLClassGlyph", () => ({
  UMLClassGlyph: () => <rect data-testid="uml-class-glyph" />,
}));
vi.mock("../glyph/type/uml/UMLInterfaceGlyph", () => ({
  UMLInterfaceGlyph: () => <rect data-testid="uml-interface-glyph" />,
}));
vi.mock("../glyph/type/uml/UMLAbstractGlyph", () => ({
  UMLAbstractGlyph: () => <rect data-testid="uml-abstract-glyph" />,
}));
vi.mock("../glyph/type/uml/UMLEnumGlyph", () => ({
  UMLEnumGlyph: () => <rect data-testid="uml-enum-glyph" />,
}));
vi.mock("../glyph/type/uml/UMLPackageGlyph", () => ({
  UMLPackageGlyph: () => <rect data-testid="uml-package-glyph" />,
}));
vi.mock("../glyph/type/uml/UMLAssociationGlyph", () => ({
  UMLAssociationGlyph: () => <rect data-testid="uml-association-glyph" />,
}));
vi.mock("../glyph/type/uml/UMLInheritanceGlyph", () => ({
  UMLInheritanceGlyph: () => <rect data-testid="uml-inheritance-glyph" />,
}));
vi.mock("../glyph/type/util/DebugGlyph", () => ({
  DebugGlyph: () => <rect data-testid="debug-glyph" />,
}));
vi.mock("../glyph/type/network/NetworkGlyph", () => ({
  NetworkGlyph: ({ type }: { type: string }) => <rect data-testid={`network-glyph-${type}`} />,
}));
vi.mock("../glyph/type/flowchart/FlowchartGlyph", () => ({
  FlowchartGlyph: ({ type }: { type: string }) => <rect data-testid={`flowchart-glyph-${type}`} />,
}));
vi.mock("../glyph/type/bpmn/BPMNGlyph", () => ({
  BPMNGlyph: ({ type }: { type: string }) => <rect data-testid={`bpmn-glyph-${type}`} />,
}));
vi.mock("../image/free-sample.png", () => ({ default: "free-sample.png" }));

/** Helper: renders GlyphRenderer inside an SVG (required for SVG elements) */
function renderInSvg(ui: React.ReactElement) {
  return render(<svg>{ui}</svg>);
}

describe("GlyphRenderer", () => {
  // ── Basic shapes ────────────────────────────────────────────────────────
  it('renders RectGlyph for type "rect"', () => {
    const { getByTestId } = renderInSvg(<GlyphRenderer type="rect" width={100} />);
    expect(getByTestId("rect-glyph")).toBeInTheDocument();
  });

  it('renders CircleGlyph for type "circle"', () => {
    const { getByTestId } = renderInSvg(<GlyphRenderer type="circle" width={80} />);
    expect(getByTestId("circle-glyph")).toBeInTheDocument();
  });

  it('renders ResizableRectangleGlyph for type "resizable-rectangle"', () => {
    const { getByTestId } = renderInSvg(
      <GlyphRenderer type="resizable-rectangle" width={120} height={60} />
    );
    expect(getByTestId("resizable-rectangle-glyph")).toBeInTheDocument();
  });

  it('renders PngGlyph for type "png-glyph"', () => {
    const { getByTestId } = renderInSvg(<GlyphRenderer type="png-glyph" width={100} height={100} />);
    expect(getByTestId("png-glyph")).toBeInTheDocument();
  });

  it('renders TextGlyph for type "text" and passes label', () => {
    const { getByTestId, getByText } = renderInSvg(
      <GlyphRenderer type="text" width={200} label="Hello" />
    );
    expect(getByTestId("text-glyph")).toBeInTheDocument();
    expect(getByText("Hello")).toBeInTheDocument();
  });

  it('renders MultiPortGlyph for type "multi"', () => {
    const { getByTestId } = renderInSvg(<GlyphRenderer type="multi" width={80} />);
    expect(getByTestId("multi-port-glyph")).toBeInTheDocument();
  });

  // ── Logic gates ─────────────────────────────────────────────────────────
  it.each([
    ["and", "and-gate-glyph"],
    ["or", "or-gate-glyph"],
    ["not", "not-gate-glyph"],
    ["nand", "nand-gate-glyph"],
    ["nor", "nor-gate-glyph"],
    ["xor", "xor-gate-glyph"],
    ["xnor", "xnor-gate-glyph"],
  ])('renders %s gate for type "%s"', (type, testId) => {
    const { getByTestId } = renderInSvg(<GlyphRenderer type={type} width={80} />);
    expect(getByTestId(testId)).toBeInTheDocument();
  });

  // ── UML ─────────────────────────────────────────────────────────────────
  it.each([
    ["uml-class", "uml-class-glyph"],
    ["uml-interface", "uml-interface-glyph"],
    ["uml-abstract", "uml-abstract-glyph"],
    ["uml-enum", "uml-enum-glyph"],
    ["uml-package", "uml-package-glyph"],
    ["uml-association", "uml-association-glyph"],
    ["uml-inheritance", "uml-inheritance-glyph"],
  ])('renders UML glyph for type "%s"', (type, testId) => {
    const { getByTestId } = renderInSvg(<GlyphRenderer type={type} width={100} />);
    expect(getByTestId(testId)).toBeInTheDocument();
  });

  // ── Util ────────────────────────────────────────────────────────────────
  it('renders DebugGlyph for type "debug"', () => {
    const { getByTestId } = renderInSvg(<GlyphRenderer type="debug" width={80} />);
    expect(getByTestId("debug-glyph")).toBeInTheDocument();
  });

  // ── Network ─────────────────────────────────────────────────────────────
  it.each([
    "network-server",
    "network-switch",
    "network-router",
    "network-firewall",
    "network-cloud",
    "network-database",
  ])('renders NetworkGlyph for type "%s"', (type) => {
    const { getByTestId } = renderInSvg(<GlyphRenderer type={type} width={80} />);
    expect(getByTestId(`network-glyph-${type}`)).toBeInTheDocument();
  });

  // ── Flowchart ───────────────────────────────────────────────────────────
  it.each([
    "flow-start",
    "flow-end",
    "flow-process",
    "flow-decision",
    "flow-io",
    "flow-document",
  ])('renders FlowchartGlyph for type "%s"', (type) => {
    const { getByTestId } = renderInSvg(<GlyphRenderer type={type} width={80} />);
    expect(getByTestId(`flowchart-glyph-${type}`)).toBeInTheDocument();
  });

  // ── BPMN ────────────────────────────────────────────────────────────────
  it.each([
    "bpmn-start-event",
    "bpmn-end-event",
    "bpmn-task",
    "bpmn-exclusive-gateway",
    "bpmn-pool",
  ])('renders BPMNGlyph for type "%s"', (type) => {
    const { getByTestId } = renderInSvg(<GlyphRenderer type={type} width={80} height={40} />);
    expect(getByTestId(`bpmn-glyph-${type}`)).toBeInTheDocument();
  });

  // ── MCP ─────────────────────────────────────────────────────────────────
  it('renders a green rect for type "mcp-glyph"', () => {
    const { container } = renderInSvg(<GlyphRenderer type="mcp-glyph" width={100} height={60} />);
    const rect = container.querySelector("rect[fill='#4ade80']");
    expect(rect).toBeInTheDocument();
  });

  // ── Default / unknown ───────────────────────────────────────────────────
  it("renders a grey fallback rect for unknown types", () => {
    const { container } = renderInSvg(<GlyphRenderer type="unknown-xyz" width={100} height={50} />);
    const rect = container.querySelector("rect[fill='#ccc']");
    expect(rect).toBeInTheDocument();
  });

  // ── Prop forwarding ─────────────────────────────────────────────────────
  it("forwards width to RectGlyph as size", () => {
    const { getByTestId } = renderInSvg(<GlyphRenderer type="rect" width={150} />);
    expect(getByTestId("rect-glyph")).toHaveAttribute("width", "150");
  });

  it('uses height fallback to width when height is omitted for type "resizable-rectangle"', () => {
    // Should not throw — ResizableRectangleGlyph receives height=width (100)
    expect(() =>
      renderInSvg(<GlyphRenderer type="resizable-rectangle" width={100} />)
    ).not.toThrow();
  });
});
