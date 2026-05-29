import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { UMLAbstractGlyph } from "../../glyph/type/uml/UMLAbstractGlyph";
import { UMLAssociationGlyph } from "../../glyph/type/uml/UMLAssociationGlyph";
import { UMLClassGlyph } from "../../glyph/type/uml/UMLClassGlyph";
import { UMLEnumGlyph } from "../../glyph/type/uml/UMLEnumGlyph";
import { UMLInheritanceGlyph } from "../../glyph/type/uml/UMLInheritanceGlyph";
import { UMLInterfaceGlyph } from "../../glyph/type/uml/UMLInterfaceGlyph";
import { UMLPackageGlyph } from "../../glyph/type/uml/UMLPackageGlyph";

const renderInSvg = (ui: React.ReactElement) => render(<svg>{ui}</svg>);

// ── Shared "stereotype box" shape ─────────────────────────────────────────────
// Abstract, Enum, Interface, Package all share the same rect+2 lines+text structure.

describe("UMLAbstractGlyph", () => {
  it("renders a rect with blue fill", () => {
    const { container } = renderInSvg(<UMLAbstractGlyph size={80} />);
    expect(container.querySelector("rect")!.getAttribute("fill")).toBe("#e0f2fe");
  });

  it("renders 2 separator lines", () => {
    const { container } = renderInSvg(<UMLAbstractGlyph size={80} />);
    expect(container.querySelectorAll("line")).toHaveLength(2);
  });

  it("renders the <<abstract>> stereotype text", () => {
    const { container } = renderInSvg(<UMLAbstractGlyph size={80} />);
    expect(container.querySelector("text")!.textContent).toContain("abstract");
  });

  it("sets rect size to the size prop", () => {
    const { container } = renderInSvg(<UMLAbstractGlyph size={100} />);
    const rect = container.querySelector("rect")!;
    expect(rect.getAttribute("width")).toBe("100");
    expect(rect.getAttribute("height")).toBe("100");
  });
});

describe("UMLEnumGlyph", () => {
  it("renders a rect, 2 lines, and stereotype text", () => {
    const { container } = renderInSvg(<UMLEnumGlyph size={80} />);
    expect(container.querySelector("rect")).toBeTruthy();
    expect(container.querySelectorAll("line")).toHaveLength(2);
    expect(container.querySelector("text")).toBeTruthy();
  });
});

describe("UMLInterfaceGlyph", () => {
  it("renders the <<interface>> stereotype text", () => {
    const { container } = renderInSvg(<UMLInterfaceGlyph size={80} />);
    expect(container.querySelector("text")!.textContent).toContain("interface");
  });

  it("has a blue fill rect", () => {
    const { container } = renderInSvg(<UMLInterfaceGlyph size={80} />);
    expect(container.querySelector("rect")!.getAttribute("fill")).toBe("#e0f2fe");
  });
});

describe("UMLPackageGlyph", () => {
  it("renders a rect, 2 lines, and <<Package>> text", () => {
    const { container } = renderInSvg(<UMLPackageGlyph size={80} />);
    expect(container.querySelector("rect")).toBeTruthy();
    expect(container.querySelectorAll("line")).toHaveLength(2);
    expect(container.querySelector("text")!.textContent).toContain("Package");
  });
});

// ── UMLAssociationGlyph ───────────────────────────────────────────────────────
describe("UMLAssociationGlyph", () => {
  it("renders a diagonal line", () => {
    const { container } = renderInSvg(<UMLAssociationGlyph size={80} />);
    expect(container.querySelector("line")).toBeTruthy();
  });

  it("line goes from lower-left to upper-right area", () => {
    const { container } = renderInSvg(<UMLAssociationGlyph size={100} />);
    const line = container.querySelector("line")!;
    // x1 < x2, y1 > y2 → lower-left to upper-right
    expect(parseFloat(line.getAttribute("x1")!)).toBeLessThan(
      parseFloat(line.getAttribute("x2")!)
    );
    expect(parseFloat(line.getAttribute("y1")!)).toBeGreaterThan(
      parseFloat(line.getAttribute("y2")!)
    );
  });
});

// ── UMLInheritanceGlyph ───────────────────────────────────────────────────────
describe("UMLInheritanceGlyph", () => {
  it("renders a line and a defs block with a marker", () => {
    const { container } = renderInSvg(<UMLInheritanceGlyph size={80} />);
    expect(container.querySelector("line")).toBeTruthy();
    expect(container.querySelector("defs")).toBeTruthy();
    expect(container.querySelector("marker")).toBeTruthy();
  });

  it("marker contains a hollow triangle polygon", () => {
    const { container } = renderInSvg(<UMLInheritanceGlyph size={80} />);
    expect(container.querySelector("marker polygon")).toBeTruthy();
  });

  it("arrowhead polygon has white fill (hollow)", () => {
    const { container } = renderInSvg(<UMLInheritanceGlyph size={80} />);
    expect(container.querySelector("marker polygon")!.getAttribute("fill")).toBe("#fff");
  });
});

// ── UMLClassGlyph ─────────────────────────────────────────────────────────────
describe("UMLClassGlyph", () => {
  it("renders an outer rect, 2 separator lines", () => {
    const { container } = renderInSvg(<UMLClassGlyph width={120} height={160} />);
    expect(container.querySelector("rect")).toBeTruthy();
    expect(container.querySelectorAll("line")).toHaveLength(2);
  });

  it("renders class name text when label is provided", () => {
    const { container } = renderInSvg(
      <UMLClassGlyph width={120} height={160} label="MyClass" />
    );
    expect(container.querySelector("text")!.textContent).toContain("MyClass");
  });

  it("renders no text when label is omitted", () => {
    const { container } = renderInSvg(<UMLClassGlyph width={120} height={160} />);
    expect(container.querySelector("text")).toBeNull();
  });

  it("renders attribute rows", () => {
    const attrs = [
      { name: "id", type: "int", visibility: "private" },
      { name: "name", type: "string", visibility: "public" },
    ];
    const { container } = renderInSvg(
      <UMLClassGlyph width={120} height={200} attributes={attrs} />
    );
    const texts = container.querySelectorAll("text");
    expect(texts.length).toBeGreaterThanOrEqual(2);
  });

  it("prefixes private attributes with '-'", () => {
    const attrs = [{ name: "secret", type: "string", visibility: "private" }];
    const { container } = renderInSvg(
      <UMLClassGlyph width={120} height={200} attributes={attrs} />
    );
    const attrText = container.querySelector("text")!.textContent ?? "";
    expect(attrText).toMatch(/^-/);
  });

  it("prefixes public attributes with '+'", () => {
    const attrs = [{ name: "pub", type: "string", visibility: "public" }];
    const { container } = renderInSvg(
      <UMLClassGlyph width={120} height={200} attributes={attrs} />
    );
    expect(container.querySelector("text")!.textContent).toMatch(/^\+/);
  });

  it("truncates long attribute names", () => {
    const attrs = [{ name: "veryLongName", type: "string", visibility: "public" }];
    const { container } = renderInSvg(
      <UMLClassGlyph width={120} height={200} attributes={attrs} />
    );
    const attrText = container.querySelector("text")!.textContent ?? "";
    expect(attrText).toContain("...");
  });

  it("renders method rows", () => {
    const methods = [{ name: "run", returnType: "void", visibility: "public" }];
    const { container } = renderInSvg(
      <UMLClassGlyph width={120} height={200} methods={methods} />
    );
    expect(container.querySelector("text")).toBeTruthy();
  });

  it("truncates long method names", () => {
    const methods = [{ name: "doSomethingLong", returnType: "void", visibility: "public" }];
    const { container } = renderInSvg(
      <UMLClassGlyph width={120} height={200} methods={methods} />
    );
    const methodText = container.querySelector("text")!.textContent ?? "";
    expect(methodText).toContain("...");
  });
});
