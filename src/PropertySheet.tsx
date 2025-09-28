// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React, { useState, useEffect } from "react";
import { Glyph } from "./glyph/Glyph";
import type { UMLAttr } from "./glyph/type/uml/UMLAttr";
import type { UMLMethod } from "./glyph/type/uml/UMLMethod";
import { Connection } from "./glyph/Connection";

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
  glyph?: Glyph;
  connection?: Connection;
  onClose: () => void;
  onUpdateGlyph?: (id: string, updates: Partial<Glyph>) => void;
  onUpdateConnection?: (id: string, updates: Partial<Connection>) => void;
  connectorType?: ConnectorType;
  setConnectorType?: (type: ConnectorType) => void;
  onUpdateConnectionType?: (id: string, type: ConnectorType) => void;
}

export const PropertySheet: React.FC<PropertySheetProps> = ({
  glyph,
  connection,
  onClose,
  onUpdateGlyph,
  onUpdateConnection,
  connectorType,
  setConnectorType,
  onUpdateConnectionType
})  => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<"Style" | "Text" | "General">("General");

  // Safely initialize state from props
  const [label, setLabel] = useState(glyph?.label ?? connection?.label ?? "");
  const [inputs, setInputs] = useState(glyph?.inputs ?? 0);
  const [outputs, setOutputs] = useState(glyph?.outputs ?? 0);

  // Effect to update internal state when the selected glyph or connection changes
  useEffect(() => {
    if (glyph) {
      setLabel(glyph.label ?? "");
      setInputs(glyph.inputs ?? 0);
      setOutputs(glyph.outputs ?? 0);
    } else if (connection) {
      setLabel(connection.label ?? "");
    } else {
      // Reset when nothing is selected
      setLabel("");
    }
  }, [glyph, connection]);

  const handleSave = () => {
    if (glyph && onUpdateGlyph) {
      onUpdateGlyph(glyph.id, { label, inputs, outputs });
    } else if (connection && onUpdateConnection) {
      if (connection.id) {
        onUpdateConnection(connection.id, { label });
      }
    }
    
    // Show an alert to confirm the save
    window.alert("Properties saved successfully!");

    onClose(); // Close after saving
  };

  // --- Render Functions for different selections ---

  const renderGlyphProperties = () => (
    <>
      {/* General Tab Content */}
      <div className="property-row">
        <label>Label</label>
        <input value={label} onChange={e => setLabel(e.target.value)} />
      </div>
      <div className="property-row">
        <label>Inputs</label>
        <input type="number" value={inputs} onChange={e => setInputs(parseInt(e.target.value, 10) || 0)} />
      </div>
      <div className="property-row">
        <label>Outputs</label>
        <input type="number" value={outputs} onChange={e => setOutputs(parseInt(e.target.value, 10) || 0)} />
      </div>
    </>
  );

  const renderConnectionProperties = () => (
    <>
      {/* General Tab Content */}
      <div className="property-row">
        <label>Label</label>
        <input value={label} onChange={e => setLabel(e.target.value)} />
      </div>
      {connectorType && setConnectorType && (
        <div className="property-row">
          <label>Connector Type</label>
          <select value={connectorType} onChange={e => connection?.id && onUpdateConnectionType && onUpdateConnectionType(connection.id, e.target.value as ConnectorType)}>
            <option value="bezier">Bezier</option>
            <option value="manhattan">Manhattan</option>
            <option value="line">Line</option>
          </select>
        </div>
      )}
    </>
  );

  const renderEmptyState = () => (
    <div style={{ padding: "20px", color: "#64748b", textAlign: "center" }}>
      <p>Nothing selected</p>
      <small>Click on a shape or a line to see its properties.</small>
    </div>
  );

  return (
    <div className="property-sheet">
      <div className="property-sheet-header">
        <h3>Properties</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      <div className="property-sheet-content">
        {glyph ? renderGlyphProperties() : connection ? renderConnectionProperties() : renderEmptyState()}
      </div>
      {(glyph || connection) && (
        <div className="property-sheet-footer">
          <button onClick={handleSave} className="save-btn">Apply</button>
        </div>
      )}
    </div>
  );
};