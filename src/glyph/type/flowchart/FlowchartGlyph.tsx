import React from "react";

export const FlowchartGlyph: React.FC<{ type: string; width?: number; height?: number }> = ({
  type,
  width = 40,
  height = 40,
}) => {
  // Scale factors for 40x40 base
  const sx = width / 40;
  const sy = height / 40;

  // Helper to scale coordinates
  const scale = (n: number, axis: "x" | "y") => (axis === "x" ? n * sx : n * sy);

  switch (type) {
    case "flow-start":
      return (
        <g>
          <ellipse
            cx={scale(20, "x")}
            cy={scale(20, "y")}
            rx={scale(18, "x")}
            ry={scale(18, "y")}
            fill="#bbf7d0"
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    case "flow-end":
      return (
        <g>
          <ellipse
            cx={scale(20, "x")}
            cy={scale(20, "y")}
            rx={scale(18, "x")}
            ry={scale(18, "y")}
            fill="#fca5a5"
            stroke="#222"
            strokeWidth={2}
          />
          <ellipse
            cx={scale(20, "x")}
            cy={scale(20, "y")}
            rx={scale(12, "x")}
            ry={scale(12, "y")}
            fill="#fff"
            stroke="none"
          />
        </g>
      );
    case "flow-process":
      return (
        <g>
          <rect
            x={scale(4, "x")}
            y={scale(10, "y")}
            width={scale(32, "x")}
            height={scale(20, "y")}
            rx={scale(6, "x")}
            fill="#e0e7ef"
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    case "flow-io":
      return (
        <g>
          <polygon
            points={`
              ${scale(10, "x")},${scale(10, "y")}
              ${scale(36, "x")},${scale(10, "y")}
              ${scale(30, "x")},${scale(30, "y")}
              ${scale(4, "x")},${scale(30, "y")}
            `}
            fill="#bae6fd"
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    case "flow-decision":
      return (
        <g>
          <polygon
            points={`
              ${scale(20, "x")},${scale(4, "y")}
              ${scale(36, "x")},${scale(20, "y")}
              ${scale(20, "x")},${scale(36, "y")}
              ${scale(4, "x")},${scale(20, "y")}
            `}
            fill="#fef9c3"
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    case "flow-action":
      return (
        <g>
          <rect
            x={scale(6, "x")}
            y={scale(14, "y")}
            width={scale(28, "x")}
            height={scale(12, "y")}
            rx={scale(6, "x")}
            fill="#fde68a"
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    case "flow-document":
      return (
        <g>
          <path
            d={`
              M${scale(6, "x")},${scale(10, "y")}
              Q${scale(20, "x")},${scale(38, "y")} ${scale(34, "x")},${scale(10, "y")}
              L${scale(34, "x")},${scale(30, "y")}
              Q${scale(20, "x")},${scale(38, "y")} ${scale(6, "x")},${scale(30, "y")}
              Z
            `}
            fill="#e0e7ef"
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    case "flow-multidocument":
      return (
        <g>
          {/* Back document */}
          <path
            d={`
              M${scale(10, "x")},${scale(14, "y")}
              Q${scale(24, "x")},${scale(42, "y")} ${scale(38, "x")},${scale(14, "y")}
              L${scale(38, "x")},${scale(34, "y")}
              Q${scale(24, "x")},${scale(42, "y")} ${scale(10, "x")},${scale(34, "y")}
              Z
            `}
            fill="#f3f4f6"
            stroke="#222"
            strokeWidth={2}
            opacity={0.7}
          />
          {/* Middle document */}
          <path
            d={`
              M${scale(8, "x")},${scale(12, "y")}
              Q${scale(22, "x")},${scale(40, "y")} ${scale(36, "x")},${scale(12, "y")}
              L${scale(36, "x")},${scale(32, "y")}
              Q${scale(22, "x")},${scale(40, "y")} ${scale(8, "x")},${scale(32, "y")}
              Z
            `}
            fill="#e5e7eb"
            stroke="#222"
            strokeWidth={2}
            opacity={0.85}
          />
          {/* Front document */}
          <path
            d={`
              M${scale(6, "x")},${scale(10, "y")}
              Q${scale(20, "x")},${scale(38, "y")} ${scale(34, "x")},${scale(10, "y")}
              L${scale(34, "x")},${scale(30, "y")}
              Q${scale(20, "x")},${scale(38, "y")} ${scale(6, "x")},${scale(30, "y")}
              Z
            `}
            fill="#e0e7ef"
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    case "flow-manualinput":
        return (
            <g>
            <polygon
                points={`
                ${scale(8, "x")},${scale(12, "y")}
                ${scale(36, "x")},${scale(12, "y")}
                ${scale(32, "x")},${scale(28, "y")}
                ${scale(12, "x")},${scale(28, "y")}
                `}
                fill="#fbcfe8"
                stroke="#222"
                strokeWidth={2}
            />
            {/* Top slant line */}
            <line
                x1={scale(8, "x")}
                y1={scale(12, "y")}
                x2={scale(12, "x")}
                y2={scale(28, "y")}
                stroke="#222"
                strokeWidth={2}
            />
            </g>
        );
    case "flow-subroutine":
        return (
            <g>
            <rect
                x={scale(8, "x")}
                y={scale(12, "y")}
                width={scale(24, "x")}
                height={scale(16, "y")}
                rx={scale(4, "x")}
                fill="#ddd6fe"
                stroke="#222"
                strokeWidth={2}
            />
            {/* Left vertical line */}
            <line
                x1={scale(12, "x")}
                y1={scale(12, "y")}
                x2={scale(12, "x")}
                y2={scale(28, "y")}
                stroke="#222"
                strokeWidth={2}
            />
            {/* Right vertical line */}
            <line
                x1={scale(28, "x")}
                y1={scale(12, "y")}
                x2={scale(28, "x")}
                y2={scale(28, "y")}
                stroke="#222"
                strokeWidth={2}
            />
            </g>
        );
    case "flow-delay":
        return (
            <g>
            <ellipse
                cx={scale(20, "x")}
                cy={scale(20, "y")}
                rx={scale(18, "x")}
                ry={scale(10, "y")}
                fill="#fcd34d"
                stroke="#222"
                strokeWidth={2}
            />
            {/* Vertical line in the center */}
            <line
                x1={scale(20, "x")}
                y1={scale(10, "y")}
                x2={scale(20, "x")}
                y2={scale(30, "y")}
                stroke="#222"
                strokeWidth={2}
            />
            </g>
        );
    case "flow-predefinedprocess":
        return (
            <g>
            <rect
                x={scale(8, "x")}
                y={scale(12, "y")}
                width={scale(24, "x")}
                height={scale(16, "y")}
                rx={scale(4, "x")}
                fill="#c7d2fe"
                stroke="#222"
                strokeWidth={2}
            />
            {/* Left double vertical line */}
            <line
                x1={scale(10, "x")}
                y1={scale(12, "y")}
                x2={scale(10, "x")}
                y2={scale(28, "y")}
                stroke="#222"
                strokeWidth={2}
            />
            <line
                x1={scale(14, "x")}
                y1={scale(12, "y")}
                x2={scale(14, "x")}
                y2={scale(28, "y")}
                stroke="#222"
                strokeWidth={2}
            />
            </g>
        );
    case "flow-data":
        return (
            <g>
            <polygon
                points={`
                ${scale(10, "x")},${scale(10, "y")}
                ${scale(34, "x")},${scale(10, "y")}
                ${scale(30, "x")},${scale(30, "y")}
                ${scale(6, "x")},${scale(30, "y")}
                `}
                fill="#6ee7b7"
                stroke="#222"
                strokeWidth={2}
            />
            </g>
        );
    case "flow-connector":
        return (
            <g>
            <circle
                cx={scale(20, "x")}
                cy={scale(20, "y")}
                r={scale(10, "x")}
                fill="#a5b4fc"
                stroke="#222"
                strokeWidth={2}
            />
            <text
                x={scale(20, "x")}
                y={scale(20, "y")}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize={scale(12, "x")}
                fill="#222"
                fontFamily="Arial"
                style={{ pointerEvents: "none", userSelect: "none" }}
            >
                ●
            </text>
            </g>
        );
    case "flow-offpageconnector":
        return (
            <g>
            <polygon
                points={`
                ${scale(20, "x")},${scale(6, "y")}
                ${scale(34, "x")},${scale(16, "y")}
                ${scale(28, "x")},${scale(34, "y")}
                ${scale(12, "x")},${scale(34, "y")}
                ${scale(6, "x")},${scale(16, "y")}
                `}
                fill="#fbbf24"
                stroke="#222"
                strokeWidth={2}
            />
            </g>
        );
    case "flow-magnetic-tape":
        return (
            <g>
            <rect
                x={scale(6, "x")}
                y={scale(12, "y")}
                width={scale(28, "x")}
                height={scale(16, "y")}
                rx={scale(4, "x")}
                fill="#f87171"
                stroke="#222"
                strokeWidth={2}
            />
            {/* Wavy line inside */}
            <path
                d={`
                M${scale(6, "x")},${scale(20, "y")}
                Q${scale(10, "x")},${scale(12, "y")} ${scale(14, "x")},${scale(20, "y")}
                T${scale(22, "x")},${scale(20, "y")}
                T${scale(30, "x")},${scale(20, "y")}
                L${scale(34, "x")},${scale(20, "y")}
                `}
                fill="none"
                stroke="#222"
                strokeWidth={2}
            />
            </g>
        );
    case "flow-card":
        return (
            <g>
            <polygon
                points={`
                ${scale(10, "x")},${scale(10, "y")}
                ${scale(34, "x")},${scale(10, "y")}
                ${scale(30, "x")},${scale(30, "y")}
                ${scale(6, "x")},${scale(30, "y")}
                `}
                fill="#fbbf24"
                stroke="#222"
                strokeWidth={2}
            />
            {/* Top right corner cut */}
            <line
                x1={scale(30, "x")}
                y1={scale(10, "y")}
                x2={scale(34, "x")}
                y2={scale(14, "y")}
                stroke="#222"
                strokeWidth={2}
            />
            </g>
        );
    case "flow-sentiment":
        return (
            <g>
            <ellipse
                cx={scale(20, "x")}
                cy={scale(20, "y")}
                rx={scale(18, "x")}
                ry={scale(12, "y")}
                fill="#a7f3d0"
                stroke="#222"
                strokeWidth={2}
            />
            {/* Smiley face */}
            <circle
                cx={scale(14, "x")}
                cy={scale(16, "y")}
                r={scale(2, "x")}
                fill="#222"
            />
            <circle
                cx={scale(26, "x")}
                cy={scale(16, "y")}
                r={scale(2, "x")}
                fill="#222"
            />
            <path
                d={`
                M${scale(12, "x")},${scale(24, "y")}
                Q${scale(20, "x")},${scale(30, "y")} ${scale(28, "x")},${scale(24, "y")}
                `}
                fill="none"
                stroke="#222"
                strokeWidth={2}
            />
            </g>
        );
    case "flow-merge":
        return (
            <g>
            <polygon
                points={`
                ${scale(20, "x")},${scale(4, "y")}
                ${scale(36, "x")},${scale(20, "y")}
                ${scale(20, "x")},${scale(36, "y")}
                ${scale(4, "x")},${scale(20, "y")}
                `}
                fill="#fbbf24"
                stroke="#222"
                strokeWidth={2}
            />
            </g>
        );
    case "flow-extract":
        return (
            <g>
            <polygon
                points={`
                ${scale(10, "x")},${scale(10, "y")}
                ${scale(34, "x")},${scale(10, "y")}
                ${scale(30, "x")},${scale(30, "y")}
                ${scale(6, "x")},${scale(30, "y")}
                `}
                fill="#fbbf24"
                stroke="#222"
                strokeWidth={2}
            />
            {/* Bottom left corner cut */}
            <line
                x1={scale(6, "x")}
                y1={scale(30, "y")}
                x2={scale(10, "x")}
                y2={scale(26, "y")}
                stroke="#222"
                strokeWidth={2}
            />
            </g>
        );
    case "flow-multi-document":
      return (
        <g>
          {/* Back document */}
          <path
            d={`
              M${scale(10, "x")},${scale(14, "y")}
              Q${scale(24, "x")},${scale(42, "y")} ${scale(38, "x")},${scale(14, "y")}
              L${scale(38, "x")},${scale(34, "y")}
              Q${scale(24, "x")},${scale(42, "y")} ${scale(10, "x")},${scale(34, "y")}
              Z
            `}
            fill="#f3f4f6"
            stroke="#222"
            strokeWidth={2}
            opacity={0.7}
          />
          {/* Middle document */}
          <path
            d={`
              M${scale(8, "x")},${scale(12, "y")}
              Q${scale(22, "x")},${scale(40, "y")} ${scale(36, "x")},${scale(12, "y")}
              L${scale(36, "x")},${scale(32, "y")}
              Q${scale(22, "x")},${scale(40, "y")} ${scale(8, "x")},${scale(32, "y")}
              Z
            `}
            fill="#e5e7eb"
            stroke="#222"
            strokeWidth={2}
            opacity={0.85}
          />
          {/* Front document */}
          <path
            d={`
              M${scale(6, "x")},${scale(10, "y")}
              Q${scale(20, "x")},${scale(38, "y")} ${scale(34, "x")},${scale(10, "y")}
              L${scale(34, "x")},${scale(30, "y")}
              Q${scale(20, "x")},${scale(38, "y")} ${scale(6, "x")},${scale(30, "y")}
              Z
            `}
            fill="#e0e7ef"
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    case "flow-multiinput":
        return (
            <g>
            <polygon
                points={`
                ${scale(12, "x")},${scale(10, "y")}
                ${scale(36, "x")},${scale(10, "y")}
                ${scale(30, "x")},${scale(30, "y")}
                ${scale(6, "x")},${scale(30, "y")}
                `}
                fill="#fbcfe8"
                stroke="#222"
                strokeWidth={2}
            />
            {/* Top left corner cut */}
            <line
                x1={scale(12, "x")}
                y1={scale(10, "y")}
                x2={scale(16, "x")}
                y2={scale(26, "y")}
                stroke="#222"
                strokeWidth={2}
            />
            </g>
        );
    case "flow-sorted-data":
      return (
        <g>
          {/* Parallelogram base */}
          <polygon
            points={`
              ${scale(10, "x")},${scale(12, "y")}
              ${scale(34, "x")},${scale(12, "y")}
              ${scale(30, "x")},${scale(28, "y")}
              ${scale(6, "x")},${scale(28, "y")}
            `}
            fill="#fca5a5"
            stroke="#222"
            strokeWidth={2}
          />
          {/* Vertical lines to indicate sorting */}
          <line
            x1={scale(14, "x")}
            y1={scale(14, "y")}
            x2={scale(10, "x")}
            y2={scale(28, "y")}
            stroke="#222"
            strokeWidth={1.5}
          />
          <line
            x1={scale(18, "x")}
            y1={scale(14, "y")}
            x2={scale(14, "x")}
            y2={scale(28, "y")}
            stroke="#222"
            strokeWidth={1.5}
          />
          <line
            x1={scale(22, "x")}
            y1={scale(14, "y")}
            x2={scale(18, "x")}
            y2={scale(28, "y")}
            stroke="#222"
            strokeWidth={1.5}
          />
          <line
            x1={scale(26, "x")}
            y1={scale(14, "y")}
            x2={scale(22, "x")}
            y2={scale(28, "y")}
            stroke="#222"
            strokeWidth={1.5}
          />
          <line
            x1={scale(30, "x")}
            y1={scale(14, "y")}
            x2={scale(26, "x")}
            y2={scale(28, "y")}
            stroke="#222"
            strokeWidth={1.5}
          />
        </g>
      );
    case "flow-predefined-process":
      return (
        <g>
          <rect
            x={scale(8, "x")}
            y={scale(12, "y")}
            width={scale(24, "x")}
            height={scale(16, "y")}
            rx={scale(4, "x")}
            fill="#c7d2fe"
            stroke="#222"
            strokeWidth={2}
          />
          {/* Left double vertical line */}
          <line
            x1={scale(10, "x")}
            y1={scale(12, "y")}
            x2={scale(10, "x")}
            y2={scale(28, "y")}
            stroke="#222"
            strokeWidth={2}
          />
          <line
            x1={scale(14, "x")}
            y1={scale(12, "y")}
            x2={scale(14, "x")}
            y2={scale(28, "y")}
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    case "flow-display":
      return (
        <g>
          {/* Parallelogram with curved bottom for "Display" */}
          <path
            d={`
              M${scale(8, "x")},${scale(12, "y")}
              L${scale(32, "x")},${scale(12, "y")}
              Q${scale(36, "x")},${scale(20, "y")} ${scale(32, "x")},${scale(28, "y")}
              L${scale(8, "x")},${scale(28, "y")}
              Q${scale(4, "x")},${scale(20, "y")} ${scale(8, "x")},${scale(12, "y")}
              Z
            `}
            fill="#fef08a"
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    case "flow-collate":
      return (
        <g>
          {/* Collate: two intersecting arcs */}
          <path
            d={`
              M${scale(8, "x")},${scale(28, "y")}
              Q${scale(20, "x")},${scale(8, "y")} ${scale(32, "x")},${scale(28, "y")}
            `}
            fill="none"
            stroke="#222"
            strokeWidth={2}
          />
          <path
            d={`
              M${scale(8, "x")},${scale(20, "y")}
              Q${scale(20, "x")},${scale(36, "y")} ${scale(32, "x")},${scale(20, "y")}
            `}
            fill="none"
            stroke="#222"
            strokeWidth={2}
          />
          {/* Outline */}
          <ellipse
            cx={scale(20, "x")}
            cy={scale(20, "y")}
            rx={scale(14, "x")}
            ry={scale(10, "y")}
            fill="#f3f4f6"
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    case "flow-manual-input":
      return (
        <g>
          <polygon
            points={`
              ${scale(8, "x")},${scale(12, "y")}
              ${scale(36, "x")},${scale(12, "y")}
              ${scale(32, "x")},${scale(28, "y")}
              ${scale(12, "x")},${scale(28, "y")}
            `}
            fill="#fbcfe8"
            stroke="#222"
            strokeWidth={2}
          />
          {/* Top slant line */}
          <line
            x1={scale(8, "x")}
            y1={scale(12, "y")}
            x2={scale(12, "x")}
            y2={scale(28, "y")}
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    case "flow-manual-operation":
      return (
        <g>
          <rect
            x={scale(8, "x")}
            y={scale(14, "y")}
            width={scale(24, "x")}
            height={scale(12, "y")}
            rx={scale(2, "x")}
            fill="#fcd34d"
            stroke="#222"
            strokeWidth={2}
          />
          {/* Manual operation "bevel" */}
          <polygon
            points={`
              ${scale(8, "x")},${scale(14, "y")}
              ${scale(32, "x")},${scale(14, "y")}
              ${scale(36, "x")},${scale(26, "y")}
              ${scale(12, "x")},${scale(26, "y")}
            `}
            fill="none"
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    case "flow-on-page-connector":
      return (
        <g>
          {/* On-page connector: small circle */}
          <circle
            cx={scale(20, "x")}
            cy={scale(20, "y")}
            r={scale(10, "x")}
            fill="#fff"
            stroke="#222"
            strokeWidth={2}
          />
          <text
            x={scale(20, "x")}
            y={scale(25, "y")}
            textAnchor="middle"
            fontSize={scale(16, "x")}
            fill="#222"
            fontFamily="Arial"
            pointerEvents="none"
          >
            ⬤
          </text>
        </g>
      );
    case "flow-off-page-connector":
      return (
        <g>
          {/* Off-page connector: downward-pointing pentagon */}
          <polygon
            points={`
              ${scale(12, "x")},${scale(12, "y")}
              ${scale(28, "x")},${scale(12, "y")}
              ${scale(36, "x")},${scale(20, "y")}
              ${scale(20, "x")},${scale(36, "y")}
              ${scale(4, "x")},${scale(20, "y")}
            `}
            fill="#fbbf24"
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    case "flow-summarize":
      return (
        <g>
          {/* Summarize: triangle with base at top */}
          <polygon
            points={`
              ${scale(8, "x")},${scale(12, "y")}
              ${scale(32, "x")},${scale(12, "y")}
              ${scale(20, "x")},${scale(32, "y")}
            `}
            fill="#a7f3d0"
            stroke="#222"
            strokeWidth={2}
          />
          {/* Horizontal line at base */}
          <line
            x1={scale(8, "x")}
            y1={scale(12, "y")}
            x2={scale(32, "x")}
            y2={scale(12, "y")}
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    case "flow-decision-alt":
      return (
        <g>
          {/* Decision Alt: hexagon */}
          <polygon
            points={`
              ${scale(12, "x")},${scale(8, "y")}
              ${scale(28, "x")},${scale(8, "y")}
              ${scale(36, "x")},${scale(20, "y")}
              ${scale(28, "x")},${scale(32, "y")}
              ${scale(12, "x")},${scale(32, "y")}
              ${scale(4, "x")},${scale(20, "y")}
            `}
            fill="#fef9c3"
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    case "flow-split":
      return (
        <g>
          {/* Split: triangle with base at bottom and vertical line */}
          <polygon
            points={`
              ${scale(8, "x")},${scale(28, "y")}
              ${scale(32, "x")},${scale(28, "y")}
              ${scale(20, "x")},${scale(8, "y")}
            `}
            fill="#bae6fd"
            stroke="#222"
            strokeWidth={2}
          />
          {/* Vertical line from tip down */}
          <line
            x1={scale(20, "x")}
            y1={scale(8, "y")}
            x2={scale(20, "x")}
            y2={scale(32, "y")}
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    case "flow-arrow":
      return (
        <g>
          {/* Arrow: simple right-pointing arrow */}
          <line
            x1={scale(8, "x")}
            y1={scale(20, "y")}
            x2={scale(28, "x")}
            y2={scale(20, "y")}
            stroke="#222"
            strokeWidth={3}
            markerEnd="url(#arrowhead)"
          />
          <polygon
            points={`
              ${scale(28, "x")},${scale(16, "y")}
              ${scale(36, "x")},${scale(20, "y")}
              ${scale(28, "x")},${scale(24, "y")}
            `}
            fill="#222"
          />
          {/* Optional: define marker for arrowhead if used elsewhere */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <polygon points="0 0, 6 3, 0 6" fill="#222" />
            </marker>
          </defs>
        </g>
      );
    case "flow-preparation":
      return (
        <g>
          {/* Preparation: hexagon with horizontal sides */}
          <polygon
            points={`
              ${scale(12, "x")},${scale(12, "y")}
              ${scale(28, "x")},${scale(12, "y")}
              ${scale(36, "x")},${scale(20, "y")}
              ${scale(28, "x")},${scale(28, "y")}
              ${scale(12, "x")},${scale(28, "y")}
              ${scale(4, "x")},${scale(20, "y")}
            `}
            fill="#f9fafb"
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    case "flow-database":
      return (
        <g>
          {/* Database: cylinder shape */}
          {/* Top ellipse */}
          <ellipse
            cx={scale(20, "x")}
            cy={scale(14, "y")}
            rx={scale(12, "x")}
            ry={scale(4, "y")}
            fill="#fef9c3"
            stroke="#222"
            strokeWidth={2}
          />
          {/* Body */}
          <rect
            x={scale(8, "x")}
            y={scale(14, "y")}
            width={scale(24, "x")}
            height={scale(12, "y")}
            fill="#fef9c3"
            stroke="#222"
            strokeWidth={2}
          />
          {/* Bottom ellipse (only bottom half visible) */}
          <path
            d={`
              M${scale(8, "x")},${scale(26, "y")}
              a${scale(12, "x")},${scale(4, "y")} 0 0 0 ${scale(24, "x")},0
            `}
            fill="none"
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    case "flow-manual-loop":
      return (
        <g>
          {/* Manual Loop: rectangle with a hand-drawn style loop arrow */}
          <rect
            x={scale(8, "x")}
            y={scale(12, "y")}
            width={scale(24, "x")}
            height={scale(16, "y")}
            rx={scale(4, "x")}
            fill="#fef9c3"
            stroke="#222"
            strokeWidth={2}
          />
          {/* Loop arrow */}
          <path
            d={`
              M${scale(28, "x")},${scale(20, "y")}
              q${scale(6, "x")},${scale(-8, "y")} 0,${scale(-8, "y")}
              q${scale(-6, "x")},${scale(0, "y")} -6,${scale(8, "y")}
            `}
            fill="none"
            stroke="#222"
            strokeWidth={2}
            markerEnd="url(#arrowhead)"
          />
        </g>
      );
    case "flow-loop-limit":
      return (
        <g>
          {/* Loop Limit: rectangle with a loop and a limit bar */}
          <rect
            x={scale(8, "x")}
            y={scale(12, "y")}
            width={scale(24, "x")}
            height={scale(16, "y")}
            rx={scale(4, "x")}
            fill="#bae6fd"
            stroke="#222"
            strokeWidth={2}
          />
          {/* Loop arrow */}
          <path
            d={`
              M${scale(28, "x")},${scale(20, "y")}
              q${scale(6, "x")},${scale(-8, "y")} 0,${scale(-8, "y")}
              q${scale(-6, "x")},${scale(0, "y")} -6,${scale(8, "y")}
            `}
            fill="none"
            stroke="#222"
            strokeWidth={2}
            markerEnd="url(#arrowhead)"
          />
          {/* Limit bar */}
          <rect
            x={scale(26, "x")}
            y={scale(8, "y")}
            width={scale(8, "x")}
            height={scale(2, "y")}
            fill="#222"
          />
        </g>
      );
    case "flow-internal-storage":
      return (
        <g>
          <rect
            x={scale(8, "x")}
            y={scale(12, "y")}
            width={scale(24, "x")}
            height={scale(16, "y")}
            fill="#fef08a"
            stroke="#222"
            strokeWidth={2}
          />
          {/* Internal storage: L-shaped line from top-left (vertical then horizontal) */}
          <line
            x1={scale(12, "x")}
            y1={scale(12, "y")}
            x2={scale(12, "x")}
            y2={scale(28, "y")}
            stroke="#222"
            strokeWidth={2}
          />
          <line
            x1={scale(8, "x")}
            y1={scale(18, "y")}
            x2={scale(32, "x")}
            y2={scale(18, "y")}
            stroke="#222"
            strokeWidth={2}
          />
        </g>
      );
    default:
      return (
        <g>
          <rect
            x={scale(8, "x")}
            y={scale(8, "y")}
            width={scale(24, "x")}
            height={scale(24, "y")}
            fill="#eee"
            stroke="#222"
          />
        </g>
      );
  }
};