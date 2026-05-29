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
  const sourceText = fullLabel ?? label;

  // Font size: explicit value or derived from box height
  const effectiveFontSize = fontSize ?? Math.max(8, Math.floor(height * 0.5));

  // How many characters fit given the current width at this font size
  const charWidth = effectiveFontSize * 0.55;
  const maxChars = Math.max(1, Math.floor(width / charWidth));

  const displayText =
    sourceText.length <= maxChars
      ? sourceText
      : sourceText.slice(0, Math.max(1, maxChars - 3)) + "...";
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
        {displayText}
      </text>
    </g>
  );
};