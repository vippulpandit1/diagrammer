import React from "react";
export const RectGlyph: React.FC<{ size: number }> = ({ size }) => (
  <rect
    x={0}
    y={0}
    width={size}
    height={size}
    rx={8}
    fill="#38bdf8"
    stroke="#222"
    strokeWidth={2}
  />
);