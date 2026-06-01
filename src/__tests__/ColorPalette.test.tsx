import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { ColorPalette, PRESET_COLORS, TRANSPARENT } from "../glyph/type/ColorPalette";

describe("ColorPalette", () => {
  describe("label", () => {
    it("renders the provided label text", () => {
      const { getByText } = render(
        <ColorPalette label="Fill Color" value="#ffffff" onChange={vi.fn()} />
      );
      expect(getByText("Fill Color")).toBeTruthy();
    });
  });

  describe("preset swatches", () => {
    it("renders 16 preset swatches", () => {
      const { container } = render(
        <ColorPalette label="Color" value="" onChange={vi.fn()} />
      );
      // Each preset is a <button> with a title matching the hex string
      const swatches = PRESET_COLORS.map((c) =>
        container.querySelector(`button[title="${c}"]`)
      );
      expect(swatches.every(Boolean)).toBe(true);
      expect(swatches.length).toBe(16);
    });

    it("calls onChange with the selected preset color when a swatch is clicked", () => {
      const onChange = vi.fn();
      const { container } = render(
        <ColorPalette label="Color" value="" onChange={onChange} />
      );
      const swatch = container.querySelector(
        `button[title="${PRESET_COLORS[0]}"]`
      ) as HTMLButtonElement;
      fireEvent.click(swatch);
      expect(onChange).toHaveBeenCalledWith(PRESET_COLORS[0]);
    });

    it("applies active border styling to the currently selected preset", () => {
      const activeColor = PRESET_COLORS[3];
      const { container } = render(
        <ColorPalette label="Color" value={activeColor} onChange={vi.fn()} />
      );
      const swatch = container.querySelector(
        `button[title="${activeColor}"]`
      ) as HTMLButtonElement;
      expect(swatch.style.border).toContain("2px solid");
    });

    it("does not apply active border to non-selected presets", () => {
      const activeColor = PRESET_COLORS[0];
      const inactiveColor = PRESET_COLORS[1];
      const { container } = render(
        <ColorPalette label="Color" value={activeColor} onChange={vi.fn()} />
      );
      const swatch = container.querySelector(
        `button[title="${inactiveColor}"]`
      ) as HTMLButtonElement;
      expect(swatch.style.border).not.toContain("2px solid");
    });
  });

  describe("transparent swatch (allowNone)", () => {
    it("does NOT render transparent swatch when allowNone is false (default)", () => {
      const { container } = render(
        <ColorPalette label="Color" value="" onChange={vi.fn()} />
      );
      const transparentBtn = container.querySelector(
        'button[title="None (transparent)"]'
      );
      expect(transparentBtn).toBeNull();
    });

    it("renders transparent swatch when allowNone=true", () => {
      const { container } = render(
        <ColorPalette label="Color" value="" onChange={vi.fn()} allowNone />
      );
      const transparentBtn = container.querySelector(
        'button[title="None (transparent)"]'
      );
      expect(transparentBtn).toBeTruthy();
    });

    it("calls onChange with TRANSPARENT when the transparent swatch is clicked", () => {
      const onChange = vi.fn();
      const { container } = render(
        <ColorPalette label="Color" value="" onChange={onChange} allowNone />
      );
      const transparentBtn = container.querySelector(
        'button[title="None (transparent)"]'
      ) as HTMLButtonElement;
      fireEvent.click(transparentBtn);
      expect(onChange).toHaveBeenCalledWith(TRANSPARENT);
    });

    it("applies active border to transparent swatch when value is TRANSPARENT", () => {
      const { container } = render(
        <ColorPalette label="Color" value={TRANSPARENT} onChange={vi.fn()} allowNone />
      );
      const transparentBtn = container.querySelector(
        'button[title="None (transparent)"]'
      ) as HTMLButtonElement;
      expect(transparentBtn.style.border).toContain("2px solid");
    });
  });

  describe("custom color picker", () => {
    it("renders the custom color picker button", () => {
      const { container } = render(
        <ColorPalette label="Color" value="" onChange={vi.fn()} />
      );
      const customBtn = container.querySelector('button[title="Custom color…"]');
      expect(customBtn).toBeTruthy();
    });

    it("renders a hidden color input for the native picker", () => {
      const { container } = render(
        <ColorPalette label="Color" value="" onChange={vi.fn()} />
      );
      const input = container.querySelector('input[type="color"]') as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input.style.opacity).toBe("0");
    });

    it("calls onChange when the hidden color input changes", () => {
      const onChange = vi.fn();
      const { container } = render(
        <ColorPalette label="Color" value="" onChange={onChange} />
      );
      const input = container.querySelector('input[type="color"]') as HTMLInputElement;
      fireEvent.change(input, { target: { value: "#abcdef" } });
      expect(onChange).toHaveBeenCalledWith("#abcdef");
    });

    it("sets hidden input value to current custom color when value is not a preset", () => {
      const customColor = "#aabbcc";
      const { container } = render(
        <ColorPalette label="Color" value={customColor} onChange={vi.fn()} />
      );
      const input = container.querySelector('input[type="color"]') as HTMLInputElement;
      expect(input.value).toBe(customColor);
    });

    it("sets hidden input value to #ffffff when value is a preset", () => {
      const { container } = render(
        <ColorPalette label="Color" value={PRESET_COLORS[0]} onChange={vi.fn()} />
      );
      const input = container.querySelector('input[type="color"]') as HTMLInputElement;
      expect(input.value).toBe("#ffffff");
    });
  });

  describe("current value chip", () => {
    it("shows the current color value chip when a non-transparent color is active", () => {
      const { getByText } = render(
        <ColorPalette label="Color" value="#aabbcc" onChange={vi.fn()} />
      );
      expect(getByText("#aabbcc")).toBeTruthy();
    });

    it("does not show the chip when value is TRANSPARENT", () => {
      const { queryByText } = render(
        <ColorPalette label="Color" value={TRANSPARENT} onChange={vi.fn()} />
      );
      expect(queryByText(TRANSPARENT)).toBeNull();
    });

    it("does not show the chip when value is empty string", () => {
      const { container } = render(
        <ColorPalette label="Color" value="" onChange={vi.fn()} />
      );
      // Check no <span> with monospace font exists for the chip
      const spans = Array.from(container.querySelectorAll("span")).filter(
        (s) => s.style.fontFamily === "monospace"
      );
      expect(spans.length).toBe(0);
    });
  });
});
