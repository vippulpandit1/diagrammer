import React from "react";
export const MultiPortGlyph: React.FC<{ size: number }> = ({ size }) => (
  <rect
    x={0}
    y={0}
    width={size}
    height={size}
    rx={10}
    fill="#a7f3d0"
    stroke="#222"
    strokeWidth={2}
  />
);