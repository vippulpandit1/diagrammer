import React from "react";

type Props = { width: number; height: number };

const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;
const smx = (n: number, w: number, h: number) => (Math.max(w, h) / 40) * n;

export const NetworkDns: React.FC<Props> = ({ width, height }) => (
  <g>
    <ellipse cx={sx(20, width)} cy={sy(14, height)} rx={sx(10, width)} ry={sy(4, height)} fill="#e0e7ef" stroke="#6366f1" strokeWidth={2} />
    <rect x={sx(10, width)} y={sy(14, height)} width={sx(20, width)} height={sy(12, height)} fill="#e0e7ef" stroke="#6366f1" strokeWidth={2} />
    <ellipse cx={sx(20, width)} cy={sy(26, height)} rx={sx(10, width)} ry={sy(4, height)} fill="#e0e7ef" stroke="#6366f1" strokeWidth={2} />
    <text x={sx(20, width)} y={sy(22, height)} textAnchor="middle" fontSize={sy(5, height)} fill="#6366f1" fontWeight={700}>DNS</text>
  </g>
);

export const NetworkDhcp: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(10, width)} y={sy(14, height)} width={sx(20, width)} height={sy(12, height)} rx={sx(3, width)} fill="#fef9c3" stroke="#eab308" strokeWidth={smx(2, width, height)} />
    <rect x={sx(18, width)} y={sy(26, height)} width={sx(4, width)} height={sy(6, height)} fill="#eab308" stroke="#eab308" strokeWidth={1} rx={sx(1, width)} />
    <text x={sx(20, width)} y={sy(22, height)} textAnchor="middle" fontSize={sy(5, height)} fill="#eab308" fontWeight={700}>DHCP</text>
  </g>
);

export const NetworkNat: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(10, width)} y={sy(14, height)} width={sx(20, width)} height={sy(12, height)} rx={sx(3, width)} fill="#e0f2fe" stroke="#0ea5e9" strokeWidth={smx(2, width, height)} />
    <path d={`M${sx(14, width)},${sy(20, height)} L${sx(18, width)},${sy(20, height)}`} stroke="#0ea5e9" strokeWidth={2} markerEnd="url(#arrowhead-nat)" />
    <path d={`M${sx(26, width)},${sy(20, height)} L${sx(22, width)},${sy(20, height)}`} stroke="#0ea5e9" strokeWidth={2} markerEnd="url(#arrowhead-nat)" />
    <defs>
      <marker id="arrowhead-nat" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L6,3 L0,6 Z" fill="#0ea5e9" />
      </marker>
    </defs>
    <text x={sx(20, width)} y={sy(22, height)} textAnchor="middle" fontSize={sy(5, height)} fill="#0ea5e9" fontWeight={700}>NAT</text>
  </g>
);

export const NetworkProxy: React.FC<Props> = ({ width, height }) => (
  <g>
    <ellipse cx={sx(20, width)} cy={sy(20, height)} rx={sx(12, width)} ry={sy(10, height)} fill="#f0f9ff" stroke="#6366f1" strokeWidth={2} />
    <path d={`M${sx(12, width)},${sy(20, height)} Q${sx(20, width)},${sy(8, height)} ${sx(28, width)},${sy(20, height)}`} stroke="#6366f1" strokeWidth={2} fill="none" />
    <rect x={sx(16, width)} y={sy(16, height)} width={sx(8, width)} height={sy(8, height)} rx={sx(2, width)} fill="#6366f1" opacity={0.2} />
    <text x={sx(20, width)} y={sy(34, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#6366f1" fontWeight={600}>Proxy</text>
  </g>
);

export const NetworkIds: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(10, width)} y={sy(14, height)} width={sx(20, width)} height={sy(12, height)} rx={sx(4, width)} fill="#fef2f2" stroke="#dc2626" strokeWidth={smx(2, width, height)} />
    <polygon points={`${sx(20, width)},${sy(16, height)} ${sx(14, width)},${sy(26, height)} ${sx(26, width)},${sy(26, height)}`} fill="#dc2626" opacity={0.7} stroke="#dc2626" strokeWidth={1} />
    <circle cx={sx(20, width)} cy={sy(23, height)} r={sx(1.5, width)} fill="#fff" />
    <text x={sx(20, width)} y={sy(30, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#dc2626" fontWeight={600}>IDS</text>
  </g>
);

export const NetworkGateway: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(12, width)} y={sy(16, height)} width={sx(16, width)} height={sy(8, height)} rx={sx(4, width)} fill="#f3f4f6" stroke="#0ea5e9" strokeWidth={smx(2, width, height)} />
    <path d={`M${sx(16, width)},${sy(20, height)} L${sx(24, width)},${sy(20, height)}`} stroke="#0ea5e9" strokeWidth={2} markerEnd="url(#arrowhead-gateway)" />
    <defs>
      <marker id="arrowhead-gateway" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L6,3 L0,6 Z" fill="#0ea5e9" />
      </marker>
    </defs>
    <text x={sx(20, width)} y={sy(30, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#0ea5e9" fontWeight={600}>Gateway</text>
  </g>
);

export const NetworkVpn: React.FC<Props> = ({ width, height }) => (
  <g>
    <ellipse cx={sx(20, width)} cy={sy(20, height)} rx={sx(12, width)} ry={sy(10, height)} fill="#e0f2fe" stroke="#2563eb" strokeWidth={2} />
    <rect x={sx(16, width)} y={sy(18, height)} width={sx(8, width)} height={sy(6, height)} rx={sx(2, width)} fill="#fff" stroke="#2563eb" strokeWidth={1} />
    <rect x={sx(18, width)} y={sy(16, height)} width={sx(4, width)} height={sy(2, height)} rx={sx(1, width)} fill="#2563eb" stroke="#2563eb" strokeWidth={1} />
    <text x={sx(20, width)} y={sy(34, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#2563eb" fontWeight={600}>VPN</text>
  </g>
);
