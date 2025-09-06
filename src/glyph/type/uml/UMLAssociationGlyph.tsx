import React from "react";
export const UMLAssociationGlyph: React.FC<{ size: number }> = ({ size }) => (
  <g>
    <line
      x1={size * 0.2}
      y1={size * 0.8}
      x2={size * 0.8}
      y2={size * 0.2}
      stroke="#222"
      strokeWidth={2}
      markerEnd=""
    />
  </g>
);