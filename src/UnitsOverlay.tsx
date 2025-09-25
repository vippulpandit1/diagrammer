// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React from 'react'

export const UnitsOverlay: React.FC = () => {
  const gridSize = 32
  const count = 40 // Adjust for your canvas size
  const fontSize = 11
  const color = "#bbb"

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        zIndex: 2,
      }}
    >
      {/* Horizontal units */}
      {Array.from({ length: count }).map((_, i) =>
        i % 2 === 0 ? (
          <text
            key={`x${i}`}
            x={i * gridSize + 2}
            y={14}
            fontSize={fontSize}
            fill={color}
          >
            {i * gridSize}
          </text>
        ) : null
      )}
      {/* Vertical units */}
      {Array.from({ length: count }).map((_, i) =>
        i % 2 === 0 ? (
          <text
            key={`y${i}`}
            x={2}
            y={i * gridSize + fontSize + 2}
            fontSize={fontSize}
            fill={color}
          >
            {i * gridSize}
          </text>
        ) : null
      )}
    </svg>
  )
}