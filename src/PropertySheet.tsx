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

  const handleAttributesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.split("\n").map(s => s.trim()).filter(Boolean);
    setAttributes(value);
    onUpdate(glyph.id, { attributes: value });
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
            <td style={{ fontWeight: 600, padding: "6px 8px" }}>Attributes</td>
            <td style={{ padding: "6px 8px" }}>
                <textarea
                value={attributes.join("\n")}
                onChange={e => {
                    const value = e.target.value.split("\n").map(s => s.trim()).filter(Boolean);
                    setAttributes(value);
                    onUpdate(glyph.id, { attributes: value });
                }}
                rows={4}
                style={{ width: "100%", resize: "vertical" }}
                placeholder="Enter one attribute per line"
                />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};