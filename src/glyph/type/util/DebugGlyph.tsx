import React from "react";
export const DebugGlyph: React.FC<{ size: number, height?: number, hasConnections?: boolean  }> = ({ size, height = 50, hasConnections=false  }) => (
    <g>
      <rect x={0} y={0} width={size} height={height} 
        fill={hasConnections ? "#ffcccc" : "#ffe066"} // Red tint if breakpoint active
        stroke={hasConnections ? "#ff0000" : "#222"} // Red border if active
        strokeWidth={hasConnections ? 4 : 2} // Thicker border if active
        rx={8}
      />     {/* Input ports */}
      <text
        x={size / 2}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size * 0.2}
        fill="#222"
      >
        Debug
      </text>
    </g>
);