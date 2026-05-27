// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React from "react";

type Props = { width: number; height: number };

const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;

const GatewayDiamond: React.FC<Props & { fill: string; stroke: string }> = ({ width, height, fill, stroke }) => (
  <polygon
    points={`${sx(20,width)},${sy(2,height)} ${sx(38,width)},${sy(20,height)} ${sx(20,width)},${sy(38,height)} ${sx(2,width)},${sy(20,height)}`}
    fill={fill} stroke={stroke} strokeWidth={1.8}
  />
);

export const BPMNExclusiveGateway: React.FC<Props> = ({ width, height }) => (
  <g>
    <GatewayDiamond width={width} height={height} fill="#fef9c3" stroke="#ca8a04" />
    {/* X */}
    <line x1={sx(14,width)} y1={sy(14,height)} x2={sx(26,width)} y2={sy(26,height)} stroke="#ca8a04" strokeWidth={2} />
    <line x1={sx(26,width)} y1={sy(14,height)} x2={sx(14,width)} y2={sy(26,height)} stroke="#ca8a04" strokeWidth={2} />
  </g>
);

export const BPMNParallelGateway: React.FC<Props> = ({ width, height }) => (
  <g>
    <GatewayDiamond width={width} height={height} fill="#bbf7d0" stroke="#16a34a" />
    {/* + */}
    <line x1={sx(20,width)} y1={sy(11,height)} x2={sx(20,width)} y2={sy(29,height)} stroke="#16a34a" strokeWidth={2} />
    <line x1={sx(11,width)} y1={sy(20,height)} x2={sx(29,width)} y2={sy(20,height)} stroke="#16a34a" strokeWidth={2} />
  </g>
);

export const BPMNInclusiveGateway: React.FC<Props> = ({ width, height }) => (
  <g>
    <GatewayDiamond width={width} height={height} fill="#dbeafe" stroke="#1d4ed8" />
    {/* O */}
    <circle cx={sx(20,width)} cy={sy(20,height)} r={sx(6,width)} fill="none" stroke="#1d4ed8" strokeWidth={2} />
  </g>
);

export const BPMNEventBasedGateway: React.FC<Props> = ({ width, height }) => (
  <g>
    <GatewayDiamond width={width} height={height} fill="#fef9c3" stroke="#ca8a04" />
    <circle cx={sx(20,width)} cy={sy(20,height)} r={sx(7,width)} fill="none" stroke="#ca8a04" strokeWidth={1.2} />
    <circle cx={sx(20,width)} cy={sy(20,height)} r={sx(5,width)} fill="none" stroke="#ca8a04" strokeWidth={1.2} />
    {/* pentagon */}
    {[90,162,234,306,378].map((deg, i, arr) => {
      const next = arr[(i + 1) % arr.length];
      const r = sx(3.5, width);
      const x1 = sx(20, width) + r * Math.cos((deg * Math.PI) / 180);
      const y1 = sy(20, height) + r * Math.sin((deg * Math.PI) / 180);
      const x2 = sx(20, width) + r * Math.cos((next * Math.PI) / 180);
      const y2 = sy(20, height) + r * Math.sin((next * Math.PI) / 180);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ca8a04" strokeWidth={1} />;
    })}
  </g>
);
