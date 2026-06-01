import React from "react";

type Props = { width: number; height: number };
const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;
const sm = (n: number, w: number, h: number) => (Math.min(w, h) / 40) * n;

export const CloudObjectStorage: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <path d={`M ${sx(11,w)},${sy(9,h)} L ${sx(9,w)},${sy(28,h)} L ${sx(31,w)},${sy(28,h)} L ${sx(29,w)},${sy(9,h)} Z`}
      fill="#bbf7d0" stroke="#16a34a" strokeWidth={1.5}/>
    <path d={`M ${sx(14,w)},${sy(9,h)} Q ${sx(20,w)},${sy(5,h)} ${sx(26,w)},${sy(9,h)}`}
      fill="none" stroke="#16a34a" strokeWidth={2}/>
    <line x1={sx(10,w)} y1={sy(16,h)} x2={sx(30,w)} y2={sy(16,h)} stroke="#16a34a" strokeWidth={1} strokeDasharray="2,1.5"/>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#16a34a" fontWeight={600}>Object Storage</text>
  </g>
);

export const CloudBlockStorage: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <rect x={sx(5,w)} y={sy(7,h)} width={sx(30,w)} height={sy(23,h)} rx={sx(2,w)} fill="#d1fae5" stroke="#059669" strokeWidth={1.5}/>
    <line x1={sx(5,w)} y1={sy(14,h)} x2={sx(35,w)} y2={sy(14,h)} stroke="#059669" strokeWidth={1}/>
    <line x1={sx(5,w)} y1={sy(21,h)} x2={sx(35,w)} y2={sy(21,h)} stroke="#059669" strokeWidth={1}/>
    <circle cx={sx(31,w)} cy={sy(11,h)} r={sm(2,w,h)} fill="#059669"/>
    <circle cx={sx(31,w)} cy={sy(18,h)} r={sm(2,w,h)} fill="#059669"/>
    <circle cx={sx(31,w)} cy={sy(25,h)} r={sm(2,w,h)} fill="#059669"/>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#059669" fontWeight={600}>Block Storage</text>
  </g>
);

export const CloudDatabase: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <ellipse cx={sx(20,w)} cy={sy(11,h)} rx={sx(12,w)} ry={sy(3.5,h)} fill="#a7f3d0" stroke="#059669" strokeWidth={1.5}/>
    <rect x={sx(8,w)} y={sy(11,h)} width={sx(24,w)} height={sy(16,h)} fill="#a7f3d0" stroke="#059669" strokeWidth={1.5}/>
    <ellipse cx={sx(20,w)} cy={sy(27,h)} rx={sx(12,w)} ry={sy(3.5,h)} fill="#6ee7b7" stroke="#059669" strokeWidth={1.5}/>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#059669" fontWeight={600}>Database</text>
  </g>
);

export const CloudCache: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <rect x={sx(5,w)} y={sy(7,h)} width={sx(30,w)} height={sy(23,h)} rx={sx(3,w)} fill="#fecdd3" stroke="#e11d48" strokeWidth={1.5}/>
    <polygon
      points={`${sx(23,w)},${sy(9,h)} ${sx(15,w)},${sy(20,h)} ${sx(20,w)},${sy(20,h)} ${sx(17,w)},${sy(29,h)} ${sx(25,w)},${sy(18,h)} ${sx(20,w)},${sy(18,h)}`}
      fill="#e11d48"/>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#e11d48" fontWeight={600}>Cache</text>
  </g>
);
