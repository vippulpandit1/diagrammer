import React from "react";
export const OrGateGlyph: React.FC<{ size: number }> = ({ size }) => (
  <g>
    <path d={`
      M${size * 0.1},${size * 0.2}
      Q${size * 0.4},${size * 0.5} ${size * 0.1},${size * 0.8}
      Q${size * 0.5},${size * 0.5} ${size * 0.9},${size * 0.5}
      Q${size * 0.5},${size * 0.5} ${size * 0.1},${size * 0.2}
    `}
    fill="#fff" stroke="#222" strokeWidth={2}/>
  </g>
);