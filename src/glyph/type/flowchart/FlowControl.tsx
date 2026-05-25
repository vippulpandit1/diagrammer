import React from "react";

type Props = { width: number; height: number };

const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;

export const FlowMerge: React.FC<Props> = ({ width, height }) => (
  <g>
    <polygon
      points={`
        ${sx(20, width)},${sy(4,  height)}
        ${sx(36, width)},${sy(20, height)}
        ${sx(20, width)},${sy(36, height)}
        ${sx(4,  width)},${sy(20, height)}
      `}
      fill="#fbbf24" stroke="#222" strokeWidth={2}
    />
  </g>
);

export const FlowExtract: React.FC<Props> = ({ width, height }) => (
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
    <line x1={sx(6, width)} y1={sy(30, height)} x2={sx(10, width)} y2={sy(26, height)} stroke="#222" strokeWidth={2} />
  </g>
);

export const FlowSummarize: React.FC<Props> = ({ width, height }) => (
  <g>
    <polygon
      points={`
        ${sx(8,  width)},${sy(12, height)}
        ${sx(32, width)},${sy(12, height)}
        ${sx(20, width)},${sy(32, height)}
      `}
      fill="#a7f3d0" stroke="#222" strokeWidth={2}
    />
    <line x1={sx(8, width)} y1={sy(12, height)} x2={sx(32, width)} y2={sy(12, height)} stroke="#222" strokeWidth={2} />
  </g>
);

export const FlowDecisionAlt: React.FC<Props> = ({ width, height }) => (
  <g>
    <polygon
      points={`
        ${sx(12, width)},${sy(8,  height)}
        ${sx(28, width)},${sy(8,  height)}
        ${sx(36, width)},${sy(20, height)}
        ${sx(28, width)},${sy(32, height)}
        ${sx(12, width)},${sy(32, height)}
        ${sx(4,  width)},${sy(20, height)}
      `}
      fill="#fef9c3" stroke="#222" strokeWidth={2}
    />
  </g>
);

export const FlowSplit: React.FC<Props> = ({ width, height }) => (
  <g>
    <polygon
      points={`
        ${sx(8,  width)},${sy(28, height)}
        ${sx(32, width)},${sy(28, height)}
        ${sx(20, width)},${sy(8,  height)}
      `}
      fill="#bae6fd" stroke="#222" strokeWidth={2}
    />
    <line x1={sx(20, width)} y1={sy(8, height)} x2={sx(20, width)} y2={sy(32, height)} stroke="#222" strokeWidth={2} />
  </g>
);

export const FlowArrow: React.FC<Props> = ({ width, height }) => (
  <g>
    <line x1={sx(8, width)} y1={sy(20, height)} x2={sx(28, width)} y2={sy(20, height)} stroke="#222" strokeWidth={3} />
    <polygon
      points={`
        ${sx(28, width)},${sy(16, height)}
        ${sx(36, width)},${sy(20, height)}
        ${sx(28, width)},${sy(24, height)}
      `}
      fill="#222"
    />
  </g>
);

export const FlowSentiment: React.FC<Props> = ({ width, height }) => (
  <g>
    <ellipse cx={sx(20, width)} cy={sy(20, height)} rx={sx(18, width)} ry={sy(12, height)} fill="#a7f3d0" stroke="#222" strokeWidth={2} />
    <circle cx={sx(14, width)} cy={sy(16, height)} r={sx(2, width)} fill="#222" />
    <circle cx={sx(26, width)} cy={sy(16, height)} r={sx(2, width)} fill="#222" />
    <path d={`M${sx(12, width)},${sy(24, height)} Q${sx(20, width)},${sy(30, height)} ${sx(28, width)},${sy(24, height)}`} fill="none" stroke="#222" strokeWidth={2} />
  </g>
);
