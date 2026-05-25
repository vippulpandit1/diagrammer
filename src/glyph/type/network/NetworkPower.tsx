import React from "react";

type Props = { width: number; height: number };

const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;
const sm = (n: number, w: number, h: number) => (Math.min(w, h) / 40) * n;
const smx = (n: number, w: number, h: number) => (Math.max(w, h) / 40) * n;

export const NetworkGenerator: React.FC<Props> = ({ width, height }) => (
  <g>
    <circle cx={sx(20, width)} cy={sy(20, height)} r={sx(12, width)} fill="#fef9c3" stroke="#eab308" strokeWidth={smx(2, width, height)} />
    <polyline
      points={`${sx(18, width)},${sy(14, height)} ${sx(22, width)},${sy(20, height)} ${sx(19, width)},${sy(20, height)} ${sx(22, width)},${sy(26, height)} ${sx(20, width)},${sy(20, height)} ${sx(23, width)},${sy(14, height)}`}
      fill="none"
      stroke="#eab308"
      strokeWidth={2}
    />
  </g>
);

export const NetworkPdu: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(10, width)} y={sy(14, height)} width={sx(20, width)} height={sy(12, height)} rx={sx(3, width)} fill="#f3f4f6" stroke="#6366f1" strokeWidth={smx(2, width, height)} />
    <circle cx={sx(14, width)} cy={sy(20, height)} r={sm(1.2, width, height)} fill="#6366f1" />
    <circle cx={sx(20, width)} cy={sy(20, height)} r={sm(1.2, width, height)} fill="#6366f1" />
    <circle cx={sx(26, width)} cy={sy(20, height)} r={sm(1.2, width, height)} fill="#6366f1" />
    <text x={sx(20, width)} y={sy(28, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#6366f1" fontWeight={600}>PDU</text>
  </g>
);

export const NetworkUps: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(10, width)} y={sy(14, height)} width={sx(20, width)} height={sy(12, height)} rx={sx(4, width)} fill="#f0fdf4" stroke="#059669" strokeWidth={smx(2, width, height)} />
    <rect x={sx(16, width)} y={sy(18, height)} width={sx(8, width)} height={sy(6, height)} rx={sx(2, width)} fill="#fff" stroke="#059669" strokeWidth={1.5} />
    <rect x={sx(19, width)} y={sy(16, height)} width={sx(2, width)} height={sy(2, height)} fill="#059669" stroke="#059669" strokeWidth={1} />
    <text x={sx(20, width)} y={sy(28, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#059669" fontWeight={600}>UPS</text>
  </g>
);

export const NetworkAntenna: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(18, width)} y={sy(12, height)} width={sx(4, width)} height={sy(16, height)} fill="#f3f4f6" stroke="#2563eb" strokeWidth={smx(1.5, width, height)} rx={sx(2, width)} />
    <rect x={sx(16, width)} y={sy(28, height)} width={sx(8, width)} height={sy(4, height)} fill="#2563eb" stroke="#2563eb" strokeWidth={1} rx={sx(2, width)} />
    <path d={`M${sx(20, width)},${sy(12, height)} Q${sx(10, width)},${sy(6, height)} ${sx(20, width)},${sy(2, height)}`} stroke="#2563eb" strokeWidth={2} fill="none" />
    <path d={`M${sx(20, width)},${sy(12, height)} Q${sx(30, width)},${sy(6, height)} ${sx(20, width)},${sy(2, height)}`} stroke="#2563eb" strokeWidth={2} fill="none" />
    <circle cx={sx(20, width)} cy={sy(12, height)} r={sm(1.5, width, height)} fill="#2563eb" />
  </g>
);

export const NetworkCctv: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(12, width)} y={sy(16, height)} width={sx(16, width)} height={sy(8, height)} rx={sx(2, width)} fill="#e0e7ef" stroke="#222" strokeWidth={2} />
    <circle cx={sx(20, width)} cy={sy(20, height)} r={sx(3, width)} fill="#2563eb" stroke="#222" strokeWidth={1} />
    <rect x={sx(18, width)} y={sy(24, height)} width={sx(4, width)} height={sy(8, height)} rx={sx(1, width)} fill="#888" stroke="#222" strokeWidth={1} />
    <ellipse cx={sx(20, width)} cy={sy(32, height)} rx={sx(4, width)} ry={sy(2, height)} fill="#888" stroke="#222" strokeWidth={1} />
  </g>
);
