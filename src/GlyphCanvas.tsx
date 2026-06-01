// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React, { useRef, useState, useEffect } from 'react';
import { Glyph } from './glyph/Glyph';
import { Connection } from './glyph/Connection';
import { computeGlyphSize, getConnectionPath, getConnectors, snapToPerimeter } from './glyphCanvas/canvasUtils';
import { GlyphItem } from './glyphCanvas/GlyphItem';
import { ConnectionItem } from './glyphCanvas/ConnectionItem';
import { ContextMenus } from './glyphCanvas/ContextMenus';
import type { GlyphCanvasProps, ResizingState, DragConnState, DraggingPortState } from './glyphCanvas/types';

export const GlyphCanvas: React.FC<GlyphCanvasProps> = ({
  pages,
  activePageIdx,
  onPageChange,
  glyphs,
  connections,
  onMoveGlyph,
  onAddConnection,
  onDeleteConnection,
  onUpdateConnection,
  zoom,
  onAddGlyph,
  onGlyphClick,
  bringGlyphToFront,
  sendGlyphToBack,
  groupGlyphs,
  ungroupGlyphs,
  connectorType,
  onConnectionClick,
  onMessage,
  onResizeGlyph,
  onUpdateGlyph,
}) => {
  const activePage = pages[activePageIdx];

  // --- State ---
  const [draggedPoint, setDraggedPoint] = useState<{ connId: string; idx: number } | null>(null);
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [dragMouse, setDragMouse] = useState<{ x: number; y: number } | null>(null);
  const [selectedConn, setSelectedConn] = useState<number | null>(null);
  const [selectedGlyphId, setSelectedGlyphId] = useState<string | null>(null);
  const [selectedGlyphIds, setSelectedGlyphIds] = useState<string[]>([]);
  const [hoveredConn, setHoveredConn] = useState<number | null>(null);
  const [glyphMenu, setGlyphMenu] = useState<{ glyphId: string; x: number; y: number } | null>(null);
  const [connectionMenu, setConnectionMenu] = useState<{ connId: string; x: number; y: number } | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextValue, setEditingTextValue] = useState<string>("");
  const [dragConn, setDragConn] = useState<DragConnState | null>(null);
  const [hoveredPort, setHoveredPort] = useState<{ glyphId: string; portIdx: number } | null>(null);
  const [, setRect] = useState({ x: 60, y: 60, width: 120, height: 80 });
  const [resizing, setResizing] = useState<ResizingState | null>(null);
  const [, setResizeMouse] = useState<{ x: number; y: number } | null>(null);
  const [draggingPort, setDraggingPort] = useState<DraggingPortState | null>(null);

  const glyphsToRender = activePage.glyphs;
  const connectionsToRender = activePage.connections;
  const selectedConnId = selectedConn !== null ? (connectionsToRender[selectedConn]?.id ?? null) : null;

  const hoveredPortId = hoveredPort
    ? (() => {
        const g = glyphsToRender.find(gl => gl.id === hoveredPort.glyphId);
        if (!g) return null;
        const { w, h } = computeGlyphSize(g);
        const connectors = getConnectors(g, w, h);
        return connectors[hoveredPort.portIdx]?.id ?? null;
      })()
    : null;
  const canvasRef = useRef<HTMLDivElement | null>(null);

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
      onMoveGlyph(dragging.id, e.clientX - dragging.offsetX, e.clientY - dragging.offsetY);
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

  useEffect(() => {
    if (!resizing) return;
    const handlePointerMove = (e: PointerEvent) => {
      const dx = (e.clientX - resizing.startX) / zoom;
      const dy = (e.clientY - resizing.startY) / zoom;
      let x = resizing.origX;
      let y = resizing.origY;
      let w = resizing.origW;
      let h = resizing.origH;
      switch (resizing.handle) {
        case 'tl': x = resizing.origX + dx; y = resizing.origY + dy; w = resizing.origW - dx; h = resizing.origH - dy; break;
        case 'tr': y = resizing.origY + dy; w = resizing.origW + dx; h = resizing.origH - dy; break;
        case 'bl': x = resizing.origX + dx; w = resizing.origW - dx; h = resizing.origH + dy; break;
        case 'br': w = resizing.origW + dx; h = resizing.origH + dy; break;
        case 'tc': y = resizing.origY + dy; h = resizing.origH - dy; break;
        case 'bc': h = resizing.origH + dy; break;
        case 'ml': x = resizing.origX + dx; w = resizing.origW - dx; break;
        case 'mr': w = resizing.origW + dx; break;
      }
      w = Math.max(40, w);
      h = Math.max(40, h);
      onResizeGlyph?.(resizing.id, x, y, w, h);
      setResizeMouse({ x: e.clientX, y: e.clientY });
    };
    const handlePointerUp = () => {
      setResizing(null);
      setResizeMouse(null);
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [resizing, zoom, onResizeGlyph]);

  useEffect(() => {
    if (!draggingPort) return;
    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      const canvasX = (e.clientX - (rect?.left ?? 0)) / zoom;
      const canvasY = (e.clientY - (rect?.top ?? 0)) / zoom;
      const glyph = glyphsToRender.find(g => g.id === draggingPort.glyphId);
      if (!glyph) return;
      const { w, h } = computeGlyphSize(glyph);
      const port = glyph.ports?.find(p => p.id === draggingPort.portId);
      if (!port) return;
      // Snap to nearest perimeter edge of the glyph
      const snapped = snapToPerimeter(canvasX - glyph.x, canvasY - glyph.y, w, h);
      port.x = snapped.x;
      port.y = snapped.y;
      setDragMouse({ x: canvasX, y: canvasY }); // trigger re-render
    };
    const handlePointerUp = (e: PointerEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      const canvasX = (e.clientX - (rect?.left ?? 0)) / zoom;
      const canvasY = (e.clientY - (rect?.top ?? 0)) / zoom;
      const glyph = glyphsToRender.find(g => g.id === draggingPort.glyphId);
      if (glyph && onUpdateGlyph) {
        const { w, h } = computeGlyphSize(glyph);
        const snapped = snapToPerimeter(canvasX - glyph.x, canvasY - glyph.y, w, h);
        const updatedPorts = glyph.ports.map(p =>
          p.id === draggingPort.portId ? { ...p, x: snapped.x, y: snapped.y } : p
        );
        onUpdateGlyph(glyph.id, { ports: updatedPorts });
      }
      setDraggingPort(null);
      setDragMouse(null);
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingPort, glyphsToRender, zoom, onUpdateGlyph]);

  useEffect(() => {
    if (!draggedPoint) return;
    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      const canvasX = (e.clientX - (rect?.left ?? 0)) / zoom;
      const canvasY = (e.clientY - (rect?.top ?? 0)) / zoom;
      activePage.connections = activePage.connections.map(conn =>
        conn.id === draggedPoint.connId
          ? {
            ...conn,
            points: conn.points?.map((pt, i) =>
              i === draggedPoint.idx ? { x: canvasX, y: canvasY } : pt
            ),
          }
          : conn
      );
      setDragMouse({ x: canvasX, y: canvasY }); // trigger re-render
    };
    const handlePointerUp = () => setDraggedPoint(null);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggedPoint, activePage.connections, zoom]);

  // --- Event Handlers ---
  const handleMouseDown = (e: React.PointerEvent, glyph: Glyph) => {
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
    if (!json) json = e.dataTransfer.getData("text/plain");
    if (json) {
      try {
        const parsed = JSON.parse(json);
        if (parsed.type) type = parsed.type;
        if (typeof parsed.inputs === "number") inputs = parsed.inputs;
        if (typeof parsed.outputs === "number") outputs = parsed.outputs;
      } catch (_err) {
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

  const handleAddWaypoint = (connId: string, segmentIdx: number, canvasX: number, canvasY: number) => {
    const conn = activePage.connections.find(c => c.id === connId);
    if (!conn) return;
    const newPoints = [...(conn.points ?? [])];
    newPoints.splice(segmentIdx, 0, { x: canvasX, y: canvasY });
    onUpdateConnection(connId, { points: newPoints });
  };

  const handleRemoveWaypoint = (connId: string, idx: number) => {
    const conn = activePage.connections.find(c => c.id === connId);
    if (!conn) return;
    const newPoints = (conn.points ?? []).filter((_, i) => i !== idx);
    onUpdateConnection(connId, { points: newPoints });
  };

  // --- Z-order sorted render list ---
  const renderItems = (() => {
    const items: Array<{ type: 'glyph' | 'connection'; data: Glyph | Connection; index: number }> = [];
    glyphsToRender.forEach((glyph, idx) => {
      items.push({ type: 'glyph', data: glyph, index: idx });
    });
    connectionsToRender.forEach(conn => {
      const fromGlyphIdx = glyphsToRender.findIndex(g => g.id === conn.fromGlyphId);
      const toGlyphIdx = glyphsToRender.findIndex(g => g.id === conn.toGlyphId);
      const connectionZOrder = Math.min(
        fromGlyphIdx >= 0 ? fromGlyphIdx : 0,
        toGlyphIdx >= 0 ? toGlyphIdx : 0
      );
      items.push({ type: 'connection', data: conn, index: connectionZOrder });
    });
    return items.sort((a, b) => a.index - b.index);
  })();

  // --- Canvas content bounds (for scrolling) ---
  const CANVAS_PADDING = 200;
  const canvasContentWidth = glyphsToRender.reduce((max, glyph) => {
    const { w } = computeGlyphSize(glyph);
    return Math.max(max, glyph.x + w + CANVAS_PADDING);
  }, CANVAS_PADDING);
  const canvasContentHeight = glyphsToRender.reduce((max, glyph) => {
    const { h } = computeGlyphSize(glyph);
    return Math.max(max, glyph.y + h + CANVAS_PADDING);
  }, CANVAS_PADDING);

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
          minWidth: canvasContentWidth,
          minHeight: canvasContentHeight,
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
        onClick={() => {
          setSelectedGlyphId(null);
          setSelectedGlyphIds([]);
          setSelectedConn(null);
        }}
      >
        {renderItems.map((item, renderIdx) => {
          if (item.type === 'glyph') {
            const glyph = item.data as Glyph;
            return (
              <GlyphItem
                key={glyph.id}
                glyph={glyph}
                renderIdx={renderIdx}
                selectedGlyphId={selectedGlyphId}
                selectedGlyphIds={selectedGlyphIds}
                selectedConnId={selectedConnId}
                hoveredPort={hoveredPort}
                dragConn={dragConn}
                editingTextId={editingTextId}
                editingTextValue={editingTextValue}
                zoom={zoom}
                allGlyphs={glyphs}
                allConnections={connections}
                canvasRef={canvasRef}
                onPointerDown={handleMouseDown}
                onSelect={(glyphId, multiSelect) => {
                  if (multiSelect) {
                    setSelectedGlyphIds(ids => ids.includes(glyphId) ? ids : [...ids, glyphId]);
                  } else {
                    setSelectedGlyphIds([glyphId]);
                  }
                  setSelectedGlyphId(glyphId);
                }}
                onDoubleClickGlyph={g => {
                  setSelectedGlyphIds([g.id]);
                  setSelectedGlyphId(g.id);
                  if (g.type === "text") {
                    setEditingTextId(g.id);
                    setEditingTextValue(g.label ?? "");
                  }
                  if (onGlyphClick) onGlyphClick(g);
                }}
                onContextMenu={(glyphId, x, y) => setGlyphMenu({ glyphId, x, y })}
                onStartPortDrag={(portId, glyphId, fromX, fromY) => {
                  setDragConn({ fromGlyphId: glyphId, fromPortIdx: portId, fromX, fromY });
                  setDragMouse({ x: fromX, y: fromY });
                }}
                onStartPortMove={(portId, glyphId) => setDraggingPort({ glyphId, portId })}
                onCompleteConnection={(toGlyphId, toPortId) => {
                  if (dragConn) {
                    onAddConnection({
                      id: crypto.randomUUID(),
                      fromGlyphId: dragConn.fromGlyphId,
                      fromPortId: dragConn.fromPortIdx,
                      toGlyphId,
                      toPortId: toPortId ?? "",
                      type: "default",
                      view: {},
                    });
                    setDragConn(null);
                    setDragMouse(null);
                  }
                }}
                onPortHover={(glyphId, portIdx) => setHoveredPort({ glyphId, portIdx })}
                onPortHoverEnd={() => setHoveredPort(null)}
                setEditingTextId={setEditingTextId}
                setEditingTextValue={setEditingTextValue}
                setResizing={setResizing}
                setSelectedConn={setSelectedConn}
                onMoveGlyph={onMoveGlyph}
                onNotifyResize={setRect}
              />
            );
          } else {
            const conn = item.data as Connection;
            const i = connectionsToRender.findIndex(c => c.id === conn.id);
            return (
              <ConnectionItem
                key={conn.id || i}
                conn={conn}
                i={i}
                renderIdx={renderIdx}
                selectedConn={selectedConn}
                hoveredConn={hoveredConn}
                hoveredPortId={hoveredPortId}
                glyphsToRender={glyphsToRender}
                connectorType={connectorType}
                onSelect={idx => setSelectedConn(selectedConn === idx ? null : idx)}
                onDoubleClick={(c, idx) => {
                  setSelectedGlyphId(null);
                  if (onConnectionClick && selectedConn !== idx) onConnectionClick(c);
                }}
                onMouseEnter={idx => setHoveredConn(idx)}
                onMouseLeave={() => setHoveredConn(null)}
                onContextMenu={(connId, x, y) => setConnectionMenu({ connId, x, y })}
                onPointPointerDown={handlePointPointerDown}
                onAddWaypoint={handleAddWaypoint}
                onRemoveWaypoint={handleRemoveWaypoint}
              />
            );
          }
        })}

        <ContextMenus
          glyphMenu={glyphMenu}
          connectionMenu={connectionMenu}
          selectedGlyphIds={selectedGlyphIds}
          glyphsToRender={glyphsToRender}
          activePage={activePage}
          pages={pages}
          onSetGlyphMenu={setGlyphMenu}
          onSetConnectionMenu={setConnectionMenu}
          bringGlyphToFront={bringGlyphToFront}
          sendGlyphToBack={sendGlyphToBack}
          groupGlyphs={groupGlyphs}
          ungroupGlyphs={ungroupGlyphs}
          onPageChange={onPageChange}
          onMessage={onMessage}
          onUpdateGlyph={onUpdateGlyph}
        />

        {/* Drag connection preview */}
        {dragConn && dragMouse && (
          <svg
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 1000,
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
