import React from "react";

type Props = { width: number; height: number };

const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;

export const FlowServer: React.FC<Props> = ({ width, height }) => (
  <g>
    <rect x={sx(8, width)} y={sy(10, height)} width={sx(24, width)} height={sy(20, height)} rx={sx(4, width)} fill="#dbeafe" stroke="#1e40af" strokeWidth={2} />
    <path
      d={`
        M ${sx(20, width)} ${sy(15, height)}
        a 5 5 0 1 0 0 10
        a 5 5 0 1 0 0 -10
        Z
        M ${sx(20, width)} ${sy(17, height)}
        a 3 3 0 1 0 0 6
        a 3 3 0 1 0 0 -6
        Z
      `}
      fill="#1e40af"
    />
    <path
      d={`
        M ${sx(20, width)} ${sy(14, height)} v -1
        M ${sx(20, width)} ${sy(26, height)} v 1
        M ${sx(14, width)} ${sy(20, height)} h -1
        M ${sx(26, width)} ${sy(20, height)} h 1
        M ${sx(16, width)} ${sy(16, height)} l -1 -1
        M ${sx(24, width)} ${sy(24, height)} l 1 1
        M ${sx(16, width)} ${sy(24, height)} l -1 1
        M ${sx(24, width)} ${sy(16, height)} l 1 -1
      `}
      stroke="#1e40af" strokeWidth={2} strokeLinecap="round"
    />
  </g>
);
