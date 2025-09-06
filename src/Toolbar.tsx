import React, { useState } from 'react';
import { Stencil } from "./Stencil";

const STENCILS = [
  { key: "basic", label: "Basic" },
  { key: "logic", label: "Logic Gates" },
  { key: "uml", label: "UML" }, // Add this line

];
// Add connection types for UML
const UML_CONNECTION_TYPES = ["uml-association", "uml-inheritance"];

export const Toolbar: React.FC<{
  stencilType: string;
  setStencilType: (type: string) => void;
  connectionType: string;
  setConnectionType: (type: string) => void;
}> = ({ stencilType, setStencilType, connectionType, setConnectionType })  => {
  const [selectedStencil, setSelectedStencil] = useState<"basic" | "logic" | "uml">("uml");

  return (
    <div className="workspace-toolbar">
      <div style={{ marginBottom: 8 }}>
        <select
          value={selectedStencil}
          onChange={e => setSelectedStencil(e.target.value as "basic" | "logic"| "uml")}
          style={{ width: "100%", padding: 4, borderRadius: 4 }}
        >
          {STENCILS.map(s => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </div>
      {/* Only show connection type selector for UML stencil */}
`    {selectedStencil === "uml" && (
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 12, fontWeight: 600 }}>Connection:</label>
        <select
          value={connectionType}
          onChange={e => setConnectionType(e.target.value)}
          style={{ width: "100%", marginTop: 4 }}
        >
          <option value="association">Association</option>
          <option value="inheritance">Inheritance</option>
        </select>
      </div>
    )}`
      <Stencil stencilType={selectedStencil} />
    </div>
  );
};