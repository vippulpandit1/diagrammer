import React from "react";

type Props = { width: number; height: number };
const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;
const sm = (n: number, w: number, h: number) => (Math.min(w, h) / 40) * n;

export const CloudVm: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <rect x={sx(6,w)} y={sy(7,h)} width={sx(28,w)} height={sy(20,h)} rx={sx(2,w)} fill="#bfdbfe" stroke="#1d4ed8" strokeWidth={1.5}/>
    <rect x={sx(9,w)} y={sy(10,h)} width={sx(22,w)} height={sy(14,h)} fill="#fff" stroke="#93c5fd"/>
    <line x1={sx(12,w)} y1={sy(14,h)} x2={sx(28,w)} y2={sy(14,h)} stroke="#3b82f6" strokeWidth={1}/>
    <line x1={sx(12,w)} y1={sy(17,h)} x2={sx(28,w)} y2={sy(17,h)} stroke="#3b82f6" strokeWidth={1}/>
    <line x1={sx(12,w)} y1={sy(20,h)} x2={sx(28,w)} y2={sy(20,h)} stroke="#3b82f6" strokeWidth={1}/>
    <rect x={sx(17,w)} y={sy(27,h)} width={sx(6,w)} height={sy(2,h)} fill="#6b7280"/>
    <rect x={sx(13,w)} y={sy(29,h)} width={sx(14,w)} height={sy(1.5,h)} fill="#6b7280"/>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#1d4ed8" fontWeight={600}>VM</text>
  </g>
);

export const CloudContainer: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <rect x={sx(5,w)} y={sy(7,h)} width={sx(30,w)} height={sy(6,h)} rx={sx(1,w)} fill="#99f6e4" stroke="#0d9488" strokeWidth={1.5}/>
    <rect x={sx(5,w)} y={sy(15,h)} width={sx(30,w)} height={sy(6,h)} rx={sx(1,w)} fill="#5eead4" stroke="#0d9488" strokeWidth={1.5}/>
    <rect x={sx(5,w)} y={sy(23,h)} width={sx(30,w)} height={sy(6,h)} rx={sx(1,w)} fill="#2dd4bf" stroke="#0d9488" strokeWidth={1.5}/>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#0d9488" fontWeight={600}>Container</text>
  </g>
);

export const CloudFunction: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <rect x={sx(5,w)} y={sy(7,h)} width={sx(30,w)} height={sy(23,h)} rx={sx(4,w)} fill="#fde68a" stroke="#d97706" strokeWidth={1.5}/>
    <text x={sx(20,w)} y={sy(21,h)} textAnchor="middle" fontSize={sy(14,h)} fill="#92400e" fontWeight={700} dominantBaseline="middle">λ</text>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#d97706" fontWeight={600}>Function</text>
  </g>
);

export const CloudKubernetes: React.FC<Props> = ({ width: w, height: h }) => {
  const cx = sx(20, w), cy = sy(17, h), r = sm(10, w, h);
  const hexPts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(' ');
  const innerR = sm(3.5, w, h);
  const spokes = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return (
      <line key={i}
        x1={cx + innerR * Math.cos(a)} y1={cy + innerR * Math.sin(a)}
        x2={cx + r * 0.82 * Math.cos(a)} y2={cy + r * 0.82 * Math.sin(a)}
        stroke="#2563eb" strokeWidth={sm(1.2, w, h)}/>
    );
  });
  return (
    <g>
      <polygon points={hexPts} fill="#dbeafe" stroke="#2563eb" strokeWidth={1.5}/>
      <circle cx={cx} cy={cy} r={innerR} fill="#2563eb"/>
      {spokes}
      <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#2563eb" fontWeight={600}>Kubernetes</text>
    </g>
  );
};
