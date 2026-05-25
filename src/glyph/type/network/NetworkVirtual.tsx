import React from "react";

type Props = { width: number; height: number };

const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;
const sm = (n: number, w: number, h: number) => (Math.min(w, h) / 40) * n;
const smx = (n: number, w: number, h: number) => (Math.max(w, h) / 40) * n;

export const NetworkQuantumComputer: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(10, width)} y={sy(14, height)} width={sx(20, width)} height={sy(12, height)} rx={sx(4, width)} fill="#ede9fe" stroke="#7c3aed" strokeWidth={smx(2, width, height)} />
    <ellipse cx={sx(20, width)} cy={sy(20, height)} rx={sx(8, width)} ry={sy(4, height)} fill="none" stroke="#7c3aed" strokeWidth={2} />
    <ellipse cx={sx(20, width)} cy={sy(20, height)} rx={sx(5, width)} ry={sy(2.5, height)} fill="none" stroke="#a78bfa" strokeWidth={1.5} />
    <circle cx={sx(16, width)} cy={sy(20, height)} r={sx(1.5, width)} fill="#7c3aed" />
    <circle cx={sx(24, width)} cy={sy(20, height)} r={sx(1.5, width)} fill="#7c3aed" />
    <text x={sx(20, width)} y={sy(30, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#7c3aed" fontWeight={600}>Quantum</text>
  </g>
);

export const NetworkEdgeDevice: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(12, width)} y={sy(16, height)} width={sx(16, width)} height={sy(8, height)} rx={sx(4, width)} fill="#f0fdf4" stroke="#0ea5e9" strokeWidth={smx(2, width, height)} />
    <polygon
      points={`${sx(20, width)},${sy(14, height)} ${sx(24, width)},${sy(16, height)} ${sx(24, width)},${sy(20, height)} ${sx(20, width)},${sy(22, height)} ${sx(16, width)},${sy(20, height)} ${sx(16, width)},${sy(16, height)}`}
      fill="#0ea5e9"
      stroke="#0ea5e9"
      strokeWidth={1}
      opacity={0.7}
    />
    <text x={sx(20, width)} y={sy(30, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#0ea5e9" fontWeight={600}>Edge</text>
  </g>
);

export const NetworkVirtualMachine: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(12, width)} y={sy(14, height)} width={sx(16, width)} height={sy(12, height)} rx={sx(4, width)} fill="#f3f4f6" stroke="#6366f1" strokeWidth={smx(2, width, height)} />
    <rect x={sx(16, width)} y={sy(18, height)} width={sx(8, width)} height={sy(4, height)} rx={sx(1, width)} fill="#fff" stroke="#6366f1" strokeWidth={1} />
    <text x={sx(20, width)} y={sy(28, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#6366f1" fontWeight={600}>VM</text>
  </g>
);

export const NetworkIotDevice: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(14, width)} y={sy(16, height)} width={sx(12, width)} height={sy(12, height)} rx={sx(4, width)} fill="#f0fdf4" stroke="#22c55e" strokeWidth={smx(2, width, height)} />
    <path d={`M${sx(20, width)},${sy(22, height)} Q${sx(16, width)},${sy(18, height)} ${sx(24, width)},${sy(18, height)}`} stroke="#22c55e" strokeWidth={2} fill="none" />
    <path d={`M${sx(20, width)},${sy(24, height)} Q${sx(18, width)},${sy(22, height)} ${sx(22, width)},${sy(22, height)}`} stroke="#22c55e" strokeWidth={1.5} fill="none" />
    <circle cx={sx(20, width)} cy={sy(26, height)} r={sm(1.2, width, height)} fill="#22c55e" />
    <text x={sx(20, width)} y={sy(32, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#22c55e" fontWeight={600}>IoT</text>
  </g>
);

export const NetworkCloudStorage: React.FC<Props> = ({ width, height }) => (
  <g>
    <ellipse cx={sx(20, width)} cy={sy(22, height)} rx={sx(12, width)} ry={sy(8, height)} fill="#f0f9ff" stroke="#0ea5e9" strokeWidth={2} />
    <ellipse cx={sx(20, width)} cy={sy(28, height)} rx={sx(6, width)} ry={sy(2.5, height)} fill="#e0e7ef" stroke="#0ea5e9" strokeWidth={1} />
    <rect x={sx(14, width)} y={sy(28, height)} width={sx(12, width)} height={sy(4, height)} fill="#e0e7ef" stroke="#0ea5e9" strokeWidth={1} />
    <text x={sx(20, width)} y={sy(36, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#0ea5e9" fontWeight={600}>Cloud Storage</text>
  </g>
);

export const NetworkContentDelivery: React.FC<Props> = ({ width, height }) => (
  <g>
    <ellipse cx={sx(20, width)} cy={sy(20, height)} rx={sx(12, width)} ry={sy(12, height)} fill="#f0f9ff" stroke="#0ea5e9" strokeWidth={2} />
    <path d={`M${sx(8, width)},${sy(20, height)} A${sx(12, width)},${sy(12, height)} 0 0,1 ${sx(32, width)},${sy(20, height)}`} stroke="#0ea5e9" strokeWidth={1.5} fill="none" />
    <path d={`M${sx(20, width)},${sy(8, height)} A${sx(12, width)},${sy(12, height)} 0 0,1 ${sx(20, width)},${sy(32, height)}`} stroke="#0ea5e9" strokeWidth={1.5} fill="none" />
    <path d={`M${sx(20, width)},${sy(20, height)} L${sx(28, width)},${sy(12, height)}`} stroke="#0ea5e9" strokeWidth={2} markerEnd="url(#arrowhead-cdn)" />
    <defs>
      <marker id="arrowhead-cdn" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L6,3 L0,6 Z" fill="#0ea5e9" />
      </marker>
    </defs>
    <text x={sx(20, width)} y={sy(36, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#0ea5e9" fontWeight={600}>CDN</text>
  </g>
);

export const NetworkSdn: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(12, width)} y={sy(16, height)} width={sx(16, width)} height={sy(8, height)} rx={sx(4, width)} fill="#e0f2fe" stroke="#0ea5e9" strokeWidth={2} />
    <path d={`M${sx(14, width)},${sy(20, height)} L${sx(26, width)},${sy(20, height)}`} stroke="#0ea5e9" strokeWidth={2} />
    <path d={`M${sx(20, width)},${sy(18, height)} L${sx(20, width)},${sy(22, height)}`} stroke="#0ea5e9" strokeWidth={2} />
    <text x={sx(20, width)} y={sy(30, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#0ea5e9" fontWeight={600}>SDN</text>
  </g>
);

export const NetworkUtm: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(12, width)} y={sy(16, height)} width={sx(16, width)} height={sy(8, height)} rx={sx(4, width)} fill="#fee2e2" stroke="#b91c1c" strokeWidth={2} />
    <path
      d={`M${sx(20, width)},${sy(14, height)} L${sx(26, width)},${sy(18, height)} L${sx(20, width)},${sy(28, height)} L${sx(14, width)},${sy(18, height)} Z`}
      fill="#fff"
      stroke="#b91c1c"
      strokeWidth={1.5}
    />
    <text x={sx(20, width)} y={sy(30, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#b91c1c" fontWeight={600}>UTM</text>
  </g>
);

export const NetworkWirelessController: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(14, width)} y={sy(16, height)} width={sx(12, width)} height={sy(8, height)} rx={sx(3, width)} fill="#f0fdf4" stroke="#22c55e" strokeWidth={2} />
    <path d={`M${sx(20, width)},${sy(18, height)} Q${sx(16, width)},${sy(14, height)} ${sx(24, width)},${sy(14, height)}`} stroke="#22c55e" strokeWidth={2} fill="none" />
    <circle cx={sx(20, width)} cy={sy(22, height)} r={sm(1.2, width, height)} fill="#22c55e" />
    <text x={sx(20, width)} y={sy(30, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#22c55e" fontWeight={600}>Wireless Ctrl</text>
  </g>
);

export const NetworkFunctionVirtualization: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(12, width)} y={sy(16, height)} width={sx(16, width)} height={sy(8, height)} rx={sx(4, width)} fill="#f3f4f6" stroke="#6366f1" strokeWidth={2} />
    <rect x={sx(14, width)} y={sy(18, height)} width={sx(12, width)} height={sy(4, height)} rx={sx(1, width)} fill="#fff" stroke="#6366f1" strokeWidth={1} />
    <rect x={sx(15, width)} y={sy(22, height)} width={sx(10, width)} height={sy(2, height)} rx={sx(1, width)} fill="#e0e7ef" stroke="#6366f1" strokeWidth={1} />
    <text x={sx(20, width)} y={sy(30, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#6366f1" fontWeight={600}>NFV</text>
  </g>
);

export const NetworkFirewallAlt: React.FC<Props> = ({ width, height }) => (
  <g>
    <path
      d={`M${sx(20, width)},${sy(12, height)} L${sx(28, width)},${sy(18, height)} L${sx(24, width)},${sy(32, height)} L${sx(16, width)},${sy(32, height)} L${sx(12, width)},${sy(18, height)} Z`}
      fill="#fee2e2"
      stroke="#b91c1c"
      strokeWidth={smx(2, width, height)}
    />
    <path d={`M${sx(20, width)},${sy(16, height)} L${sx(20, width)},${sy(28, height)}`} stroke="#b91c1c" strokeWidth={2} />
    <path d={`M${sx(16, width)},${sy(24, height)} L${sx(24, width)},${sy(24, height)}`} stroke="#b91c1c" strokeWidth={2} />
    <text x={sx(20, width)} y={sy(36, height)} textAnchor="middle" fontSize={sy(4, height)} fill="#b91c1c" fontWeight={600}>Firewall</text>
  </g>
);
