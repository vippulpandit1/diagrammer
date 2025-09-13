import React from "react";
export const NorGateGlyph: React.FC<{ width: number; height?: number }> = ({ width, height }) => {
  const h = height ?? width;
  // OR shape path coordinates
  const leftX = width * 0.1;
  const topY = h * 0.2;
  const midY = h * 0.5;
  const bottomY = h * 0.8;
  const rightX = width * 0.9;
  // NOT circle
  const circleCX = width * 0.8;
  const circleCY = h / 2;
  const circleR = Math.min(width, h) * 0.08;

  return (
    <g>
      {/* OR shape */}
      <path
        d={`
          M${leftX},${topY}
          Q${width * 0.4},${midY} ${leftX},${bottomY}
          Q${width * 0.5},${midY} ${rightX},${midY}
          Q${width * 0.5},${midY} ${leftX},${topY}
        `}
        fill="#fff"
        stroke="#222"
        strokeWidth={2}
      />
      {/* NOT circle */}
      <circle
        cx={circleCX}
        cy={circleCY}
        r={circleR}
        fill="#fff"
        stroke="#222"
        strokeWidth={2}
      />
    </g>
  );
};