import React from "react";
export const RectGlyph: React.FC<{ width: number; height: number }> = ({ width, height }) => (
  <rect
    x={0}
    y={0}
    width={width}
    height={height}
    rx={8}
    fill="#38bdf8"
    stroke="#222"
    strokeWidth={2}
  />
);