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
  const [activeTab, setActiveTab] = useState<"General" | "Attributes" | "Methods">("General");

  // Safely initialize state from props
  const [label, setLabel] = useState(glyph?.label ?? connection?.label ?? "");
  const [inputs, setInputs] = useState(glyph?.inputs ?? 0);
  const [outputs, setOutputs] = useState(glyph?.outputs ?? 0);

  // UML-specific fields
  const [attributes, setAttributes] = useState<UMLAttr[]>(glyph?.attributes ?? []);
  const [methods, setMethods] = useState<UMLMethod[]>(glyph?.methods ?? []);


  // Effect to update internal state when the selected glyph or connection changes
  useEffect(() => {
    setLabel(glyph?.label ?? connection?.label ?? "");
    setInputs(glyph?.inputs ?? 0);
    setOutputs(glyph?.outputs ?? 0);
    setAttributes(glyph?.attributes ?? []);
    setMethods(glyph?.methods ?? []);
  }, [glyph, connection]);

  const handleSave = () => {
    if (glyph && onUpdateGlyph) {
      const updates: Partial<Glyph> = { label, inputs, outputs };
      if (glyph.type === "uml-class") {
        updates.attributes = attributes;
        updates.methods = methods;
        onUpdateGlyph(glyph.id, { label, inputs, outputs, attributes, methods });
      } else {
        onUpdateGlyph(glyph.id, updates);
      }
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

 // --- Renderers for UML class ---
  const renderAttributesTab = () => (
    <div>
      <div>
        {attributes.map((attr, idx) => (
          <div key={idx} style={{ display: "flex", marginBottom: 4 }}>
            <input
              style={{ flex: 1 }}
              value={attr.name}
              placeholder="Attribute"
              onChange={e => {
                const newAttrs = [...attributes];
                newAttrs[idx] = { ...newAttrs[idx], name: e.target.value };
                setAttributes(newAttrs);
              }}
            />
            <button
              style={{ marginLeft: 4 }}
              onClick={() => setAttributes(attributes.filter((_, i) => i !== idx))}
              title="Remove"
            >×</button>
          </div>
        ))}
      </div>
      <button
        style={{ marginTop: 6 }}
        onClick={() => setAttributes([...attributes, { name: "", type: "string", visibility: "public" }])}
      >Add Attribute</button>
    </div>
  );

  const renderMethodsTab = () => (
    <div>
      <div>
        {methods.map((method, idx) => (
          <div key={idx} style={{ display: "flex", marginBottom: 4 }}>
            <input
              style={{ flex: 1 }}
              value={method.name}
              placeholder="Method"
              onChange={e => {
                const newMethods = [...methods];
                newMethods[idx] = { ...newMethods[idx], name: e.target.value };
                setMethods(newMethods);
              }}
            />
            <button
              style={{ marginLeft: 4 }}
              onClick={() => setMethods(methods.filter((_, i) => i !== idx))}
              title="Remove"
            >×</button>
          </div>
        ))}
      </div>
      <button
        style={{ marginTop: 6 }}
        onClick={() => setMethods([...methods, { name: "", returnType: "void", visibility: "public" }])}
      >Add Method</button>
    </div>
  );

  const renderTabs = () => (
    <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", marginBottom: 8 }}>
      {["General", "Attributes", "Methods"].map(tab => (
        <button
          key={tab}
          style={{
            flex: 1,
            padding: "8px 0",
            background: activeTab === tab ? "#e0e7ef" : "transparent",
            border: "none",
            borderBottom: activeTab === tab ? "2px solid #2563eb" : "2px solid transparent",
            color: activeTab === tab ? "#2563eb" : "#64748b",
            fontWeight: activeTab === tab ? 700 : 500,
            fontSize: 15,
            cursor: "pointer"
          }}
          onClick={() => setActiveTab(tab as any)}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  const renderGeneralTab = () => (
    <>
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
          <select value={connectorType} onChange={
                  e => connection?.id && onUpdateConnectionType 
                    && onUpdateConnectionType(connection.id, e.target.value as ConnectorType)
          }>
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
  // --- Main Render ---
  if (!glyph && !connection) {
    return (
      <div className="property-sheet">
        <div style={{ padding: "20px", color: "#64748b", textAlign: "center" }}>
          <p>Nothing selected</p>
          <small>Click on a shape or a line to see its properties.</small>
        </div>
      </div>
    );
  }
  if (connection && !glyph) {
    return (
      <div className="property-sheet">
        <div className="property-sheet-header">
          <h3>Connection Properties</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="property-sheet-content">
          {renderConnectionProperties()}
        </div>
        <div className="property-sheet-footer">
          <button onClick={handleSave} className="save-btn">Apply</button>
        </div>
      </div>
    );
  }


  return (
    <div className="property-sheet">
      <div className="property-sheet-header">
        <h3>Properties</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      {glyph?.type === "uml-class" ? (
        <>
          {renderTabs()}
          <div className="property-sheet-content" style={{ minHeight: 120 }}>
            {activeTab === "General" && renderGeneralTab()}
            {activeTab === "Attributes" && renderAttributesTab()}
            {activeTab === "Methods" && renderMethodsTab()}
          </div>
        </>
      ) : (
        glyph ? (
          <div className="property-sheet-content" style={{ minHeight: 120 }}>
            {renderGeneralTab()}
          </div>
        ) : renderEmptyState()
      )}

      {(glyph || connection) && (
        <div className="property-sheet-footer">
          <button onClick={handleSave} className="save-btn">Apply</button>
        </div>
      )}
    </div>
  );
};