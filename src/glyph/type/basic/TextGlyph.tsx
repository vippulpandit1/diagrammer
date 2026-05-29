import React from "react";

interface TextGlyphProps {
  label?: string;
  fullLabel?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
}

export const TextGlyph: React.FC<TextGlyphProps> = ({
  label = "Text",
  fullLabel,
  width = 100,
  height = 40,
  fontSize,
  fontFamily = "Arial",
  textColor = "#222"
}) => {
  // If no explicit fontSize, fit the text to the current box dimensions
  const effectiveFontSize = fontSize ?? Math.max(
    8,
    Math.floor(Math.min(
      height * 0.5,
      label.length > 0 ? width / (label.length * 0.55) : width
    ))
  );
  return (
    <g>
      <title>{fullLabel ?? label}</title>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={6}
        fill="#fff"
        stroke="#bbb"
      />
      <text
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={effectiveFontSize}
        fontFamily={fontFamily}
        fill={textColor}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {label}
      </text>
    </g>
  );
};