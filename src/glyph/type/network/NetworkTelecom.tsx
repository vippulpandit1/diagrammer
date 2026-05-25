import React from "react";

type Props = { width: number; height: number };

const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;
const sm = (n: number, w: number, h: number) => (Math.min(w, h) / 40) * n;
const smx = (n: number, w: number, h: number) => (Math.max(w, h) / 40) * n;

export const NetworkVoipPhone: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(13, width)} y={sy(12, height)} width={sx(14, width)} height={sy(16, height)} rx={sx(3, width)} fill="#f3f4f6" stroke="#2563eb" strokeWidth={2} />
    <rect x={sx(15, width)} y={sy(14, height)} width={sx(10, width)} height={sy(6, height)} rx={sx(1, width)} fill="#e0e7ef" stroke="#2563eb" strokeWidth={1} />
    <rect x={sx(15, width)} y={sy(22, height)} width={sx(10, width)} height={sy(4, height)} rx={sx(1, width)} fill="#fff" stroke="#2563eb" strokeWidth={1} />
    <rect x={sx(10, width)} y={sy(10, height)} width={sx(6, width)} height={sy(4, height)} rx={sx(2, width)} fill="#2563eb" stroke="#2563eb" strokeWidth={1} transform={`rotate(-20 ${sx(13, width)} ${sy(12, height)})`} />
    <text x={sx(20, width)} y={sy(32, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#2563eb" fontWeight={600}>VOIP</text>
  </g>
);

export const NetworkOpticalNetwork: React.FC<Props> = ({ width, height }) => (
  <g>
    <ellipse cx={sx(20, width)} cy={sy(20, height)} rx={sx(12, width)} ry={sy(12, height)} fill="#f0f9ff" stroke="#0ea5e9" strokeWidth={smx(2, width, height)} />
    <path d={`M${sx(8, width)},${sy(20, height)} Q${sx(20, width)},${sy(8, height)} ${sx(32, width)},${sy(20, height)}`} stroke="#0ea5e9" strokeWidth={2} fill="none" />
    <path d={`M${sx(8, width)},${sy(20, height)} Q${sx(20, width)},${sy(32, height)} ${sx(32, width)},${sy(20, height)}`} stroke="#0ea5e9" strokeWidth={2} fill="none" />
    <circle cx={sx(20, width)} cy={sy(20, height)} r={sm(2, width, height)} fill="#0ea5e9" opacity={0.3} />
    <text x={sx(20, width)} y={sy(36, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#0ea5e9" fontWeight={600}>Optical</text>
  </g>
);

export const NetworkSatellite: React.FC<Props> = ({ width, height }) => (
  <g>
    <ellipse cx={sx(20, width)} cy={sy(24, height)} rx={sx(10, width)} ry={sy(6, height)} fill="#f0f9ff" stroke="#2563eb" strokeWidth={smx(2, width, height)} transform={`rotate(-25 ${sx(20, width)} ${sy(24, height)})`} />
    <rect x={sx(18, width)} y={sy(28, height)} width={sx(4, width)} height={sy(8, height)} rx={sx(1, width)} fill="#2563eb" stroke="#2563eb" strokeWidth={1} />
    <circle cx={sx(20, width)} cy={sy(20, height)} r={sx(2, width)} fill="#2563eb" stroke="#2563eb" strokeWidth={1} />
    <path d={`M${sx(20, width)},${sy(20, height)} Q${sx(28, width)},${sy(12, height)} ${sx(36, width)},${sy(20, height)}`} stroke="#2563eb" strokeWidth={2} fill="none" />
    <path d={`M${sx(20, width)},${sy(20, height)} Q${sx(30, width)},${sy(16, height)} ${sx(36, width)},${sy(24, height)}`} stroke="#2563eb" strokeWidth={2} fill="none" />
    <text x={sx(20, width)} y={sy(38, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#2563eb" fontWeight={600}>Satellite</text>
  </g>
);

export const NetworkTerminal: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(10, width)} y={sy(14, height)} width={sx(20, width)} height={sy(12, height)} rx={sx(3, width)} fill="#1e293b" stroke="#2563eb" strokeWidth={smx(2, width, height)} />
    <text x={sx(14, width)} y={sy(22, height)} fontSize={sy(6, height)} fill="#38bdf8" fontFamily="monospace" fontWeight={700}>&gt;_</text>
    <text x={sx(20, width)} y={sy(28, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#2563eb" fontWeight={600}>Terminal</text>
  </g>
);
