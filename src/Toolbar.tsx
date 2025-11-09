// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React, { useState } from 'react';
import { Stencil } from "./Stencil";

const STENCILS = [
  { key: "basic", label: "Basic" },
  { key: "logic", label: "Logic Gates" },
  { key: "uml", label: "UML" }, 
  { key: "debug", label: "Debug" },
  { key: "network", label: "Network" },
  { key: "flowchart", label: "Flowchart" }
];
// Add connection types for UML
const UML_CONNECTION_TYPES = ["uml-association", "uml-inheritance"];

export const Toolbar: React.FC<{
  stencilType: string;
  setStencilType: (type: string) => void;
  connectionType: string;
  setConnectionType: (type: string) => void;
}> = ({ stencilType, setStencilType, connectionType, setConnectionType })  => {
  const [selectedStencil, setSelectedStencil] = useState<"basic" | "logic" | "uml">("basic");

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
          // https://www.visual-paradigm.com/guide/uml-unified-modeling-language/uml-class-diagram-tutorial/
          <option value="association">Association</option>
          <option value="inheritance">Inheritance</option>
          <option value="realization">Realization</option>
          <option value="dependency">Dependency</option>
          <option value="aggregation">Aggregation</option>
          <option value="composition">Composition</option>
        </select>
      </div>
    )}`
      <Stencil stencilType={selectedStencil} />
    </div>
  );
};