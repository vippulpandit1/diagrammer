import React from "react";

type Props = { width: number; height: number };

const scale = (n: number, dim: number) => (n / 40) * dim;
const sx = (n: number, w: number) => scale(n, w);
const sy = (n: number, h: number) => scale(n, h);

export const FlowStart: React.FC<Props> = ({ width, height }) => (
  <g>
    <ellipse
      cx={sx(20, width)} cy={sy(20, height)}
      rx={sx(18, width)} ry={sy(18, height)}
      fill="#bbf7d0" stroke="#222" strokeWidth={2}
    />
  </g>
);

export const FlowEnd: React.FC<Props> = ({ width, height }) => (
  <g>
    <ellipse
      cx={sx(20, width)} cy={sy(20, height)}
      rx={sx(18, width)} ry={sy(18, height)}
      fill="#fca5a5" stroke="#222" strokeWidth={2}
    />
    <ellipse
      cx={sx(20, width)} cy={sy(20, height)}
      rx={sx(12, width)} ry={sy(12, height)}
      fill="#fff" stroke="none"
    />
  </g>
);

export const FlowProcess: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect
      x={sx(4, width)} y={sy(10, height)}
      width={sx(32, width)} height={sy(20, height)}
      rx={sx(6, width)}
      fill="#e0e7ef" stroke="#222" strokeWidth={2}
    />
  </g>
);

export const FlowIo: React.FC<Props> = ({ width, height }) => (
  <g>
    <polygon
      points={`
        ${sx(10, width)},${sy(10, height)}
        ${sx(36, width)},${sy(10, height)}
        ${sx(30, width)},${sy(30, height)}
        ${sx(4,  width)},${sy(30, height)}
      `}
      fill="#bae6fd" stroke="#222" strokeWidth={2}
    />
  </g>
);

export const FlowDecision: React.FC<Props> = ({ width, height }) => (
  <g>
    <polygon
      points={`
        ${sx(20, width)},${sy(4,  height)}
        ${sx(36, width)},${sy(20, height)}
        ${sx(20, width)},${sy(36, height)}
        ${sx(4,  width)},${sy(20, height)}
      `}
      fill="#fef9c3" stroke="#222" strokeWidth={2}
    />
  </g>
);

export const FlowAction: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect
      x={sx(6, width)} y={sy(14, height)}
      width={sx(28, width)} height={sy(12, height)}
      rx={sx(6, width)}
      fill="#fde68a" stroke="#222" strokeWidth={2}
    />
  </g>
);
