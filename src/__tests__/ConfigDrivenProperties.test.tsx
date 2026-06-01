import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { ConfigDrivenProperties, PropertyFieldConfig } from "../glyph/type/ConfigDrivenProperties";
import { Glyph } from "../glyph/Glyph";

const makeGlyph = (data: Record<string, unknown> = {}): Glyph => {
  const g = new Glyph("g1", "rect", 10, 20);
  g.data = data;
  return g;
};

const textField: PropertyFieldConfig = {
  key: "label",
  label: "Label",
  type: "text",
  placeholder: "Enter label",
};

const numberField: PropertyFieldConfig = {
  key: "count",
  label: "Count",
  type: "number",
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 5,
};

const colorField: PropertyFieldConfig = {
  key: "color",
  label: "Color",
  type: "color",
  defaultValue: "#ffffff",
};

const checkboxField: PropertyFieldConfig = {
  key: "visible",
  label: "Visible",
  type: "checkbox",
  placeholder: "Show element",
};

const selectField: PropertyFieldConfig = {
  key: "shape",
  label: "Shape",
  type: "select",
  options: [
    { label: "Circle", value: "circle" },
    { label: "Square", value: "square" },
  ],
  defaultValue: "circle",
};

const textareaField: PropertyFieldConfig = {
  key: "notes",
  label: "Notes",
  type: "textarea",
  placeholder: "Add notes",
};

describe("ConfigDrivenProperties", () => {
  describe("text field", () => {
    it("renders the label and a text input", () => {
      const { getByText, getByPlaceholderText } = render(
        <ConfigDrivenProperties
          glyph={makeGlyph({ label: "hello" })}
          fields={[textField]}
          onUpdate={vi.fn()}
        />
      );
      expect(getByText("Label")).toBeTruthy();
      expect(getByPlaceholderText("Enter label")).toBeTruthy();
    });

    it("pre-fills text input with glyph.data value", () => {
      const { getByDisplayValue } = render(
        <ConfigDrivenProperties
          glyph={makeGlyph({ label: "my value" })}
          fields={[textField]}
          onUpdate={vi.fn()}
        />
      );
      expect(getByDisplayValue("my value")).toBeTruthy();
    });

    it("calls onUpdate with updated data when text input changes", () => {
      const onUpdate = vi.fn();
      const glyph = makeGlyph({ label: "old" });
      const { getByDisplayValue } = render(
        <ConfigDrivenProperties glyph={glyph} fields={[textField]} onUpdate={onUpdate} />
      );
      fireEvent.change(getByDisplayValue("old"), { target: { value: "new" } });
      expect(onUpdate).toHaveBeenCalledOnce();
      expect(onUpdate.mock.calls[0][0].data.label).toBe("new");
    });

    it("uses defaultValue when glyph.data key is absent", () => {
      const field: PropertyFieldConfig = {
        key: "missing",
        label: "Missing",
        type: "text",
        defaultValue: "fallback",
      };
      const { getByDisplayValue } = render(
        <ConfigDrivenProperties glyph={makeGlyph()} fields={[field]} onUpdate={vi.fn()} />
      );
      expect(getByDisplayValue("fallback")).toBeTruthy();
    });
  });

  describe("number field", () => {
    it("renders a number input with min/max/step", () => {
      const { container } = render(
        <ConfigDrivenProperties
          glyph={makeGlyph({ count: 10 })}
          fields={[numberField]}
          onUpdate={vi.fn()}
        />
      );
      const input = container.querySelector('input[type="number"]') as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input.min).toBe("0");
      expect(input.max).toBe("100");
    });

    it("calls onUpdate with parsed float when number input changes", () => {
      const onUpdate = vi.fn();
      const glyph = makeGlyph({ count: 5 });
      const { container } = render(
        <ConfigDrivenProperties glyph={glyph} fields={[numberField]} onUpdate={onUpdate} />
      );
      const input = container.querySelector('input[type="number"]') as HTMLInputElement;
      fireEvent.change(input, { target: { value: "42" } });
      expect(onUpdate).toHaveBeenCalledOnce();
      expect(onUpdate.mock.calls[0][0].data.count).toBe(42);
    });

    it("uses defaultValue when glyph.data key is absent", () => {
      const { container } = render(
        <ConfigDrivenProperties
          glyph={makeGlyph()}
          fields={[numberField]}
          onUpdate={vi.fn()}
        />
      );
      const input = container.querySelector('input[type="number"]') as HTMLInputElement;
      expect(Number(input.value)).toBe(5);
    });
  });

  describe("color field", () => {
    it("renders a color input", () => {
      const { container } = render(
        <ConfigDrivenProperties
          glyph={makeGlyph({ color: "#aabbcc" })}
          fields={[colorField]}
          onUpdate={vi.fn()}
        />
      );
      const input = container.querySelector('input[type="color"]') as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input.value).toBe("#aabbcc");
    });

    it("calls onUpdate when color input changes", () => {
      const onUpdate = vi.fn();
      const { container } = render(
        <ConfigDrivenProperties
          glyph={makeGlyph({ color: "#ffffff" })}
          fields={[colorField]}
          onUpdate={onUpdate}
        />
      );
      const input = container.querySelector('input[type="color"]') as HTMLInputElement;
      fireEvent.change(input, { target: { value: "#123456" } });
      expect(onUpdate).toHaveBeenCalledOnce();
      expect(onUpdate.mock.calls[0][0].data.color).toBe("#123456");
    });
  });

  describe("checkbox field", () => {
    it("renders a checkbox", () => {
      const { container } = render(
        <ConfigDrivenProperties
          glyph={makeGlyph({ visible: true })}
          fields={[checkboxField]}
          onUpdate={vi.fn()}
        />
      );
      const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(checkbox).toBeTruthy();
      expect(checkbox.checked).toBe(true);
    });

    it("calls onUpdate with boolean when checkbox changes", () => {
      const onUpdate = vi.fn();
      const { container } = render(
        <ConfigDrivenProperties
          glyph={makeGlyph({ visible: true })}
          fields={[checkboxField]}
          onUpdate={onUpdate}
        />
      );
      const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
      fireEvent.click(checkbox);
      expect(onUpdate).toHaveBeenCalledOnce();
      expect(typeof onUpdate.mock.calls[0][0].data.visible).toBe("boolean");
    });

    it("renders optional placeholder text alongside checkbox", () => {
      const { getByText } = render(
        <ConfigDrivenProperties
          glyph={makeGlyph()}
          fields={[checkboxField]}
          onUpdate={vi.fn()}
        />
      );
      expect(getByText("Show element")).toBeTruthy();
    });
  });

  describe("select field", () => {
    it("renders a select with the provided options", () => {
      const { container, getByText } = render(
        <ConfigDrivenProperties
          glyph={makeGlyph({ shape: "circle" })}
          fields={[selectField]}
          onUpdate={vi.fn()}
        />
      );
      const select = container.querySelector("select") as HTMLSelectElement;
      expect(select).toBeTruthy();
      expect(getByText("Circle")).toBeTruthy();
      expect(getByText("Square")).toBeTruthy();
    });

    it("calls onUpdate with selected value when select changes", () => {
      const onUpdate = vi.fn();
      const { container } = render(
        <ConfigDrivenProperties
          glyph={makeGlyph({ shape: "circle" })}
          fields={[selectField]}
          onUpdate={onUpdate}
        />
      );
      const select = container.querySelector("select") as HTMLSelectElement;
      fireEvent.change(select, { target: { value: "square" } });
      expect(onUpdate).toHaveBeenCalledOnce();
      expect(onUpdate.mock.calls[0][0].data.shape).toBe("square");
    });
  });

  describe("textarea field", () => {
    it("renders a textarea", () => {
      const { container } = render(
        <ConfigDrivenProperties
          glyph={makeGlyph({ notes: "some text" })}
          fields={[textareaField]}
          onUpdate={vi.fn()}
        />
      );
      const ta = container.querySelector("textarea") as HTMLTextAreaElement;
      expect(ta).toBeTruthy();
      expect(ta.value).toBe("some text");
    });

    it("calls onUpdate when textarea changes", () => {
      const onUpdate = vi.fn();
      const { container } = render(
        <ConfigDrivenProperties
          glyph={makeGlyph({ notes: "old" })}
          fields={[textareaField]}
          onUpdate={onUpdate}
        />
      );
      const ta = container.querySelector("textarea") as HTMLTextAreaElement;
      fireEvent.change(ta, { target: { value: "updated notes" } });
      expect(onUpdate).toHaveBeenCalledOnce();
      expect(onUpdate.mock.calls[0][0].data.notes).toBe("updated notes");
    });
  });

  describe("multiple fields", () => {
    it("renders all fields when multiple are provided", () => {
      const { getByText } = render(
        <ConfigDrivenProperties
          glyph={makeGlyph()}
          fields={[textField, numberField, selectField]}
          onUpdate={vi.fn()}
        />
      );
      expect(getByText("Label")).toBeTruthy();
      expect(getByText("Count")).toBeTruthy();
      expect(getByText("Shape")).toBeTruthy();
    });
  });
});
