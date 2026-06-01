// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React from 'react';
import { Glyph } from '../glyph/Glyph';
import { Connection } from '../glyph/Connection';
import { GlyphRenderer } from '../glyph/GlyphRenderer';
import { computeGlyphSize, getConnectors } from './canvasUtils';
import type { ResizingState, DragConnState } from './types';

export interface GlyphItemProps {
  glyph: Glyph;
  renderIdx: number;
  // Render state
  selectedGlyphId: string | null;
  selectedGlyphIds: string[];
  selectedConnId: string | null;
  hoveredPort: { glyphId: string; portIdx: number } | null;
  dragConn: DragConnState | null;
  editingTextId: string | null;
  editingTextValue: string;
  zoom: number;
  allGlyphs: Glyph[];
  allConnections: Connection[];
  canvasRef: React.RefObject<HTMLDivElement | null>;
  // Callbacks
  onPointerDown: (e: React.PointerEvent, glyph: Glyph) => void;
  onSelect: (glyphId: string, multiSelect: boolean) => void;
  onDoubleClickGlyph: (glyph: Glyph) => void;
  onContextMenu: (glyphId: string, x: number, y: number) => void;
  onStartPortDrag: (portId: string, glyphId: string, fromX: number, fromY: number) => void;
  onStartPortMove: (portId: string, glyphId: string) => void;
  onCompleteConnection: (toGlyphId: string, toPortId: string | undefined) => void;
  onPortHover: (glyphId: string, portIdx: number) => void;
  onPortHoverEnd: () => void;
  setEditingTextId: (id: string | null) => void;
  setEditingTextValue: (v: string) => void;
  setResizing: (state: ResizingState | null) => void;
  setSelectedConn: (conn: number | null) => void;
  onMoveGlyph: (id: string, x: number, y: number) => void;
  onNotifyResize: (rect: { x: number; y: number; width: number; height: number }) => void;
}

const MAX_LABEL_CHARS = 5;

export const GlyphItem: React.FC<GlyphItemProps> = ({
  glyph,
  renderIdx,
  selectedGlyphId,
  selectedGlyphIds,
  selectedConnId,
  hoveredPort,
  dragConn,
  editingTextId,
  editingTextValue,
  zoom,
  allGlyphs,
  allConnections,
  canvasRef,
  onPointerDown,
  onSelect,
  onDoubleClickGlyph,
  onContextMenu,
  onStartPortDrag,
  onStartPortMove,
  onCompleteConnection,
  onPortHover,
  onPortHoverEnd,
  setEditingTextId,
  setEditingTextValue,
  setResizing,
  setSelectedConn,
  onMoveGlyph,
  onNotifyResize,
}) => {
  const { w: width, h: height } = computeGlyphSize(glyph);
  const isTextGlyph = glyph.type === "text";
  const isEditing = editingTextId === glyph.id;
  const connectors = getConnectors(glyph, width, height);
  const isGrouped =
    glyph.groupId != null &&
    allGlyphs.some(g => g.groupId === glyph.groupId && selectedGlyphIds.includes(g.id));
  const hasConnections = allConnections.some(
    conn => conn.fromGlyphId === glyph.id || conn.toGlyphId === glyph.id
  );
  if (glyph.type === "debug" && hasConnections) {
    console.log(`Breakpoint triggered on Debug Glyph "${glyph.label || glyph.id}": Connection detected.`);
  }
  const isTruncated = !!(glyph.label && glyph.label.length > MAX_LABEL_CHARS);
  const displayLabel = isTruncated
    ? glyph.label.slice(0, MAX_LABEL_CHARS - 3) + "..."
    : glyph.label;

  const PAD = 8; // must be >= connector circle radius (7px)

  return (
    <svg
      key={glyph.id}
      width={width + PAD * 2}
      height={height + PAD * 2}
      viewBox={`${-PAD} ${-PAD} ${width + PAD * 2} ${height + PAD * 2}`}
      preserveAspectRatio="xMidYMid meet"
      style={{
        position: 'absolute',
        left: glyph.x - PAD,
        top: glyph.y - PAD,
        width: width + PAD * 2,
        height: height + PAD * 2,
        overflow: 'visible',
        cursor: isTextGlyph ? (isEditing ? 'text' : 'pointer') : 'grab',
        zIndex: renderIdx,
        pointerEvents: 'all',
        touchAction: 'none',
      }}
      onPointerDown={e => onPointerDown(e, glyph)}
      onClick={e => {
        e.stopPropagation();
        onSelect(glyph.id, e.shiftKey || e.ctrlKey);
      }}
      onDoubleClick={e => {
        e.stopPropagation();
        setSelectedConn(null);
        onDoubleClickGlyph(glyph);
      }}
      onContextMenu={e => {
        e.preventDefault();
        onContextMenu(glyph.id, e.clientX, e.clientY);
      }}
    >
      {/* Highlight border if selected */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={6}
        fill="none"
        stroke={
          selectedGlyphId === glyph.id
            ? "#2563eb"
            : isGrouped
              ? "#38bdf8"
              : "transparent"
        }
        strokeWidth={selectedGlyphId === glyph.id || isGrouped ? 4 : 0}
        pointerEvents="none"
      />
      {/* Glyph shape */}
      <GlyphRenderer
        type={glyph.type}
        width={width}
        height={height}
        label={displayLabel}
        orinLabel={glyph.label}
        isTruncated={isTruncated}
        attributes={glyph.attributes}
        methods={glyph.methods}
        hasConnections={hasConnections}
        glyph={glyph}
        onResize={newRect => {
          if (typeof glyph.onUpdate === "function") {
            if (glyph.type === "text") {
              glyph.onUpdate(glyph.id, { label: glyph.label ?? "" });
            } else {
              onMoveGlyph(glyph.id, newRect.x, newRect.y);
            }
          } else {
            if (
              glyph.type === "resizable-rectangle" ||
              glyph.type === "bpmn-pool" ||
              glyph.type === "bpmn-lane"
            ) {
              onNotifyResize(newRect);
              glyph.x = newRect.x;
              glyph.y = newRect.y;
              glyph.width = newRect.width;
              glyph.height = newRect.height;
            } else {
              onMoveGlyph(glyph.id, newRect.x, newRect.y);
            }
          }
        }}
      />
      {/* Resize handles for selected glyph */}
      {selectedGlyphId === glyph.id && (
        <g>
          {([
            { h: 'tl' as const, cx: 0, cy: 0, cursor: 'nwse-resize' },
            { h: 'tr' as const, cx: width, cy: 0, cursor: 'nesw-resize' },
            { h: 'bl' as const, cx: 0, cy: height, cursor: 'nesw-resize' },
            { h: 'br' as const, cx: width, cy: height, cursor: 'nwse-resize' },
            { h: 'tc' as const, cx: width / 2, cy: 0, cursor: 'n-resize' },
            { h: 'bc' as const, cx: width / 2, cy: height, cursor: 's-resize' },
            { h: 'ml' as const, cx: 0, cy: height / 2, cursor: 'w-resize' },
            { h: 'mr' as const, cx: width, cy: height / 2, cursor: 'e-resize' },
          ]).map(handle => (
            <rect
              key={handle.h}
              x={handle.cx - 4}
              y={handle.cy - 4}
              width={8}
              height={8}
              fill="#fff"
              stroke="#2563eb"
              strokeWidth={1.5}
              rx={1}
              style={{ cursor: handle.cursor, touchAction: 'none' }}
              onPointerDown={e => {
                e.stopPropagation();
                setResizing({
                  id: glyph.id,
                  handle: handle.h,
                  startX: e.clientX,
                  startY: e.clientY,
                  origX: glyph.x,
                  origY: glyph.y,
                  origW: width,
                  origH: height,
                });
              }}
            />
          ))}
        </g>
      )}
      {!isTextGlyph && (
        <text
          x={(() => {
            if (glyph.data?.labelAlign === "left") return 8;
            if (glyph.data?.labelAlign === "right") return width - 8;
            return width / 2;
          })()}
          y={28}
          textAnchor={
            glyph.data?.labelAlign === "left"
              ? "start"
              : glyph.data?.labelAlign === "right"
                ? "end"
                : "middle"
          }
          style={{
            fontSize: glyph.data?.fontSize ?? 18,
            fontFamily: glyph.data?.fontFamily ?? "Arial",
            fill: glyph.data?.textColor ?? "#222",
            fontWeight: 500,
            pointerEvents: "none",
            userSelect: "none",
            dominantBaseline: "middle",
          }}
        >
          {glyph.label}
        </text>
      )}
      {/* Connectors */}
      {connectors.map((pt, idx) => (
        <g key={idx}>
          <title>{pt.type === 'output' ? 'Drag: connect | Alt+Drag: move port' : 'Alt+Drag: move port'}</title>
          <circle
            cx={pt.cx}
            cy={pt.cy}
            r={7}
            fill={
              hoveredPort && hoveredPort.glyphId === glyph.id && hoveredPort.portIdx === idx
                ? "#38bdf8"
                : selectedConnId && allConnections.find(c => c.id === selectedConnId && (c.fromPortId === pt.id || c.toPortId === pt.id))
                  ? "#fecaca"
                  : "#fff"
            }
            stroke={
              selectedConnId && allConnections.find(c => c.id === selectedConnId && (c.fromPortId === pt.id || c.toPortId === pt.id))
                ? "#f87171"
                : "#222"
            }
            strokeWidth={
              selectedConnId && allConnections.find(c => c.id === selectedConnId && (c.fromPortId === pt.id || c.toPortId === pt.id))
                ? 3
                : 2
            }
            style={{ cursor: pt.type === 'output' ? 'crosshair' : 'pointer' }}
            onPointerDown={e => {
              e.stopPropagation();
              if (e.altKey) {
                onStartPortMove(pt.id, glyph.id);
              } else if (pt.type === 'output') {
                const rect = canvasRef.current?.getBoundingClientRect();
                const mouseX = (e.clientX - (rect?.left ?? 0)) / zoom;
                const mouseY = (e.clientY - (rect?.top ?? 0)) / zoom;
                onStartPortDrag(pt.id, glyph.id, mouseX, mouseY);
              }
            }}
            onMouseEnter={() => onPortHover(glyph.id, idx)}
            onMouseLeave={() => onPortHoverEnd()}
            onMouseUp={() => {
              if (
                dragConn &&
                pt.type === 'input' &&
                !(dragConn.fromGlyphId === glyph.id && dragConn.fromPortIdx === glyph.ports?.[idx]?.id)
              ) {
                onCompleteConnection(glyph.id, glyph.ports?.[idx]?.id);
              }
            }}
          />
          <text
            x={pt.type === 'input' ? pt.cx - 14 : pt.cx + 14}
            y={pt.cy + 5}
            fontSize={12}
            fill="#222"
            textAnchor={pt.type === 'input' ? 'end' : 'start'}
            pointerEvents="none"
            style={{ userSelect: "none" }}
          >
            {pt.type === 'input'
              ? `in${connectors.filter(c => c.type === 'input').findIndex(c => c.id === pt.id) + 1}`
              : `out${connectors.filter(c => c.type === 'output').findIndex(c => c.id === pt.id) + 1}`}
          </text>
        </g>
      ))}
      {/* In-place text editing overlay for text glyphs */}
      {isTextGlyph && isEditing && (
        <foreignObject
          x={0}
          y={0}
          width={width}
          height={height}
          style={{ pointerEvents: "auto", zIndex: 10 }}
        >
          <input
            type="text"
            value={editingTextValue}
            autoFocus
            style={{
              width: "100%",
              height: "100%",
              fontSize: glyph.data?.fontSize ?? 20,
              fontFamily: glyph.data?.fontFamily ?? "Arial",
              color: glyph.data?.textColor ?? "#222",
              border: "1px solid #2563eb",
              borderRadius: 4,
              background: "#fff",
              boxSizing: "border-box",
              padding: 4,
              outline: "none",
            }}
            onChange={e => setEditingTextValue(e.target.value)}
            onBlur={() => {
              setEditingTextId(null);
              if (editingTextValue !== glyph.label && typeof glyph.onUpdate === "function") {
                glyph.onUpdate(glyph.id, { label: editingTextValue });
              }
            }}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === "Escape") {
                setEditingTextId(null);
                if (editingTextValue !== glyph.label && typeof glyph.onUpdate === "function") {
                  glyph.onUpdate(glyph.id, { label: editingTextValue });
                }
              }
            }}
          />
        </foreignObject>
      )}
    </svg>
  );
};
