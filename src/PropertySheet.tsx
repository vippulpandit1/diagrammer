// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React, { useState, useEffect } from "react";
import { Glyph } from "./glyph/Glyph";
import type { UMLAttr } from "./glyph/type/uml/UMLAttr";
import type { UMLMethod } from "./glyph/type/uml/UMLMethod";
import type { Connection } from "./glyph/GlyphDocument";

const TYPE_OPTIONS = [
  "rect", "circle", "multi",
  "and", "or", "not", "nand", "nor", "xor", "xnor",
  "uml-class", "uml-interface", "uml-abstract", "uml-enum", "uml-package", "uml-association", "uml-inheritance"
];

const FONT_FAMILIES = [
  "Arial", "Helvetica", "Times New Roman", "Courier New", "Georgia", "Verdana", "Tahoma", "Trebuchet MS", "Impact"
];

type ConnectorType = "bezier" | "manhattan" | "line";

interface PropertySheetProps {
  glyph: Glyph;
  line?: Connection;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Glyph>) => void;
  connectorType: ConnectorType;
  setConnectorType: (type: ConnectorType) => void;
  onUpdateConnectionType?: (connId: string, type: ConnectorType) => void;
}

export const PropertySheet: React.FC<PropertySheetProps> = ({
  glyph,
  line,
  onClose,
  onUpdate,
  connectorType,
  setConnectorType,
  onUpdateConnectionType
}) => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<"Style" | "Text" | "General">("General");
  const [label, setLabel] = useState(glyph.label);
  const [type, setType] = useState(glyph.type);
  const [inputs, setInputs] = useState(glyph.inputs ?? 2);
  const [outputs, setOutputs] = useState(glyph.outputs ?? 1);
  const [attributes, setAttributes] = useState<UMLAttr[]>(glyph.attributes ?? []);
  const [attrDialogIdx, setAttrDialogIdx] = useState<number | null>(null);
  const [attrDialogData, setAttrDialogData] = useState<UMLAttr | null>(null);
  const [methods, setMethods] = useState<UMLMethod[]>(glyph.methods ?? []);
  const [methodDialogIdx, setMethodDialogIdx] = useState<number | null>(null);
  const [methodDialogData, setMethodDialogData] = useState<UMLMethod | null>(null);
  const [fill, setFill] = useState(glyph.data?.fill || "#fff");
  const [stroke, setStroke] = useState(glyph.data?.stroke || "#222");
  const [strokeWidth, setStrokeWidth] = useState(glyph.data?.strokeWidth || 2);
  const [textColor, setTextColor] = useState(glyph.data?.textColor || "#222");
  const [fontSize, setFontSize] = useState(glyph.data?.fontSize || 16);
  const [fontFamily, setFontFamily] = useState(glyph.data?.fontFamily || "Arial");

  // --- Effects ---
  useEffect(() => {
    setTextColor(glyph.data?.textColor || "#222");
    setFontSize(glyph.data?.fontSize || 16);
    setFontFamily(glyph.data?.fontFamily || "Arial");
    setFill(glyph.data?.fill || "#fff");
    setStroke(glyph.data?.stroke || "#222");
    setStrokeWidth(glyph.data?.strokeWidth || 2);
    setLabel(glyph.label);
    setType(glyph.type);
    setInputs(glyph.inputs ?? 2);
    setOutputs(glyph.outputs ?? 1);
    setAttributes(glyph.attributes ?? []);
    setMethods(glyph.methods ?? []);
  }, [glyph]);

  // --- Handlers: General ---
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
    onUpdate(glyph.id, { label: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
    onUpdate(glyph.id, { type: e.target.value });
  };

  const handleInputsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setInputs(value);
    onUpdate(glyph.id, { inputs: value });
  };

  const handleOutputsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setOutputs(value);
    onUpdate(glyph.id, { outputs: value });
  };

  // --- Handlers: Style ---
  const handleStyleChange = (field: string, value: any) => {
    const newData = { ...glyph.data, [field]: value };
    onUpdate(glyph.id, { data: newData });
    if (field === "fill") setFill(value);
    if (field === "stroke") setStroke(value);
    if (field === "strokeWidth") setStrokeWidth(value);
  };

  // --- Handlers: Text Style ---
  const handleTextStyleChange = (field: string, value: any) => {
    const newData = { ...glyph.data, [field]: value };
    onUpdate(glyph.id, { data: newData });
    if (field === "textColor") setTextColor(value);
    if (field === "fontSize") setFontSize(value);
    if (field === "fontFamily") setFontFamily(value);
  };

  // --- Handlers: Attributes ---
  const handleAttrChange = (idx: number, value: UMLAttr) => {
    const updated = [...attributes];
    updated[idx] = value;
    setAttributes(updated);
    onUpdate(glyph.id, { attributes: updated });
  };

  const handleAttrAdd = () => {
    const updated = [...attributes, { name: "", type: "", visibility: "public" } as UMLAttr];
    setAttributes(updated);
    onUpdate(glyph.id, { attributes: updated });
  };

  const handleAttrRemove = (idx: number) => {
    const updated = attributes.filter((_, i) => i !== idx);
    setAttributes(updated);
    onUpdate(glyph.id, { attributes: updated });
  };

  const handleAttrMore = (idx: number) => {
    setAttrDialogIdx(idx);
    setAttrDialogData(attributes[idx]);
  };

  const handleAttrDialogSave = () => {
    if (attrDialogIdx !== null && attrDialogData) {
      handleAttrChange(attrDialogIdx, attrDialogData);
      setAttrDialogIdx(null);
      setAttrDialogData(null);
    }
  };

  const handleAttrDialogCancel = () => {
    setAttrDialogIdx(null);
    setAttrDialogData(null);
  };

  // --- Handlers: Methods ---
  const handleMethodChange = (idx: number, value: UMLMethod) => {
    const updated = [...methods];
    updated[idx] = value;
    setMethods(updated);
    onUpdate(glyph.id, { methods: updated });
  };

  const handleMethodAdd = () => {
    const updated = [...methods, { name: "", returnType: "", parameters: [], visibility: "public" }];
    setMethods(updated);
    onUpdate(glyph.id, { methods: updated });
  };

  const handleMethodRemove = (idx: number) => {
    const updated = methods.filter((_, i) => i !== idx);
    setMethods(updated);
    onUpdate(glyph.id, { methods: updated });
  };

  const handleMethodMore = (idx: number) => {
    setMethodDialogIdx(idx);
    setMethodDialogData(methods[idx]);
  };

  const handleMethodDialogSave = () => {
    if (methodDialogIdx !== null && methodDialogData) {
      handleMethodChange(methodDialogIdx, methodDialogData);
      setMethodDialogIdx(null);
      setMethodDialogData(null);
    }
  };

  const handleMethodDialogCancel = () => {
    setMethodDialogIdx(null);
    setMethodDialogData(null);
  };

  // --- Renderers ---
  const renderGeneralTab = () => (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td style={{ fontWeight: 600, padding: "6px 8px" }}>Label</td>
          <td style={{ padding: "6px 8px" }}>
            <input value={label} onChange={handleLabelChange} style={{ width: "100%" }} />
          </td>
        </tr>
        <tr>
          <td style={{ fontWeight: 600, padding: "6px 8px" }}>Type</td>
          <td style={{ padding: "6px 8px" }}>
            <select value={type} onChange={handleTypeChange} style={{ width: "100%" }}>
              {TYPE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </td>
        </tr>
        <tr>
          <td style={{ fontWeight: 600, padding: "6px 8px" }}>Inputs</td>
          <td style={{ padding: "6px 8px" }}>
            <input
              type="number"
              min={0}
              value={inputs}
              onChange={handleInputsChange}
              style={{ width: "100%" }}
            />
          </td>
        </tr>
        <tr>
          <td style={{ fontWeight: 600, padding: "6px 8px" }}>Outputs</td>
          <td style={{ padding: "6px 8px" }}>
            <input
              type="number"
              min={0}
              value={outputs}
              onChange={handleOutputsChange}
              style={{ width: "100%" }}
            />
          </td>
        </tr>
        <tr>
          <td colSpan={2} style={{ padding: "6px 8px" }}>
            <h3 style={{ margin: "8px 0 4px 0" }}>Attributes</h3>
            {renderAttributesTable()}
          </td>
        </tr>
        <tr>
          <td colSpan={2} style={{ padding: "6px 8px" }}>
            <h3 style={{ margin: "8px 0 4px 0" }}>Methods</h3>
            {renderMethodsTable()}
          </td>
        </tr>
      </tbody>
    </table>
  );

  function renderAttributesTable() {
    return (
      <table style={{ width: "100%", borderCollapse: "collapse", borderSpacing: 0 }}>
        <tbody>
          {attributes.map((attr, idx) => (
            <tr key={idx}>
              <td style={{ padding: "1px 2px", width: "70%" }}>
                <input
                  type="text"
                  value={attr.name}
                  onChange={e => handleAttrChange(idx, { ...attributes[idx], name: e.target.value })}
                  style={{ width: "100%", margin: 0, fontSize: "0.95em", padding: "2px 4px" }}
                  placeholder={`Attribute ${idx + 1}`}
                />
              </td>
              <td style={{ padding: "1px 2px", width: "30%" }}>
                <div style={{ display: "flex", gap: "4px", justifyContent: "flex-end", alignItems: "center" }}>
                  <button
                    onClick={() => handleAttrMore(idx)}
                    style={iconButtonStyle("#2563eb")}
                    title="More"
                  >...</button>
                  <button
                    onClick={() => handleAttrRemove(idx)}
                    style={iconButtonStyle("#f87171")}
                    title="Remove"
                  >&times;</button>
                </div>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={2} style={{ padding: "2px 0", textAlign: "center" }}>
              <button
                onClick={handleAttrAdd}
                style={addButtonStyle}
              >
                + Add Attribute
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  function renderMethodsTable() {
    return (
      <table style={{ width: "100%", borderCollapse: "collapse", borderSpacing: 0 }}>
        <tbody>
          {methods.map((method, idx) => (
            <tr key={idx}>
              <td style={{ padding: "1px 2px", width: "70%" }}>
                <input
                  type="text"
                  value={method.name}
                  onChange={e => handleMethodChange(idx, { ...methods[idx], name: e.target.value })}
                  style={{ width: "100%", margin: 0, fontSize: "0.95em", padding: "2px 4px" }}
                  placeholder={`Method ${idx + 1}`}
                />
              </td>
              <td style={{ padding: "1px 2px", width: "30%" }}>
                <button
                  onClick={() => handleMethodMore(idx)}
                  style={iconButtonStyle("#2563eb")}
                  title="More"
                >...</button>
                <button
                  onClick={() => handleMethodRemove(idx)}
                  style={iconButtonStyle("#f87171")}
                  title="Remove"
                >&times;</button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={3} style={{ padding: "2px 0", textAlign: "center" }}>
              <button
                onClick={handleMethodAdd}
                style={addButtonStyle}
              >
                + Add Method
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  const renderStyleTab = () => (
    <div style={{ padding: 16 }}>
      <h3>Glyph Style</h3>
      <div>
        <label>Fill Color: </label>
        <input
          type="color"
          value={fill}
          onChange={e => handleStyleChange("fill", e.target.value)}
          style={{ marginLeft: 8 }}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <label>Stroke Color: </label>
        <input
          type="color"
          value={stroke}
          onChange={e => handleStyleChange("stroke", e.target.value)}
          style={{ marginLeft: 8 }}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <label>Stroke Width: </label>
        <input
          type="number"
          min={1}
          max={10}
          value={strokeWidth}
          onChange={e => handleStyleChange("strokeWidth", Number(e.target.value))}
          style={{ marginLeft: 8, width: 60 }}
        />
      </div>
      {renderConnectionProperties()}
    </div>
  );

  function renderConnectionProperties() {
    if (!line) return null;
    return (
      <div style={{ marginTop: 16 }}>
        <h3>Connection Properties</h3>
        <div>
          <label>From: </label>
          <span>{line.fromGlyphId} (port {line.fromPortId})</span>
        </div>
        <div style={{ marginTop: 8 }}>
          <label>To: </label>
          <span>{line.toGlyphId} (port {line.toPortId})</span>
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Line Id: </label>
          <span>{line.id}</span>
        </div>
        <label>Connector Type: </label>
        <select
          value={line.type || connectorType}
          onChange={e => {
            const value = e.target.value as ConnectorType;
            if (onUpdateConnectionType && line.id) {
              onUpdateConnectionType(line.id, value);
            } else {
              setConnectorType(value);
            }
          }}
          style={{ marginLeft: 8 }}
        >
          <option value="bezier">Curve (Bezier)</option>
          <option value="manhattan">Manhattan (Elbow)</option>
          <option value="line">Straight Line</option>
        </select>
      </div>
    );
  }

  const renderTextTab = () => (
    <div style={{ padding: 16 }}>
      <h3>Text Style</h3>
      <div>
        <label>Text Color: </label>
        <input
          type="color"
          value={textColor}
          onChange={e => handleTextStyleChange("textColor", e.target.value)}
          style={{ marginLeft: 8 }}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <label>Font Size: </label>
        <input
          type="number"
          min={8}
          max={72}
          value={fontSize}
          onChange={e => handleTextStyleChange("fontSize", Number(e.target.value))}
          style={{ marginLeft: 8, width: 60 }}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <label>Font Family: </label>
        <select
          value={fontFamily}
          onChange={e => handleTextStyleChange("fontFamily", e.target.value)}
          style={{ marginLeft: 8 }}
        >
          {FONT_FAMILIES.map(family => (
            <option key={family} value={family}>{family}</option>
          ))}
        </select>
      </div>
    </div>
  );

  // --- Render ---
  return (
    <div
      className="property-sheet"
      style={{
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: 0,
        minWidth: 320,
        boxShadow: "0 2px 12px 0 #0001",
        fontFamily: "Inter, Arial, sans-serif",
        color: "#222",
        margin: 8,
        overflow: "hidden"
      }}
    >
      <div style={{
        display: "flex",
        borderBottom: "1px solid #e5e7eb",
        background: "#f1f5f9"
      }}>
        <TabButton label="General" active={activeTab === "General"} onClick={() => setActiveTab("General")} />
        <TabButton label="Style" active={activeTab === "Style"} onClick={() => setActiveTab("Style")} />
        <TabButton label="Text" active={activeTab === "Text"} onClick={() => setActiveTab("Text")} />
        <button
          style={{ flex: 1, padding: 8, border: "none", background: "#fff" }}
          onClick={onClose}
        >
          x
        </button>
      </div>
      {activeTab === "General" && renderGeneralTab()}
      {activeTab === "Style" && renderStyleTab()}
      {activeTab === "Text" && renderTextTab()}

      {/* Attribute Dialog */}
      {attrDialogIdx !== null && attrDialogData && (
        <AttributeDialog
          data={attrDialogData}
          onChange={setAttrDialogData}
          onCancel={handleAttrDialogCancel}
          onSave={handleAttrDialogSave}
        />
      )}
      {/* Method Dialog */}
      {methodDialogIdx !== null && methodDialogData && (
        <MethodDialog
          data={methodDialogData}
          onChange={setMethodDialogData}
          onCancel={handleMethodDialogCancel}
          onSave={handleMethodDialogSave}
        />
      )}
    </div>
  );
};

// --- UI Helpers ---

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      style={{
        flex: 1,
        padding: 10,
        border: "none",
        background: active ? "#e0e7ef" : "#f1f5f9",
        color: active ? "#2563eb" : "#64748b",
        fontWeight: active ? 700 : 500,
        fontSize: 15,
        borderBottom: active ? "2px solid #2563eb" : "2px solid transparent",
        cursor: "pointer",
        transition: "background 0.15s"
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function AttributeDialog({
  data,
  onChange,
  onCancel,
  onSave
}: {
  data: UMLAttr;
  onChange: (d: UMLAttr) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div style={dialogStyle}>
      <h4>Edit Attribute</h4>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", fontWeight: 600 }}>Name</label>
        <input
          type="text"
          value={data.name}
          onChange={e => onChange({ ...data, name: e.target.value })}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <label style={{ display: "block", fontWeight: 600 }}>Type</label>
        <select
          value={data.type}
          onChange={e => onChange({ ...data, type: e.target.value })}
          style={{ width: "100%", marginBottom: 8 }}
        >
          <option value="">Select type...</option>
          <option value="String">String</option>
          <option value="Integer">Integer</option>
          <option value="Boolean">Boolean</option>
          <option value="self-defined">Self-Defined</option>
        </select>
        <label style={{ display: "block", fontWeight: 600 }}>Visibility</label>
        <select
          value={data.visibility}
          onChange={e => onChange({ ...data, visibility: e.target.value as any })}
          style={{ width: "100%" }}
        >
          <option value="public">public</option>
          <option value="private">private</option>
          <option value="protected">protected</option>
        </select>
      </div>
      <div style={{ textAlign: "right" }}>
        <button
          onClick={onCancel}
          style={dialogButtonStyle("#eee")}
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          style={dialogButtonStyle("#2563eb", "#fff")}
        >
          Save
        </button>
      </div>
    </div>
  );
}

function MethodDialog({
  data,
  onChange,
  onCancel,
  onSave
}: {
  data: UMLMethod;
  onChange: (d: UMLMethod) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div style={dialogStyle}>
      <h4>Edit Method</h4>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", fontWeight: 600 }}>Name</label>
        <input
          type="text"
          value={data.name}
          onChange={e => onChange({ ...data, name: e.target.value })}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <label style={{ display: "block", fontWeight: 600 }}>Return Type</label>
        <input
          type="text"
          value={data.returnType as string}
          onChange={e => onChange({ ...data, returnType: e.target.value })}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <label style={{ display: "block", fontWeight: 600 }}>Parameters</label>
        <input
          type="text"
          value={data.parameters?.map(param => `${param.name}:${param.type}`).join(', ') || ''}
          onChange={e => onChange({
            ...data,
            parameters: e.target.value.split(',').map(param => {
              const [name, type] = param.split(':').map(s => s.trim());
              return { name, type, visibility: "public" } as UMLAttr;
            })
          })}
          style={{ width: "100%", marginBottom: 8 }}
          placeholder="e.g. param1: String, param2: Integer"
        />
      </div>
      <div style={{ textAlign: "right" }}>
        <button
          onClick={onCancel}
          style={dialogButtonStyle("#eee")}
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          style={dialogButtonStyle("#2563eb", "#fff")}
        >
          Save
        </button>
      </div>
    </div>
  );
}

// --- Styles ---
const iconButtonStyle = (color: string): React.CSSProperties => ({
  color,
  border: "none",
  background: "none",
  cursor: "pointer",
  fontSize: "1em",
  margin: 0,
  padding: "0 4px"
});

const addButtonStyle: React.CSSProperties = {
  padding: "2px 10px",
  borderRadius: 4,
  background: "#e0e7ef",
  border: "none",
  cursor: "pointer",
  margin: 0,
  fontSize: "0.95em"
};

const dialogStyle: React.CSSProperties = {
  position: "fixed",
  left: "50%",
  top: "50%",
  transform: "translate(-50%,-50%)",
  background: "#fff",
  border: "1px solid #ccc",
  borderRadius: 8,
  boxShadow: "0 2px 16px #0002",
  padding: 24,
  zIndex: 1000,
  minWidth: 320,
};

const dialogButtonStyle = (bg: string, color?: string): React.CSSProperties => ({
  marginRight: bg === "#eee" ? 8 : 0,
  padding: "4px 12px",
  borderRadius: 4,
  border: "none",
  background: bg,
  color: color || "#222",
  cursor: "pointer"
});