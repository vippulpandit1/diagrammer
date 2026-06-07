// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Glyph } from './glyph/Glyph';
import { Connection } from './glyph/Connection';
import { computeGlyphSize, getConnectionPath, getConnectors, getConnectorPos, getConnectionSegments, segmentIntersect, snapToPerimeter, portOccupied } from './glyphCanvas/canvasUtils';
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
  onDragCommit,
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
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number; companions: Array<{ id: string; offsetX: number; offsetY: number }> } | null>(null);
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

  // Marquee selection
  const marqueeRef = useRef<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
  const [marqueeActive, setMarqueeActive] = useState(false);
  const [marqueeVis, setMarqueeVis] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

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
      for (const c of dragging.companions) {
        onMoveGlyph(c.id, e.clientX - c.offsetX, e.clientY - c.offsetY);
      }
    };
    const handleMouseUp = () => {
      setDragging(null);
      setDragConn(null);
      setDragMouse(null);
      onDragCommit?.();
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
      // Only update if not overlapping another port
      if (!portOccupied(glyph, snapped, draggingPort.portId)) {
        port.x = snapped.x;
        port.y = snapped.y;
      }
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
        // Only persist the new position if it doesn't overlap an existing port
        const updatedPorts = portOccupied(glyph, snapped, draggingPort.portId)
          ? glyph.ports  // revert to current positions
          : glyph.ports.map(p =>
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

  useEffect(() => {
    if (!marqueeActive) return;
    const getHitIds = (selLeft: number, selTop: number, selRight: number, selBottom: number) =>
      glyphsToRender
        .filter(g => {
          const { w, h } = computeGlyphSize(g);
          return g.x >= selLeft && g.x + w <= selRight && g.y >= selTop && g.y + h <= selBottom;
        })
        .map(g => g.id);

    const handlePointerMove = (e: PointerEvent) => {
      if (!marqueeRef.current) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const scrollLeft = canvasRef.current?.scrollLeft ?? 0;
      const scrollTop = canvasRef.current?.scrollTop ?? 0;
      const ex = (e.clientX - rect.left + scrollLeft) / zoom;
      const ey = (e.clientY - rect.top + scrollTop) / zoom;
      marqueeRef.current.endX = ex;
      marqueeRef.current.endY = ey;
      const { startX, startY, endX, endY } = marqueeRef.current;
      const left = Math.min(startX, endX);
      const top = Math.min(startY, endY);
      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);
      setMarqueeVis({ left, top, width, height });
      setSelectedGlyphIds(getHitIds(left, top, left + width, top + height));
    };
    const handlePointerUp = () => {
      if (marqueeRef.current) {
        const { startX, startY, endX, endY } = marqueeRef.current;
        const left = Math.min(startX, endX);
        const top = Math.min(startY, endY);
        const right = left + Math.abs(endX - startX);
        const bottom = top + Math.abs(endY - startY);
        setSelectedGlyphIds(getHitIds(left, top, right, bottom));
      }
      marqueeRef.current = null;
      setMarqueeActive(false);
      setMarqueeVis(null);
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [marqueeActive, glyphsToRender, zoom]);

  // --- Event Handlers ---
  const handleMouseDown = (e: React.PointerEvent, glyph: Glyph) => {
    const companions = selectedGlyphIds
      .filter(id => id !== glyph.id)
      .map(id => {
        const g = glyphsToRender.find(gl => gl.id === id);
        return g ? { id, offsetX: e.clientX - g.x, offsetY: e.clientY - g.y } : null;
      })
      .filter((c): c is { id: string; offsetX: number; offsetY: number } => c !== null);
    setDragging({
      id: glyph.id,
      offsetX: e.clientX - glyph.x,
      offsetY: e.clientY - glyph.y,
      companions: selectedGlyphIds.includes(glyph.id) ? companions : [],
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

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scrollLeft = canvasRef.current?.scrollLeft ?? 0;
    const scrollTop = canvasRef.current?.scrollTop ?? 0;
    const x = (e.clientX - rect.left + scrollLeft) / zoom;
    const y = (e.clientY - rect.top + scrollTop) / zoom;
    marqueeRef.current = { startX: x, startY: y, endX: x, endY: y };
    setMarqueeVis({ left: x, top: y, width: 0, height: 0 });
    setMarqueeActive(true);
    setSelectedGlyphId(null);
    setSelectedGlyphIds([]);
  };

  // --- Z-order sorted render list ---
  // ── Connection crossing / hop computation ──────────────────────────────────
  const crossingsMap = useMemo(() => {
    const map = new Map<string, Array<{ x: number; y: number; angle: number }>>();

    // Build a renderIdx lookup for each connection
    const items: Array<{ type: 'glyph' | 'connection'; data: Glyph | Connection; index: number }> = [];
    glyphsToRender.forEach((g, idx) => items.push({ type: 'glyph', data: g, index: idx }));
    connectionsToRender.forEach(conn => {
      const fi = glyphsToRender.findIndex(g => g.id === conn.fromGlyphId);
      const ti = glyphsToRender.findIndex(g => g.id === conn.toGlyphId);
      items.push({ type: 'connection', data: conn, index: Math.min(fi >= 0 ? fi : 0, ti >= 0 ? ti : 0) });
    });
    const sorted = [...items].sort((a, b) => a.index - b.index);
    const connRenderIdx = new Map<string, number>();
    sorted.forEach((item, idx) => {
      if (item.type === 'connection') connRenderIdx.set((item.data as Connection).id ?? '', idx);
    });

    const sizeMap = new Map<string, { w: number; h: number }>();
    glyphsToRender.forEach(g => sizeMap.set(g.id, computeGlyphSize(g)));

    // Build linearised segments for each connection
    const connData = connectionsToRender.map(conn => {
      const fromG = glyphsToRender.find(g => g.id === conn.fromGlyphId);
      const toG   = glyphsToRender.find(g => g.id === conn.toGlyphId);
      if (!fromG || !toG) return null;
      const fs = sizeMap.get(fromG.id) ?? { w: 60, h: 60 };
      const ts = sizeMap.get(toG.id)   ?? { w: 60, h: 60 };
      const from = getConnectorPos(fromG, conn.fromPortId, fs.w, fs.h);
      const to   = getConnectorPos(toG,   conn.toPortId,   ts.w, ts.h);
      const allPts = [from, ...(conn.points ?? []), to];
      const ct = (conn.view?.type ?? connectorType) as 'bezier' | 'manhattan' | 'line';
      return { conn, segs: getConnectionSegments(allPts, ct) };
    });

    // For each unique pair, find intersections and assign to the "under" connection
    for (let i = 0; i < connData.length; i++) {
      for (let j = i + 1; j < connData.length; j++) {
        const a = connData[i];
        const b = connData[j];
        if (!a || !b) continue;
        const idxA = connRenderIdx.get(a.conn.id ?? '') ?? 0;
        const idxB = connRenderIdx.get(b.conn.id ?? '') ?? 0;
        const [underConn, underSegs, overSegs] =
          idxA < idxB ? [a.conn, a.segs, b.segs] : [b.conn, b.segs, a.segs];
        const id = underConn.id ?? '';
        for (const [a1, a2, angle] of underSegs) {
          for (const [b1, b2] of overSegs) {
            const pt = segmentIntersect(a1, a2, b1, b2);
            if (!pt) continue;
            const arr = map.get(id) ?? [];
            // Deduplicate: skip if a very close point already exists
            if (!arr.some(p => Math.hypot(p.x - pt.x, p.y - pt.y) < 6)) {
              arr.push({ ...pt, angle });
            }
            map.set(id, arr);
          }
        }
      }
    }
    return map;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionsToRender, glyphsToRender, connectorType]);

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
        onPointerDown={handleCanvasPointerDown}
        onClick={() => {
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
                crossingPoints={crossingsMap.get(conn.id ?? '') ?? []}
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

        {/* Marquee selection rectangle */}
        {marqueeVis && marqueeVis.width > 2 && marqueeVis.height > 2 && (
          <div
            style={{
              position: 'absolute',
              left: marqueeVis.left,
              top: marqueeVis.top,
              width: marqueeVis.width,
              height: marqueeVis.height,
              border: '1.5px dashed #2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              pointerEvents: 'none',
              zIndex: 9999,
            }}
          />
        )}

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
