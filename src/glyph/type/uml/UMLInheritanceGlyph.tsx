import React from "react";
export const UMLInheritanceGlyph: React.FC<{ size: number }> = ({ size }) => (
  <g>
    {/* Line */}
    <line
      x1={size * 0.2}
      y1={size * 0.8}
      x2={size * 0.8}
      y2={size * 0.2}
      stroke="#222"
      strokeWidth={2}
      markerEnd="url(#inheritance-arrow)"
    />
    {/* Hollow triangle arrowhead */}
    <defs>
      <marker
        id="inheritance-arrow"
        markerWidth="12"
        markerHeight="12"
        refX="10"
        refY="6"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <polygon
          points="2,2 10,6 2,10 2,2"
          fill="#fff"
          stroke="#222"
          strokeWidth={1.5}
        />
      </marker>
    </defs>
  </g>
);