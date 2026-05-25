import React from "react";

type Props = { width: number; height: number };

const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;

export const FlowConnector: React.FC<Props> = ({ width, height }) => (
  <g>
    <circle cx={sx(20, width)} cy={sy(20, height)} r={sx(10, width)} fill="#a5b4fc" stroke="#222" strokeWidth={2} />
    <text
      x={sx(20, width)} y={sy(20, height)}
      textAnchor="middle" alignmentBaseline="middle"
      fontSize={sx(12, width)} fill="#222" fontFamily="Arial"
      style={{ pointerEvents: "none", userSelect: "none" }}
    >
      ●
    </text>
  </g>
);

export const FlowOffPageConnector: React.FC<Props> = ({ width, height }) => (
  <g>
    <polygon
      points={`
        ${sx(20, width)},${sy(6,  height)}
        ${sx(34, width)},${sy(16, height)}
        ${sx(28, width)},${sy(34, height)}
        ${sx(12, width)},${sy(34, height)}
        ${sx(6,  width)},${sy(16, height)}
      `}
      fill="#fbbf24" stroke="#222" strokeWidth={2}
    />
  </g>
);

export const FlowOnPageConnector: React.FC<Props> = ({ width, height }) => (
  <g>
    <circle cx={sx(20, width)} cy={sy(20, height)} r={sx(10, width)} fill="#fff" stroke="#222" strokeWidth={2} />
    <text
      x={sx(20, width)} y={sy(25, height)}
      textAnchor="middle" fontSize={sx(16, width)} fill="#222" fontFamily="Arial"
      pointerEvents="none"
    >
      ⬤
    </text>
  </g>
);

export const FlowOffPageConnectorAlt: React.FC<Props> = ({ width, height }) => (
  <g>
    <polygon
      points={`
        ${sx(12, width)},${sy(12, height)}
        ${sx(28, width)},${sy(12, height)}
        ${sx(36, width)},${sy(20, height)}
        ${sx(20, width)},${sy(36, height)}
        ${sx(4,  width)},${sy(20, height)}
      `}
      fill="#fbbf24" stroke="#222" strokeWidth={2}
    />
  </g>
);
