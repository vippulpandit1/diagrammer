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
  /** Crossing points (absolute canvas coords + direction angle) for hop-arc rendering */
  crossingPoints?: Array<{ x: number; y: number; angle: number }>;
  onSelect: (i: number) => void;
  onDoubleClick: (conn: Connection, i: number) => void;
  onMouseEnter: (i: number) => void;
  onMouseLeave: () => void;
  onContextMenu: (connId: string, x: number, y: number) => void;
  onPointPointerDown: (connId: string, idx: number, e: React.PointerEvent) => void;
  onAddWaypoint: (connId: string, segmentIdx: number, canvasX: number, canvasY: number) => void;
  onRemoveWaypoint: (connId: string, idx: number) => void;
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
  crossingPoints,
  onSelect,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
  onPointPointerDown,
  onAddWaypoint,
  onRemoveWaypoint,
}) => {
  const connectionType = conn.view?.[CONNECTION_TYPE_INDEX] || connectorType;
  const sizeMap = new Map<string, { w: number; h: number }>();
  glyphsToRender.forEach(g => sizeMap.set(g.id, computeGlyphSize(g)));

  const connectionColor = conn.view?.color || "black";
  const connectionThickness = conn.view?.thickness || 2;
  const connectionDashed = conn.view?.dashed || false;
  const isPortHovered = !!(hoveredPortId && (conn.fromPortId === hoveredPortId || conn.toPortId === hoveredPortId));

  const fromGlyph = glyphsToRender.find(g => g.id === conn.fromGlyphId);
  const toGlyph = glyphsToRender.find(g => g.id === conn.toGlyphId);
  if (!fromGlyph || !toGlyph) return null;

  const fromSize = sizeMap.get(fromGlyph.id) ?? { w: 60, h: 60 };
  const toSize = sizeMap.get(toGlyph.id) ?? { w: 60, h: 60 };
  const from = getConnectorPos(fromGlyph, conn.fromPortId, fromSize.w, fromSize.h);
  const to = getConnectorPos(toGlyph, conn.toPortId, toSize.w, toSize.h);

  const isSelected = selectedConn === i;

  // All canvas-space points in order: from → waypoints → to
  const allAbsPoints = [from, ...(conn.points ?? []), to];

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

  const markerId = `arrowhead-${(conn.id ?? String(i)).replace(/[^a-zA-Z0-9_-]/g, '')}`;

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
      <defs>
        <marker
          id={markerId}
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 8 3, 0 6" fill="context-stroke" />
        </marker>
      </defs>
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
          markerEnd={`url(#${markerId})`}
        />
        {/* Hop arcs at crossing points (this connection goes under another) */}
        {crossingPoints && crossingPoints.map((cp, ci) => {
          const rp = rel(cp);
          const R = 8;
          const cos = Math.cos(cp.angle);
          const sin = Math.sin(cp.angle);
          // Entry and exit points along the connection direction
          const x1 = rp.x - R * cos, y1 = rp.y - R * sin;
          const x2 = rp.x + R * cos, y2 = rp.y + R * sin;
          return (
            <g key={`hop-${ci}`} style={{ pointerEvents: 'none' }}>
              {/* White gap to visually break the line */}
              <circle cx={rp.x} cy={rp.y} r={R + 1} fill="white" stroke="none" />
              {/* Arc bump curving to the left of the travel direction */}
              <path
                d={`M ${x1},${y1} A ${R},${R} 0 0 0 ${x2},${y2}`}
                stroke={connectionColor}
                strokeWidth={connectionThickness}
                fill="none"
              />
            </g>
          );
        })}
        {/* Waypoint circles — only when selected */}
        {isSelected && relPoints.map((pt, idx) => (
          <circle
            key={idx}
            cx={pt.x}
            cy={pt.y}
            r={7}
            fill="#fbbf24"
            stroke="#222"
            strokeWidth={2}
            style={{ cursor: "grab" }}
            onPointerDown={e => { e.stopPropagation(); onPointPointerDown(conn.id ?? "", idx, e); }}
            onDoubleClick={e => { e.stopPropagation(); onRemoveWaypoint(conn.id ?? "", idx); }}
          />
        ))}
        {/* Segment midpoint "+" handles — only when selected */}
        {isSelected && allAbsPoints.slice(0, -1).map((segFrom, idx) => {
          const segTo = allAbsPoints[idx + 1];
          const midCanvas = { x: (segFrom.x + segTo.x) / 2, y: (segFrom.y + segTo.y) / 2 };
          const relMid = rel(midCanvas);
          return (
            <g
              key={`add-${idx}`}
              style={{ cursor: 'crosshair' }}
              onClick={e => { e.stopPropagation(); onAddWaypoint(conn.id ?? "", idx, midCanvas.x, midCanvas.y); }}
            >
              <circle cx={relMid.x} cy={relMid.y} r={9} fill="white" stroke="#2563eb" strokeWidth={2} />
              <line x1={relMid.x - 5} y1={relMid.y} x2={relMid.x + 5} y2={relMid.y} stroke="#2563eb" strokeWidth={2} />
              <line x1={relMid.x} y1={relMid.y - 5} x2={relMid.x} y2={relMid.y + 5} stroke="#2563eb" strokeWidth={2} />
            </g>
          );
        })}
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
