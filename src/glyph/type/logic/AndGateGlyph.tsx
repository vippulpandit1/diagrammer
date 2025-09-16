import React from "react";
import type { Glyph } from "../../Glyph";
export const AndGateGlyph: React.FC<{ width: number; height?: number; glyph?: Glyph }> = ({ width, height, glyph }) => {
  const h = height ?? width;
  const arcRadius = h / 2;
  const arcStartY = 0;
  const arcEndY = h;
  const arcStartX = width * 0.5;
  const arcEndX = width * 0.5;
    // Use style from glyph.data or fallback
  const fill = glyph?.data?.fill || "#fff";
  const stroke = glyph?.data?.stroke || "#222";
  const strokeWidth = glyph?.data?.strokeWidth || 2;
  const textColor = glyph?.data?.textColor || "#222";
  const fontSize = glyph?.data?.fontSize || Math.round(h * 0.22);

  return (
    <g>
      {/* Left rectangle fills half the width and full height */}
      <rect
        x={0}
        y={0}
        width={width * 0.5}
        height={h}
        rx={width * 0.1}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      {/* Right arc fills the other half, matching height */}
      <path
        d={`
          M${arcStartX},${arcStartY}
          A${arcRadius},${arcRadius} 0 0 1 ${arcEndX},${arcEndY}
        `}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      {/* Optional: Gate label */}
      {glyph?.label && (
        <text
          x={width * 0.25}
          y={h * 0.55}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fill={textColor}
          fontFamily={glyph.data?.fontFamily || "Arial"}
          pointerEvents="none"
        >
          {glyph.label}
        </text>
      )}      
    </g>
  );
};