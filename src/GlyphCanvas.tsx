import React, { useRef, useState,  useEffect } from 'react'
import { Glyph } from './glyph/Glyph'
import type { Connection } from './glyph/GlyphDocument'
import { GlyphRenderer } from "./glyph/GlyphRenderer";

interface GlyphCanvasProps {
  glyphs: Glyph[]
  onMoveGlyph: (id: string, x: number, y: number) => void
  connections: Connection[]
  onAddConnection: (conn: Connection) => void
  onDeleteConnection: (connIndex: number) => void
  zoom: number // <-- Add zoom prop
  onAddGlyph: (type: string, x: number, y: number) => void;
  onGlyphClick?: (glyph: Glyph) => void;
}

export const GlyphCanvas: React.FC<GlyphCanvasProps> = ({ glyphs, connections, onMoveGlyph, onAddConnection, onDeleteConnection, zoom, onAddGlyph, onGlyphClick }) => {
  const [dragging, setDragging] = useState<null | { id: string, offsetX: number, offsetY: number }>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [dragMouse, setDragMouse] = useState<{ x: number, y: number } | null>(null);
  const [selectedConn, setSelectedConn] = useState<number | null>(null);

    // Handle delete key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in an input or textarea
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

  const handleMouseDown = (e: React.MouseEvent, glyph: Glyph) => {
    const startX = e.clientX
    const startY = e.clientY
    setDragging({
      id: glyph.id,
      offsetX: startX - glyph.x,
      offsetY: startY - glyph.y,
    })
  }
  React.useEffect(() => {
    if (!dragging) return

    const handleMouseMove = (e: MouseEvent) => {
      setDragMouse({ x: e.clientX, y: e.clientY });
      if(dragging) {
        onMoveGlyph(
          dragging.id,
          e.clientX - dragging.offsetX,
          e.clientY - dragging.offsetY
        )
      }
    };
    const handleMouseUp = () => {
      setDragging(null);
      setDragConn(null);
      setDragMouse(null);
    };

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging, onMoveGlyph])
  const size = 60
  const [dragConn, setDragConn] = useState<null | {
    fromGlyphId: string, fromPortIdx: number, fromX: number, fromY: number
  }>(null)
  const [hoveredPort, setHoveredPort] = useState<null | { glyphId: string, portIdx: number }>(null)
  const defaultTileSize = 60;
  // Helper to compute glyph visual size based on label and attributes
  const computeGlyphSize = (glyph: Glyph) => {
    const labelWidth = Math.max(60, (glyph.label?.length ?? 0) * 10 + 32);
    const attrHeight = (glyph.attributes?.length ?? 0) * 18 + defaultTileSize;
    const w = Math.max(labelWidth, 100);
    const h = Math.max(attrHeight, 60);
    return { w, h };
  }
  // Helper to get connector absolute position
  const getConnectorPos = (glyph: Glyph, idx: number, width: number, height: number) => {
    const conns = getConnectors(glyph, width, height);
    return {
      x: glyph.x + conns[idx].cx,
      y: glyph.y + conns[idx].cy,
    };
  };
  const getConnectors = (glyph: Glyph, width: number, height: number) => {
    const numInputs = glyph.inputs ?? 2;
    const numOutputs = glyph.outputs ?? 1;

    // Inputs: evenly spaced along the top edge
    const inputs = Array.from({ length: numInputs }, (_, i) => ({
      cx: 0,
      cy: height * ((i + 1) / (numInputs + 1)),
      type: "input",
    }));

    // Outputs: evenly spaced along the bottom edge
    const outputs = Array.from({ length: numOutputs }, (_, i) => ({
      cx: width,
      cy: height * ((i + 1) / (numOutputs + 1)),
      type: "output",
    }));


    return [...inputs, ...outputs];
  };

  return (
    <div ref={canvasRef} className="workspace-canvas" 
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'auto' }}  
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        const type = e.dataTransfer.getData("glyphType");
        if (type) {
          const rect = (e.target as HTMLElement).getBoundingClientRect();
          const x = (e.clientX - rect.left) / zoom;
          const y = (e.clientY - rect.top) / zoom;
          onAddGlyph(type, x, y);
        }
      }}>
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
      {/* Draw connections */}
      <svg style={{position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
        {
        connections.map((conn, i) => {
          const sizeMap = new Map<string, { w: number, h: number }>();
          glyphs.forEach(g => sizeMap.set(g.id, computeGlyphSize(g)));
          const fromGlyph = glyphs.find(g => g.id === conn.fromGlyphId)
          const toGlyph = glyphs.find(g => g.id === conn.toGlyphId)
          if (!fromGlyph || !toGlyph) return null
          const fromSize = sizeMap.get(fromGlyph.id) ?? { w: defaultTileSize, h: defaultTileSize }
          const toSize = sizeMap.get(toGlyph.id) ?? { w: defaultTileSize, h: defaultTileSize }

          const from = getConnectorPos(fromGlyph, Number(conn.fromPortId), fromSize.w, fromSize.h)
          const to = getConnectorPos(toGlyph, Number(conn.toPortId), toSize.w, toSize.h)
        // Association: solid line, no arrow
        if (conn.type === "association") {
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#222"
              strokeWidth={2}
            />
          );
        }

        // Inheritance: solid line with hollow triangle arrow
        if (conn.type === "inheritance") {
          return (
            <g key={i}>
              <defs>
                <marker
                  id="inheritance-arrow"
                  markerWidth="12"
                  markerHeight="12"
                  refX="10"
                  refY="6"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <polygon
                    points="2,2 10,6 2,10 2,2"
                    fill="#fff"
                    stroke="#222"
                    strokeWidth={1.5}
                  />
                </marker>
              </defs>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#222"
                strokeWidth={2}
                markerEnd="url(#inheritance-arrow)"
              />
            </g>
          );
        }
          return (
            <path
              key={i}
              d={`M${from.x},${from.y} C${from.x + 40},${from.y} ${to.x - 40},${to.y} ${to.x},${to.y}`}
              stroke={selectedConn === i ? "#f87171" : "#888"}
              strokeWidth={selectedConn === i ? 5 : 3}
              fill="none"
              style={{ cursor: 'pointer', pointerEvents: 'all' }}
              onClick={e => {
                e.stopPropagation();
                setSelectedConn(i);
              }}
            />
          )
        })}
        {/* Draw dragging connection from connector to mouse */}
      </svg>
      {glyphs.map(glyph => {
         // Estimate label width: 10px per character + padding
        const labelWidth = Math.max(60, (glyph.label?.length ?? 0) * 10 + 32);
        // Estimate attribute height
        const attrHeight = (glyph.attributes?.length ?? 0) * 18 + 60;
        // Use the largest of labelWidth or a minimum size
        const size = Math.max(labelWidth, 100);
        const height = Math.max(attrHeight, 80);
        const maxLabelChars = 5;//Math.floor(size / 10); // Estimate max chars that fit
        const isTruncated = !!(glyph.label && glyph.label.length > maxLabelChars);
        const displayLabel = isTruncated
          ? glyph.label.slice(0, maxLabelChars - 3) + "..."
          : glyph.label;
        const connectors = getConnectors(glyph, size, height);
        const numInputs = glyph.inputs ?? 2; // fallback to 2 if not set
        return (
          <svg
            key={glyph.id}
            style={{
              position: 'absolute',
              left: glyph.x,
              top: glyph.y,
              width: size,
              height: height,
              overflow: 'visible',
              cursor: 'grab',
              zIndex: 2,
              pointerEvents: 'auto',
            }}
            onMouseDown={e => handleMouseDown(e, glyph)}
            onClick={e => {
              e.stopPropagation();
              if (onGlyphClick) onGlyphClick(glyph);
            }}
          >
          {/* Glyph shape */}
          <GlyphRenderer 
            type={glyph.type} 
            size={size} 
            height={height}
            label={displayLabel}
            orinLabel={glyph.label}
            isTruncated={isTruncated}
            attributes={glyph.attributes} />
          {/* Property */ }
          {glyphs.map(glyph => (
            <svg
              key={glyph.id}
              // ...other props...
              onClick={e => {
                e.stopPropagation();
                if (onGlyphClick) onGlyphClick(glyph);
              }}
            >
            </svg>
          ))}
          {/* Connectors */}
          {connectors.map((pt, idx) => (
            <g key={idx}>
            <circle
              key={idx}
              cx={pt.cx}
              cy={pt.cy}
              r={7}
              fill={hoveredPort && hoveredPort.glyphId === glyph.id && hoveredPort.portIdx === idx ? "#38bdf8" : "#fff"}
              stroke="#222"
              strokeWidth={2}
              style={{ cursor: pt.type === 'output' ? 'crosshair' : 'pointer' }}
              onMouseDown={e => {
                e.stopPropagation()
                if (pt.type === 'output') {
                  // Start dragging connection
                  setDragConn({
                    fromGlyphId: glyph.id,
                    fromPortIdx: idx,
                    fromX: glyph.x + pt.cx,
                    fromY: glyph.y + pt.cy,
                  })
                  setDragMouse({ x: e.clientX, y: e.clientY });
                }
              }}
              onMouseEnter={() => setHoveredPort({ glyphId: glyph.id, portIdx: idx })}
              onMouseLeave={() => setHoveredPort(null)}
              onMouseUp={e => {
                if (dragConn && pt.type === 'input' &&
                    // Prevent connecting to self/output
                    !(dragConn.fromGlyphId === glyph.id && dragConn.fromPortIdx === idx)
                ) {
                  // Complete connection
                  onAddConnection({
                    fromGlyphId: dragConn.fromGlyphId,
                    fromPortId: String(dragConn.fromPortIdx),
                    toGlyphId: glyph.id,
                    toPortId: String(idx),
                    type: "inheritance", // or "inheritance" or another valid type
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
              {pt.type === 'input' ? `in${idx + 1}` : `out${idx + 1 - numInputs}`}
            </text>
            </g>
          ))}
          </svg>
        )
      })}
      </div>
    </div>
  )
}