import React from "react";

interface PngGlyphProps {
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl: string; // URL or base64 string for the PNG
  selected?: boolean;
}

const PngGlyph: React.FC<PngGlyphProps> = ({
  x,
  y,
  width,
  height,
  imageUrl,
  selected = false,
}) => {
  return (
    <g>
      {/* Render the rectangle */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#f3f4f6"
        stroke={selected ? "#2563eb" : "#d1d5db"}
        strokeWidth={2}
        rx={6}
      />
      {/* Render the PNG image */}
      <image
        href={imageUrl}
        x={x + width * 0.1} // Center the image
        y={y + height * 0.1}
        width={width * 0.8}
        height={height * 0.8}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
};

export default PngGlyph;