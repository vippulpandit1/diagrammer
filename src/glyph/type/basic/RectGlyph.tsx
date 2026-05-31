import React from "react";
export const RectGlyph: React.FC<{ width: number; height: number; fillColor?: string; strokeColor?: string }> = ({
  width,
  height,
  fillColor,
  strokeColor,
}) => (
  <rect
    x={0}
    y={0}
    width={width}
    height={height}
    rx={8}
    fill={fillColor && fillColor !== "none" ? fillColor : fillColor === "none" ? "transparent" : "#38bdf8"}
    stroke={strokeColor && strokeColor !== "none" ? strokeColor : strokeColor === "none" ? "transparent" : "#222"}
    strokeWidth={2}
  />
);