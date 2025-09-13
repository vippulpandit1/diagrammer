import React from "react";
export const NandGateGlyph: React.FC<{ width: number; height?: number }> = ({ width, height }) => {
  const h = height ?? width;
  // Rectangle (AND part)
  const rectX = 0;
  const rectY = 0;
  const rectW = width * 0.5;
  const rectH = h;
  const rectRX = width * 0.1;
  // Arc (AND part)
  const arcStartX = width * 0.5;
  const arcStartY = 0;
  const arcEndX = width * 0.5;
  const arcEndY = h;
  const arcRadius = h / 2;
  // NOT circle
  const circleCX = width * 0.8;
  const circleCY = h / 2;
  const circleR = Math.min(width, h) * 0.08;

  return (
    <g>
      {/* AND shape */}
      <rect
        x={rectX}
        y={rectY}
        width={rectW}
        height={rectH}
        rx={rectRX}
        fill="#fff"
        stroke="#222"
        strokeWidth={2}
      />
      <path
        d={`
          M${arcStartX},${arcStartY}
          A${arcRadius},${arcRadius} 0 0 1 ${arcEndX},${arcEndY}
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