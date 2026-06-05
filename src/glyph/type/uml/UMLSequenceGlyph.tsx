import React from "react";

type SequenceGlyphType =
  | "uml-sequence-actor"
  | "uml-sequence-participant"
  | "uml-sequence-lifeline"
  | "uml-sequence-activation"
  | "uml-sequence-message"
  | "uml-sequence-return";

export const UMLSequenceGlyph: React.FC<{
  type: SequenceGlyphType | string;
  width: number;
  height?: number;
}> = ({ type, width, height = Math.max(40, width * 1.4) }) => {
  const w = Math.max(24, width);
  const h = Math.max(40, height);

  switch (type) {
    case "uml-sequence-actor":
      return (
        <g>
          <circle cx={w / 2} cy={h * 0.16} r={Math.min(w, h) * 0.1} fill="#fff" stroke="#222" strokeWidth={2} />
          <line x1={w / 2} y1={h * 0.26} x2={w / 2} y2={h * 0.56} stroke="#222" strokeWidth={2} />
          <line x1={w * 0.24} y1={h * 0.36} x2={w * 0.76} y2={h * 0.36} stroke="#222" strokeWidth={2} />
          <line x1={w / 2} y1={h * 0.56} x2={w * 0.3} y2={h * 0.82} stroke="#222" strokeWidth={2} />
          <line x1={w / 2} y1={h * 0.56} x2={w * 0.7} y2={h * 0.82} stroke="#222" strokeWidth={2} />
        </g>
      );
    case "uml-sequence-participant":
      return (
        <g>
          <rect x={w * 0.1} y={h * 0.06} width={w * 0.8} height={h * 0.2} rx={4} fill="#eef4ff" stroke="#222" strokeWidth={1.5} />
          <line x1={w / 2} y1={h * 0.26} x2={w / 2} y2={h * 0.95} stroke="#222" strokeWidth={1.5} strokeDasharray="5 4" />
        </g>
      );
    case "uml-sequence-lifeline":
      return (
        <g>
          <line x1={w / 2} y1={h * 0.04} x2={w / 2} y2={h * 0.96} stroke="#222" strokeWidth={1.5} strokeDasharray="5 4" />
        </g>
      );
    case "uml-sequence-activation":
      return (
        <g>
          <line x1={w / 2} y1={h * 0.04} x2={w / 2} y2={h * 0.96} stroke="#999" strokeWidth={1.25} strokeDasharray="4 4" />
          <rect x={w * 0.4} y={h * 0.2} width={w * 0.2} height={h * 0.6} fill="#fff" stroke="#222" strokeWidth={1.5} />
        </g>
      );
    case "uml-sequence-message":
      return (
        <g>
          <line x1={w * 0.08} y1={h * 0.5} x2={w * 0.92} y2={h * 0.5} stroke="#222" strokeWidth={2} />
          <polygon points={`${w * 0.92},${h * 0.5} ${w * 0.8},${h * 0.43} ${w * 0.8},${h * 0.57}`} fill="#222" />
        </g>
      );
    case "uml-sequence-return":
      return (
        <g>
          <line x1={w * 0.08} y1={h * 0.5} x2={w * 0.92} y2={h * 0.5} stroke="#222" strokeWidth={1.8} strokeDasharray="6 4" />
          <polygon points={`${w * 0.92},${h * 0.5} ${w * 0.8},${h * 0.43} ${w * 0.8},${h * 0.57}`} fill="#222" />
        </g>
      );
    default:
      return (
        <g>
          <rect x={w * 0.2} y={h * 0.2} width={w * 0.6} height={h * 0.6} fill="#fff" stroke="#222" strokeWidth={1.5} />
        </g>
      );
  }
};
