// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React from 'react';
import { Glyph } from '../glyph/Glyph';
import { Connection, CONNECTION_TYPE_INDEX } from '../glyph/Connection';
import { computeGlyphSize, getConnectorPos, getConnectionPath, getConnectionPathMulti } from './canvasUtils';

export interface ConnectionItemProps {
  conn: Connection;
  /** Index of this connection in connectionsToRender — used for selectedConn / hoveredConn comparison */
  i: number;
  renderIdx: number;
  selectedConn: number | null;
  hoveredConn: number | null;
  hoveredPortId: string | null;
  glyphsToRender: Glyph[];
  connectorType: "bezier" | "manhattan" | "line";
  onSelect: (i: number) => void;
  onDoubleClick: (conn: Connection, i: number) => void;
  onMouseEnter: (i: number) => void;
  onMouseLeave: () => void;
  onContextMenu: (connId: string, x: number, y: number) => void;
  onPointPointerDown: (connId: string, idx: number, e: React.PointerEvent) => void;
}

export const ConnectionItem: React.FC<ConnectionItemProps> = ({
  conn,
  i,
  renderIdx,
  selectedConn,
  hoveredConn,
  hoveredPortId,
  glyphsToRender,
  connectorType,
  onSelect,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
  onPointPointerDown,
}) => {
  const connectionType = conn.view?.[CONNECTION_TYPE_INDEX] || connectorType;
  const sizeMap = new Map<string, { w: number; h: number }>();
  glyphsToRender.forEach(g => sizeMap.set(g.id, computeGlyphSize(g)));

  const connectionColor = conn.view?.color || "black";
  const connectionThickness = conn.view?.thickness || 2;
  const connectionDashed = conn.view?.dashed || false;
  const isHovered = hoveredConn === i;
  const isPortHovered = !!(hoveredPortId && (conn.fromPortId === hoveredPortId || conn.toPortId === hoveredPortId));

  const fromGlyph = glyphsToRender.find(g => g.id === conn.fromGlyphId);
  const toGlyph = glyphsToRender.find(g => g.id === conn.toGlyphId);
  if (!fromGlyph || !toGlyph) return null;

  const fromSize = sizeMap.get(fromGlyph.id) ?? { w: 60, h: 60 };
  const toSize = sizeMap.get(toGlyph.id) ?? { w: 60, h: 60 };
  const from = getConnectorPos(fromGlyph, conn.fromPortId, fromSize.w, fromSize.h);
  const to = getConnectorPos(toGlyph, conn.toPortId, toSize.w, toSize.h);

  // Bounding box
  const xs = [from.x, to.x, ...(conn.points?.map(pt => pt.x) ?? [])];
  const ys = [from.y, to.y, ...(conn.points?.map(pt => pt.y) ?? [])];
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const svgWidth = Math.max(1, maxX - minX + 20);
  const svgHeight = Math.max(1, maxY - minY + 20);

  // Local SVG coordinates relative to bounding box
  const rel = (pt: { x: number; y: number }) => ({
    x: pt.x - minX + 10,
    y: pt.y - minY + 10,
  });
  const relFrom = rel(from);
  const relTo = rel(to);
  const relPoints = conn.points?.map(rel) ?? [];
  const midPoint = {
    x: (relFrom.x + relTo.x) / 2,
    y: (relFrom.y + relTo.y) / 2,
  };

  return (
    <svg
      key={conn.id || i}
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        touchAction: 'none',
        zIndex: renderIdx,
        left: minX - 10,
        top: minY - 10,
      }}
      width={svgWidth}
      height={svgHeight}
    >
      <g
        className="connection"
        style={{ pointerEvents: 'all' }}
        onContextMenu={e => {
          e.preventDefault();
          onContextMenu(conn.id ?? "", e.clientX, e.clientY);
        }}
      >
        <path
          d={
            relPoints.length > 0
              ? getConnectionPathMulti(relFrom, relPoints, relTo, connectionType)
              : getConnectionPath(relFrom, relTo, connectionType)
          }
          stroke={
            selectedConn === i
              ? "#f87171"
              : isPortHovered
                ? "#38bdf8"
                : hoveredConn === i
                  ? "#2563eb"
                  : connectionColor
          }
          strokeWidth={selectedConn === i || isPortHovered || hoveredConn === i ? 5 : connectionThickness}
          fill="none"
          style={{
            cursor: 'pointer',
            pointerEvents: 'all',
            filter:
              selectedConn === i
                ? 'drop-shadow(0 0 4px #f87171)'
                : isPortHovered
                  ? 'drop-shadow(0 0 4px #38bdf8)'
                  : hoveredConn === i
                    ? 'drop-shadow(0 0 4px #2563eb)'
                    : undefined,
          }}
          onClick={e => {
            e.stopPropagation();
            onSelect(i);
          }}
          onDoubleClick={e => {
            e.stopPropagation();
            onDoubleClick(conn, i);
          }}
          onMouseEnter={() => onMouseEnter(i)}
          onMouseLeave={() => onMouseLeave()}
          strokeDasharray={connectionDashed ? "5,5" : "none"}
        />
        {relPoints.map((pt, idx) => (
          <circle
            key={idx}
            cx={pt.x}
            cy={pt.y}
            r={8}
            fill="#fbbf24"
            stroke="#222"
            strokeWidth={2}
            style={{ cursor: "grab" }}
            onPointerDown={e => onPointPointerDown(conn.id ?? "", idx, e)}
          />
        ))}
        {conn.label && (
          <>
            <rect
              x={midPoint.x - conn.label.length * 4}
              y={midPoint.y - 10}
              width={conn.label.length * 8}
              height={20}
              fill="#fff"
            />
            <text
              x={midPoint.x}
              y={midPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#334155"
              fontSize="13px"
              fontWeight="500"
            >
              {conn.label}
            </text>
          </>
        )}
      </g>
    </svg>
  );
};
