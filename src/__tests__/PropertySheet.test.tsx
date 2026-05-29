import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PropertySheet } from "../PropertySheet";
import { Glyph } from "../glyph/Glyph";
import { Connection } from "../glyph/Connection";
import type { Page } from "../glyph/Page";

vi.mock("../glyph/type/GlyphRegistry", () => ({
  glyphRegistry: {},
}));

vi.mock("uuid", () => ({ v4: () => "test-uuid" }));

const makeGlyph = (overrides: Partial<Glyph> = {}) =>
  Object.assign(
    new Glyph("g1", "rect", 10, 20, [], { fill: "#fff" }, "My Label", 1, 1),
    overrides
  );

const makeConnection = (): Connection => {
  const c = new Connection("from-port", "to-port", "c1", "g1", "g2");
  c.label = "My Connection";
  c.view = { connectionType: "line", color: "#000000", thickness: 2, dashed: false };
  return c;
};

// ── Empty state (no glyph, no connection) ──────────────────────────────────
describe("PropertySheet — empty state", () => {
  it("renders 'Nothing selected' when no glyph or connection is provided", () => {
    render(<PropertySheet onClose={vi.fn()} />);
    expect(screen.getAllByText("Nothing selected").length).toBeGreaterThan(0);
  });

  it("does not render an Apply button in empty state", () => {
    render(<PropertySheet onClose={vi.fn()} />);
    expect(screen.queryByText("Apply")).toBeNull();
  });
});

// ── Connection mode ────────────────────────────────────────────────────────
describe("PropertySheet — connection selected", () => {
  it("renders 'Connection Properties' heading", () => {
    render(<PropertySheet connection={makeConnection()} onClose={vi.fn()} />);
    expect(screen.getByText("Connection Properties")).toBeTruthy();
  });

  it("renders an Apply button", () => {
    render(<PropertySheet connection={makeConnection()} onClose={vi.fn()} />);
    expect(screen.getByText("Apply")).toBeTruthy();
  });

  it("close button (×) calls onClose", () => {
    const onClose = vi.fn();
    render(<PropertySheet connection={makeConnection()} onClose={onClose} />);
    fireEvent.click(screen.getByText("×"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders connection label input pre-filled with connection label", () => {
    render(<PropertySheet connection={makeConnection()} onClose={vi.fn()} />);
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    const labelInput = inputs.find(i => i.value === "My Connection");
    expect(labelInput).toBeTruthy();
  });
});

// ── Glyph mode ─────────────────────────────────────────────────────────────
describe("PropertySheet — glyph selected", () => {
  it("renders 'Properties' heading", () => {
    render(<PropertySheet glyph={makeGlyph()} onClose={vi.fn()} />);
    expect(screen.getByText("Properties")).toBeTruthy();
  });

  it("pre-fills the Label input with the glyph label", () => {
    render(<PropertySheet glyph={makeGlyph()} onClose={vi.fn()} />);
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    const labelInput = inputs.find(i => i.value === "My Label");
    expect(labelInput).toBeTruthy();
  });

  it("renders an Apply button", () => {
    render(<PropertySheet glyph={makeGlyph()} onClose={vi.fn()} />);
    expect(screen.getByText("Apply")).toBeTruthy();
  });

  it("close button calls onClose", () => {
    const onClose = vi.fn();
    const { container } = render(<PropertySheet glyph={makeGlyph()} onClose={onClose} />);
    const closeBtn = container.querySelector(".close-btn") as HTMLElement;
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("updating the label input changes its displayed value", () => {
    render(<PropertySheet glyph={makeGlyph()} onClose={vi.fn()} />);
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    const labelInput = inputs.find(i => i.value === "My Label")!;
    fireEvent.change(labelInput, { target: { value: "Renamed" } });
    expect((screen.getAllByRole("textbox") as HTMLInputElement[]).find(i => i.value === "Renamed")).toBeTruthy();
  });

  it("calls onUpdateGlyph when Apply is clicked", () => {
    const onUpdateGlyph = vi.fn();
    render(
      <PropertySheet glyph={makeGlyph()} onClose={vi.fn()} onUpdateGlyph={onUpdateGlyph} />
    );
    fireEvent.click(screen.getByText("Apply"));
    expect(onUpdateGlyph).toHaveBeenCalledTimes(1);
    expect(onUpdateGlyph.mock.calls[0][0]).toBe("g1");
  });

  it("syncs label state when a new glyph prop is passed", () => {
    const g1 = makeGlyph();
    const g2 = Object.assign(new Glyph("g2", "rect", 0, 0, [], {}, "Other Label"), {});
    const { rerender } = render(<PropertySheet glyph={g1} onClose={vi.fn()} />);

    rerender(<PropertySheet glyph={g2} onClose={vi.fn()} />);
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    expect(inputs.find(i => i.value === "Other Label")).toBeTruthy();
  });
});

// ── Font and alignment controls ────────────────────────────────────────────
describe("PropertySheet — font controls call onUpdateGlyph immediately", () => {
  it("font family change calls onUpdateGlyph with new fontFamily", () => {
    const onUpdateGlyph = vi.fn();
    render(<PropertySheet glyph={makeGlyph()} onClose={vi.fn()} onUpdateGlyph={onUpdateGlyph} />);
    const selects = screen.getAllByRole("combobox") as HTMLSelectElement[];
    const fontSelect = selects.find(s => Array.from(s.options).some(o => o.value === "Georgia"))!;
    fireEvent.change(fontSelect, { target: { value: "Georgia" } });
    expect(onUpdateGlyph).toHaveBeenCalled();
    expect(onUpdateGlyph.mock.calls[0][1].data?.fontFamily).toBe("Georgia");
  });

  it("font size change calls onUpdateGlyph with new fontSize", () => {
    const onUpdateGlyph = vi.fn();
    render(<PropertySheet glyph={makeGlyph()} onClose={vi.fn()} onUpdateGlyph={onUpdateGlyph} />);
    const spinners = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    fireEvent.change(spinners[0], { target: { value: "24" } });
    expect(onUpdateGlyph).toHaveBeenCalled();
    expect(onUpdateGlyph.mock.calls[0][1].data?.fontSize).toBe(24);
  });
});

describe("PropertySheet — label alignment buttons", () => {
  it("Align Left calls onUpdateGlyph with labelAlign=left", () => {
    const onUpdateGlyph = vi.fn();
    render(<PropertySheet glyph={makeGlyph()} onClose={vi.fn()} onUpdateGlyph={onUpdateGlyph} />);
    fireEvent.click(screen.getByTitle("Align Left"));
    expect(onUpdateGlyph).toHaveBeenCalled();
    expect(onUpdateGlyph.mock.calls[0][1].data?.labelAlign).toBe("left");
  });

  it("Align Center calls onUpdateGlyph with labelAlign=center", () => {
    const onUpdateGlyph = vi.fn();
    render(<PropertySheet glyph={makeGlyph()} onClose={vi.fn()} onUpdateGlyph={onUpdateGlyph} />);
    fireEvent.click(screen.getByTitle("Align Center"));
    expect(onUpdateGlyph).toHaveBeenCalled();
    expect(onUpdateGlyph.mock.calls[0][1].data?.labelAlign).toBe("center");
  });

  it("Align Right calls onUpdateGlyph with labelAlign=right", () => {
    const onUpdateGlyph = vi.fn();
    render(<PropertySheet glyph={makeGlyph()} onClose={vi.fn()} onUpdateGlyph={onUpdateGlyph} />);
    fireEvent.click(screen.getByTitle("Align Right"));
    expect(onUpdateGlyph).toHaveBeenCalled();
    expect(onUpdateGlyph.mock.calls[0][1].data?.labelAlign).toBe("right");
  });
});

describe("PropertySheet — clear label button", () => {
  it("clicking Clear label span clears the label input", () => {
    render(<PropertySheet glyph={makeGlyph()} onClose={vi.fn()} />);
    fireEvent.click(screen.getByTitle("Clear label"));
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    const labelInput = inputs.find(i => i.getAttribute("style")?.includes("100%"))!;
    expect(labelInput.value).toBe("");
  });
});

// ── Connection Apply ────────────────────────────────────────────────────────
describe("PropertySheet — connection Apply saves updated fields", () => {
  it("calls onUpdateConnection with new connectorType when Apply is clicked", () => {
    const onUpdateConnection = vi.fn();
    render(
      <PropertySheet
        connection={makeConnection()}
        onClose={vi.fn()}
        onUpdateConnection={onUpdateConnection}
      />
    );
    const selects = screen.getAllByRole("combobox") as HTMLSelectElement[];
    const connTypeSelect = selects.find(s =>
      Array.from(s.options).some(o => o.value === "bezier")
    )!;
    fireEvent.change(connTypeSelect, { target: { value: "bezier" } });
    fireEvent.click(screen.getByText("Apply"));
    expect(onUpdateConnection).toHaveBeenCalledTimes(1);
    const [id, updates] = onUpdateConnection.mock.calls[0];
    expect(id).toBe("from-port");
    expect(updates.view?.connectionType).toBe("bezier");
  });

  it("calls onUpdateConnection with dashed=true when checkbox is checked", () => {
    const onUpdateConnection = vi.fn();
    render(
      <PropertySheet
        connection={makeConnection()}
        onClose={vi.fn()}
        onUpdateConnection={onUpdateConnection}
      />
    );
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText("Apply"));
    expect(onUpdateConnection).toHaveBeenCalledTimes(1);
    expect(onUpdateConnection.mock.calls[0][1].view?.dashed).toBe(true);
  });
});

// ── UML class tabs ─────────────────────────────────────────────────────────
const makeUMLGlyph = () =>
  Object.assign(
    new Glyph("g-uml", "uml-class", 10, 20, [], {}, "MyClass", 1, 1),
    {
      attributes: [{ name: "age", type: "attribute", visibility: "public", dataType: "number" }],
      methods: [{ name: "getAge", visibility: "public", returnType: "number", parameters: [] }],
    }
  );

describe("PropertySheet — UML class tabs", () => {
  it("renders General, Attributes and Methods tab buttons for uml-class", () => {
    render(<PropertySheet glyph={makeUMLGlyph()} onClose={vi.fn()} />);
    expect(screen.getByText("General")).toBeTruthy();
    expect(screen.getByText("Attributes")).toBeTruthy();
    expect(screen.getByText("Methods")).toBeTruthy();
  });

  it("switching to Attributes tab shows Add Attribute button", () => {
    render(<PropertySheet glyph={makeUMLGlyph()} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText("Attributes"));
    expect(screen.getByText("Add Attribute")).toBeTruthy();
  });

  it("can add a new attribute", () => {
    render(<PropertySheet glyph={makeUMLGlyph()} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText("Attributes"));
    const before = screen.getAllByPlaceholderText("Attribute").length;
    fireEvent.click(screen.getByText("Add Attribute"));
    expect(screen.getAllByPlaceholderText("Attribute").length).toBeGreaterThan(before);
  });

  it("can remove an existing attribute", () => {
    render(<PropertySheet glyph={makeUMLGlyph()} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText("Attributes"));
    const removeBtn = screen.getByTitle("Remove");
    fireEvent.click(removeBtn);
    expect(screen.queryAllByPlaceholderText("Attribute")).toHaveLength(0);
  });

  it("switching to Methods tab shows Add Method button", () => {
    render(<PropertySheet glyph={makeUMLGlyph()} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText("Methods"));
    expect(screen.getByText("Add Method")).toBeTruthy();
  });

  it("can add a new method", () => {
    render(<PropertySheet glyph={makeUMLGlyph()} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText("Methods"));
    const before = screen.getAllByPlaceholderText("Method Name").length;
    fireEvent.click(screen.getByText("Add Method"));
    expect(screen.getAllByPlaceholderText("Method Name").length).toBeGreaterThan(before);
  });

  it("can remove an existing method", () => {
    render(<PropertySheet glyph={makeUMLGlyph()} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText("Methods"));
    fireEvent.click(screen.getByTitle("Remove Method"));
    expect(screen.queryAllByPlaceholderText("Method Name")).toHaveLength(0);
  });

  it("can add a parameter to a method", () => {
    render(<PropertySheet glyph={makeUMLGlyph()} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText("Methods"));
    const paramInputs = screen.getAllByPlaceholderText("Parameter Name") as HTMLInputElement[];
    const newParamInput = paramInputs[paramInputs.length - 1];
    fireEvent.change(newParamInput, { target: { value: "newParam" } });
    fireEvent.click(screen.getByText("Add Parameter"));
    expect(screen.getAllByPlaceholderText("Parameter Name").length).toBeGreaterThan(paramInputs.length);
  });

  it("Apply on uml-class calls onUpdateGlyph with attributes and methods", () => {
    const onUpdateGlyph = vi.fn();
    render(
      <PropertySheet glyph={makeUMLGlyph()} onClose={vi.fn()} onUpdateGlyph={onUpdateGlyph} />
    );
    fireEvent.click(screen.getByText("Apply"));
    expect(onUpdateGlyph).toHaveBeenCalledTimes(1);
    const updates = onUpdateGlyph.mock.calls[0][1];
    expect(updates.attributes).toBeDefined();
    expect(updates.methods).toBeDefined();
  });
});

// ── flow-off-page-connector page dropdown ──────────────────────────────────
describe("PropertySheet — flow-off-page-connector page dropdown", () => {
  const makeOffPageGlyph = () =>
    new Glyph("g-opc", "flow-off-page-connector", 0, 0, [], {}, "Go to", 0, 0);

  const testPages: Page[] = [
    { id: "p1", name: "Page One", glyphs: [], connections: [] },
    { id: "p2", name: "Page Two", glyphs: [], connections: [] },
  ];

  it("shows 'Connects to Page' label when pages are provided", () => {
    render(
      <PropertySheet glyph={makeOffPageGlyph()} onClose={vi.fn()} pages={testPages} />
    );
    expect(screen.getByText("Connects to Page")).toBeTruthy();
  });

  it("lists available pages in the dropdown", () => {
    render(
      <PropertySheet glyph={makeOffPageGlyph()} onClose={vi.fn()} pages={testPages} />
    );
    expect(screen.getByText("Page One")).toBeTruthy();
    expect(screen.getByText("Page Two")).toBeTruthy();
  });

  it("does not show page dropdown for regular glyph types", () => {
    render(
      <PropertySheet glyph={makeGlyph()} onClose={vi.fn()} pages={testPages} />
    );
    expect(screen.queryByText("Connects to Page")).toBeNull();
  });
});

// ── Port count changes ─────────────────────────────────────────────────────
describe("PropertySheet — port count changes", () => {
  it("increasing inputs and clicking Apply calls onUpdateGlyph with updated port count", () => {
    const onUpdateGlyph = vi.fn();
    render(
      <PropertySheet glyph={makeGlyph()} onClose={vi.fn()} onUpdateGlyph={onUpdateGlyph} />
    );
    const spinners = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    const inputsField = spinners.find(s => (s as HTMLInputElement).value === "1");
    fireEvent.change(inputsField!, { target: { value: "3" } });
    fireEvent.click(screen.getByText("Apply"));
    expect(onUpdateGlyph).toHaveBeenCalledTimes(1);
    const updates = onUpdateGlyph.mock.calls[0][1];
    expect(updates.ports?.filter((p: { type: string }) => p.type === "input").length).toBe(3);
  });
});
