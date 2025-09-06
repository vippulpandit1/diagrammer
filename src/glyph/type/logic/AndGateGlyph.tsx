import React from "react";
export const AndGateGlyph: React.FC<{ size: number }> = ({ size }) => (
  <g>
    <rect x={0} y={size * 0.2} width={size * 0.5} height={size * 0.6} rx={size * 0.1} fill="#fff" stroke="#222" strokeWidth={2}/>
    <path d={`M${size * 0.5},${size * 0.2} 
               A${size * 0.3},${size * 0.3} 0 0 1 ${size * 0.5},${size * 0.8}`} 
          fill="#fff" stroke="#222" strokeWidth={2}/>
  </g>
);