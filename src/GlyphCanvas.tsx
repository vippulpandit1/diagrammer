// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React, { useRef, useState, useEffect } from 'react';
import { Glyph } from './glyph/Glyph';
import { Connection, CONNECTION_TYPE_INDEX } from './glyph/Connection';
import { GlyphRenderer } from "./glyph/GlyphRenderer";
import type { Page } from './glyph/Page';

// function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
//   return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
// }
// --- Utility Functions ---
const getConnectionPath = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  type: "bezier" | "manhattan" | "line" = "bezier"
) => {
  if (type === "line") return `M${from.x},${from.y} L${to.x},${to.y}`;
  if (type === "manhattan") {
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);
    if (dx > dy) {
      const mx = (from.x + to.x) / 2;
      return `M${from.x},${from.y} L${mx},${from.y} L${mx},${to.y} L${to.x},${to.y}`;
    }
    const my = (from.y + to.y) / 2;
    return `M${from.x},${from.y} L${from.x},${my} L${to.x},${my} L${to.x},${to.y}`;
  }
  // Bezier curve
  const c1x = from.x + (to.x - from.x) * 0.3;
  const c1y = from.y;
  const c2x = to.x - (to.x - from.x) * 0.3;
  const c2y = to.y;
  return `M${from.x},${from.y} C${c1x},${c1y} ${c2x},${c2y} ${to.x},${to.y}`;
};

const computeGlyphSize = (glyph: Glyph) => {
  const defaultTileSize = 60;
  if (glyph.type === "text") {
    const fontSize = glyph.data?.fontSize ?? 20;
    const label = glyph.label ?? "Text";
    const width = Math.max(60, label.length * (fontSize * 0.6) + 32);
    const height = Math.max(fontSize * 2, 40);
    return { w: width, h: height };
  }
  const labelWidth = Math.max(60, (glyph.label?.length ?? 0) * 10 + 32);
  const attrHeight = (glyph.attributes?.length ?? 0) * 18 + defaultTileSize;
  const w = Math.max(labelWidth, 100);
  const h = Math.max(attrHeight, 60);
  if (glyph.type === "resizable-rectangle") {
    return { w: glyph.width ?? 120, h: glyph.height ?? 80 };
  }

  if (typeof glyph.width === "number" && typeof glyph.height === "number") {
    return { w: glyph.width, h: glyph.height };
  }
  return { w, h };
};

const getConnectors = (glyph: Glyph, width: number, height: number) => {
  const connectors = [];
  const numInputs = glyph.inputs ?? 2;
  const numOutputs = glyph.outputs ?? 1;

  let inputCount = 0;
  let outputCount = 0;
  for (let i = 0; i < glyph.ports?.length; i++) {
    const port = glyph.ports[i];
    if (port.type === "input") {
      connectors.push({
        cx: 0,
        cy: height * ((inputCount + 1) / (numInputs + 1)),
        type: "input",
        id: port.id ?? `input-${i + 1}`,
      });
      inputCount++;
    } else if (port.type === "output") {
      connectors.push({
        cx: width,
        cy: height * ((outputCount + 1) / (numOutputs + 1)),
        type: "output",
        id: port.id ?? `output-${i + 1}`,
      });
      outputCount++;
    }
  }
  // Attribute outbound connectors for self-defined attributes
  if (glyph.type === "uml-class" && Array.isArray(glyph.attributes)) {
    const LABEL_SECTION_HEIGHT = 25;
    const ATTR_START_Y = LABEL_SECTION_HEIGHT + 8;
    glyph.attributes.forEach((attr, i) => {
      if (attr.type === "self-defined") {
        connectors.push({
          cx: width,
          cy: ATTR_START_Y + i * 20 + 10,
          type: "attribute-outbound",
          attrIdx: i,
          id: `attr-outbound-${i}`,
        });
      }
    });
  }
  return connectors;
};

const getConnectorPos = (glyph: Glyph, portId: string, width: number, height: number) => {
  const conns = getConnectors(glyph, width, height);
  const connector = conns.find(c => c.id === portId);
  if (!connector) {
    // fallback: use first connector
    return { x: glyph.x, y: glyph.y };
  }
  return {
    x: glyph.x + connector.cx,
    y: glyph.y + connector.cy,
  };
};

// --- Main Component ---

interface GlyphCanvasProps {
  pages: Page[];
  activePageIdx: number;
  onPageChange: (index: number) => void;
  glyphs: Glyph[];
  onMoveGlyph: (id: string, x: number, y: number) => void;
  connections: Connection[];
  onAddConnection: (conn: Connection) => void;
  onDeleteConnection: (connIndex: number) => void;
  zoom: number;
  onAddGlyph: (type: string, x: number, y: number, inputs?: number, outputs?: number) => void;
  onGlyphClick?: (glyph: Glyph) => void;
  bringGlyphToFront: (glyphId: string) => void;
  sendGlyphToBack: (glyphId: string) => void;
  groupGlyphs: (glyphIds: string[]) => void;
  ungroupGlyphs: (glyphIds: string[]) => void;
  connectorType: "bezier" | "manhattan" | "line";
  onConnectionClick?: (conn: Connection) => void;
  onMessage?: (msg: string) => void;
}

export const GlyphCanvas: React.FC<GlyphCanvasProps> = ({
  pages,
  activePageIdx,
  onPageChange,
  glyphs,
  connections,
  onMoveGlyph,
  onAddConnection,
  onDeleteConnection,
  zoom,
  onAddGlyph,
  onGlyphClick,
  bringGlyphToFront,
  sendGlyphToBack,
  groupGlyphs,
  ungroupGlyphs,
  connectorType,
  onConnectionClick,
  onMessage
}) => {
  // --- State ---
  const activePage = pages[activePageIdx];
  const [draggedPoint, setDraggedPoint] = useState<{ connId: string; idx: number } | null>(null);
  const [dragging, setDragging] = useState<null | { id: string, offsetX: number, offsetY: number }>(null);
  const [dragMouse, setDragMouse] = useState<{ x: number, y: number } | null>(null);
  const [selectedConn, setSelectedConn] = useState<number | null>(null);
  const [selectedGlyphId, setSelectedGlyphId] = useState<string | null>(null);
  const [selectedGlyphIds, setSelectedGlyphIds] = useState<string[]>([]);
  const [hoveredConn, setHoveredConn] = useState<number | null>(null);
  const [glyphMenu, setGlyphMenu] = useState<{ glyphId: string, x: number, y: number } | null>(null);
  // Add state for connection menu
  const [connectionMenu, setConnectionMenu] = useState<{ connId: string, x: number, y: number } | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextValue, setEditingTextValue] = useState<string>("");
  const [dragConn, setDragConn] = useState<null | {
    fromGlyphId: string, fromPortIdx: string, fromX: number, fromY: number
  }>(null);
  const [hoveredPort, setHoveredPort] = useState<null | { glyphId: string, portIdx: number }>(null);
  // add rect state here (parent owns the rect)
  const [_, setRect] = useState({ x: 60, y: 60, width: 120, height: 80 });
  // Your existing rendering logic now uses `activePage.glyphs` and `activePage.connections`
  const glyphsToRender = activePage.glyphs;
  const connectionsToRender = activePage.connections;

  const canvasRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedConn !== null) {
        onDeleteConnection(selectedConn);
        setSelectedConn(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedConn, onDeleteConnection]);

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      setDragMouse({ x: e.clientX, y: e.clientY });
      if (dragging) {
        onMoveGlyph(
          dragging.id,
          e.clientX - dragging.offsetX,
          e.clientY - dragging.offsetY
        );
      }
    };
    const handleMouseUp = () => {
      setDragging(null);
      setDragConn(null);
      setDragMouse(null);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, onMoveGlyph]);
  useEffect(() => {
    if (!dragConn) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      const mouseX = (e.clientX - (rect?.left ?? 0)) / zoom;
      const mouseY = (e.clientY - (rect?.top ?? 0)) / zoom;
      setDragMouse({ x: mouseX, y: mouseY });
    };
    const handleMouseUp = () => {
      setDragConn(null);
      setDragMouse(null);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragConn, zoom]);
  const getConnectionPathMulti = (
    from: { x: number; y: number },
    points: { x: number; y: number }[],
    to: { x: number; y: number },
    _type: "bezier" | "manhattan" | "line" = "bezier"
  ) => {
    // Start at 'from'
    let path = `M${from.x},${from.y}`;
    // Draw lines or curves through each point
    points.forEach(pt => {
      path += ` L${pt.x},${pt.y}`;
    });
    // End at 'to'
    path += ` L${to.x},${to.y}`;
    return path;
  };
  // --- Handlers ---
  const handleMouseDown = (e: React.MouseEvent, glyph: Glyph) => {
    if (glyph.type === "resizable-rectangle") {
      // Check if the click is on a corner handle
      const { x, y } = glyph;
      const width = glyph.width ?? 120;
      const height = glyph.height ?? 80;
      const HANDLE_RADIUS = 6; // Same as the handle radius in ResizableRectangleGlyph
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Define the positions of the corner handles
      const handles = [
        { cx: x, cy: y }, // Top-left
        { cx: x + width, cy: y }, // Top-right
        { cx: x, cy: y + height }, // Bottom-left
        { cx: x + width, cy: y + height }, // Bottom-right
      ];

      // Check if the mouse is within any handle
      const isOnHandle = handles.some(
        handle =>
          Math.abs(mouseX - handle.cx) <= HANDLE_RADIUS &&
          Math.abs(mouseY - handle.cy) <= HANDLE_RADIUS
      );

      if (isOnHandle) {
        console.log("Clicked on handle, not starting drag");
        // If the click is on a handle, do not start dragging
        return;
      }
    }

    // Default dragging logic
    setDragging({
      id: glyph.id,
      offsetX: e.clientX - glyph.x,
      offsetY: e.clientY - glyph.y,
    });

  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    let type = e.dataTransfer.getData("glyphType");
    let inputs: number | undefined = undefined;
    let outputs: number | undefined = undefined;
    let json = e.dataTransfer.getData("glyphJSON");
    if (!json) {
      // Fallback for Safari
      json = e.dataTransfer.getData("text/plain");
    }
    if (json) {
      try {
        const parsed = JSON.parse(json);
        if (parsed.type) type = parsed.type;
        if (typeof parsed.inputs === "number") inputs = parsed.inputs;
        if (typeof parsed.outputs === "number") outputs = parsed.outputs;
      } catch (err) {
        // ignore
      }
    }
    if (type) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;
      onAddGlyph(type, x, y, inputs, outputs);
    }
  };
  const handlePointPointerDown = (connId: string, idx: number, e: React.PointerEvent) => {
    e.stopPropagation();
    setDraggedPoint({ connId, idx });
  };

  useEffect(() => {
    if (!draggedPoint) return;
    const handlePointerMove = (e: PointerEvent) => {
      // Update the position of the dragged point
      activePage.connections = activePage.connections.map(conn =>
        conn.id === draggedPoint.connId
          ? {
            ...conn,
            points: conn.points?.map((pt, i) =>
              i === draggedPoint.idx ? { x: e.clientX, y: e.clientY } : pt
            )
          }
          : conn
      );
    };
    const handlePointerUp = () => setDraggedPoint(null);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggedPoint, activePage.connections]);

  // Create a combined array of glyphs and connections with their render order
  const renderItems = (() => {
    const items: Array<{ type: 'glyph' | 'connection', data: Glyph | Connection, index: number }> = [];

    // Add glyphs with their index as z-order
    glyphsToRender.forEach((glyph, idx) => {
      items.push({ type: 'glyph', data: glyph, index: idx });
    });

    // Add connections with their index as z-order
    connectionsToRender.forEach((conn) => {
      // Find the z-order of the connected glyphs
      const fromGlyphIdx = glyphsToRender.findIndex(g => g.id === conn.fromGlyphId);
      const toGlyphIdx = glyphsToRender.findIndex(g => g.id === conn.toGlyphId);

      // Place connection at the minimum z-order of its connected glyphs
      // This ensures connections appear behind their glyphs by default
      const connectionZOrder = Math.min(
        fromGlyphIdx >= 0 ? fromGlyphIdx : 0,
        toGlyphIdx >= 0 ? toGlyphIdx : 0
      );

      items.push({ type: 'connection', data: conn, index: connectionZOrder });
    });

    // Sort by index (z-order)
    return items.sort((a, b) => a.index - b.index);
  })();

  // --- Render ---
  return (
    <div
      ref={canvasRef}
      className="workspace-canvas"
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'auto' }}
      onDragOver={e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }}
      onDrop={handleDrop}
    >
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {renderItems.map((item, renderIdx) => {
          if (item.type === 'glyph') {
            const glyph = item.data as Glyph;
            // const i = glyphsToRender.findIndex(g => g.id === glyph.id);
            const width = computeGlyphSize(glyph).w;
            const height = computeGlyphSize(glyph).h;
            const isTextGlyph = glyph.type === "text";
            const isEditing = editingTextId === glyph.id;
            const connectors = getConnectors(glyph, width, height);
            // const numInputs = glyph.inputs ?? 2;
            const isGrouped =
              glyph.groupId &&
              glyphs.some(
                g =>
                  g.groupId === glyph.groupId &&
                  selectedGlyphIds.includes(g.id)
              );
            const hasConnections = connections.some(
              conn => conn.fromGlyphId === glyph.id || conn.toGlyphId === glyph.id
            );
            if (glyph.type === "debug" && hasConnections) {
              console.log(`Breakpoint triggered on Debug Glyph "${glyph.label || glyph.id}": Connection detected.`);
            }
            // Truncate label if needed
            const maxLabelChars = 5;
            const isTruncated = !!(glyph.label && glyph.label.length > maxLabelChars);
            const displayLabel = isTruncated
              ? glyph.label.slice(0, maxLabelChars - 3) + "..."
              : glyph.label;
            return (
              <svg
                key={glyph.id}
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="xMidYMid meet"
                style={{
                  position: 'absolute',
                  left: glyph.x,
                  top: glyph.y,
                  width: width,
                  height: height,
                  overflow: 'visible',
                  cursor: isTextGlyph ? (isEditing ? 'text' : 'pointer') : 'grab',
                  zIndex: renderIdx,
                  pointerEvents: 'all',
                  touchAction: 'none'
                }}
                onPointerDown={e => handleMouseDown(e, glyph)}
                onClick={e => {
                  e.stopPropagation();
                  if (e.shiftKey || e.ctrlKey) {
                    setSelectedGlyphIds(ids => ids.includes(glyph.id) ? ids : [...ids, glyph.id]);
                  } else {
                    setSelectedGlyphIds([glyph.id]);
                  }
                  setSelectedGlyphId(glyph.id);
                }}
                onDoubleClick={e => {
                  e.stopPropagation();
                  setSelectedConn(null);
                  setSelectedGlyphIds([glyph.id]);
                  setSelectedGlyphId(glyph.id);
                  if (isTextGlyph) {
                    setEditingTextId(glyph.id);
                    setEditingTextValue(glyph.label ?? "");
                  } else if (onGlyphClick) {
                    onGlyphClick(glyph);
                  }
                }}
                onContextMenu={e => {
                  e.preventDefault();
                  setGlyphMenu({
                    glyphId: glyph.id,
                    x: e.clientX,
                    y: e.clientY,
                  });
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
                  strokeWidth={
                    selectedGlyphId === glyph.id || isGrouped ? 4 : 0
                  }
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
                      // Only update label for text glyphs; otherwise, move glyph
                      if (glyph.type === "text") {
                        glyph.onUpdate(glyph.id, { label: glyph.label ?? "" });
                      } else {
                        onMoveGlyph(glyph.id, newRect.x, newRect.y);
                      }
                    } else {
                      if (glyph.type === "resizable-rectangle") {
                        console.log("Resized glyph:", glyph.id, newRect);
                        //newRect.x = glyph.x;
                        //newRect.y = glyph.y;
                        setRect(newRect);
                        glyph.x = newRect.x;
                        glyph.y = newRect.y;
                        glyph.width = newRect.width;
                        glyph.height = newRect.height;
                      } else {
                        onMoveGlyph(glyph.id, newRect.x, newRect.y);
                      }
                    }

                    // width and height are constants and should not be reassigned here
                  }}
                />
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
                    dominantBaseline: "middle"
                  }}
                >
                  {glyph.label}
                </text>
                {/* Connectors */}
                {connectors.map((pt, idx) => (
                  <g key={idx}>
                    <circle
                      cx={pt.cx}
                      cy={pt.cy}
                      r={7}
                      fill={hoveredPort && hoveredPort.glyphId === glyph.id && hoveredPort.portIdx === idx ? "#38bdf8" : "#fff"}
                      stroke="#222"
                      strokeWidth={2}
                      style={{ cursor: pt.type === 'output' ? 'crosshair' : 'pointer' }}
                      onPointerDown={e => {
                        e.stopPropagation();
                        if (pt.type === 'output') {
                          const rect = canvasRef.current?.getBoundingClientRect();
                          const mouseX = (e.clientX - (rect?.left ?? 0)) / zoom;
                          const mouseY = (e.clientY - (rect?.top ?? 0)) / zoom;
                          setDragConn({
                            fromGlyphId: glyph.id,
                            fromPortIdx: pt.id,
                            fromX: mouseX,
                            fromY: mouseY,
                          });
                          setDragMouse({ x: mouseX, y: mouseY });
                        }
                      }}
                      onMouseEnter={() => setHoveredPort({ glyphId: glyph.id, portIdx: idx })}
                      onMouseLeave={() => setHoveredPort(null)}
                      onMouseUp={() => {
                        if (
                          dragConn &&
                          pt.type === 'input' &&
                          !(dragConn.fromGlyphId === glyph.id && dragConn.fromPortIdx === glyph.ports?.[idx]?.id)
                        ) {
                          onAddConnection({
                            id: crypto.randomUUID(),
                            fromGlyphId: dragConn.fromGlyphId,
                            fromPortId: dragConn.fromPortIdx,
                            toGlyphId: glyph.id,
                            toPortId: glyph.ports?.[idx]?.id,
                            type: "default",
                            view: {}, // Provide a default or appropriate view object
                          });
                          setDragConn(null);
                          setDragMouse(null);
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
          } else {
            const conn = item.data as Connection;
            const i = connectionsToRender.findIndex(c => c.id === conn.id);
            const connectionType = conn.view?.[CONNECTION_TYPE_INDEX] || connectorType;
            const sizeMap = new Map<string, { w: number, h: number }>();
            glyphsToRender.forEach(g => sizeMap.set(g.id, computeGlyphSize(g)));
            const connectionColor = conn.view?.color || "black";
            const connectionThickness = conn.view?.thickness || 2;
            const connectionDashed = conn.view?.dashed || false;
            const isHovered = hoveredConn === i;
            const fromGlyph = glyphsToRender.find(g => g.id === conn.fromGlyphId);
            const toGlyph = glyphsToRender.find(g => g.id === conn.toGlyphId);
            if (!fromGlyph || !toGlyph) return null;
            const fromSize = sizeMap.get(fromGlyph.id) ?? { w: 60, h: 60 };
            const toSize = sizeMap.get(toGlyph.id) ?? { w: 60, h: 60 };
            const from = getConnectorPos(fromGlyph, conn.fromPortId, fromSize.w, fromSize.h);
            const to = getConnectorPos(toGlyph, conn.toPortId, toSize.w, toSize.h);

            // Calculate bounding box for this connection
            const xs = [from.x, to.x, ...(conn.points?.map(pt => pt.x) ?? [])];
            const ys = [from.y, to.y, ...(conn.points?.map(pt => pt.y) ?? [])];
            const minX = Math.min(...xs);
            const minY = Math.min(...ys);
            const maxX = Math.max(...xs);
            const maxY = Math.max(...ys);
            const svgWidth = Math.max(1, maxX - minX + 20); // add some padding
            const svgHeight = Math.max(1, maxY - minY + 20);

            // Adjust all points relative to minX/minY for local SVG coordinates
            const rel = (pt: { x: number, y: number }) => ({
              x: pt.x - minX + 10,
              y: pt.y - minY + 10
            });
            const relFrom = rel(from);
            const relTo = rel(to);
            const relPoints = conn.points?.map(rel) ?? [];

            // Calculate the midpoint for displaying the label
            const midPoint = {
              x: (relFrom.x + relTo.x) / 2,
              y: (relFrom.y + relTo.y) / 2
            };
            return (
              <svg
                key={conn.id || i}
                style={{
                  position: 'absolute',
                  pointerEvents: 'all',
                  touchAction: 'none',
                  zIndex: renderIdx,
                  left: minX - 10,
                  top: minY - 10
                }}
                width={svgWidth}
                height={svgHeight}
              >
                <g
                  key={i}
                  className="connection"
                  onContextMenu={e => {
                    e.preventDefault();
                    setConnectionMenu({
                      connId: conn.id ?? "",
                      x: e.clientX,
                      y: e.clientY,
                    });
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
                        : hoveredConn === i
                          ? "#2563eb"
                          : connectionColor === "black" ? "#f87171" : connectionColor
                    }
                    strokeWidth={selectedConn === i || hoveredConn === i ? 5 : connectionThickness}
                    fill="none"
                    style={{
                      cursor: 'pointer',
                      pointerEvents: 'all',
                      filter:
                        selectedConn === i
                          ? 'drop-shadow(0 0 4px #f87171)'
                          : hoveredConn === i
                            ? 'drop-shadow(0 0 4px #2563eb)'
                            : undefined
                    }}
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedConn(selectedConn === i ? null : i);
                    }}
                    onDoubleClick={e => {
                      e.stopPropagation();
                      setSelectedGlyphId(null);
                      if (onConnectionClick && selectedConn !== i) onConnectionClick(conn);
                    }}
                    onMouseEnter={() => setHoveredConn(i)}
                    onMouseLeave={() => setHoveredConn(null)}
                    strokeDasharray={connectionDashed ? "5,5" : isHovered ? "5,5" : "none"}
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
                      onPointerDown={e => handlePointPointerDown(conn.id ?? "", idx, e)}
                    />
                  ))}
                  {conn.label && (
                    <>
                      <rect
                        x={midPoint.x - (conn.label.length * 4)}
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
          }
        })}
        {/* Glyph context menu */}
        {glyphMenu && (
          <div
            style={{
              position: "fixed",
              left: glyphMenu.x,
              top: glyphMenu.y,
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: 6,
              boxShadow: "0 2px 8px #0002",
              zIndex: 10000,
              minWidth: 120,
              padding: "4px 0"
            }}
            onMouseLeave={() => setGlyphMenu(null)}
          >
            <button
              style={menuButtonStyle}
              onClick={() => {
                bringGlyphToFront(glyphMenu.glyphId);
                setGlyphMenu(null);
              }}
            >
              Bring to Front
            </button>
            <button
              style={menuButtonStyle}
              onClick={() => {
                sendGlyphToBack(glyphMenu.glyphId);
                setGlyphMenu(null);
              }}
            >
              Send to Back
            </button>
            <button
              style={menuButtonStyle}
              onClick={() => {
                const idsToGroup = Array.from(new Set([glyphMenu.glyphId, ...selectedGlyphIds]));
                groupGlyphs(idsToGroup);
                setGlyphMenu(null);
              }}
            >
              Group
            </button>
            <button
              style={menuButtonStyle}
              onClick={() => {
                const idsToUngroup = Array.from(new Set([glyphMenu.glyphId, ...selectedGlyphIds]));
                ungroupGlyphs(idsToUngroup);
                setGlyphMenu(null);
              }}
            >
              Ungroup
            </button>
            <button
              style={menuButtonStyle}
              onClick={() => {
                // Delete the glyph and its connections
                const glyphId = glyphMenu.glyphId;
                // Remove the glyph
                const glyphIdx = activePage.glyphs.findIndex(g => g.id === glyphId);
                if (glyphIdx !== -1) {
                  activePage.glyphs.splice(glyphIdx, 1);
                }
                // Remove all connections associated with this glyph
                activePage.connections = activePage.connections.filter(
                  conn => conn.fromGlyphId !== glyphId && conn.toGlyphId !== glyphId
                );
                setGlyphMenu(null);
                if (onMessage) onMessage(`Deleted glyph ${glyphId} and its connections`);
              }}
            >
              Delete
            </button>
            {/* Goto page selection for flow-off-page-connector */}
            {(() => {
              const glyph = glyphsToRender.find(g => g.id === glyphMenu.glyphId);
              if (glyph?.type === "flow-off-page-connector" && pages.length > 0) {
                return (
                  <div style={{ padding: "8px 16px" }}>
                    <label style={{ fontWeight: 500, fontSize: 13, color: "#2563eb", display: "block", marginBottom: 4 }}>
                      Goto Page
                    </label>
                    <select
                      style={{
                        width: "100%",
                        padding: "6px",
                        border: "1px solid #2563eb",
                        borderRadius: 4,
                        fontSize: 14,
                        marginBottom: 4,
                      }}
                      value={glyph.data?.targetPageId || ""}
                      onChange={e => {
                        // Save the selected page id in the glyph's data
                        glyph.data = { ...glyph.data, targetPageId: e.target.value };
                        setGlyphMenu(null);
                        // Take the user to the selected page
                        const pageIdx = pages.findIndex(p => p.id === e.target.value);
                        if (pageIdx >= 0) {
                          onPageChange(pageIdx);
                          onMessage?.(`Navigated to page: ${pages[pageIdx].name}`);
                        }
                      }}
                    >
                      <option value="">-- Select Page --</option>
                      {pages.map(page => (
                        <option key={page.id} value={page.id}>
                          {page.name}
                        </option>
                      ))}
                    </select>
                    <button
                      style={{
                        marginTop: 4,
                        width: "100%",
                        padding: "6px",
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        fontSize: 14,
                        cursor: "pointer"
                      }}
                      onClick={() => {
                        const pageIdx = pages.findIndex(p => p.id === (glyph.data?.targetPageId || ""));
                        setGlyphMenu(null);
                        if (pageIdx >= 0) {
                          onPageChange(pageIdx);
                          onMessage?.(`Navigated to page: ${pages[pageIdx].name}`);
                        }
                      }}
                    >
                      Go
                    </button>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}
        {/* Draw connections */}

        {/* Draw connection context menu */}
        {connectionMenu && (
          <div
            style={{
              position: "fixed",
              left: connectionMenu.x,
              top: connectionMenu.y,
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: 6,
              boxShadow: "0 2px 8px #0002",
              zIndex: 10000,
              minWidth: 120,
              padding: "4px 0"
            }}
            onMouseLeave={() => setConnectionMenu(null)}
          >
            <button
              style={menuButtonStyle}
              onClick={() => {
                // Delete the connection
                const connIdx = activePage.connections.findIndex(c => c.id === connectionMenu.connId);
                if (connIdx !== -1) {
                  activePage.connections.splice(connIdx, 1);
                }
                setConnectionMenu(null);
                if (onMessage) onMessage(`Deleted connection ${connectionMenu.connId}`);
              }}
            >
              Delete Connection
            </button>
            {/* You can add more connection actions here */}
          </div>
        )}
        {dragConn && dragMouse && (
          <svg
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 1000
            }}
            width="100%"
            height="100%"
          >
            <path
              d={getConnectionPath(
                { x: dragConn.fromX, y: dragConn.fromY },
                dragMouse,
                connectorType
              )}
              stroke="#2563eb"
              strokeWidth={3}
              fill="none"
              style={{ pointerEvents: "none" }}
            />
          </svg>
        )}
      </div>
    </div>
  );
};

// --- Styles ---
const menuButtonStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "6px 16px",
  background: "none",
  border: "none",
  textAlign: "left",
  cursor: "pointer"
};