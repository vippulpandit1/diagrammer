import React from "react";
export const NotGateGlyph: React.FC<{ size: number }> = ({ size }) => (
  <g>
    <polygon
      points={`
        ${size * 0.2},${size * 0.2}
        ${size * 0.2},${size * 0.8}
        ${size * 0.7},${size * 0.5}
      `}
      fill="#fff"
      stroke="#222"
      strokeWidth={2}
    />
    <circle
      cx={size * 0.8}
      cy={size * 0.5}
      r={size * 0.08}
      fill="#fff"
      stroke="#222"
      strokeWidth={2}
    />
  </g>
);