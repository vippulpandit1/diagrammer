import React from "react";

type Props = { width: number; height: number };

const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;
const sm = (n: number, w: number, h: number) => (Math.min(w, h) / 40) * n;
const smx = (n: number, w: number, h: number) => (Math.max(w, h) / 40) * n;

export const NetworkCloud: React.FC<Props> = ({ width, height }) => (
  <g>
    <ellipse cx={sx(20, width)} cy={sy(22, height)} rx={sx(10, width)} ry={sy(7, height)} fill="#f0f9ff" stroke="#38bdf8" />
    <ellipse cx={sx(27, width)} cy={sy(20, height)} rx={sx(6, width)} ry={sy(5, height)} fill="#f0f9ff" stroke="#38bdf8" />
    <ellipse cx={sx(13, width)} cy={sy(20, height)} rx={sx(6, width)} ry={sy(5, height)} fill="#f0f9ff" stroke="#38bdf8" />
    <text x={sx(20, width)} y={sy(32, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#6366f1" fontWeight={600}>Cloud</text>
  </g>
);

export const NetworkDatabase: React.FC<Props> = ({ width, height }) => (
  <g>
    <ellipse cx={sx(20, width)} cy={sy(14, height)} rx={sx(10, width)} ry={sy(4, height)} fill="#fef3c7" stroke="#b45309" />
    <rect x={sx(10, width)} y={sy(14, height)} width={sx(20, width)} height={sy(12, height)} fill="#fef3c7" stroke="#b45309" />
    <ellipse cx={sx(20, width)} cy={sy(26, height)} rx={sx(10, width)} ry={sy(4, height)} fill="#fef3c7" stroke="#b45309" />
    <text x={sx(20, width)} y={sy(38, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#6366f1" fontWeight={600}>Database</text>
  </g>
);

export const NetworkWifi: React.FC<Props> = ({ width, height }) => (
  <g>
    <path d={`M${sx(12, width)} ${sy(22, height)} Q${sx(20, width)} ${sy(14, height)} ${sx(28, width)} ${sy(22, height)}`} stroke="#38bdf8" strokeWidth={smx(2, width, height)} fill="none" />
    <path d={`M${sx(15, width)} ${sy(25, height)} Q${sx(20, width)} ${sy(20, height)} ${sx(25, width)} ${sy(25, height)}`} stroke="#38bdf8" strokeWidth={smx(2, width, height)} fill="none" />
    <circle cx={sx(20, width)} cy={sy(28, height)} r={sm(1.5, width, height)} fill="#38bdf8" />
  </g>
);

export const NetworkHub: React.FC<Props> = ({ width, height }) => (
  <g>
    <circle cx={sx(20, width)} cy={sy(20, height)} r={sm(6, width, height)} fill="#fef9c3" stroke="#222" />
    <line x1={sx(20, width)} y1={sy(20, height)} x2={sx(8, width)} y2={sy(32, height)} stroke="#222" />
    <line x1={sx(20, width)} y1={sy(20, height)} x2={sx(32, width)} y2={sy(32, height)} stroke="#222" />
    <line x1={sx(20, width)} y1={sy(20, height)} x2={sx(20, width)} y2={sy(8, height)} stroke="#222" />
  </g>
);

export const NetworkCable: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(16, width)} y={sy(16, height)} width={sx(8, width)} height={sy(12, height)} fill="#e0e7ef" stroke="#222" />
    <rect x={sx(18, width)} y={sy(12, height)} width={sx(4, width)} height={sy(4, height)} fill="#888" />
  </g>
);

export const NetworkBridge: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(10, width)} y={sy(16, height)} width={sx(20, width)} height={sy(8, height)} rx={sx(4, width)} fill="#f3f4f6" stroke="#2563eb" strokeWidth={smx(2, width, height)} />
    <rect x={sx(12, width)} y={sy(24, height)} width={sx(4, width)} height={sy(6, height)} fill="#2563eb" stroke="#2563eb" strokeWidth={smx(1, width, height)} />
    <rect x={sx(24, width)} y={sy(24, height)} width={sx(4, width)} height={sy(6, height)} fill="#2563eb" stroke="#2563eb" strokeWidth={smx(1, width, height)} />
  </g>
);

export const NetworkAccessPoint: React.FC<Props> = ({ width, height }) => (
  <g>
    <circle cx={sx(20, width)} cy={sy(20, height)} r={sx(12, width)} fill="#f0fdf4" stroke="#22c55e" strokeWidth={smx(2, width, height)} />
    <path d={`M${sx(14, width)} ${sy(24, height)} Q${sx(20, width)} ${sy(16, height)} ${sx(26, width)} ${sy(24, height)}`} stroke="#22c55e" strokeWidth={smx(2, width, height)} fill="none" />
    <path d={`M${sx(16, width)} ${sy(26, height)} Q${sx(20, width)} ${sy(20, height)} ${sx(24, width)} ${sy(26, height)}`} stroke="#22c55e" strokeWidth={smx(1.5, width, height)} fill="none" />
    <circle cx={sx(20, width)} cy={sy(28, height)} r={sm(1.5, width, height)} fill="#22c55e" />
  </g>
);

export const NetworkLoadBalancer: React.FC<Props> = ({ width, height }) => (
  <g>
    <ellipse cx={sx(20, width)} cy={sy(20, height)} rx={sx(12, width)} ry={sy(8, height)} fill="#e0f2fe" stroke="#0ea5e9" strokeWidth={smx(2, width, height)} />
    <path d={`M${sx(12, width)} ${sy(20, height)} L${sx(20, width)} ${sy(14, height)} L${sx(28, width)} ${sy(20, height)}`} stroke="#0ea5e9" strokeWidth={2} fill="none" />
    <path d={`M${sx(12, width)} ${sy(20, height)} L${sx(20, width)} ${sy(26, height)} L${sx(28, width)} ${sy(20, height)}`} stroke="#0ea5e9" strokeWidth={2} fill="none" />
    <circle cx={sx(20, width)} cy={sy(20, height)} r={sm(2, width, height)} fill="#0ea5e9" opacity={0.3} />
  </g>
);

export const NetworkServerRack: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(14, width)} y={sy(10, height)} width={sx(12, width)} height={sy(20, height)} rx={sx(2, width)} fill="#e0e7ef" stroke="#222" strokeWidth={2} />
    {[0, 1, 2, 3].map(i => (
      <rect key={i} x={sx(16, width)} y={sy(12 + i * 5, height)} width={sx(8, width)} height={sy(3, height)} fill="#fff" stroke="#2563eb" strokeWidth={1} />
    ))}
    <text x={sx(20, width)} y={sy(34, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#2563eb" fontWeight={600}>Rack</text>
  </g>
);
