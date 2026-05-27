// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React from "react";

type Props = { width: number; height: number };

const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;

export const BPMNDataObject: React.FC<Props> = ({ width, height }) => (
  <g>
    {/* document with folded corner */}
    <polygon
      points={`
        ${sx(8,width)},${sy(4,height)}
        ${sx(28,width)},${sy(4,height)}
        ${sx(34,width)},${sy(10,height)}
        ${sx(34,width)},${sy(36,height)}
        ${sx(8,width)},${sy(36,height)}
      `}
      fill="#fff7ed" stroke="#ea580c" strokeWidth={1.5}
    />
    <polyline points={`${sx(28,width)},${sy(4,height)} ${sx(28,width)},${sy(10,height)} ${sx(34,width)},${sy(10,height)}`}
      fill="none" stroke="#ea580c" strokeWidth={1.2} />
  </g>
);

export const BPMNDataStore: React.FC<Props> = ({ width, height }) => (
  <g>
    <ellipse cx={sx(20,width)} cy={sy(10,height)} rx={sx(14,width)} ry={sx(5,width)}
      fill="#e0e7ef" stroke="#334155" strokeWidth={1.5} />
    <rect x={sx(6,width)} y={sy(10,height)} width={sx(28,width)} height={sy(22,height)}
      fill="#e0e7ef" stroke="none" />
    <line x1={sx(6,width)} y1={sy(10,height)} x2={sx(6,width)} y2={sy(32,height)} stroke="#334155" strokeWidth={1.5} />
    <line x1={sx(34,width)} y1={sy(10,height)} x2={sx(34,width)} y2={sy(32,height)} stroke="#334155" strokeWidth={1.5} />
    <ellipse cx={sx(20,width)} cy={sy(32,height)} rx={sx(14,width)} ry={sx(5,width)}
      fill="#e0e7ef" stroke="#334155" strokeWidth={1.5} />
  </g>
);
