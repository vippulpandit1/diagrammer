import React from "react";
export const UMLInterfaceGlyph: React.FC<{ size: number }> = ({ size }) => (
  <g>
    <rect x={0} y={0} width={size} height={size} rx={6} fill="#e0f2fe" stroke="#222" strokeWidth={2}/>
    <line x1={0} y1={size * 0.3} x2={size} y2={size * 0.3} stroke="#222" strokeWidth={1}/>
    <line x1={0} y1={size * 0.6} x2={size} y2={size * 0.6} stroke="#222" strokeWidth={1}/>
    <text x={size/2} y={size*0.2} fontSize={size*0.16} fill="#222" textAnchor="middle" dominantBaseline="middle">&lt;&lt;interface&gt;&gt;</text>
  </g>
);