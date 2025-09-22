import React from "react";

interface TextGlyphProps {
  label?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
}

export const TextGlyph: React.FC<TextGlyphProps> = ({
  label = "Text",
  width = 100,
  height = 40,
  fontSize = 20,
  fontFamily = "Arial",
  textColor = "#222"
}) => {
  return (
    <g>
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
        fontSize={fontSize}
        fontFamily={fontFamily}
        fill={textColor}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {label}
      </text>
    </g>
  );
};