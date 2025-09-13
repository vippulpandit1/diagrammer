import React from "react";
export const XorGateGlyph: React.FC<{ width: number; height?: number }> = ({ width, height }) => {
  const h = height ?? width;
  return (
    <g>
      {/* XOR = OR with extra curve */}
      <path
        d={`
          M${width * 0.13},${h * 0.2}
          Q${width * 0.43},${h * 0.5} ${width * 0.13},${h * 0.8}
          Q${width * 0.53},${h * 0.5} ${width * 0.93},${h * 0.5}
          Q${width * 0.53},${h * 0.5} ${width * 0.13},${h * 0.2}
        `}
        fill="#fff"
        stroke="#222"
        strokeWidth={2}
      />
      <path
        d={`
          M${width * 0.07},${h * 0.2}
          Q${width * 0.37},${h * 0.5} ${width * 0.07},${h * 0.8}
        `}
        fill="none"
        stroke="#222"
        strokeWidth={2}
      />
    </g>
  );
};