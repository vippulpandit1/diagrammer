import React from "react";
export const CircleGlyph: React.FC<{ size: number; fillColor?: string; strokeColor?: string }> = ({
  size,
  fillColor,
  strokeColor,
}) => (
  <circle
    cx={size / 2}
    cy={size / 2}
    r={size / 2}
    fill={fillColor && fillColor !== "none" ? fillColor : fillColor === "none" ? "transparent" : "#fbbf24"}
    stroke={strokeColor && strokeColor !== "none" ? strokeColor : strokeColor === "none" ? "transparent" : "#222"}
    strokeWidth={2}
  />
);