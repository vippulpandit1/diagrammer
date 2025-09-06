import React, { useState, useEffect } from "react";
import { Glyph } from "./glyph/Glyph";

const TYPE_OPTIONS = [
  "rect", "circle", "multi",
  "and", "or", "not", "nand", "nor", "xor", "xnor",
  "uml-class", "uml-interface", "uml-abstract", "uml-enum", "uml-package","uml-association","uml-inheritance"
];

export const PropertySheet: React.FC<{
  glyph: Glyph;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Glyph>) => void;
}> = ({ glyph, onClose, onUpdate }) => {
  const [label, setLabel] = useState(glyph.label);
  const [type, setType] = useState(glyph.type);
  const [inputs, setInputs] = useState(glyph.inputs ?? 2);
  const [outputs, setOutputs] = useState(glyph.outputs ?? 1);
  const [attributes, setAttributes] = useState(glyph.attributes ?? []);


  useEffect(() => {
    setLabel(glyph.label);
    setType(glyph.type);
    setInputs(glyph.inputs ?? 2);
    setOutputs(glyph.outputs ?? 1);
    setAttributes(glyph.attributes ?? []);
  }, [glyph]);

  const handleAttrChange = (idx: number, value: string) => {
    const updated = [...attributes];
    updated[idx] = value;
    setAttributes(updated);
    onUpdate(glyph.id, { attributes: updated });
  };

  const handleAttrAdd = () => {
    const updated = [...attributes, ""];
    setAttributes(updated);
    onUpdate(glyph.id, { attributes: updated });
  };

  const handleAttrRemove = (idx: number) => {
    const updated = attributes.filter((_, i) => i !== idx);
    setAttributes(updated);
    onUpdate(glyph.id, { attributes: updated });
  };
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
  // Add more fields as needed
  const handleBlur = () => {
    if (label !== glyph.label) {
      onUpdate(glyph.id, { label });
    }
  };

  return (
    <div className="property-sheet">
      <button className="close-btn" onClick={onClose}>×</button>
      <h3>Properties</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ fontWeight: 600, padding: "6px 8px" }}>Label</td>
            <td style={{ padding: "6px 8px" }}>
              <input
                value={label}
                onChange={handleLabelChange}
                style={{ width: "100%" }}
              />
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
              <table style={{ width: "100%", borderCollapse: "collapse", borderSpacing: 0 }}>
                <tbody>
                  {attributes.map((attr, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: "1px 2px", width: "80%" }}>
                        <input
                          type="text"
                          value={attr}
                          onChange={e => handleAttrChange(idx, e.target.value)}
                          style={{ width: "100%", margin: 0, fontSize: "0.95em", padding: "2px 4px" }}
                          placeholder={`Attribute ${idx + 1}`}
                        />
                      </td>
                      <td style={{ padding: "1px 2px", width: "20%" }}>
                        <button
                          onClick={() => handleAttrRemove(idx)}
                          style={{
                            color: "#f87171",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            fontSize: "1.1em",
                            margin: 0,
                            padding: "0 4px"
                          }}
                          title="Remove"
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={2} style={{ padding: "2px 0", textAlign: "center" }}>
                      <button
                        onClick={handleAttrAdd}
                        style={{
                          padding: "2px 10px",
                          borderRadius: 4,
                          background: "#e0e7ef",
                          border: "none",
                          cursor: "pointer",
                          margin: 0,
                          fontSize: "0.95em"
                        }}
                      >
                        + Add Attribute
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};