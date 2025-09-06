import React from "react";
export const CircleGlyph: React.FC<{ size: number }> = ({ size }) => (
  <circle
    cx={size / 2}
    cy={size / 2}
    r={size / 2}
    fill="#fbbf24"
    stroke="#222"
    strokeWidth={2}
  />
);