// Cloud architecture glyph components — provider-agnostic building blocks
import React from "react";

type Props = { width: number; height: number };
const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;
const sm = (n: number, w: number, h: number) => (Math.min(w, h) / 40) * n;

// ── Compute ───────────────────────────────────────────────────────────────────

export const CloudVm: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <rect x={sx(6,w)} y={sy(7,h)} width={sx(28,w)} height={sy(20,h)} rx={sx(2,w)} fill="#bfdbfe" stroke="#1d4ed8" strokeWidth={1.5}/>
    <rect x={sx(9,w)} y={sy(10,h)} width={sx(22,w)} height={sy(14,h)} fill="#fff" stroke="#93c5fd"/>
    <line x1={sx(12,w)} y1={sy(14,h)} x2={sx(28,w)} y2={sy(14,h)} stroke="#3b82f6" strokeWidth={1}/>
    <line x1={sx(12,w)} y1={sy(17,h)} x2={sx(28,w)} y2={sy(17,h)} stroke="#3b82f6" strokeWidth={1}/>
    <line x1={sx(12,w)} y1={sy(20,h)} x2={sx(28,w)} y2={sy(20,h)} stroke="#3b82f6" strokeWidth={1}/>
    <rect x={sx(17,w)} y={sy(27,h)} width={sx(6,w)} height={sy(2,h)} fill="#6b7280"/>
    <rect x={sx(13,w)} y={sy(29,h)} width={sx(14,w)} height={sy(1.5,h)} fill="#6b7280"/>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#1d4ed8" fontWeight={600}>VM</text>
  </g>
);

export const CloudContainer: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <rect x={sx(5,w)} y={sy(7,h)} width={sx(30,w)} height={sy(6,h)} rx={sx(1,w)} fill="#99f6e4" stroke="#0d9488" strokeWidth={1.5}/>
    <rect x={sx(5,w)} y={sy(15,h)} width={sx(30,w)} height={sy(6,h)} rx={sx(1,w)} fill="#5eead4" stroke="#0d9488" strokeWidth={1.5}/>
    <rect x={sx(5,w)} y={sy(23,h)} width={sx(30,w)} height={sy(6,h)} rx={sx(1,w)} fill="#2dd4bf" stroke="#0d9488" strokeWidth={1.5}/>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#0d9488" fontWeight={600}>Container</text>
  </g>
);

export const CloudFunction: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <rect x={sx(5,w)} y={sy(7,h)} width={sx(30,w)} height={sy(23,h)} rx={sx(4,w)} fill="#fde68a" stroke="#d97706" strokeWidth={1.5}/>
    <text x={sx(20,w)} y={sy(21,h)} textAnchor="middle" fontSize={sy(14,h)} fill="#92400e" fontWeight={700} dominantBaseline="middle">λ</text>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#d97706" fontWeight={600}>Function</text>
  </g>
);

export const CloudKubernetes: React.FC<Props> = ({ width: w, height: h }) => {
  const cx = sx(20, w), cy = sy(17, h), r = sm(10, w, h);
  const hexPts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(' ');
  const innerR = sm(3.5, w, h);
  const spokes = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return (
      <line key={i}
        x1={cx + innerR * Math.cos(a)} y1={cy + innerR * Math.sin(a)}
        x2={cx + r * 0.82 * Math.cos(a)} y2={cy + r * 0.82 * Math.sin(a)}
        stroke="#2563eb" strokeWidth={sm(1.2, w, h)}/>
    );
  });
  return (
    <g>
      <polygon points={hexPts} fill="#dbeafe" stroke="#2563eb" strokeWidth={1.5}/>
      <circle cx={cx} cy={cy} r={innerR} fill="#2563eb"/>
      {spokes}
      <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#2563eb" fontWeight={600}>Kubernetes</text>
    </g>
  );
};

// ── Storage ───────────────────────────────────────────────────────────────────

export const CloudObjectStorage: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <path d={`M ${sx(11,w)},${sy(9,h)} L ${sx(9,w)},${sy(28,h)} L ${sx(31,w)},${sy(28,h)} L ${sx(29,w)},${sy(9,h)} Z`}
      fill="#bbf7d0" stroke="#16a34a" strokeWidth={1.5}/>
    <path d={`M ${sx(14,w)},${sy(9,h)} Q ${sx(20,w)},${sy(5,h)} ${sx(26,w)},${sy(9,h)}`}
      fill="none" stroke="#16a34a" strokeWidth={2}/>
    <line x1={sx(10,w)} y1={sy(16,h)} x2={sx(30,w)} y2={sy(16,h)} stroke="#16a34a" strokeWidth={1} strokeDasharray="2,1.5"/>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#16a34a" fontWeight={600}>Object Storage</text>
  </g>
);

export const CloudBlockStorage: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <rect x={sx(5,w)} y={sy(7,h)} width={sx(30,w)} height={sy(23,h)} rx={sx(2,w)} fill="#d1fae5" stroke="#059669" strokeWidth={1.5}/>
    <line x1={sx(5,w)} y1={sy(14,h)} x2={sx(35,w)} y2={sy(14,h)} stroke="#059669" strokeWidth={1}/>
    <line x1={sx(5,w)} y1={sy(21,h)} x2={sx(35,w)} y2={sy(21,h)} stroke="#059669" strokeWidth={1}/>
    <circle cx={sx(31,w)} cy={sy(11,h)} r={sm(2,w,h)} fill="#059669"/>
    <circle cx={sx(31,w)} cy={sy(18,h)} r={sm(2,w,h)} fill="#059669"/>
    <circle cx={sx(31,w)} cy={sy(25,h)} r={sm(2,w,h)} fill="#059669"/>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#059669" fontWeight={600}>Block Storage</text>
  </g>
);

export const CloudDatabase: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <ellipse cx={sx(20,w)} cy={sy(11,h)} rx={sx(12,w)} ry={sy(3.5,h)} fill="#a7f3d0" stroke="#059669" strokeWidth={1.5}/>
    <rect x={sx(8,w)} y={sy(11,h)} width={sx(24,w)} height={sy(16,h)} fill="#a7f3d0" stroke="#059669" strokeWidth={1.5}/>
    <ellipse cx={sx(20,w)} cy={sy(27,h)} rx={sx(12,w)} ry={sy(3.5,h)} fill="#6ee7b7" stroke="#059669" strokeWidth={1.5}/>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#059669" fontWeight={600}>Database</text>
  </g>
);

export const CloudCache: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <rect x={sx(5,w)} y={sy(7,h)} width={sx(30,w)} height={sy(23,h)} rx={sx(3,w)} fill="#fecdd3" stroke="#e11d48" strokeWidth={1.5}/>
    <polygon
      points={`${sx(23,w)},${sy(9,h)} ${sx(15,w)},${sy(20,h)} ${sx(20,w)},${sy(20,h)} ${sx(17,w)},${sy(29,h)} ${sx(25,w)},${sy(18,h)} ${sx(20,w)},${sy(18,h)}`}
      fill="#e11d48"/>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#e11d48" fontWeight={600}>Cache</text>
  </g>
);

// ── Network ───────────────────────────────────────────────────────────────────

export const CloudVpc: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <rect x={sx(2,w)} y={sy(8,h)} width={sx(36,w)} height={sy(22,h)} rx={sx(3,w)}
      fill="#ede9fe" stroke="#7c3aed" strokeWidth={1.5} strokeDasharray={`${sx(3.5,w)},${sx(2,w)}`}/>
    <ellipse cx={sx(11,w)} cy={sy(14,h)} rx={sx(4.5,w)} ry={sy(3,h)} fill="#c4b5fd" stroke="#7c3aed"/>
    <ellipse cx={sx(19,w)} cy={sy(12,h)} rx={sx(5.5,w)} ry={sy(3.5,h)} fill="#c4b5fd" stroke="#7c3aed"/>
    <ellipse cx={sx(28,w)} cy={sy(14,h)} rx={sx(4.5,w)} ry={sy(3,h)} fill="#c4b5fd" stroke="#7c3aed"/>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#7c3aed" fontWeight={600}>VPC</text>
  </g>
);

export const CloudLoadBalancer: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <circle cx={sx(20,w)} cy={sy(10,h)} r={sm(4,w,h)} fill="#fed7aa" stroke="#ea580c" strokeWidth={1.5}/>
    <line x1={sx(20,w)} y1={sy(14,h)} x2={sx(10,w)} y2={sy(22,h)} stroke="#ea580c" strokeWidth={1.5}/>
    <line x1={sx(20,w)} y1={sy(14,h)} x2={sx(20,w)} y2={sy(22,h)} stroke="#ea580c" strokeWidth={1.5}/>
    <line x1={sx(20,w)} y1={sy(14,h)} x2={sx(30,w)} y2={sy(22,h)} stroke="#ea580c" strokeWidth={1.5}/>
    <circle cx={sx(10,w)} cy={sy(25,h)} r={sm(3,w,h)} fill="#fed7aa" stroke="#ea580c" strokeWidth={1.5}/>
    <circle cx={sx(20,w)} cy={sy(25,h)} r={sm(3,w,h)} fill="#fed7aa" stroke="#ea580c" strokeWidth={1.5}/>
    <circle cx={sx(30,w)} cy={sy(25,h)} r={sm(3,w,h)} fill="#fed7aa" stroke="#ea580c" strokeWidth={1.5}/>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#ea580c" fontWeight={600}>Load Balancer</text>
  </g>
);

export const CloudCdn: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <circle cx={sx(20,w)} cy={sy(17,h)} r={sm(11,w,h)} fill="#e0f2fe" stroke="#0284c7" strokeWidth={1.5}/>
    <ellipse cx={sx(20,w)} cy={sy(17,h)} rx={sm(11,w,h)} ry={sm(4,w,h)} fill="none" stroke="#0284c7" strokeWidth={1}/>
    <line x1={sx(20,w)} y1={sy(6,h)} x2={sx(20,w)} y2={sy(28,h)} stroke="#0284c7" strokeWidth={1}/>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#0284c7" fontWeight={600}>CDN</text>
  </g>
);

export const CloudApiGateway: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <rect x={sx(7,w)} y={sy(9,h)} width={sx(26,w)} height={sy(20,h)} rx={sx(2,w)} fill="#fef3c7" stroke="#d97706" strokeWidth={1.5}/>
    <line x1={sx(2,w)} y1={sy(19,h)} x2={sx(38,w)} y2={sy(19,h)} stroke="#d97706" strokeWidth={2}/>
    <polygon points={`${sx(35,w)},${sy(16,h)} ${sx(38,w)},${sy(19,h)} ${sx(35,w)},${sy(22,h)}`} fill="#d97706"/>
    <text x={sx(20,w)} y={sy(21,h)} textAnchor="middle" fontSize={sy(5.5,h)} fill="#92400e" fontWeight={700} dominantBaseline="middle">API</text>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#d97706" fontWeight={600}>API Gateway</text>
  </g>
);

// ── Security ──────────────────────────────────────────────────────────────────

const ShieldPath: React.FC<{ w: number; h: number; fill: string; stroke: string }> = ({ w, h, fill, stroke }) => (
  <path
    d={`M ${sx(20,w)},${sy(5,h)} L ${sx(35,w)},${sy(11,h)} L ${sx(35,w)},${sy(22,h)} Q ${sx(35,w)},${sy(32,h)} ${sx(20,w)},${sy(35,h)} Q ${sx(5,w)},${sy(32,h)} ${sx(5,w)},${sy(22,h)} L ${sx(5,w)},${sy(11,h)} Z`}
    fill={fill} stroke={stroke} strokeWidth={1.5}/>
);

export const CloudIam: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <ShieldPath w={w} h={h} fill="#fee2e2" stroke="#dc2626"/>
    <circle cx={sx(20,w)} cy={sy(15,h)} r={sm(4,w,h)} fill="#dc2626"/>
    <path d={`M ${sx(10,w)},${sy(30,h)} Q ${sx(10,w)},${sy(24,h)} ${sx(20,w)},${sy(24,h)} Q ${sx(30,w)},${sy(24,h)} ${sx(30,w)},${sy(30,h)}`}
      fill="#dc2626" stroke="none"/>
    <text x={sx(20,w)} y={sy(39,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#dc2626" fontWeight={600}>IAM</text>
  </g>
);

export const CloudFirewall: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <ShieldPath w={w} h={h} fill="#fecaca" stroke="#dc2626"/>
    <path d={`M ${sx(20,w)},${sy(30,h)} Q ${sx(16,w)},${sy(25,h)} ${sx(18,w)},${sy(20,h)} Q ${sx(14,w)},${sy(22,h)} ${sx(14,w)},${sy(17,h)} Q ${sx(14,w)},${sy(12,h)} ${sx(18,w)},${sy(11,h)} Q ${sx(17,w)},${sy(15,h)} ${sx(19,w)},${sy(16,h)} Q ${sx(20,w)},${sy(12,h)} ${sx(22,w)},${sy(11,h)} Q ${sx(25,w)},${sy(12,h)} ${sx(26,w)},${sy(17,h)} Q ${sx(28,w)},${sy(15,h)} ${sx(27,w)},${sy(11,h)} Q ${sx(30,w)},${sy(13,h)} ${sx(30,w)},${sy(19,h)} Q ${sx(30,w)},${sy(24,h)} ${sx(26,w)},${sy(26,h)} Q ${sx(25,w)},${sy(23,h)} ${sx(22,w)},${sy(24,h)} Q ${sx(23,w)},${sy(28,h)} ${sx(20,w)},${sy(30,h)}`}
      fill="#dc2626" stroke="none"/>
    <text x={sx(20,w)} y={sy(39,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#dc2626" fontWeight={600}>Firewall</text>
  </g>
);

export const CloudWaf: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <ShieldPath w={w} h={h} fill="#fce7f3" stroke="#db2777"/>
    <text x={sx(20,w)} y={sy(23,h)} textAnchor="middle" fontSize={sy(12,h)} fill="#db2777" fontWeight={800} dominantBaseline="middle">W</text>
    <text x={sx(20,w)} y={sy(39,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#db2777" fontWeight={600}>WAF</text>
  </g>
);

export const CloudKms: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <circle cx={sx(20,w)} cy={sy(13,h)} r={sm(6,w,h)} fill="#fef9c3" stroke="#ca8a04" strokeWidth={1.5}/>
    <circle cx={sx(20,w)} cy={sy(13,h)} r={sm(3,w,h)} fill="#fff" stroke="#ca8a04"/>
    <rect x={sx(18.5,w)} y={sy(19,h)} width={sx(3,w)} height={sy(9,h)} rx={sx(0.5,w)} fill="#ca8a04"/>
    <rect x={sx(15,w)} y={sy(24,h)} width={sx(10,w)} height={sy(4,h)} rx={sx(1,w)} fill="#fef9c3" stroke="#ca8a04" strokeWidth={1.5}/>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#ca8a04" fontWeight={600}>KMS</text>
  </g>
);

// ── Services ──────────────────────────────────────────────────────────────────

export const CloudQueue: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <rect x={sx(3,w)} y={sy(13,h)} width={sx(9,w)} height={sy(12,h)} rx={sx(1,w)} fill="#ede9fe" stroke="#7c3aed" strokeWidth={1.5}/>
    <rect x={sx(14,w)} y={sy(13,h)} width={sx(9,w)} height={sy(12,h)} rx={sx(1,w)} fill="#ddd6fe" stroke="#7c3aed" strokeWidth={1.5}/>
    <rect x={sx(25,w)} y={sy(13,h)} width={sx(9,w)} height={sy(12,h)} rx={sx(1,w)} fill="#c4b5fd" stroke="#7c3aed" strokeWidth={1.5}/>
    <line x1={sx(34,w)} y1={sy(19,h)} x2={sx(38,w)} y2={sy(19,h)} stroke="#7c3aed" strokeWidth={1.5}/>
    <polygon points={`${sx(36,w)},${sy(16,h)} ${sx(39,w)},${sy(19,h)} ${sx(36,w)},${sy(22,h)}`} fill="#7c3aed"/>
    <text x={sx(20,w)} y={sy(32,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#7c3aed" fontWeight={600}>Queue</text>
  </g>
);

export const CloudEventBus: React.FC<Props> = ({ width: w, height: h }) => {
  const xPositions = [9, 16, 23, 31];
  return (
    <g>
      <rect x={sx(5,w)} y={sy(16,h)} width={sx(30,w)} height={sy(8,h)} rx={sx(1,w)} fill="#e0e7ff" stroke="#4f46e5" strokeWidth={1.5}/>
      {xPositions.map((x, i) => (
        <line key={i} x1={sx(x,w)} y1={sy(11,h)} x2={sx(x,w)} y2={sy(30,h)} stroke="#4f46e5" strokeWidth={1.5}/>
      ))}
      {[9, 23, 31].map((x, i) => (
        <polygon key={i} points={`${sx(x-1.5,w)},${sy(11,h)} ${sx(x+1.5,w)},${sy(11,h)} ${sx(x,w)},${sy(9,h)}`} fill="#4f46e5"/>
      ))}
      <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#4f46e5" fontWeight={600}>Event Bus</text>
    </g>
  );
};

export const CloudMonitoring: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <rect x={sx(4,w)} y={sy(7,h)} width={sx(32,w)} height={sy(23,h)} rx={sx(2,w)} fill="#eff6ff" stroke="#3b82f6" strokeWidth={1.5}/>
    <rect x={sx(8,w)} y={sy(21,h)} width={sx(5,w)} height={sy(7,h)} fill="#bfdbfe" stroke="#3b82f6"/>
    <rect x={sx(15,w)} y={sy(16,h)} width={sx(5,w)} height={sy(12,h)} fill="#3b82f6"/>
    <rect x={sx(22,w)} y={sy(12,h)} width={sx(5,w)} height={sy(16,h)} fill="#1d4ed8"/>
    <rect x={sx(29,w)} y={sy(18,h)} width={sx(5,w)} height={sy(10,h)} fill="#3b82f6"/>
    <line x1={sx(6,w)} y1={sy(28,h)} x2={sx(35,w)} y2={sy(28,h)} stroke="#1e3a5f" strokeWidth={1}/>
    <text x={sx(20,w)} y={sy(36,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#3b82f6" fontWeight={600}>Monitoring</text>
  </g>
);

export const CloudCicd: React.FC<Props> = ({ width: w, height: h }) => (
  <g>
    <circle cx={sx(7,w)} cy={sy(18,h)} r={sm(4,w,h)} fill="#c7d2fe" stroke="#4f46e5" strokeWidth={1.5}/>
    <line x1={sx(11,w)} y1={sy(18,h)} x2={sx(16,w)} y2={sy(18,h)} stroke="#4f46e5" strokeWidth={1.5}/>
    <polygon points={`${sx(14,w)},${sy(15,h)} ${sx(17,w)},${sy(18,h)} ${sx(14,w)},${sy(21,h)}`} fill="#4f46e5"/>
    <circle cx={sx(21,w)} cy={sy(18,h)} r={sm(4,w,h)} fill="#c7d2fe" stroke="#4f46e5" strokeWidth={1.5}/>
    <line x1={sx(25,w)} y1={sy(18,h)} x2={sx(30,w)} y2={sy(18,h)} stroke="#4f46e5" strokeWidth={1.5}/>
    <polygon points={`${sx(28,w)},${sy(15,h)} ${sx(31,w)},${sy(18,h)} ${sx(28,w)},${sy(21,h)}`} fill="#4f46e5"/>
    <circle cx={sx(35,w)} cy={sy(18,h)} r={sm(4,w,h)} fill="#c7d2fe" stroke="#4f46e5" strokeWidth={1.5}/>
    <polyline points={`${sx(32,w)},${sy(18,h)} ${sx(34,w)},${sy(21,h)} ${sx(38,w)},${sy(14,h)}`}
      fill="none" stroke="#4f46e5" strokeWidth={1.5}/>
    <text x={sx(21,w)} y={sy(30,h)} textAnchor="middle" fontSize={sy(4,h)} fill="#4f46e5" fontWeight={600}>CI/CD</text>
  </g>
);
