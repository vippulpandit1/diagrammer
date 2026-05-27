// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React from "react";

type Props = { width: number; height: number };

const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;

export const BPMNStartEvent: React.FC<Props> = ({ width, height }) => (
  <g>
    <circle cx={sx(20,width)} cy={sy(20,height)} r={sx(17,width)}
      fill="#bbf7d0" stroke="#16a34a" strokeWidth={1.5} />
  </g>
);

export const BPMNEndEvent: React.FC<Props> = ({ width, height }) => (
  <g>
    <circle cx={sx(20,width)} cy={sy(20,height)} r={sx(17,width)}
      fill="#fecaca" stroke="#dc2626" strokeWidth={3} />
  </g>
);

export const BPMNIntermediateEvent: React.FC<Props> = ({ width, height }) => (
  <g>
    <circle cx={sx(20,width)} cy={sy(20,height)} r={sx(17,width)}
      fill="#fef9c3" stroke="#ca8a04" strokeWidth={1.5} />
    <circle cx={sx(20,width)} cy={sy(20,height)} r={sx(13,width)}
      fill="none" stroke="#ca8a04" strokeWidth={1.5} />
  </g>
);

export const BPMNStartMessageEvent: React.FC<Props> = ({ width, height }) => (
  <g>
    <circle cx={sx(20,width)} cy={sy(20,height)} r={sx(17,width)}
      fill="#bbf7d0" stroke="#16a34a" strokeWidth={1.5} />
    {/* envelope */}
    <rect x={sx(10,width)} y={sy(13,height)} width={sx(20,width)} height={sy(14,height)}
      fill="#fff" stroke="#16a34a" strokeWidth={1.2} rx={1} />
    <polyline points={`${sx(10,width)},${sy(13,height)} ${sx(20,width)},${sy(21,height)} ${sx(30,width)},${sy(13,height)}`}
      fill="none" stroke="#16a34a" strokeWidth={1.2} />
  </g>
);

export const BPMNEndMessageEvent: React.FC<Props> = ({ width, height }) => (
  <g>
    <circle cx={sx(20,width)} cy={sy(20,height)} r={sx(17,width)}
      fill="#fecaca" stroke="#dc2626" strokeWidth={3} />
    <rect x={sx(10,width)} y={sy(13,height)} width={sx(20,width)} height={sy(14,height)}
      fill="#dc2626" stroke="#fff" strokeWidth={1.2} rx={1} />
    <polyline points={`${sx(10,width)},${sy(13,height)} ${sx(20,width)},${sy(21,height)} ${sx(30,width)},${sy(13,height)}`}
      fill="none" stroke="#fff" strokeWidth={1.2} />
  </g>
);

export const BPMNIntermediateTimerEvent: React.FC<Props> = ({ width, height }) => (
  <g>
    <circle cx={sx(20,width)} cy={sy(20,height)} r={sx(17,width)}
      fill="#fef9c3" stroke="#ca8a04" strokeWidth={1.5} />
    <circle cx={sx(20,width)} cy={sy(20,height)} r={sx(13,width)}
      fill="none" stroke="#ca8a04" strokeWidth={1.5} />
    {/* clock hands */}
    <line x1={sx(20,width)} y1={sy(10,height)} x2={sx(20,width)} y2={sy(20,height)}
      stroke="#ca8a04" strokeWidth={1.5} />
    <line x1={sx(20,width)} y1={sy(20,height)} x2={sx(27,width)} y2={sy(23,height)}
      stroke="#ca8a04" strokeWidth={1.5} />
    <circle cx={sx(20,width)} cy={sy(20,height)} r={sx(1.5,width)} fill="#ca8a04" />
  </g>
);

export const BPMNStartErrorEvent: React.FC<Props> = ({ width, height }) => (
  <g>
    <circle cx={sx(20,width)} cy={sy(20,height)} r={sx(17,width)}
      fill="#bbf7d0" stroke="#16a34a" strokeWidth={1.5} />
    {/* lightning bolt */}
    <polyline points={`${sx(22,width)},${sy(10,height)} ${sx(16,width)},${sy(20,height)} ${sx(21,width)},${sy(20,height)} ${sx(18,width)},${sy(30,height)}`}
      fill="none" stroke="#16a34a" strokeWidth={1.5} strokeLinejoin="round" />
  </g>
);

export const BPMNStartSignalEvent: React.FC<Props> = ({ width, height }) => (
  <g>
    <circle cx={sx(20,width)} cy={sy(20,height)} r={sx(17,width)}
      fill="#bbf7d0" stroke="#16a34a" strokeWidth={1.5} />
    <polygon points={`${sx(20,width)},${sy(10,height)} ${sx(30,width)},${sy(30,height)} ${sx(10,width)},${sy(30,height)}`}
      fill="none" stroke="#16a34a" strokeWidth={1.5} />
  </g>
);
