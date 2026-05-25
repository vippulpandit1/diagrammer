import React from "react";

type Props = { width: number; height: number };

const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;

export const FlowManualInput: React.FC<Props> = ({ width, height }) => (
  <g>
    <polygon
      points={`
        ${sx(8,  width)},${sy(12, height)}
        ${sx(36, width)},${sy(12, height)}
        ${sx(32, width)},${sy(28, height)}
        ${sx(12, width)},${sy(28, height)}
      `}
      fill="#fbcfe8" stroke="#222" strokeWidth={2}
    />
    <line x1={sx(8, width)} y1={sy(12, height)} x2={sx(12, width)} y2={sy(28, height)} stroke="#222" strokeWidth={2} />
  </g>
);

export const FlowManualOperation: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(8, width)} y={sy(14, height)} width={sx(24, width)} height={sy(12, height)} rx={sx(2, width)} fill="#fcd34d" stroke="#222" strokeWidth={2} />
    <polygon
      points={`
        ${sx(8,  width)},${sy(14, height)}
        ${sx(32, width)},${sy(14, height)}
        ${sx(36, width)},${sy(26, height)}
        ${sx(12, width)},${sy(26, height)}
      `}
      fill="none" stroke="#222" strokeWidth={2}
    />
  </g>
);

export const FlowManualLoop: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(8, width)} y={sy(12, height)} width={sx(24, width)} height={sy(16, height)} rx={sx(4, width)} fill="#fef9c3" stroke="#222" strokeWidth={2} />
    <path
      d={`M${sx(28, width)},${sy(20, height)} q${sx(6, width)},${sy(-8, height)} 0,${sy(-8, height)} q${sx(-6, width)},${sy(0, height)} -${sx(6, width)},${sy(8, height)}`}
      fill="none" stroke="#222" strokeWidth={2}
    />
  </g>
);

export const FlowLoopLimit: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(8, width)} y={sy(12, height)} width={sx(24, width)} height={sy(16, height)} rx={sx(4, width)} fill="#bae6fd" stroke="#222" strokeWidth={2} />
    <path
      d={`M${sx(28, width)},${sy(20, height)} q${sx(6, width)},${sy(-8, height)} 0,${sy(-8, height)} q${sx(-6, width)},${sy(0, height)} -${sx(6, width)},${sy(8, height)}`}
      fill="none" stroke="#222" strokeWidth={2}
    />
    <rect x={sx(26, width)} y={sy(8, height)} width={sx(8, width)} height={sy(2, height)} fill="#222" />
  </g>
);

export const FlowMultiInput: React.FC<Props> = ({ width, height }) => (
  <g>
    <polygon
      points={`
        ${sx(12, width)},${sy(10, height)}
        ${sx(36, width)},${sy(10, height)}
        ${sx(30, width)},${sy(30, height)}
        ${sx(6,  width)},${sy(30, height)}
      `}
      fill="#fbcfe8" stroke="#222" strokeWidth={2}
    />
    <line x1={sx(12, width)} y1={sy(10, height)} x2={sx(16, width)} y2={sy(26, height)} stroke="#222" strokeWidth={2} />
  </g>
);
