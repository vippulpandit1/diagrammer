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
    case "network-load-balancer":
      return (
        <g>
          {/* Main ellipse */}
          <ellipse
            cx={scale(20, "x")}
            cy={scale(20, "y")}
            rx={scale(12, "x")}
            ry={scale(8, "y")}
            fill="#e0f2fe"
            stroke="#0ea5e9"
            strokeWidth={2 * Math.max(sx, sy)}
          />
          {/* Arrows inside ellipse */}
          <path
            d={`M${scale(12, "x")} ${scale(20, "y")} L${scale(20, "x")} ${scale(14, "y")} L${scale(28, "x")} ${scale(20, "y")}`}
            stroke="#0ea5e9"
            strokeWidth={2}
            fill="none"
            markerEnd="url(#arrowhead)"
          />
          <path
            d={`M${scale(12, "x")} ${scale(20, "y")} L${scale(20, "x")} ${scale(26, "y")} L${scale(28, "x")} ${scale(20, "y")}`}
            stroke="#0ea5e9"
            strokeWidth={2}
            fill="none"
            markerEnd="url(#arrowhead)"
          />
          {/* Arrowhead marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="#0ea5e9" />
            </marker>
          </defs>
          {/* Center dot */}
          <circle
            cx={scale(20, "x")}
            cy={scale(20, "y")}
            r={Math.min(sx, sy) * 2}
            fill="#0ea5e9"
            opacity={0.3}
          />
        </g>
      );
    case "network-generator":
      return (
        <g>
          {/* Main body: circle */}
          <circle
            cx={scale(20, "x")}
            cy={scale(20, "y")}
            r={scale(12, "x")}
            fill="#fef9c3"
            stroke="#eab308"
            strokeWidth={2 * Math.max(sx, sy)}
          />
          {/* Lightning bolt symbol */}
          <polyline
            points={`
              ${scale(18, "x")},${scale(14, "y")}
              ${scale(22, "x")},${scale(20, "y")}
              ${scale(19, "x")},${scale(20, "y")}
              ${scale(22, "x")},${scale(26, "y")}
              ${scale(20, "x")},${scale(20, "y")}
              ${scale(23, "x")},${scale(14, "y")}
            `}
            fill="none"
            stroke="#eab308"
            strokeWidth={2}
          />
        </g>
      );
    case "network-pdu":
      return (
        <g>
          {/* Main body */}
          <rect
            x={scale(10, "x")}
            y={scale(14, "y")}
            width={scale(20, "x")}
            height={scale(12, "y")}
            rx={scale(3, "x")}
            fill="#f3f4f6"
            stroke="#6366f1"
            strokeWidth={2 * Math.max(sx, sy)}
          />
          {/* Outlets */}
          <circle cx={scale(14, "x")} cy={scale(20, "y")} r={Math.min(sx, sy) * 1.2} fill="#6366f1" />
          <circle cx={scale(20, "x")} cy={scale(20, "y")} r={Math.min(sx, sy) * 1.2} fill="#6366f1" />
          <circle cx={scale(26, "x")} cy={scale(20, "y")} r={Math.min(sx, sy) * 1.2} fill="#6366f1" />
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(28, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#6366f1"
            fontWeight={600}
          >
            PDU
          </text>
        </g>
      );
    case "network-ups":
      return (
        <g>
          {/* Main body */}
          <rect
            x={scale(10, "x")}
            y={scale(14, "y")}
            width={scale(20, "x")}
            height={scale(12, "y")}
            rx={scale(4, "x")}
            fill="#f0fdf4"
            stroke="#059669"
            strokeWidth={2 * Math.max(sx, sy)}
          />
          {/* Battery symbol */}
          <rect
            x={scale(16, "x")}
            y={scale(18, "y")}
            width={scale(8, "x")}
            height={scale(6, "y")}
            rx={scale(2, "x")}
            fill="#fff"
            stroke="#059669"
            strokeWidth={1.5}
          />
          <rect
            x={scale(19, "x")}
            y={scale(16, "y")}
            width={scale(2, "x")}
            height={scale(2, "y")}
            fill="#059669"
            stroke="#059669"
            strokeWidth={1}
          />
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(28, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#059669"
            fontWeight={600}
          >
            UPS
          </text>
        </g>
      );
    case "network-antenna":
      return (
        <g>
          {/* Main mast */}
          <rect
            x={scale(18, "x")}
            y={scale(12, "y")}
            width={scale(4, "x")}
            height={scale(16, "y")}
            fill="#f3f4f6"
            stroke="#2563eb"
            strokeWidth={1.5 * Math.max(sx, sy)}
            rx={scale(2, "x")}
          />
          {/* Base */}
          <rect
            x={scale(16, "x")}
            y={scale(28, "y")}
            width={scale(8, "x")}
            height={scale(4, "y")}
            fill="#2563eb"
            stroke="#2563eb"
            strokeWidth={1}
            rx={scale(2, "x")}
          />
          {/* Signal arcs */}
          <path
            d={`M${scale(20, "x")},${scale(12, "y")} Q${scale(10, "x")},${scale(6, "y")} ${scale(20, "x")},${scale(2, "y")}`}
            stroke="#2563eb"
            strokeWidth={2}
            fill="none"
          />
          <path
            d={`M${scale(20, "x")},${scale(12, "y")} Q${scale(30, "x")},${scale(6, "y")} ${scale(20, "x")},${scale(2, "y")}`}
            stroke="#2563eb"
            strokeWidth={2}
            fill="none"
          />
          {/* Top dot */}
          <circle
            cx={scale(20, "x")}
            cy={scale(12, "y")}
            r={Math.min(sx, sy) * 1.5}
            fill="#2563eb"
          />
        </g>
      );
    case "network-cctv":
      return (
        <g>
          {/* Camera body */}
          <rect
            x={scale(12, "x")}
            y={scale(16, "y")}
            width={scale(16, "x")}
            height={scale(8, "y")}
            rx={scale(2, "x")}
            fill="#e0e7ef"
            stroke="#222"
            strokeWidth={2}
          />
          {/* Lens */}
          <circle
            cx={scale(20, "x")}
            cy={scale(20, "y")}
            r={scale(3, "x")}
            fill="#2563eb"
            stroke="#222"
            strokeWidth={1}
          />
          {/* Mount arm */}
          <rect
            x={scale(18, "x")}
            y={scale(24, "y")}
            width={scale(4, "x")}
            height={scale(8, "y")}
            rx={scale(1, "x")}
            fill="#888"
            stroke="#222"
            strokeWidth={1}
          />
          {/* Mount base */}
          <ellipse
            cx={scale(20, "x")}
            cy={scale(32, "y")}
            rx={scale(4, "x")}
            ry={scale(2, "y")}
            fill="#888"
            stroke="#222"
            strokeWidth={1}
          />
        </g>
      );
    case "network-voip-phone":
      return (
        <g>
          {/* Main phone body */}
          <rect
            x={scale(13, "x")}
            y={scale(12, "y")}
            width={scale(14, "x")}
            height={scale(16, "y")}
            rx={scale(3, "x")}
            fill="#f3f4f6"
            stroke="#2563eb"
            strokeWidth={2}
          />
          {/* Screen */}
          <rect
            x={scale(15, "x")}
            y={scale(14, "y")}
            width={scale(10, "x")}
            height={scale(6, "y")}
            rx={scale(1, "x")}
            fill="#e0e7ef"
            stroke="#2563eb"
            strokeWidth={1}
          />
          {/* Keypad */}
          <rect
            x={scale(15, "x")}
            y={scale(22, "y")}
            width={scale(10, "x")}
            height={scale(4, "y")}
            rx={scale(1, "x")}
            fill="#fff"
            stroke="#2563eb"
            strokeWidth={1}
          />
          {/* Handset */}
          <rect
            x={scale(10, "x")}
            y={scale(10, "y")}
            width={scale(6, "x")}
            height={scale(4, "y")}
            rx={scale(2, "x")}
            fill="#2563eb"
            stroke="#2563eb"
            strokeWidth={1}
            transform={`rotate(-20 ${scale(13, "x")} ${scale(12, "y")})`}
          />
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(32, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#2563eb"
            fontWeight={600}
          >
            VOIP
          </text>
        </g>
      );
    case "network-optical-network":
      return (
        <g>
          {/* Main ring */}
          <ellipse
            cx={scale(20, "x")}
            cy={scale(20, "y")}
            rx={scale(12, "x")}
            ry={scale(12, "y")}
            fill="#f0f9ff"
            stroke="#0ea5e9"
            strokeWidth={2 * Math.max(sx, sy)}
          />
          {/* Fiber lines */}
          <path
            d={`M${scale(8, "x")},${scale(20, "y")} Q${scale(20, "x")},${scale(8, "y")} ${scale(32, "x")},${scale(20, "y")}`}
            stroke="#0ea5e9"
            strokeWidth={2}
            fill="none"
          />
          <path
            d={`M${scale(8, "x")},${scale(20, "y")} Q${scale(20, "x")},${scale(32, "y")} ${scale(32, "x")},${scale(20, "y")}`}
            stroke="#0ea5e9"
            strokeWidth={2}
            fill="none"
          />
          {/* Center dot */}
          <circle
            cx={scale(20, "x")}
            cy={scale(20, "y")}
            r={Math.min(sx, sy) * 2}
            fill="#0ea5e9"
            opacity={0.3}
          />
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(36, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#0ea5e9"
            fontWeight={600}
          >
            Optical
          </text>
        </g>
      );
    case "network-satellite":
      return (
        <g>
          {/* Main satellite dish */}
          <ellipse
            cx={scale(20, "x")}
            cy={scale(24, "y")}
            rx={scale(10, "x")}
            ry={scale(6, "y")}
            fill="#f0f9ff"
            stroke="#2563eb"
            strokeWidth={2 * Math.max(sx, sy)}
            transform={`rotate(-25 ${scale(20, "x")} ${scale(24, "y")})`}
          />
          {/* Dish stand */}
          <rect
            x={scale(18, "x")}
            y={scale(28, "y")}
            width={scale(4, "x")}
            height={scale(8, "y")}
            rx={scale(1, "x")}
            fill="#2563eb"
            stroke="#2563eb"
            strokeWidth={1}
          />
          {/* Feed horn */}
          <circle
            cx={scale(20, "x")}
            cy={scale(20, "y")}
            r={scale(2, "x")}
            fill="#2563eb"
            stroke="#2563eb"
            strokeWidth={1}
          />
          {/* Signal waves */}
          <path
            d={`M${scale(20, "x")},${scale(20, "y")} Q${scale(28, "x")},${scale(12, "y")} ${scale(36, "x")},${scale(20, "y")}`}
            stroke="#2563eb"
            strokeWidth={2}
            fill="none"
          />
          <path
            d={`M${scale(20, "x")},${scale(20, "y")} Q${scale(30, "x")},${scale(16, "y")} ${scale(36, "x")},${scale(24, "y")}`}
            stroke="#2563eb"
            strokeWidth={2}
            fill="none"
          />
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(38, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#2563eb"
            fontWeight={600}
          >
            Satellite
          </text>
        </g>
      );
    case "network-dns":
      return (
        <g>
          {/* DNS cylinder */}
          <ellipse
            cx={scale(20, "x")}
            cy={scale(14, "y")}
            rx={scale(10, "x")}
            ry={scale(4, "y")}
            fill="#e0e7ef"
            stroke="#6366f1"
            strokeWidth={2}
          />
          <rect
            x={scale(10, "x")}
            y={scale(14, "y")}
            width={scale(20, "x")}
            height={scale(12, "y")}
            fill="#e0e7ef"
            stroke="#6366f1"
            strokeWidth={2}
          />
          <ellipse
            cx={scale(20, "x")}
            cy={scale(26, "y")}
            rx={scale(10, "x")}
            ry={scale(4, "y")}
            fill="#e0e7ef"
            stroke="#6366f1"
            strokeWidth={2}
          />
          {/* DNS label */}
          <text
            x={scale(20, "x")}
            y={scale(22, "y")}
            textAnchor="middle"
            fontSize={scale(5, "y")}
            fill="#6366f1"
            fontWeight={700}
          >
            DNS
          </text>
        </g>
      );
    case "network-dhcp":
      return (
        <g>
          {/* DHCP server box */}
          <rect
            x={scale(10, "x")}
            y={scale(14, "y")}
            width={scale(20, "x")}
            height={scale(12, "y")}
            rx={scale(3, "x")}
            fill="#fef9c3"
            stroke="#eab308"
            strokeWidth={2 * Math.max(sx, sy)}
          />
          {/* Network cable */}
          <rect
            x={scale(18, "x")}
            y={scale(26, "y")}
            width={scale(4, "x")}
            height={scale(6, "y")}
            fill="#eab308"
            stroke="#eab308"
            strokeWidth={1}
            rx={scale(1, "x")}
          />
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(22, "y")}
            textAnchor="middle"
            fontSize={scale(5, "y")}
            fill="#eab308"
            fontWeight={700}
          >
            DHCP
          </text>
        </g>
      );
    case "network-nat":
      return (
        <g>
          {/* NAT box */}
          <rect
            x={scale(10, "x")}
            y={scale(14, "y")}
            width={scale(20, "x")}
            height={scale(12, "y")}
            rx={scale(3, "x")}
            fill="#e0f2fe"
            stroke="#0ea5e9"
            strokeWidth={2 * Math.max(sx, sy)}
          />
          {/* Arrows for translation */}
          <path
            d={`M${scale(14, "x")},${scale(20, "y")} L${scale(18, "x")},${scale(20, "y")}`}
            stroke="#0ea5e9"
            strokeWidth={2}
            markerEnd="url(#arrowhead-nat)"
          />
          <path
            d={`M${scale(26, "x")},${scale(20, "y")} L${scale(22, "x")},${scale(20, "y")}`}
            stroke="#0ea5e9"
            strokeWidth={2}
            markerEnd="url(#arrowhead-nat)"
          />
          {/* Arrowhead marker definition */}
          <defs>
            <marker
              id="arrowhead-nat"
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="#0ea5e9" />
            </marker>
          </defs>
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(22, "y")}
            textAnchor="middle"
            fontSize={scale(5, "y")}
            fill="#0ea5e9"
            fontWeight={700}
          >
            NAT
          </text>
        </g>
      );
    case "network-proxy":
      return (
        <g>
          {/* Proxy shield */}
          <ellipse
            cx={scale(20, "x")}
            cy={scale(20, "y")}
            rx={scale(12, "x")}
            ry={scale(10, "y")}
            fill="#f0f9ff"
            stroke="#6366f1"
            strokeWidth={2}
          />
          <path
            d={`M${scale(12, "x")},${scale(20, "y")} Q${scale(20, "x")},${scale(8, "y")} ${scale(28, "x")},${scale(20, "y")}`}
            stroke="#6366f1"
            strokeWidth={2}
            fill="none"
          />
          {/* Shield center */}
          <rect
            x={scale(16, "x")}
            y={scale(16, "y")}
            width={scale(8, "x")}
            height={scale(8, "y")}
            rx={scale(2, "x")}
            fill="#6366f1"
            opacity={0.2}
          />
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(34, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#6366f1"
            fontWeight={600}
          >
            Proxy
          </text>
        </g>
      );
    case "network-ids":
      return (
        <g>
          {/* IDS box */}
          <rect
            x={scale(10, "x")}
            y={scale(14, "y")}
            width={scale(20, "x")}
            height={scale(12, "y")}
            rx={scale(4, "x")}
            fill="#fef2f2"
            stroke="#dc2626"
            strokeWidth={2 * Math.max(sx, sy)}
          />
          {/* Alert symbol */}
          <polygon
            points={`
              ${scale(20, "x")},${scale(16, "y")}
              ${scale(14, "x")},${scale(26, "y")}
              ${scale(26, "x")},${scale(26, "y")}
            `}
            fill="#dc2626"
            opacity={0.7}
            stroke="#dc2626"
            strokeWidth={1}
          />
          <circle
            cx={scale(20, "x")}
            cy={scale(23, "y")}
            r={scale(1.5, "x")}
            fill="#fff"
          />
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(30, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#dc2626"
            fontWeight={600}
          >
            IDS
          </text>
        </g>
      );
    case "network-quantum-computer":
      return (
        <g>
          {/* Main body: stylized quantum chip */}
          <rect
            x={scale(10, "x")}
            y={scale(14, "y")}
            width={scale(20, "x")}
            height={scale(12, "y")}
            rx={scale(4, "x")}
            fill="#ede9fe"
            stroke="#7c3aed"
            strokeWidth={2 * Math.max(sx, sy)}
          />
          {/* Quantum rings */}
          <ellipse
            cx={scale(20, "x")}
            cy={scale(20, "y")}
            rx={scale(8, "x")}
            ry={scale(4, "y")}
            fill="none"
            stroke="#7c3aed"
            strokeWidth={2}
          />
          <ellipse
            cx={scale(20, "x")}
            cy={scale(20, "y")}
            rx={scale(5, "x")}
            ry={scale(2.5, "y")}
            fill="none"
            stroke="#a78bfa"
            strokeWidth={1.5}
          />
          {/* Quantum dots */}
          <circle
            cx={scale(16, "x")}
            cy={scale(20, "y")}
            r={scale(1.5, "x")}
            fill="#7c3aed"
          />
          <circle
            cx={scale(24, "x")}
            cy={scale(20, "y")}
            r={scale(1.5, "x")}
            fill="#7c3aed"
          />
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(30, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#7c3aed"
            fontWeight={600}
          >
            Quantum
          </text>
        </g>
      );
    case "network-terminal":
      return (
        <g>
          {/* Terminal body */}
          <rect
            x={scale(10, "x")}
            y={scale(14, "y")}
            width={scale(20, "x")}
            height={scale(12, "y")}
            rx={scale(3, "x")}
            fill="#1e293b"
            stroke="#2563eb"
            strokeWidth={2 * Math.max(sx, sy)}
          />
          {/* Command prompt symbol */}
          <text
            x={scale(14, "x")}
            y={scale(22, "y")}
            fontSize={scale(6, "y")}
            fill="#38bdf8"
            fontFamily="monospace"
            fontWeight={700}
          >
            &gt;_
          </text>
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(28, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#2563eb"
            fontWeight={600}
          >
            Terminal
          </text>
        </g>
      );
    case "network-edge-device":
      return (
        <g>
          {/* Main body */}
          <rect
            x={scale(12, "x")}
            y={scale(16, "y")}
            width={scale(16, "x")}
            height={scale(8, "y")}
            rx={scale(4, "x")}
            fill="#f0fdf4"
            stroke="#0ea5e9"
            strokeWidth={2 * Math.max(sx, sy)}
          />
          {/* Edge symbol: small hexagon */}
          <polygon
            points={`
              ${scale(20, "x")},${scale(14, "y")}
              ${scale(24, "x")},${scale(16, "y")}
              ${scale(24, "x")},${scale(20, "y")}
              ${scale(20, "x")},${scale(22, "y")}
              ${scale(16, "x")},${scale(20, "y")}
              ${scale(16, "x")},${scale(16, "y")}
            `}
            fill="#0ea5e9"
            stroke="#0ea5e9"
            strokeWidth={1}
            opacity={0.7}
          />
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(30, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#0ea5e9"
            fontWeight={600}
          >
            Edge
          </text>
        </g>
      );
    case "network-virtual-machine":
      return (
        <g>
          {/* VM body */}
          <rect
            x={scale(12, "x")}
            y={scale(14, "y")}
            width={scale(16, "x")}
            height={scale(12, "y")}
            rx={scale(4, "x")}
            fill="#f3f4f6"
            stroke="#6366f1"
            strokeWidth={2 * Math.max(sx, sy)}
          />
          {/* VM chip */}
          <rect
            x={scale(16, "x")}
            y={scale(18, "y")}
            width={scale(8, "x")}
            height={scale(4, "y")}
            rx={scale(1, "x")}
            fill="#fff"
            stroke="#6366f1"
            strokeWidth={1}
          />
          {/* VM label */}
          <text
            x={scale(20, "x")}
            y={scale(28, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#6366f1"
            fontWeight={600}
          >
            VM
          </text>
        </g>
      );
    case "network-iot-device":
      return (
        <g>
          {/* Main body */}
          <rect
            x={scale(14, "x")}
            y={scale(16, "y")}
            width={scale(12, "x")}
            height={scale(12, "y")}
            rx={scale(4, "x")}
            fill="#f0fdf4"
            stroke="#22c55e"
            strokeWidth={2 * Math.max(sx, sy)}
          />
          {/* WiFi symbol */}
          <path
            d={`M${scale(20, "x")},${scale(22, "y")} Q${scale(16, "x")},${scale(18, "y")} ${scale(24, "x")},${scale(18, "y")}`}
            stroke="#22c55e"
            strokeWidth={2}
            fill="none"
          />
          <path
            d={`M${scale(20, "x")},${scale(24, "y")} Q${scale(18, "x")},${scale(22, "y")} ${scale(22, "x")},${scale(22, "y")}`}
            stroke="#22c55e"
            strokeWidth={1.5}
            fill="none"
          />
          {/* Center dot */}
          <circle
            cx={scale(20, "x")}
            cy={scale(26, "y")}
            r={Math.min(sx, sy) * 1.2}
            fill="#22c55e"
          />
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(32, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#22c55e"
            fontWeight={600}
          >
            IoT
          </text>
        </g>
      );   
    case "network-gateway":
      return (
        <g>
          {/* Gateway body */}
          <rect
            x={scale(12, "x")}
            y={scale(16, "y")}
            width={scale(16, "x")}
            height={scale(8, "y")}
            rx={scale(4, "x")}
            fill="#f3f4f6"
            stroke="#0ea5e9"
            strokeWidth={2 * Math.max(sx, sy)}
          />
          {/* Arrow symbol */}
          <path
            d={`M${scale(16, "x")},${scale(20, "y")} L${scale(24, "x")},${scale(20, "y")}`}
            stroke="#0ea5e9"
            strokeWidth={2}
            markerEnd="url(#arrowhead-gateway)"
          />
          <defs>
            <marker
              id="arrowhead-gateway"
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="#0ea5e9" />
            </marker>
          </defs>
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(30, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#0ea5e9"
            fontWeight={600}
          >
            Gateway
          </text>
        </g>
      );
    case "network-vpn":
      return (
        <g>
          {/* VPN shield */}
          <ellipse
            cx={scale(20, "x")}
            cy={scale(20, "y")}
            rx={scale(12, "x")}
            ry={scale(10, "y")}
            fill="#e0f2fe"
            stroke="#2563eb"
            strokeWidth={2}
          />
          {/* Lock symbol */}
          <rect
            x={scale(16, "x")}
            y={scale(18, "y")}
            width={scale(8, "x")}
            height={scale(6, "y")}
            rx={scale(2, "x")}
            fill="#fff"
            stroke="#2563eb"
            strokeWidth={1}
          />
          <rect
            x={scale(18, "x")}
            y={scale(16, "y")}
            width={scale(4, "x")}
            height={scale(2, "y")}
            rx={scale(1, "x")}
            fill="#2563eb"
            stroke="#2563eb"
            strokeWidth={1}
          />
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(34, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#2563eb"
            fontWeight={600}
          >
            VPN
          </text>
        </g>
      );
    case "network-cloud-storage":
      return (
        <g>
          {/* Cloud body */}
          <ellipse
            cx={scale(20, "x")}
            cy={scale(22, "y")}
            rx={scale(12, "x")}
            ry={scale(8, "y")}
            fill="#f0f9ff"
            stroke="#0ea5e9"
            strokeWidth={2}
          />
          {/* Storage cylinder */}
          <ellipse
            cx={scale(20, "x")}
            cy={scale(28, "y")}
            rx={scale(6, "x")}
            ry={scale(2.5, "y")}
            fill="#e0e7ef"
            stroke="#0ea5e9"
            strokeWidth={1}
          />
          <rect
            x={scale(14, "x")}
            y={scale(28, "y")}
            width={scale(12, "x")}
            height={scale(4, "y")}
            fill="#e0e7ef"
            stroke="#0ea5e9"
            strokeWidth={1}
          />
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(36, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#0ea5e9"
            fontWeight={600}
          >
            Cloud Storage
          </text>
        </g>
      );
    case "network-content-delivery":
      return (
        <g>
          {/* CDN globe */}
          <ellipse
            cx={scale(20, "x")}
            cy={scale(20, "y")}
            rx={scale(12, "x")}
            ry={scale(12, "y")}
            fill="#f0f9ff"
            stroke="#0ea5e9"
            strokeWidth={2}
          />
          {/* Globe lines */}
          <path
            d={`M${scale(8, "x")},${scale(20, "y")} A${scale(12, "x")},${scale(12, "y")} 0 0,1 ${scale(32, "x")},${scale(20, "y")}`}
            stroke="#0ea5e9"
            strokeWidth={1.5}
            fill="none"
          />
          <path
            d={`M${scale(20, "x")},${scale(8, "y")} A${scale(12, "x")},${scale(12, "y")} 0 0,1 ${scale(20, "x")},${scale(32, "y")}`}
            stroke="#0ea5e9"
            strokeWidth={1.5}
            fill="none"
          />
          {/* Arrow for delivery */}
          <path
            d={`M${scale(20, "x")},${scale(20, "y")} L${scale(28, "x")},${scale(12, "y")}`}
            stroke="#0ea5e9"
            strokeWidth={2}
            markerEnd="url(#arrowhead-cdn)"
          />
          <defs>
            <marker
              id="arrowhead-cdn"
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="#0ea5e9" />
            </marker>
          </defs>
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(36, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#0ea5e9"
            fontWeight={600}
          >
            CDN
          </text>
        </g>
      );
      return (
        <g>
          {/* Alt firewall: shield */}
          <path
            d={`
              M${scale(20, "x")},${scale(12, "y")}
              L${scale(28, "x")},${scale(18, "y")}
              L${scale(24, "x")},${scale(32, "y")}
              L${scale(16, "x")},${scale(32, "y")}
              L${scale(12, "x")},${scale(18, "y")}
              Z
            `}
            fill="#fee2e2"
            stroke="#b91c1c"
            strokeWidth={2 * Math.max(sx, sy)}
          />
          {/* Shield lines */}
          <path
            d={`M${scale(20, "x")},${scale(16, "y")} L${scale(20, "x")},${scale(28, "y")}`}
            stroke="#b91c1c"
            strokeWidth={2}
          />
          <path
            d={`M${scale(16, "x")},${scale(24, "y")} L${scale(24, "x")},${scale(24, "y")}`}
            stroke="#b91c1c"
            strokeWidth={2}
          />
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(36, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#b91c1c"
            fontWeight={600}
          >
            Firewall
          </text>
        </g>
      ); 
    case "network-software-defined-network":
      return (
        <g>
          {/* SDN body */}
          <rect
            x={scale(12, "x")}
            y={scale(16, "y")}
            width={scale(16, "x")}
            height={scale(8, "y")}
            rx={scale(4, "x")}
            fill="#e0f2fe"
            stroke="#0ea5e9"
            strokeWidth={2}
          />
          {/* SDN lines */}
          <path
            d={`M${scale(14, "x")},${scale(20, "y")} L${scale(26, "x")},${scale(20, "y")}`}
            stroke="#0ea5e9"
            strokeWidth={2}
          />
          <path
            d={`M${scale(20, "x")},${scale(18, "y")} L${scale(20, "x")},${scale(22, "y")}`}
            stroke="#0ea5e9"
            strokeWidth={2}
          />
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(30, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#0ea5e9"
            fontWeight={600}
          >
            SDN
          </text>
        </g>
      );  
    case "network-server-rack":
      return (
        <g>
          {/* Rack body */}
          <rect
            x={scale(14, "x")}
            y={scale(10, "y")}
            width={scale(12, "x")}
            height={scale(20, "y")}
            rx={scale(2, "x")}
            fill="#e0e7ef"
            stroke="#222"
            strokeWidth={2}
          />
          {/* Rack slots */}
          {[0, 1, 2, 3].map(i => (
            <rect
              key={i}
              x={scale(16, "x")}
              y={scale(12 + i * 5, "y")}
              width={scale(8, "x")}
              height={scale(3, "y")}
              fill="#fff"
              stroke="#2563eb"
              strokeWidth={1}
            />
          ))}
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(34, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#2563eb"
            fontWeight={600}
          >
            Rack
          </text>
        </g>
      );
    case "network-unified-threat-management":
      return (
        <g>
          {/* UTM body */}
          <rect
            x={scale(12, "x")}
            y={scale(16, "y")}
            width={scale(16, "x")}
            height={scale(8, "y")}
            rx={scale(4, "x")}
            fill="#fee2e2"
            stroke="#b91c1c"
            strokeWidth={2}
          />
          {/* Shield symbol */}
          <path
            d={`
              M${scale(20, "x")},${scale(14, "y")}
              L${scale(26, "x")},${scale(18, "y")}
              L${scale(20, "x")},${scale(28, "y")}
              L${scale(14, "x")},${scale(18, "y")}
              Z
            `}
            fill="#fff"
            stroke="#b91c1c"
            strokeWidth={1.5}
          />
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(30, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#b91c1c"
            fontWeight={600}
          >
            UTM
          </text>
        </g>
      );
    case "network-wireless-controller":
      return (
        <g>
          {/* Controller body */}
          <rect
            x={scale(14, "x")}
            y={scale(16, "y")}
            width={scale(12, "x")}
            height={scale(8, "y")}
            rx={scale(3, "x")}
            fill="#f0fdf4"
            stroke="#22c55e"
            strokeWidth={2}
          />
          {/* WiFi symbol */}
          <path
            d={`M${scale(20, "x")},${scale(18, "y")} Q${scale(16, "x")},${scale(14, "y")} ${scale(24, "x")},${scale(14, "y")}`}
            stroke="#22c55e"
            strokeWidth={2}
            fill="none"
          />
          <circle
            cx={scale(20, "x")}
            cy={scale(22, "y")}
            r={Math.min(sx, sy) * 1.2}
            fill="#22c55e"
          />
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(30, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#22c55e"
            fontWeight={600}
          >
            Wireless Ctrl
          </text>
        </g>
      );
    case "network-function-virtualization":
      return (
        <g>
          {/* NFV body */}
          <rect
            x={scale(12, "x")}
            y={scale(16, "y")}
            width={scale(16, "x")}
            height={scale(8, "y")}
            rx={scale(4, "x")}
            fill="#f3f4f6"
            stroke="#6366f1"
            strokeWidth={2}
          />
          {/* Virtualization symbol: stacked rectangles */}
          <rect
            x={scale(14, "x")}
            y={scale(18, "y")}
            width={scale(12, "x")}
            height={scale(4, "y")}
            rx={scale(1, "x")}
            fill="#fff"
            stroke="#6366f1"
            strokeWidth={1}
          />
          <rect
            x={scale(15, "x")}
            y={scale(22, "y")}
            width={scale(10, "x")}
            height={scale(2, "y")}
            rx={scale(1, "x")}
            fill="#e0e7ef"
            stroke="#6366f1"
            strokeWidth={1}
          />
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(30, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#6366f1"
            fontWeight={600}
          >
            NFV
          </text>
        </g>
      );
    case "network-firewall-alt":
      return (
        <g>
          {/* Alt firewall: shield */}
          <path
            d={`
              M${scale(20, "x")},${scale(12, "y")}
              L${scale(28, "x")},${scale(18, "y")}
              L${scale(24, "x")},${scale(32, "y")}
              L${scale(16, "x")},${scale(32, "y")}
              L${scale(12, "x")},${scale(18, "y")}
              Z
            `}
            fill="#fee2e2"
            stroke="#b91c1c"
            strokeWidth={2 * Math.max(sx, sy)}
          />
          {/* Shield lines */}
          <path
            d={`M${scale(20, "x")},${scale(16, "y")} L${scale(20, "x")},${scale(28, "y")}`}
            stroke="#b91c1c"
            strokeWidth={2}
          />
          <path
            d={`M${scale(16, "x")},${scale(24, "y")} L${scale(24, "x")},${scale(24, "y")}`}
            stroke="#b91c1c"
            strokeWidth={2}
          />
          {/* Label */}
          <text
            x={scale(20, "x")}
            y={scale(36, "y")}
            textAnchor="middle"
            fontSize={scale(4, "y")}
            fill="#b91c1c"
            fontWeight={600}
          >
            Firewall
          </text>
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