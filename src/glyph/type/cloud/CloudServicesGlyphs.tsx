import React from "react";

type Props = { width: number; height: number };
const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;
const sm = (n: number, w: number, h: number) => (Math.min(w, h) / 40) * n;

export const CloudQueue: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <rect x={sx(3,w)} y={sy(13,h)} width={sx(9,w)} height={sy(12,h)} rx={sx(1,w)} fill="#ede9fe" stroke="#7c3aed" strokeWidth={1.5}/>
    <rect x={sx(14,w)} y={sy(13,h)} width={sx(9,w)} height={sy(12,h)} rx={sx(1,w)} fill="#ddd6fe" stroke="#7c3aed" strokeWidth={1.5}/>
    <rect x={sx(25,w)} y={sy(13,h)} width={sx(9,w)} height={sy(12,h)} rx={sx(1,w)} fill="#c4b5fd" stroke="#7c3aed" strokeWidth={1.5}/>
    <line x1={sx(34,w)} y1={sy(19,h)} x2={sx(38,w)} y2={sy(19,h)} stroke="#7c3aed" strokeWidth={1.5}/>
    <polygon points={`${sx(36,w)},${sy(16,h)} ${sx(39,w)},${sy(19,h)} ${sx(36,w)},${sy(22,h)}`} fill="#7c3aed"/>
    <text x={sx(20,w)} y={sy(32,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#7c3aed" fontWeight={600}>Queue</text>
  </g>
);

export const CloudEventBus: React.FC<Props> = ({ width: w, height: h }) => {
  const xPositions = [9, 16, 23, 31];
  return (
    <g>
      <rect x={sx(5,w)} y={sy(16,h)} width={sx(30,w)} height={sy(8,h)} rx={sx(1,w)} fill="#e0e7ff" stroke="#4f46e5" strokeWidth={1.5}/>
      {xPositions.map((x, i) => (
        <line key={i} x1={sx(x,w)} y1={sy(11,h)} x2={sx(x,w)} y2={sy(30,h)} stroke="#4f46e5" strokeWidth={1.5}/>
      ))}
      {[9, 23, 31].map((x, i) => (
        <polygon key={i} points={`${sx(x-1.5,w)},${sy(11,h)} ${sx(x+1.5,w)},${sy(11,h)} ${sx(x,w)},${sy(9,h)}`} fill="#4f46e5"/>
      ))}
      <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#4f46e5" fontWeight={600}>Event Bus</text>
    </g>
  );
};

export const CloudMonitoring: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <rect x={sx(4,w)} y={sy(7,h)} width={sx(32,w)} height={sy(23,h)} rx={sx(2,w)} fill="#eff6ff" stroke="#3b82f6" strokeWidth={1.5}/>
    <rect x={sx(8,w)} y={sy(21,h)} width={sx(5,w)} height={sy(7,h)} fill="#bfdbfe" stroke="#3b82f6"/>
    <rect x={sx(15,w)} y={sy(16,h)} width={sx(5,w)} height={sy(12,h)} fill="#3b82f6"/>
    <rect x={sx(22,w)} y={sy(12,h)} width={sx(5,w)} height={sy(16,h)} fill="#1d4ed8"/>
    <rect x={sx(29,w)} y={sy(18,h)} width={sx(5,w)} height={sy(10,h)} fill="#3b82f6"/>
    <line x1={sx(6,w)} y1={sy(28,h)} x2={sx(35,w)} y2={sy(28,h)} stroke="#1e3a5f" strokeWidth={1}/>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#3b82f6" fontWeight={600}>Monitoring</text>
  </g>
);

export const CloudCicd: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <circle cx={sx(7,w)} cy={sy(18,h)} r={sm(4,w,h)} fill="#c7d2fe" stroke="#4f46e5" strokeWidth={1.5}/>
    <line x1={sx(11,w)} y1={sy(18,h)} x2={sx(16,w)} y2={sy(18,h)} stroke="#4f46e5" strokeWidth={1.5}/>
    <polygon points={`${sx(14,w)},${sy(15,h)} ${sx(17,w)},${sy(18,h)} ${sx(14,w)},${sy(21,h)}`} fill="#4f46e5"/>
    <circle cx={sx(21,w)} cy={sy(18,h)} r={sm(4,w,h)} fill="#c7d2fe" stroke="#4f46e5" strokeWidth={1.5}/>
    <line x1={sx(25,w)} y1={sy(18,h)} x2={sx(30,w)} y2={sy(18,h)} stroke="#4f46e5" strokeWidth={1.5}/>
    <polygon points={`${sx(28,w)},${sy(15,h)} ${sx(31,w)},${sy(18,h)} ${sx(28,w)},${sy(21,h)}`} fill="#4f46e5"/>
    <circle cx={sx(35,w)} cy={sy(18,h)} r={sm(4,w,h)} fill="#c7d2fe" stroke="#4f46e5" strokeWidth={1.5}/>
    <polyline points={`${sx(32,w)},${sy(18,h)} ${sx(34,w)},${sy(21,h)} ${sx(38,w)},${sy(14,h)}`}
      fill="none" stroke="#4f46e5" strokeWidth={1.5}/>
    <text x={sx(21,w)} y={sy(30,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#4f46e5" fontWeight={600}>CI/CD</text>
  </g>
);
