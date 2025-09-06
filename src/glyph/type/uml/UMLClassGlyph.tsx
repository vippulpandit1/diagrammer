import React from "react";
export const UMLClassGlyph: React.FC<{ size: number; height?: number; label?: string; orinLabel?: string; 
            isTruncated?: boolean; attributes?: string[] }> = ({ size, height = size, label, orinLabel, isTruncated, attributes }) => (

   <g>
    <rect x={0} y={0} width={size} height={height} rx={6} fill="#fff" stroke="#222" strokeWidth={2}/>
    <line x1={0} y1={height * 0.3} x2={size} y2={height * 0.3} stroke="#222" strokeWidth={1}/>
    <line x1={0} y1={height * 0.6} x2={size} y2={height * 0.6} stroke="#222" strokeWidth={1}/>
    {/* Class name */}
    {label && (
      <text
        x={size / 2}
        y={height * 0.15}
        fontSize={size * 0.18}
        fill="#222"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ userSelect: "none", pointerEvents: "auto" }}
      >
        {label}
        {isTruncated && (
            <title>{orinLabel}</title>
        )}
      </text>
    )}
    {/* Attributes */}
    {attributes && attributes.map((attr, i) => (
      <text
        key={i}
        x={size * 0.05}
        y={height * 0.35 + i * (height * 0.13)}
        fontSize={size * 0.13}
        fill="#222"
        textAnchor="start"
        dominantBaseline="hanging"
        style={{ userSelect: "none", pointerEvents: "none" }}
      >
        {attr}
      </text>
    ))}
  </g>
);