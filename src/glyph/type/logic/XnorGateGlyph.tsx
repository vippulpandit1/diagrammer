import React from "react";
export const XnorGateGlyph: React.FC<{ size: number }> = ({ size }) => (
  <g>
    {/* XOR shape */}
    <path d={`
      M${size * 0.13},${size * 0.2}
      Q${size * 0.43},${size * 0.5} ${size * 0.13},${size * 0.8}
      Q${size * 0.53},${size * 0.5} ${size * 0.93},${size * 0.5}
      Q${size * 0.53},${size * 0.5} ${size * 0.13},${size * 0.2}
    `}
    fill="#fff" stroke="#222" strokeWidth={2}/>
    <path d={`
      M${size * 0.07},${size * 0.2}
      Q${size * 0.37},${size * 0.5} ${size * 0.07},${size * 0.8}
    `}
    fill="none" stroke="#222" strokeWidth={2}/>
    {/* NOT circle */}
    <circle cx={size * 0.8} cy={size / 2} r={size * 0.08} fill="#fff" stroke="#222" strokeWidth={2}/>
  </g>
);