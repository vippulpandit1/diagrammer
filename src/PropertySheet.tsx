// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React, { useState, useEffect } from "react";
import { Glyph } from "./glyph/Glyph";
import type { UMLAttr, UMLVisibility, UMLDataType } from "./glyph/type/uml/UMLAttr";
import type { UMLMethod } from "./glyph/type/uml/UMLMethod";
import { Connection } from "./glyph/Connection";
import type { Page } from "./glyph/Page";
import { Port } from "./glyph/Port";
import { v4 as uuidv4 } from "uuid";

const TYPE_OPTIONS = [
  "rect", "circle", "multi",
  "and", "or", "not", "nand", "nor", "xor", "xnor",
  "uml-class", "uml-interface", "uml-abstract", "uml-enum", "uml-package", "uml-association", "uml-inheritance"
];

const FONT_FAMILIES = [
  "Arial", "Helvetica", "Times New Roman", "Courier New", "Georgia", "Verdana", "Tahoma", "Trebuchet MS", "Impact"
];

type ConnectorType = "bezier" | "manhattan" | "line";

const DATA_TYPES: UMLDataType[] = [
  "string", "number", "boolean", "date", "object", "array", "custom"
];

interface PropertySheetProps {
  glyph?: Glyph;
  connection?: Connection;
  onClose: () => void;
  onUpdateGlyph?: (id: string, updates: Partial<Glyph>) => void;
  onUpdateConnection?: (id: string, updates: Partial<Connection>) => void;
  connectorType?: ConnectorType;
  setConnectorType?: (type: ConnectorType) => void;
  pages?: Page[];
  connections?: Connection[];
//  onUpdateConnectionType?: (id: string, type: ConnectorType) => void;
}

export const PropertySheet: React.FC<PropertySheetProps> = ({
  glyph,
  connection,
  onClose,
  onUpdateGlyph,
  onUpdateConnection,
  pages = [],
  connections = [],
//  onUpdateConnectionType
})  => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<"General" | "Attributes" | "Methods">("General");

  // Safely initialize state from props
  const [label, setLabel] = useState(glyph?.label ?? connection?.label ?? "");
  const [connectorType, setConnectorType] = useState<ConnectorType>(
    (connection?.view?.connectionType as ConnectorType) || "line"
  );
  const [connectionColor, setConnectionColor] = useState(connection?.view?.color || "#000000");
  const [connectionThickness, setConnectionThickness] = useState(connection?.view?.thickness || 2);
  const [connectionDashed, setConnectionDashed] = useState(connection?.view?.dashed || false);

  const [inputs, setInputs] = useState(glyph?.inputs ?? 0);
  const [outputs, setOutputs] = useState(glyph?.outputs ?? 0);

  // UML-specific fields
  const [attributes, setAttributes] = useState<UMLAttr[]>(glyph?.attributes ?? []);
  const [methods, setMethods] = useState<UMLMethod[]>(glyph?.methods ?? []);
  const [newParamName, setNewParamName] = useState("");
  const [newParamType, setNewParamType] = useState<UMLDataType | string>("string");
  const [targetPageId, setTargetPageId] = useState(glyph?.data?.targetPageId ?? "");


  // Effect to update internal state when the selected glyph or connection changes
  useEffect(() => {
    setLabel(glyph?.label ?? connection?.label ?? "");
    setTargetPageId(glyph?.data?.targetPageId ?? "");
    setInputs(glyph?.inputs ?? 0);
    setOutputs(glyph?.outputs ?? 0);
    setAttributes(glyph?.attributes ?? []);
    setMethods(glyph?.methods ?? []);
    setConnectorType((connection?.view?.connectionType as ConnectorType) || "line");
    setConnectionColor(connection?.view?.color || "#000000");
    setConnectionThickness(connection?.view?.thickness || 2);
    setConnectionDashed(connection?.view?.dashed || false);
  }, [glyph, connection]);

  const handleSave = () => {
    if (glyph && onUpdateGlyph) {
      const updates: Partial<Glyph> = { label, inputs, outputs };

      // Keep existing ports, only add new ones if needed
      let ports = glyph.ports ? [...glyph.ports] : [];
      // Find ports that will be removed
      const removedInputPorts = ports.filter(p => p.type === "input").slice(inputs);
      const removedOutputPorts = ports.filter(p => p.type === "output").slice(outputs);
      // Check for connections using these ports
      const usedPortIds = [
        ...removedInputPorts.map(p => p.id),
        ...removedOutputPorts.map(p => p.id),
      ];
      const affectedConnections = connections.filter(
        conn => usedPortIds.includes(conn.fromPortId) || usedPortIds.includes(conn.toPortId)
      );
      if (affectedConnections.length > 0) {
        window.alert(
          `Warning: Removing ports will affect ${affectedConnections.length} connection(s).`
        );
        // Reset inputs/outputs to original values
        setInputs(glyph.inputs ?? 0);
        setOutputs(glyph.outputs ?? 0); 
        return;
        // Optionally, handle affected connections here
      }
      // Remove excess input ports if inputs decreased
      const inputPorts = ports.filter(p => p.type === "input").slice(0, inputs);
      // Remove excess output ports if outputs decreased
      const outputPorts = ports.filter(p => p.type === "output").slice(0, outputs);

      // Add missing input ports
      if (inputs > inputPorts.length) {
        inputPorts.push(
          ...Array.from({ length: inputs - inputPorts.length }, () => new Port(`input-${uuidv4()}`, "input"))
        );
      }
      // Add missing output ports
      if (outputs > outputPorts.length) {
        outputPorts.push(
          ...Array.from({ length: outputs - outputPorts.length }, () => new Port(`output-${uuidv4()}`, "output"))
        );
      }

      updates.ports = [...inputPorts, ...outputPorts];


      if (glyph.type === "uml-class") {
        updates.attributes = attributes;
        updates.methods = methods;
      } else if (glyph.type === "flow-off-page-connector") {
        updates.data = { ...glyph.data, targetPageId };
      }
      onUpdateGlyph(glyph.id, updates);
    } else if (connection && connection.id && onUpdateConnection) {
      // ...existing connection update logic...
    }
    window.alert("Properties saved successfully!");
    onClose();
  };

  // --- Render Functions for different selections ---

 // --- Renderers for UML class ---
  const renderAttributesTab = () => (
    <div style={{ padding: "8px" }}> {/* Add padding to the container */}
      {attributes.map((attr, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
            border: "1px solid #ddd",
            padding: "8px",
            borderRadius: "4px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {/* Visibility selector */}
          <select
            value={attr.visibility ?? "public"}
            onChange={e => {
              const newAttrs = [...attributes];
              newAttrs[idx] = { ...newAttrs[idx], visibility: e.target.value as UMLVisibility };
              setAttributes(newAttrs);
            }}
            style={{ marginRight: "8px", width: "48px", padding: "4px", border: "1px solid #ccc", borderRadius: "4px" }}
            title="Visibility"
          >
            <option value="public">+</option>
            <option value="private">-</option>
            <option value="protected">#</option>
          </select>
          {/* Attribute name */}
          <input
            style={{ flex: 1, marginRight: "8px", padding: "4px", border: "1px solid #ccc", borderRadius: "4px" }}
            value={attr.name}
            placeholder="Attribute"
            onChange={e => {
              const newAttrs = [...attributes];
              newAttrs[idx] = { ...newAttrs[idx], name: e.target.value };
              setAttributes(newAttrs);
            }}
          />
          {/* Datatype dropdown */}
          <select
            value={attr.dataType ?? "string"}
            onChange={e => {
              const newAttrs = [...attributes];
              newAttrs[idx] = { ...newAttrs[idx], dataType: e.target.value };
              setAttributes(newAttrs);
            }}
            style={{ marginRight: "8px", width: "90px", padding: "4px", border: "1px solid #ccc", borderRadius: "4px" }}
            title="Datatype"
          >
            {DATA_TYPES.map(dt => (
              <option key={dt} value={dt}>{dt}</option>
            ))}
          </select>
          <button
            onClick={() => setAttributes(attributes.filter((_, i) => i !== idx))}
            title="Remove"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#d32f2f" }}
          >
            ×
          </button>
        </div>
      ))}
      <button
        style={{
          marginTop: "12px",
          background: "#2196f3",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
        }}
        onClick={() => setAttributes([...attributes, { name: "", visibility: "public", dataType: "string", type: "attribute" }])}
      >
        Add Attribute
      </button>
    </div>
  );

  const renderMethodsTab = () => {

    const handleAddParameter = (methodIndex: number) => {
      const newMethods = [...methods];
      if (!newMethods[methodIndex].parameters) {
        newMethods[methodIndex].parameters = [];
      }
      newMethods[methodIndex].parameters!.push({ name: newParamName, type: newParamType });
      setMethods(newMethods);
      setNewParamName("");
      setNewParamType("string");
    };
    return (
      <div style={{ padding: "8px" }}> {/* Add padding to the container */}
        {methods.map((method, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "12px",
              border: "1px solid #ddd",
              padding: "8px",
              borderRadius: "4px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
              {/* Visibility selector */}
              <select
                value={method.visibility ?? "public"}
                onChange={e => {
                  const newMethods = [...methods];
                  newMethods[idx] = { ...newMethods[idx], visibility: e.target.value as UMLVisibility };
                  setMethods(newMethods);
                }}
                style={{ marginRight: "8px", width: "48px", padding: "4px", border: "1px solid #ccc", borderRadius: "4px" }}
                title="Visibility"
              >
                <option value="public">+</option>
                <option value="private">-</option>
                <option value="protected">#</option>
              </select>
              {/* Method name */}
              <input
                style={{ flex: 1, marginRight: "8px", padding: "4px", border: "1px solid #ccc", borderRadius: "4px" }}
                value={method.name}
                placeholder="Method Name"
                onChange={e => {
                  const newMethods = [...methods];
                  newMethods[idx] = { ...newMethods[idx], name: e.target.value };
                  setMethods(newMethods);
                }}
              />
              {/* Return type */}
              <select
                value={method.returnType ?? "void"}
                onChange={e => {
                  const newMethods = [...methods];
                  newMethods[idx] = { ...newMethods[idx], returnType: e.target.value };
                  setMethods(newMethods);
                }}
                style={{ marginRight: "8px", width: "90px", padding: "4px", border: "1px solid #ccc", borderRadius: "4px" }}
                title="Return Type"
              >
                <option value="void">void</option>
                {DATA_TYPES.map(dt => (
                  <option key={dt} value={dt}>{dt}</option>
                ))}
              </select>
              <button
                onClick={() => setMethods(methods.filter((_, i) => i !== idx))}
                title="Remove Method"
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#d32f2f" }}
              >
                ×
              </button>
            </div>

            {/* Parameters */}
            <div style={{ marginLeft: "12px" }}>
              {method.parameters?.map((param, paramIdx) => (
                <div
                  key={paramIdx}
                  style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}
                >
                  <input
                    style={{ width: "100px", marginRight: "8px", padding: "4px", border: "1px solid #ccc", borderRadius: "4px" }}
                    value={param.name}
                    placeholder="Parameter Name"
                    onChange={e => {
                      const newMethods = [...methods];
                      newMethods[idx].parameters![paramIdx].name = e.target.value;
                      setMethods(newMethods);
                    }}
                  />
                  <select
                    value={param.type}
                    onChange={e => {
                      const newMethods = [...methods];
                      newMethods[idx].parameters![paramIdx].type = e.target.value;
                      setMethods(newMethods);
                    }}
                    style={{ marginRight: "8px", width: "90px", padding: "4px", border: "1px solid #ccc", borderRadius: "4px" }}
                    title="Parameter Type"
                  >
                    {DATA_TYPES.map(dt => (
                      <option key={dt} value={dt}>{dt}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      const newMethods = [...methods];
                      newMethods[idx].parameters = newMethods[idx].parameters!.filter((_, i) => i !== paramIdx);
                      setMethods(newMethods);
                    }}
                    title="Remove Parameter"
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#d32f2f" }}
                  >
                    x
                  </button>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  style={{ width: "100px", marginRight: "8px", padding: "4px", border: "1px solid #ccc", borderRadius: "4px" }}
                  placeholder="Parameter Name"
                  value={newParamName}
                  onChange={e => setNewParamName(e.target.value)}
                />
                <select
                  value={newParamType}
                  onChange={e => setNewParamType(e.target.value as UMLDataType)}
                  style={{ marginRight: "8px", width: "90px", padding: "4px", border: "1px solid #ccc", borderRadius: "4px" }}
                  title="Parameter Type"
                >
                  {DATA_TYPES.map(dt => (
                    <option key={dt} value={dt}>{dt}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleAddParameter(idx)}
                  disabled={!newParamName}
                  style={{
                    background: "#4caf50",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Add Parameter
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          style={{
            marginTop: "12px",
            background: "#2196f3",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
          onClick={() => setMethods([...methods, { name: "", visibility: "public" }])}
        >
          Add Method
        </button>
      </div>
    );
  };
  

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
    <div style={{ padding: "8px" }}> {/* Add padding to the container */}
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold", color: "#333" }}>Label</label>
        <input
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          value={label}
          onChange={e => setLabel(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold", color: "#333" }}>Inputs</label>
        <input
          type="number"
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          value={inputs}
          onChange={e => setInputs(parseInt(e.target.value, 10) || 0)}
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold", color: "#333" }}>Outputs</label>
        <input
          type="number"
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          value={outputs}
          onChange={e => setOutputs(parseInt(e.target.value, 10) || 0)}
        />
      </div>
      {/* Add page dropdown for flow-off-page-connector */}
      {glyph?.type === "flow-off-page-connector" && pages.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold", color: "#333" }}>Connects to Page</label>
          <select
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
            value={targetPageId}
            onChange={e => setTargetPageId(e.target.value)}
          >
            <option value="">-- Select Page --</option>
            {pages.map(page => (
              <option key={page.id} value={page.id}>
                {page.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );

 const renderConnectionProperties = () => (
    <div style={{ padding: "8px" }}>
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold", color: "#333" }}>Label</label>
        <input
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          value={label}
          onChange={e => setLabel(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold", color: "#333" }}>Connector Type</label>
        <select
          value={connectorType}
          onChange={e => setConnectorType(e.target.value as ConnectorType)}
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        >
          <option value="bezier">Bezier</option>
          <option value="manhattan">Manhattan</option>
          <option value="line">Line</option>
        </select>
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold", color: "#333" }}>Connection Color</label>
        <input
          type="color"
          value={connectionColor}
          onChange={e => setConnectionColor(e.target.value)}
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold", color: "#333" }}>Connection Thickness</label>
        <input
          type="number"
          value={connectionThickness}
          onChange={e => setConnectionThickness(Number(e.target.value))}
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold", color: "#333" }}>Connection Dashed</label>
        <input
          type="checkbox"
          checked={connectionDashed}
          onChange={e => setConnectionDashed(e.target.checked)}
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
      </div>
    </div>

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



