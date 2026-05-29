import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CircleGlyph } from "../../glyph/type/basic/CircleGlyph";
import { RectGlyph } from "../../glyph/type/basic/RectGlyph";
import { MultiPortGlyph } from "../../glyph/type/basic/MultiPortGlyph";
import { TextGlyph } from "../../glyph/type/basic/TextGlyph";
import PngGlyph from "../../glyph/type/basic/PngGlyph";
import { ResizableRectangleGlyph } from "../../glyph/type/basic/ResizableRectangleGlyph";

const renderInSvg = (ui: React.ReactElement) => render(<svg>{ui}</svg>);

// ─── CircleGlyph ──────────────────────────────────────────────────────────────
describe("CircleGlyph", () => {
  it("renders a <circle> element", () => {
    const { container } = renderInSvg(<CircleGlyph size={100} />);
    expect(container.querySelector("circle")).toBeTruthy();
  });

  it("sets cx and cy to size/2", () => {
    const { container } = renderInSvg(<CircleGlyph size={80} />);
    const circle = container.querySelector("circle")!;
    expect(circle.getAttribute("cx")).toBe("40");
    expect(circle.getAttribute("cy")).toBe("40");
  });

  it("sets r to size/2", () => {
    const { container } = renderInSvg(<CircleGlyph size={60} />);
    const circle = container.querySelector("circle")!;
    expect(circle.getAttribute("r")).toBe("30");
  });

  it("fills with the amber colour #fbbf24", () => {
    const { container } = renderInSvg(<CircleGlyph size={50} />);
    expect(container.querySelector("circle")!.getAttribute("fill")).toBe("#fbbf24");
  });

  it("has a dark stroke", () => {
    const { container } = renderInSvg(<CircleGlyph size={50} />);
    expect(container.querySelector("circle")!.getAttribute("stroke")).toBe("#222");
  });
});

// ─── RectGlyph ────────────────────────────────────────────────────────────────
describe("RectGlyph", () => {
  it("renders a <rect> element", () => {
    const { container } = renderInSvg(<RectGlyph size={100} />);
    expect(container.querySelector("rect")).toBeTruthy();
  });

  it("sets width and height to the size prop", () => {
    const { container } = renderInSvg(<RectGlyph size={90} />);
    const rect = container.querySelector("rect")!;
    expect(rect.getAttribute("width")).toBe("90");
    expect(rect.getAttribute("height")).toBe("90");
  });

  it("fills with sky-blue #38bdf8", () => {
    const { container } = renderInSvg(<RectGlyph size={40} />);
    expect(container.querySelector("rect")!.getAttribute("fill")).toBe("#38bdf8");
  });

  it("has rounded corners (rx=8)", () => {
    const { container } = renderInSvg(<RectGlyph size={40} />);
    expect(container.querySelector("rect")!.getAttribute("rx")).toBe("8");
  });

  it("is positioned at origin (x=0, y=0)", () => {
    const { container } = renderInSvg(<RectGlyph size={40} />);
    const rect = container.querySelector("rect")!;
    expect(rect.getAttribute("x")).toBe("0");
    expect(rect.getAttribute("y")).toBe("0");
  });
});

// ─── MultiPortGlyph ───────────────────────────────────────────────────────────
describe("MultiPortGlyph", () => {
  it("renders a <rect> element", () => {
    const { container } = renderInSvg(<MultiPortGlyph size={80} />);
    expect(container.querySelector("rect")).toBeTruthy();
  });

  it("sets width and height to the size prop", () => {
    const { container } = renderInSvg(<MultiPortGlyph size={70} />);
    const rect = container.querySelector("rect")!;
    expect(rect.getAttribute("width")).toBe("70");
    expect(rect.getAttribute("height")).toBe("70");
  });

  it("fills with mint-green #a7f3d0", () => {
    const { container } = renderInSvg(<MultiPortGlyph size={40} />);
    expect(container.querySelector("rect")!.getAttribute("fill")).toBe("#a7f3d0");
  });

  it("has more rounded corners than RectGlyph (rx=10)", () => {
    const { container } = renderInSvg(<MultiPortGlyph size={40} />);
    expect(container.querySelector("rect")!.getAttribute("rx")).toBe("10");
  });
});

// ─── TextGlyph ────────────────────────────────────────────────────────────────
describe("TextGlyph", () => {
  it("renders with the default label 'Text' when no props given", () => {
    const { container } = renderInSvg(<TextGlyph />);
    const text = container.querySelector("text")!;
    expect(text.textContent).toBe("Text");
  });

  it("renders the provided label", () => {
    const { container } = renderInSvg(<TextGlyph label="Hello" />);
    expect(container.querySelector("text")!.textContent).toBe("Hello");
  });

  it("prefers fullLabel over label for display text", () => {
    const { container } = renderInSvg(
      <TextGlyph label="Short" fullLabel="Full Label Text" width={300} />
    );
    expect(container.querySelector("text")!.textContent).toBe("Full Label Text");
  });

  it("truncates long text that exceeds the width", () => {
    const { container } = renderInSvg(
      <TextGlyph label="This is a very long label" width={60} height={20} />
    );
    const text = container.querySelector("text")!.textContent ?? "";
    expect(text.endsWith("...")).toBe(true);
    expect(text.length).toBeLessThan("This is a very long label".length);
  });

  it("does not truncate text that fits within the width", () => {
    const { container } = renderInSvg(
      <TextGlyph label="Hi" width={200} height={40} />
    );
    expect(container.querySelector("text")!.textContent).toBe("Hi");
  });

  it("uses an explicit fontSize when provided", () => {
    const { container } = renderInSvg(<TextGlyph fontSize={24} />);
    expect(container.querySelector("text")!.getAttribute("font-size")).toBe("24");
  });

  it("derives fontSize from height when fontSize is not provided", () => {
    // height=40 → floor(40 * 0.5) = 20, max(8, 20) = 20
    const { container } = renderInSvg(<TextGlyph height={40} />);
    expect(container.querySelector("text")!.getAttribute("font-size")).toBe("20");
  });

  it("uses at least font-size 8 for very small heights", () => {
    const { container } = renderInSvg(<TextGlyph height={10} />);
    const fontSize = parseInt(container.querySelector("text")!.getAttribute("font-size") ?? "0");
    expect(fontSize).toBeGreaterThanOrEqual(8);
  });

  it("uses the provided fontFamily", () => {
    const { container } = renderInSvg(<TextGlyph fontFamily="monospace" />);
    expect(container.querySelector("text")!.getAttribute("font-family")).toBe("monospace");
  });

  it("defaults fontFamily to Arial", () => {
    const { container } = renderInSvg(<TextGlyph />);
    expect(container.querySelector("text")!.getAttribute("font-family")).toBe("Arial");
  });

  it("uses the provided textColor as fill", () => {
    const { container } = renderInSvg(<TextGlyph textColor="#ff0000" />);
    expect(container.querySelector("text")!.getAttribute("fill")).toBe("#ff0000");
  });

  it("renders a <title> with the label text", () => {
    const { container } = renderInSvg(<TextGlyph label="My Glyph" />);
    expect(container.querySelector("title")!.textContent).toBe("My Glyph");
  });

  it("renders a <title> with fullLabel when provided", () => {
    const { container } = renderInSvg(
      <TextGlyph label="Short" fullLabel="Full Label" />
    );
    expect(container.querySelector("title")!.textContent).toBe("Full Label");
  });

  it("renders a background rect with the given width and height", () => {
    const { container } = renderInSvg(<TextGlyph width={150} height={50} />);
    const rect = container.querySelector("rect")!;
    expect(rect.getAttribute("width")).toBe("150");
    expect(rect.getAttribute("height")).toBe("50");
  });

  it("centers the text horizontally at width/2", () => {
    const { container } = renderInSvg(<TextGlyph width={120} />);
    expect(container.querySelector("text")!.getAttribute("x")).toBe("60");
  });
});

// ─── PngGlyph ─────────────────────────────────────────────────────────────────
describe("PngGlyph", () => {
  const baseProps = { x: 10, y: 20, width: 100, height: 80, imageUrl: "https://example.com/img.png" };

  it("renders a <rect> and an <image>", () => {
    const { container } = renderInSvg(<PngGlyph {...baseProps} />);
    expect(container.querySelector("rect")).toBeTruthy();
    expect(container.querySelector("image")).toBeTruthy();
  });

  it("sets the image href to the imageUrl prop", () => {
    const { container } = renderInSvg(<PngGlyph {...baseProps} />);
    const image = container.querySelector("image")!;
    expect(image.getAttribute("href")).toBe(baseProps.imageUrl);
  });

  it("uses a blue stroke when selected=true", () => {
    const { container } = renderInSvg(<PngGlyph {...baseProps} selected={true} />);
    expect(container.querySelector("rect")!.getAttribute("stroke")).toBe("#2563eb");
  });

  it("uses a grey stroke when selected=false (default)", () => {
    const { container } = renderInSvg(<PngGlyph {...baseProps} />);
    expect(container.querySelector("rect")!.getAttribute("stroke")).toBe("#d1d5db");
  });

  it("positions the rect at the given x and y", () => {
    const { container } = renderInSvg(<PngGlyph {...baseProps} x={30} y={45} />);
    const rect = container.querySelector("rect")!;
    expect(rect.getAttribute("x")).toBe("30");
    expect(rect.getAttribute("y")).toBe("45");
  });

  it("sets the rect width and height from props", () => {
    const { container } = renderInSvg(<PngGlyph {...baseProps} width={200} height={150} />);
    const rect = container.querySelector("rect")!;
    expect(rect.getAttribute("width")).toBe("200");
    expect(rect.getAttribute("height")).toBe("150");
  });

  it("insets the image by 10% on each side", () => {
    const { container } = renderInSvg(
      <PngGlyph {...baseProps} x={0} y={0} width={100} height={80} />
    );
    const image = container.querySelector("image")!;
    expect(image.getAttribute("x")).toBe("10");   // 0 + 100 * 0.1
    expect(image.getAttribute("y")).toBe("8");    // 0 + 80  * 0.1
    expect(image.getAttribute("width")).toBe("80");  // 100 * 0.8
    expect(image.getAttribute("height")).toBe("64"); // 80  * 0.8
  });
});

// ─── ResizableRectangleGlyph ──────────────────────────────────────────────────
describe("ResizableRectangleGlyph", () => {
  it("renders a <rect> with the given dimensions", () => {
    const { container } = renderInSvg(
      <ResizableRectangleGlyph width={200} height={100} />
    );
    const rect = container.querySelector("rect")!;
    expect(rect.getAttribute("width")).toBe("200");
    expect(rect.getAttribute("height")).toBe("100");
  });

  it("defaults x and y to 0 when not provided", () => {
    const { container } = renderInSvg(
      <ResizableRectangleGlyph width={100} height={60} />
    );
    const rect = container.querySelector("rect")!;
    expect(rect.getAttribute("x")).toBe("0");
    expect(rect.getAttribute("y")).toBe("0");
  });

  it("uses provided x and y", () => {
    const { container } = renderInSvg(
      <ResizableRectangleGlyph x={15} y={25} width={100} height={60} />
    );
    const rect = container.querySelector("rect")!;
    expect(rect.getAttribute("x")).toBe("15");
    expect(rect.getAttribute("y")).toBe("25");
  });

  it("renders 4 handle circles when selected=true (default)", () => {
    const { container } = renderInSvg(
      <ResizableRectangleGlyph width={100} height={60} selected={true} />
    );
    expect(container.querySelectorAll("circle")).toHaveLength(4);
  });

  it("renders no handle circles when selected=false", () => {
    const { container } = renderInSvg(
      <ResizableRectangleGlyph width={100} height={60} selected={false} />
    );
    expect(container.querySelectorAll("circle")).toHaveLength(0);
  });

  it("positions top-left handle at (x, y)", () => {
    const { container } = renderInSvg(
      <ResizableRectangleGlyph x={10} y={20} width={100} height={60} selected />
    );
    const circles = container.querySelectorAll("circle");
    expect(circles[0].getAttribute("cx")).toBe("10");
    expect(circles[0].getAttribute("cy")).toBe("20");
  });

  it("positions top-right handle at (x+width, y)", () => {
    const { container } = renderInSvg(
      <ResizableRectangleGlyph x={10} y={20} width={100} height={60} selected />
    );
    const circles = container.querySelectorAll("circle");
    expect(circles[1].getAttribute("cx")).toBe("110");
    expect(circles[1].getAttribute("cy")).toBe("20");
  });

  it("positions bottom-right handle at (x+width, y+height)", () => {
    const { container } = renderInSvg(
      <ResizableRectangleGlyph x={10} y={20} width={100} height={60} selected />
    );
    const circles = container.querySelectorAll("circle");
    expect(circles[3].getAttribute("cx")).toBe("110");
    expect(circles[3].getAttribute("cy")).toBe("80");
  });

  it("calls onResize when a handle is pointer-dragged", () => {
    const onResize = vi.fn();
    const { container } = renderInSvg(
      <ResizableRectangleGlyph
        x={0} y={0} width={100} height={60}
        selected onResize={onResize}
      />
    );
    const handle = container.querySelectorAll("circle")[3]; // br handle
    // Simulate pointer capture (jsdom stub)
    (handle as SVGElement & { setPointerCapture: (id: number) => void }).setPointerCapture =
      vi.fn();

    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 100, clientY: 60 });
    fireEvent.pointerMove(window, { pointerId: 1, clientX: 120, clientY: 80 });

    expect(onResize).toHaveBeenCalled();
    const newRect = onResize.mock.calls[0][0];
    expect(newRect.width).toBeGreaterThan(0);
    expect(newRect.height).toBeGreaterThan(0);
  });

  it("does not call onResize when no handler is provided", () => {
    const { container } = renderInSvg(
      <ResizableRectangleGlyph x={0} y={0} width={100} height={60} selected />
    );
    const handle = container.querySelectorAll("circle")[0];
    (handle as SVGElement & { setPointerCapture: (id: number) => void }).setPointerCapture =
      vi.fn();
    // Should not throw
    expect(() => {
      fireEvent.pointerDown(handle, { pointerId: 1, clientX: 0, clientY: 0 });
      fireEvent.pointerMove(window, { pointerId: 1, clientX: 10, clientY: 10 });
    }).not.toThrow();
  });

  it("fills the rect with the light background colour", () => {
    const { container } = renderInSvg(
      <ResizableRectangleGlyph width={100} height={60} />
    );
    expect(container.querySelector("rect")!.getAttribute("fill")).toBe("#f1f5f9");
  });

  it("strokes the rect with blue", () => {
    const { container } = renderInSvg(
      <ResizableRectangleGlyph width={100} height={60} />
    );
    expect(container.querySelector("rect")!.getAttribute("stroke")).toBe("#2563eb");
  });
});
