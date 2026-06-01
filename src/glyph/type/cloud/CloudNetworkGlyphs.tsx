import React from "react";

type Props = { width: number; height: number };
const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;
const sm = (n: number, w: number, h: number) => (Math.min(w, h) / 40) * n;

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
