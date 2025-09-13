import React from "react";
export const NotGateGlyph: React.FC<{ width: number; height?: number }> = ({ width, height }) => {
  const h = height ?? width;
  return (
    <g>
      <polygon
        points={`
          ${width * 0.2},${h * 0.2}
          ${width * 0.2},${h * 0.8}
          ${width * 0.7},${h * 0.5}
        `}
        fill="#fff"
        stroke="#222"
        strokeWidth={2}
      />
      <circle
        cx={width * 0.8}
        cy={h * 0.5}
        r={Math.min(width, h) * 0.08}
        fill="#fff"
        stroke="#222"
        strokeWidth={2}
      />
    </g>
  );
};