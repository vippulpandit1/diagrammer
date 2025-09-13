import React from "react";
export const OrGateGlyph: React.FC<{ width: number; height?: number }> = ({ width, height }) => {
  const h = height ?? width;
  return (
    <g>
      <path
        d={`
          M${width * 0.1},${h * 0.2}
          Q${width * 0.4},${h * 0.5} ${width * 0.1},${h * 0.8}
          Q${width * 0.5},${h * 0.5} ${width * 0.9},${h * 0.5}
          Q${width * 0.5},${h * 0.5} ${width * 0.1},${h * 0.2}
        `}
        fill="#fff"
        stroke="#222"
        strokeWidth={2}
      />
    </g>
  );
};