import React from "react";

type Props = { width: number; height: number };

const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;
const sm = (n: number, w: number, h: number) => (Math.min(w, h) / 40) * n;

export const NetworkServer: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(8, width)} y={sy(10, height)} width={sx(24, width)} height={sy(20, height)} rx={sx(3, width)} fill="#e0e7ef" stroke="#222" />
    <rect x={sx(12, width)} y={sy(14, height)} width={sx(16, width)} height={sy(8, height)} fill="#fff" stroke="#888" />
    <circle cx={sx(20, width)} cy={sy(28, height)} r={sm(2, width, height)} fill="#888" />
    <circle cx={sx(28, width)} cy={sy(14, height)} r={sx(4, width)} fill="#6366f1" stroke="#fff" strokeWidth={1.5} />
    <text x={sx(28, width)} y={sy(14.5, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#fff" fontWeight={700} dominantBaseline="middle">I</text>
    <text x={sx(20, width)} y={sy(36, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#6366f1" fontWeight={600}>Network Server</text>
  </g>
);

export const NetworkSwitch: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(8, width)} y={sy(14, height)} width={sx(24, width)} height={sy(12, height)} rx={sx(3, width)} fill="#d1fae5" stroke="#222" />
    <circle cx={sx(14, width)} cy={sy(20, height)} r={sm(1.5, width, height)} fill="#222" />
    <circle cx={sx(20, width)} cy={sy(20, height)} r={sm(1.5, width, height)} fill="#222" />
    <circle cx={sx(26, width)} cy={sy(20, height)} r={sm(1.5, width, height)} fill="#222" />
    <text x={sx(20, width)} y={sy(30, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#6366f1" fontWeight={600}>Switch</text>
  </g>
);

export const NetworkRouter: React.FC<Props> = ({ width, height }) => (
  <g>
    <ellipse cx={sx(20, width)} cy={sy(20, height)} rx={sx(12, width)} ry={sy(8, height)} fill="#fef9c3" stroke="#222" />
    <rect x={sx(12, width)} y={sy(24, height)} width={sx(16, width)} height={sy(4, height)} fill="#fff" stroke="#888" />
    <text x={sx(20, width)} y={sy(28, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#6366f1" fontWeight={600}>Router</text>
  </g>
);

export const NetworkFirewall: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(10, width)} y={sy(12, height)} width={sx(20, width)} height={sy(16, height)} fill="#fecaca" stroke="#b91c1c" />
    <rect x={sx(12, width)} y={sy(14, height)} width={sx(16, width)} height={sy(4, height)} fill="#fff" stroke="#b91c1c" />
    <rect x={sx(12, width)} y={sy(20, height)} width={sx(16, width)} height={sy(4, height)} fill="#fff" stroke="#b91c1c" />
    <text x={sx(20, width)} y={sy(32, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#6366f1" fontWeight={600}>Firewall</text>
  </g>
);

export const NetworkPc: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(10, width)} y={sy(14, height)} width={sx(20, width)} height={sy(12, height)} rx={sx(2, width)} fill="#e0e7ef" stroke="#222" />
    <rect x={sx(16, width)} y={sy(26, height)} width={sx(8, width)} height={sy(2, height)} fill="#888" />
    <text x={sx(20, width)} y={sy(32, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#6366f1" fontWeight={600}>Network PC</text>
  </g>
);

export const NetworkLaptop: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(12, width)} y={sy(16, height)} width={sx(16, width)} height={sy(8, height)} rx={sx(2, width)} fill="#e0e7ef" stroke="#222" />
    <rect x={sx(10, width)} y={sy(24, height)} width={sx(20, width)} height={sy(3, height)} fill="#888" />
    <text x={sx(20, width)} y={sy(32, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#6366f1" fontWeight={600}>Laptop</text>
  </g>
);

export const NetworkPhone: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(16, width)} y={sy(12, height)} width={sx(8, width)} height={sy(16, height)} rx={sx(2, width)} fill="#f3f4f6" stroke="#222" />
    <circle cx={sx(20, width)} cy={sy(26, height)} r={sm(1, width, height)} fill="#888" />
  </g>
);

export const NetworkTablet: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(13, width)} y={sy(10, height)} width={sx(14, width)} height={sy(20, height)} rx={sx(3, width)} fill="#f3f4f6" stroke="#222" />
    <circle cx={sx(20, width)} cy={sy(28, height)} r={sm(1, width, height)} fill="#888" />
  </g>
);

export const NetworkPrinter: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(12, width)} y={sy(18, height)} width={sx(16, width)} height={sy(8, height)} fill="#e0e7ef" stroke="#222" />
    <rect x={sx(14, width)} y={sy(12, height)} width={sx(12, width)} height={sy(6, height)} fill="#fff" stroke="#222" />
    <rect x={sx(16, width)} y={sy(26, height)} width={sx(8, width)} height={sy(2, height)} fill="#888" />
  </g>
);
