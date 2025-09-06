import React from "react";
export const NorGateGlyph: React.FC<{ size: number }> = ({ size }) => (
  <g>
    {/* OR shape */}
    <path d={`
      M${size * 0.1},${size * 0.2}
      Q${size * 0.4},${size * 0.5} ${size * 0.1},${size * 0.8}
      Q${size * 0.5},${size * 0.5} ${size * 0.9},${size * 0.5}
      Q${size * 0.5},${size * 0.5} ${size * 0.1},${size * 0.2}
    `}
    fill="#fff" stroke="#222" strokeWidth={2}/>
    {/* NOT circle */}
    <circle cx={size * 0.8} cy={size / 2} r={size * 0.08} fill="#fff" stroke="#222" strokeWidth={2}/>
  </g>
);