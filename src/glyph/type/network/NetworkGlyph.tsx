import React from "react";

export const NetworkGlyph: React.FC<{ type: string; width?: number; height?: number }> = ({
  type,
  width = 100,
  height = 100,
}) => {
  // Scale factors for 40x40 base
  const sx = width / 40;
  const sy = height / 40;

  // Helper to scale coordinates
  const scale = (n: number, axis: "x" | "y") => (axis === "x" ? n * sx : n * sy);

  switch (type) {
    case "network-server":
      return (
        <g>
          <rect x={scale(8, "x")} y={scale(10, "y")} width={scale(24, "x")} height={scale(20, "y")} rx={scale(3, "x")} fill="#e0e7ef" stroke="#222" />
          <rect x={scale(12, "x")} y={scale(14, "y")} width={scale(16, "x")} height={scale(8, "y")} fill="#fff" stroke="#888" />
          <circle cx={scale(20, "x")} cy={scale(28, "y")} r={Math.min(sx, sy) * 2} fill="#888" />
        </g>
      );
    case "network-switch":
      return (
        <g>
          <rect x={scale(8, "x")} y={scale(14, "y")} width={scale(24, "x")} height={scale(12, "y")} rx={scale(3, "x")} fill="#d1fae5" stroke="#222" />
          <circle cx={scale(14, "x")} cy={scale(20, "y")} r={Math.min(sx, sy) * 1.5} fill="#222" />
          <circle cx={scale(20, "x")} cy={scale(20, "y")} r={Math.min(sx, sy) * 1.5} fill="#222" />
          <circle cx={scale(26, "x")} cy={scale(20, "y")} r={Math.min(sx, sy) * 1.5} fill="#222" />
        </g>
      );
    case "network-router":
      return (
        <g>
          <ellipse cx={scale(20, "x")} cy={scale(20, "y")} rx={scale(12, "x")} ry={scale(8, "y")} fill="#fef9c3" stroke="#222" />
          <rect x={scale(12, "x")} y={scale(24, "y")} width={scale(16, "x")} height={scale(4, "y")} fill="#fff" stroke="#888" />
        </g>
      );
    case "network-firewall":
      return (
        <g>
          <rect x={scale(10, "x")} y={scale(12, "y")} width={scale(20, "x")} height={scale(16, "y")} fill="#fecaca" stroke="#b91c1c" />
          <rect x={scale(12, "x")} y={scale(14, "y")} width={scale(16, "x")} height={scale(4, "y")} fill="#fff" stroke="#b91c1c" />
          <rect x={scale(12, "x")} y={scale(20, "y")} width={scale(16, "x")} height={scale(4, "y")} fill="#fff" stroke="#b91c1c" />
        </g>
      );
    case "network-pc":
      return (
        <g>
          <rect x={scale(10, "x")} y={scale(14, "y")} width={scale(20, "x")} height={scale(12, "y")} rx={scale(2, "x")} fill="#e0e7ef" stroke="#222" />
          <rect x={scale(16, "x")} y={scale(26, "y")} width={scale(8, "x")} height={scale(2, "y")} fill="#888" />
        </g>
      );
    case "network-cloud":
      return (
        <g>
          <ellipse cx={scale(20, "x")} cy={scale(22, "y")} rx={scale(10, "x")} ry={scale(7, "y")} fill="#f0f9ff" stroke="#38bdf8" />
          <ellipse cx={scale(27, "x")} cy={scale(20, "y")} rx={scale(6, "x")} ry={scale(5, "y")} fill="#f0f9ff" stroke="#38bdf8" />
          <ellipse cx={scale(13, "x")} cy={scale(20, "y")} rx={scale(6, "x")} ry={scale(5, "y")} fill="#f0f9ff" stroke="#38bdf8" />
        </g>
      );
    case "network-database":
      return (
        <g>
          <ellipse cx={scale(20, "x")} cy={scale(14, "y")} rx={scale(10, "x")} ry={scale(4, "y")} fill="#fef3c7" stroke="#b45309" />
          <rect x={scale(10, "x")} y={scale(14, "y")} width={scale(20, "x")} height={scale(12, "y")} fill="#fef3c7" stroke="#b45309" />
          <ellipse cx={scale(20, "x")} cy={scale(26, "y")} rx={scale(10, "x")} ry={scale(4, "y")} fill="#fef3c7" stroke="#b45309" />
        </g>
      );
    case "network-laptop":
      return (
        <g>
          <rect x={scale(12, "x")} y={scale(16, "y")} width={scale(16, "x")} height={scale(8, "y")} rx={scale(2, "x")} fill="#e0e7ef" stroke="#222" />
          <rect x={scale(10, "x")} y={scale(24, "y")} width={scale(20, "x")} height={scale(3, "y")} fill="#888" />
        </g>
      );
    case "network-phone":
      return (
        <g>
          <rect x={scale(16, "x")} y={scale(12, "y")} width={scale(8, "x")} height={scale(16, "y")} rx={scale(2, "x")} fill="#f3f4f6" stroke="#222" />
          <circle cx={scale(20, "x")} cy={scale(26, "y")} r={Math.min(sx, sy) * 1} fill="#888" />
        </g>
      );
    case "network-tablet":
      return (
        <g>
          <rect x={scale(13, "x")} y={scale(10, "y")} width={scale(14, "x")} height={scale(20, "y")} rx={scale(3, "x")} fill="#f3f4f6" stroke="#222" />
          <circle cx={scale(20, "x")} cy={scale(28, "y")} r={Math.min(sx, sy) * 1} fill="#888" />
        </g>
      );
    case "network-wifi":
      return (
        <g>
          <path d={`M${scale(12, "x")} ${scale(22, "y")} Q${scale(20, "x")} ${scale(14, "y")} ${scale(28, "x")} ${scale(22, "y")}`} stroke="#38bdf8" strokeWidth={2 * Math.max(sx, sy)} fill="none" />
          <path d={`M${scale(15, "x")} ${scale(25, "y")} Q${scale(20, "x")} ${scale(20, "y")} ${scale(25, "x")} ${scale(25, "y")}`} stroke="#38bdf8" strokeWidth={2 * Math.max(sx, sy)} fill="none" />
          <circle cx={scale(20, "x")} cy={scale(28, "y")} r={Math.min(sx, sy) * 1.5} fill="#38bdf8" />
        </g>
      );
    case "network-printer":
      return (
        <g>
          <rect x={scale(12, "x")} y={scale(18, "y")} width={scale(16, "x")} height={scale(8, "y")} fill="#e0e7ef" stroke="#222" />
          <rect x={scale(14, "x")} y={scale(12, "y")} width={scale(12, "x")} height={scale(6, "y")} fill="#fff" stroke="#222" />
          <rect x={scale(16, "x")} y={scale(26, "y")} width={scale(8, "x")} height={scale(2, "y")} fill="#888" />
        </g>
      );
    case "network-hub":
      return (
        <g>
          <circle cx={scale(20, "x")} cy={scale(20, "y")} r={Math.min(sx, sy) * 6} fill="#fef9c3" stroke="#222" />
          <line x1={scale(20, "x")} y1={scale(20, "y")} x2={scale(8, "x")} y2={scale(32, "y")} stroke="#222" />
          <line x1={scale(20, "x")} y1={scale(20, "y")} x2={scale(32, "x")} y2={scale(32, "y")} stroke="#222" />
          <line x1={scale(20, "x")} y1={scale(20, "y")} x2={scale(20, "x")} y2={scale(8, "y")} stroke="#222" />
        </g>
      );

    case "network-cable":
      return (
        <g>
          <rect x={scale(16, "x")} y={scale(16, "y")} width={scale(8, "x")} height={scale(12, "y")} fill="#e0e7ef" stroke="#222" />
          <rect x={scale(18, "x")} y={scale(12, "y")} width={scale(4, "x")} height={scale(4, "y")} fill="#888" />
        </g>
      );
    case "network-bridge":
      return (
        <g>
          {/* Main bridge body */}
          <rect
            x={scale(10, "x")}
            y={scale(16, "y")}
            width={scale(20, "x")}
            height={scale(8, "y")}
            rx={scale(4, "x")}
            fill="#f3f4f6"
            stroke="#2563eb"
            strokeWidth={2 * Math.max(sx, sy)}
          />
          {/* Two "legs" */}
          <rect
            x={scale(12, "x")}
            y={scale(24, "y")}
            width={scale(4, "x")}
            height={scale(6, "y")}
            fill="#2563eb"
            stroke="#2563eb"
            strokeWidth={1 * Math.max(sx, sy)}
          />
          <rect
            x={scale(24, "x")}
            y={scale(24, "y")}
            width={scale(4, "x")}
            height={scale(6, "y")}
            fill="#2563eb"
            stroke="#2563eb"
            strokeWidth={1 * Math.max(sx, sy)}
          />
        </g>
      );  
    case "network-access-point":
      return (
        <g>
          {/* Outer circle */}
          <circle cx={scale(20, "x")} cy={scale(20, "y")} r={scale(12, "x")} fill="#f0fdf4" stroke="#22c55e" strokeWidth={2 * Math.max(sx, sy)} />
          {/* WiFi arcs */}
          <path d={`M${scale(14, "x")} ${scale(24, "y")} Q${scale(20, "x")} ${scale(16, "y")} ${scale(26, "x")} ${scale(24, "y")}`} stroke="#22c55e" strokeWidth={2 * Math.max(sx, sy)} fill="none" />
          <path d={`M${scale(16, "x")} ${scale(26, "y")} Q${scale(20, "x")} ${scale(20, "y")} ${scale(24, "x")} ${scale(26, "y")}`} stroke="#22c55e" strokeWidth={1.5 * Math.max(sx, sy)} fill="none" />
          {/* Center dot */}
          <circle cx={scale(20, "x")} cy={scale(28, "y")} r={Math.min(sx, sy) * 1.5} fill="#22c55e" />
        </g>
      );  
    default:
      return (
        <g>
          <rect x={scale(8, "x")} y={scale(8, "y")} width={scale(24, "x")} height={scale(24, "y")} fill="#eee" stroke="#222" />
        </g>
      );
  }
};