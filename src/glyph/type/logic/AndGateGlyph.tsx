import React from "react";
export const AndGateGlyph: React.FC<{ width: number; height?: number }> = ({ width, height }) => {
  const h = height ?? width;
  const arcRadius = h / 2;
  const arcStartY = 0;
  const arcEndY = h;
  const arcStartX = width * 0.5;
  const arcEndX = width * 0.5;

  return (
    <g>
      {/* Left rectangle fills half the width and full height */}
      <rect
        x={0}
        y={0}
        width={width * 0.5}
        height={h}
        rx={width * 0.1}
        fill="#fff"
        stroke="#222"
        strokeWidth={2}
      />
      {/* Right arc fills the other half, matching height */}
      <path
        d={`
          M${arcStartX},${arcStartY}
          A${arcRadius},${arcRadius} 0 0 1 ${arcEndX},${arcEndY}
        `}
        fill="#fff"
        stroke="#222"
        strokeWidth={2}
      />
    </g>
  );
};