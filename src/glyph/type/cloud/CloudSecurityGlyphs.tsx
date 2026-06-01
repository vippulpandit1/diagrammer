import React from "react";

type Props = { width: number; height: number };
const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;
const sm = (n: number, w: number, h: number) => (Math.min(w, h) / 40) * n;

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
