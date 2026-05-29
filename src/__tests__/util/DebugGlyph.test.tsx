import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DebugGlyph } from "../../glyph/type/util/DebugGlyph";

const renderInSvg = (ui: React.ReactElement) => render(<svg>{ui}</svg>);

describe("DebugGlyph", () => {
  it("renders a rect and a text element", () => {
    const { container } = renderInSvg(<DebugGlyph size={80} />);
    expect(container.querySelector("rect")).toBeTruthy();
    expect(container.querySelector("text")).toBeTruthy();
  });

  it("text reads 'Debug'", () => {
    const { container } = renderInSvg(<DebugGlyph size={60} />);
    expect(container.querySelector("text")!.textContent).toBe("Debug");
  });

  it("uses yellow fill by default (no connections)", () => {
    const { container } = renderInSvg(<DebugGlyph size={60} />);
    expect(container.querySelector("rect")!.getAttribute("fill")).toBe("#ffe066");
  });

  it("uses red-tint fill when hasConnections=true", () => {
    const { container } = renderInSvg(<DebugGlyph size={60} hasConnections />);
    expect(container.querySelector("rect")!.getAttribute("fill")).toBe("#ffcccc");
  });

  it("uses dark stroke by default", () => {
    const { container } = renderInSvg(<DebugGlyph size={60} />);
    expect(container.querySelector("rect")!.getAttribute("stroke")).toBe("#222");
  });

  it("uses red stroke when hasConnections=true", () => {
    const { container } = renderInSvg(<DebugGlyph size={60} hasConnections />);
    expect(container.querySelector("rect")!.getAttribute("stroke")).toBe("#ff0000");
  });

  it("uses thicker stroke (4) when hasConnections=true", () => {
    const { container } = renderInSvg(<DebugGlyph size={60} hasConnections />);
    expect(container.querySelector("rect")!.getAttribute("stroke-width")).toBe("4");
  });

  it("uses standard stroke (2) by default", () => {
    const { container } = renderInSvg(<DebugGlyph size={60} />);
    expect(container.querySelector("rect")!.getAttribute("stroke-width")).toBe("2");
  });

  it("sets rect width to the size prop", () => {
    const { container } = renderInSvg(<DebugGlyph size={100} />);
    expect(container.querySelector("rect")!.getAttribute("width")).toBe("100");
  });

  it("defaults height to 50", () => {
    const { container } = renderInSvg(<DebugGlyph size={80} />);
    expect(container.querySelector("rect")!.getAttribute("height")).toBe("50");
  });

  it("uses provided height prop", () => {
    const { container } = renderInSvg(<DebugGlyph size={80} height={70} />);
    expect(container.querySelector("rect")!.getAttribute("height")).toBe("70");
  });
});
