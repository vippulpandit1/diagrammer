import React from "react";

type Props = { width: number; height: number };

const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;

export const FlowSubroutine: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(8, width)} y={sy(12, height)} width={sx(24, width)} height={sy(16, height)} rx={sx(4, width)} fill="#ddd6fe" stroke="#222" strokeWidth={2} />
    <line x1={sx(12, width)} y1={sy(12, height)} x2={sx(12, width)} y2={sy(28, height)} stroke="#222" strokeWidth={2} />
    <line x1={sx(28, width)} y1={sy(12, height)} x2={sx(28, width)} y2={sy(28, height)} stroke="#222" strokeWidth={2} />
  </g>
);

export const FlowPredefinedProcess: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(8, width)} y={sy(12, height)} width={sx(24, width)} height={sy(16, height)} rx={sx(4, width)} fill="#c7d2fe" stroke="#222" strokeWidth={2} />
    <line x1={sx(10, width)} y1={sy(12, height)} x2={sx(10, width)} y2={sy(28, height)} stroke="#222" strokeWidth={2} />
    <line x1={sx(14, width)} y1={sy(12, height)} x2={sx(14, width)} y2={sy(28, height)} stroke="#222" strokeWidth={2} />
  </g>
);

export const FlowDelay: React.FC<Props> = ({ width, height }) => (
  <g>
    <ellipse cx={sx(20, width)} cy={sy(20, height)} rx={sx(18, width)} ry={sy(10, height)} fill="#fcd34d" stroke="#222" strokeWidth={2} />
    <line x1={sx(20, width)} y1={sy(10, height)} x2={sx(20, width)} y2={sy(30, height)} stroke="#222" strokeWidth={2} />
  </g>
);

export const FlowPreparation: React.FC<Props> = ({ width, height }) => (
  <g>
    <polygon
      points={`
        ${sx(12, width)},${sy(12, height)}
        ${sx(28, width)},${sy(12, height)}
        ${sx(36, width)},${sy(20, height)}
        ${sx(28, width)},${sy(28, height)}
        ${sx(12, width)},${sy(28, height)}
        ${sx(4,  width)},${sy(20, height)}
      `}
      fill="#f9fafb" stroke="#222" strokeWidth={2}
    />
  </g>
);

export const FlowDisplay: React.FC<Props> = ({ width, height }) => (
  <g>
    <path
      d={`
        M${sx(8,  width)},${sy(12, height)}
        L${sx(32, width)},${sy(12, height)}
        Q${sx(36, width)},${sy(20, height)} ${sx(32, width)},${sy(28, height)}
        L${sx(8,  width)},${sy(28, height)}
        Q${sx(4,  width)},${sy(20, height)} ${sx(8, width)},${sy(12, height)}
        Z
      `}
      fill="#fef08a" stroke="#222" strokeWidth={2}
    />
  </g>
);

export const FlowCollate: React.FC<Props> = ({ width, height }) => (
  <g>
    <ellipse cx={sx(20, width)} cy={sy(20, height)} rx={sx(14, width)} ry={sy(10, height)} fill="#f3f4f6" stroke="#222" strokeWidth={2} />
    <path d={`M${sx(8, width)},${sy(28, height)} Q${sx(20, width)},${sy(8,  height)} ${sx(32, width)},${sy(28, height)}`} fill="none" stroke="#222" strokeWidth={2} />
    <path d={`M${sx(8, width)},${sy(20, height)} Q${sx(20, width)},${sy(36, height)} ${sx(32, width)},${sy(20, height)}`} fill="none" stroke="#222" strokeWidth={2} />
  </g>
);
