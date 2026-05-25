import React from "react";

type Props = { width: number; height: number };

const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;

export const FlowDocument: React.FC<Props> = ({ width, height }) => (
  <g>
    <path
      d={`
        M${sx(6, width)},${sy(10, height)}
        Q${sx(20, width)},${sy(38, height)} ${sx(34, width)},${sy(10, height)}
        L${sx(34, width)},${sy(30, height)}
        Q${sx(20, width)},${sy(38, height)} ${sx(6, width)},${sy(30, height)}
        Z
      `}
      fill="#e0e7ef" stroke="#222" strokeWidth={2}
    />
  </g>
);

export const FlowMultiDocument: React.FC<Props> = ({ width, height }) => (
  <g>
    {/* Back */}
    <path
      d={`
        M${sx(10, width)},${sy(14, height)}
        Q${sx(24, width)},${sy(42, height)} ${sx(38, width)},${sy(14, height)}
        L${sx(38, width)},${sy(34, height)}
        Q${sx(24, width)},${sy(42, height)} ${sx(10, width)},${sy(34, height)}
        Z
      `}
      fill="#f3f4f6" stroke="#222" strokeWidth={2} opacity={0.7}
    />
    {/* Middle */}
    <path
      d={`
        M${sx(8, width)},${sy(12, height)}
        Q${sx(22, width)},${sy(40, height)} ${sx(36, width)},${sy(12, height)}
        L${sx(36, width)},${sy(32, height)}
        Q${sx(22, width)},${sy(40, height)} ${sx(8, width)},${sy(32, height)}
        Z
      `}
      fill="#e5e7eb" stroke="#222" strokeWidth={2} opacity={0.85}
    />
    {/* Front */}
    <path
      d={`
        M${sx(6, width)},${sy(10, height)}
        Q${sx(20, width)},${sy(38, height)} ${sx(34, width)},${sy(10, height)}
        L${sx(34, width)},${sy(30, height)}
        Q${sx(20, width)},${sy(38, height)} ${sx(6, width)},${sy(30, height)}
        Z
      `}
      fill="#e0e7ef" stroke="#222" strokeWidth={2}
    />
  </g>
);

export const FlowData: React.FC<Props> = ({ width, height }) => (
  <g>
    <polygon
      points={`
        ${sx(10, width)},${sy(10, height)}
        ${sx(34, width)},${sy(10, height)}
        ${sx(30, width)},${sy(30, height)}
        ${sx(6,  width)},${sy(30, height)}
      `}
      fill="#6ee7b7" stroke="#222" strokeWidth={2}
    />
  </g>
);

export const FlowSortedData: React.FC<Props> = ({ width, height }) => (
  <g>
    <polygon
      points={`
        ${sx(10, width)},${sy(12, height)}
        ${sx(34, width)},${sy(12, height)}
        ${sx(30, width)},${sy(28, height)}
        ${sx(6,  width)},${sy(28, height)}
      `}
      fill="#fca5a5" stroke="#222" strokeWidth={2}
    />
    <line x1={sx(14, width)} y1={sy(14, height)} x2={sx(10, width)} y2={sy(28, height)} stroke="#222" strokeWidth={1.5} />
    <line x1={sx(18, width)} y1={sy(14, height)} x2={sx(14, width)} y2={sy(28, height)} stroke="#222" strokeWidth={1.5} />
    <line x1={sx(22, width)} y1={sy(14, height)} x2={sx(18, width)} y2={sy(28, height)} stroke="#222" strokeWidth={1.5} />
    <line x1={sx(26, width)} y1={sy(14, height)} x2={sx(22, width)} y2={sy(28, height)} stroke="#222" strokeWidth={1.5} />
    <line x1={sx(30, width)} y1={sy(14, height)} x2={sx(26, width)} y2={sy(28, height)} stroke="#222" strokeWidth={1.5} />
  </g>
);

export const FlowDatabase: React.FC<Props> = ({ width, height }) => (
  <g>
    <ellipse cx={sx(20, width)} cy={sy(14, height)} rx={sx(12, width)} ry={sy(4, height)} fill="#fef9c3" stroke="#222" strokeWidth={2} />
    <rect x={sx(8, width)} y={sy(14, height)} width={sx(24, width)} height={sy(12, height)} fill="#fef9c3" stroke="#222" strokeWidth={2} />
    <path
      d={`M${sx(8, width)},${sy(26, height)} a${sx(12, width)},${sy(4, height)} 0 0 0 ${sx(24, width)},0`}
      fill="none" stroke="#222" strokeWidth={2}
    />
  </g>
);

export const FlowInternalStorage: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(8, width)} y={sy(12, height)} width={sx(24, width)} height={sy(16, height)} fill="#fef08a" stroke="#222" strokeWidth={2} />
    <line x1={sx(12, width)} y1={sy(12, height)} x2={sx(12, width)} y2={sy(28, height)} stroke="#222" strokeWidth={2} />
    <line x1={sx(8, width)}  y1={sy(18, height)} x2={sx(32, width)} y2={sy(18, height)} stroke="#222" strokeWidth={2} />
  </g>
);

export const FlowMagneticTape: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(6, width)} y={sy(12, height)} width={sx(28, width)} height={sy(16, height)} rx={sx(4, width)} fill="#f87171" stroke="#222" strokeWidth={2} />
    <path
      d={`
        M${sx(6,  width)},${sy(20, height)}
        Q${sx(10, width)},${sy(12, height)} ${sx(14, width)},${sy(20, height)}
        T${sx(22, width)},${sy(20, height)}
        T${sx(30, width)},${sy(20, height)}
        L${sx(34, width)},${sy(20, height)}
      `}
      fill="none" stroke="#222" strokeWidth={2}
    />
  </g>
);

export const FlowCard: React.FC<Props> = ({ width, height }) => (
  <g>
    <polygon
      points={`
        ${sx(10, width)},${sy(10, height)}
        ${sx(34, width)},${sy(10, height)}
        ${sx(30, width)},${sy(30, height)}
        ${sx(6,  width)},${sy(30, height)}
      `}
      fill="#fbbf24" stroke="#222" strokeWidth={2}
    />
    <line x1={sx(30, width)} y1={sy(10, height)} x2={sx(34, width)} y2={sy(14, height)} stroke="#222" strokeWidth={2} />
  </g>
);
