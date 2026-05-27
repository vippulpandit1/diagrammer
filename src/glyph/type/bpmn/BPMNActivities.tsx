// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React from "react";

type Props = { width: number; height: number };

const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;

export const BPMNTask: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(2,width)} y={sy(4,height)} width={sx(36,width)} height={sy(32,height)}
      rx={sx(4,width)} fill="#dbeafe" stroke="#1d4ed8" strokeWidth={1.5} />
  </g>
);

export const BPMNSubProcess: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(2,width)} y={sy(4,height)} width={sx(36,width)} height={sy(32,height)}
      rx={sx(4,width)} fill="#ede9fe" stroke="#7c3aed" strokeWidth={1.5} />
    {/* + marker */}
    <rect x={sx(14,width)} y={sy(31,height)} width={sx(12,width)} height={sy(7,height)}
      rx={sx(1,width)} fill="#fff" stroke="#7c3aed" strokeWidth={1} />
    <line x1={sx(20,width)} y1={sy(32.5,height)} x2={sx(20,width)} y2={sy(37,height)} stroke="#7c3aed" strokeWidth={1.2} />
    <line x1={sx(15,width)} y1={sy(34.5,height)} x2={sx(25,width)} y2={sy(34.5,height)} stroke="#7c3aed" strokeWidth={1.2} />
  </g>
);

export const BPMNCallActivity: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(2,width)} y={sy(4,height)} width={sx(36,width)} height={sy(32,height)}
      rx={sx(4,width)} fill="#dbeafe" stroke="#1d4ed8" strokeWidth={3} />
  </g>
);

export const BPMNUserTask: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(2,width)} y={sy(4,height)} width={sx(36,width)} height={sy(32,height)}
      rx={sx(4,width)} fill="#dbeafe" stroke="#1d4ed8" strokeWidth={1.5} />
    {/* person icon */}
    <circle cx={sx(10,width)} cy={sy(13,height)} r={sx(4,width)} fill="#1d4ed8" />
    <path d={`M${sx(4,width)},${sy(26,height)} Q${sx(4,width)},${sy(20,height)} ${sx(10,width)},${sy(20,height)} Q${sx(16,width)},${sy(20,height)} ${sx(16,width)},${sy(26,height)}`}
      fill="#1d4ed8" />
  </g>
);

export const BPMNServiceTask: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(2,width)} y={sy(4,height)} width={sx(36,width)} height={sy(32,height)}
      rx={sx(4,width)} fill="#dbeafe" stroke="#1d4ed8" strokeWidth={1.5} />
    {/* gear icon */}
    <circle cx={sx(11,width)} cy={sy(18,height)} r={sx(5,width)} fill="none" stroke="#1d4ed8" strokeWidth={1.5} />
    <circle cx={sx(11,width)} cy={sy(18,height)} r={sx(2.5,width)} fill="#1d4ed8" />
    {[0,45,90,135,180,225,270,315].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const x1 = sx(11 + 5.5 * Math.cos(rad), width);
      const y1 = sy(18 + 5.5 * Math.sin(rad), height);
      const x2 = sx(11 + 7 * Math.cos(rad), width);
      const y2 = sy(18 + 7 * Math.sin(rad), height);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1d4ed8" strokeWidth={2} />;
    })}
  </g>
);

export const BPMNSendTask: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(2,width)} y={sy(4,height)} width={sx(36,width)} height={sy(32,height)}
      rx={sx(4,width)} fill="#dbeafe" stroke="#1d4ed8" strokeWidth={1.5} />
    <rect x={sx(4,width)} y={sy(10,height)} width={sx(14,width)} height={sy(10,height)}
      fill="#1d4ed8" stroke="none" rx={1} />
    <polyline points={`${sx(4,width)},${sy(10,height)} ${sx(11,width)},${sy(16,height)} ${sx(18,width)},${sy(10,height)}`}
      fill="none" stroke="#fff" strokeWidth={1} />
  </g>
);

export const BPMNReceiveTask: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(2,width)} y={sy(4,height)} width={sx(36,width)} height={sy(32,height)}
      rx={sx(4,width)} fill="#dbeafe" stroke="#1d4ed8" strokeWidth={1.5} />
    <rect x={sx(4,width)} y={sy(10,height)} width={sx(14,width)} height={sy(10,height)}
      fill="#fff" stroke="#1d4ed8" strokeWidth={1} rx={1} />
    <polyline points={`${sx(4,width)},${sy(10,height)} ${sx(11,width)},${sy(16,height)} ${sx(18,width)},${sy(10,height)}`}
      fill="none" stroke="#1d4ed8" strokeWidth={1} />
  </g>
);

export const BPMNScriptTask: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(2,width)} y={sy(4,height)} width={sx(36,width)} height={sy(32,height)}
      rx={sx(4,width)} fill="#dbeafe" stroke="#1d4ed8" strokeWidth={1.5} />
    {/* script lines */}
    <line x1={sx(5,width)} y1={sy(12,height)} x2={sx(16,width)} y2={sy(12,height)} stroke="#1d4ed8" strokeWidth={1.2} />
    <line x1={sx(5,width)} y1={sy(16,height)} x2={sx(16,width)} y2={sy(16,height)} stroke="#1d4ed8" strokeWidth={1.2} />
    <line x1={sx(5,width)} y1={sy(20,height)} x2={sx(13,width)} y2={sy(20,height)} stroke="#1d4ed8" strokeWidth={1.2} />
    {/* scroll curl */}
    <path d={`M${sx(4,width)},${sy(8,height)} Q${sx(7,width)},${sy(6,height)} ${sx(10,width)},${sy(8,height)} Q${sx(13,width)},${sy(10,height)} ${sx(16,width)},${sy(8,height)}`}
      fill="none" stroke="#1d4ed8" strokeWidth={1} />
  </g>
);
