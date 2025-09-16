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
  bringGlyphToFront: (glyphId: string) => void;
  sendGlyphToBack: (glyphId: string) => void;
  groupGlyphs: (glyphIds: string[]) => void;
  ungroupGlyphs: (glyphIds: string[]) => void;
}

export const GlyphCanvas: React.FC<GlyphCanvasProps> = ({ glyphs, connections, onMoveGlyph, onAddConnection, onDeleteConnection, zoom, onAddGlyph, onGlyphClick, bringGlyphToFront,  sendGlyphToBack, groupGlyphs, ungroupGlyphs}) => {
  const [dragging, setDragging] = useState<null | { id: string, offsetX: number, offsetY: number }>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [dragMouse, setDragMouse] = useState<{ x: number, y: number } | null>(null);
  const [selectedConn, setSelectedConn] = useState<number | null>(null);
  // Add state for selected glyph
  const [selectedGlyphId, setSelectedGlyphId] = useState<string | null>(null);
  const [selectedGlyphIds, setSelectedGlyphIds] = useState<string[]>([]);
  const [hoveredConn, setHoveredConn] = useState<number | null>(null);
  // Add state for menu
  const [glyphMenu, setGlyphMenu] = useState<{ glyphId: string, x: number, y: number } | null>(null);

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
      y: glyph.y + conns[idx].cy + 5,
    };
  };
  const getConnectors = (glyph: Glyph, width: number, height: number) => {
    const connectors = [];
    const numInputs = glyph.inputs ?? 2;
    const numOutputs = glyph.outputs ?? 1;

    for (let i = 0; i < numInputs; i++) {
      connectors.push({
        cx: 0,
        cy: height * ((i + 1) / (numInputs + 1)),
        type: "input",
      });
    }


    for (let i = 0; i < numOutputs; i++) {
      connectors.push({
        cx: width,
        cy: height * ((i + 1) / (numOutputs + 1)),
        type: "output",
      });
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
          });
        }
      });
    }

    return connectors;
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

          return (
            <path
              key={i}
              d={`M${from.x},${from.y} C${from.x + 40},${from.y} ${to.x - 40},${to.y} ${to.x},${to.y}`}
              stroke={
                selectedConn === i
                  ? "#f87171"
                  : hoveredConn === i
                  ? "#2563eb"
                  : "#888"
              }
              strokeWidth={selectedConn === i || hoveredConn === i ? 5 : 3}
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
                if (selectedConn === i) {
                  setSelectedConn(null); // Deselect if already selected
                } else {
                  setSelectedConn(i); // Select new connector
                }
              }}
              onMouseEnter={() => setHoveredConn(i)}
              onMouseLeave={() => setHoveredConn(null)}
            />
          )
        })}
        {/* Draw dragging connection from connector to mouse */}
      </svg>
      {glyphs.map(glyph => {
         // Estimate label width: 10px per character + padding
        const labelWidth = Math.max(60, (glyph.label?.length ?? 0) * 10 + 32);
        // Estimate attribute height
        const attrHeight = (glyph.attributes?.length ?? 0) * 20 + 60;
        // Estimate method height
        const methodHeight = (glyph.methods?.length ?? 0) * 20 + attrHeight;
        // Use the largest of labelWidth or a minimum size
        const size = Math.max(labelWidth, 100);
        const height = Math.max(attrHeight, 80);
        const finalHeight = glyph.type === "uml-class" ? Math.max(methodHeight, height) : height;
        const maxLabelChars = 5;//Math.floor(size / 10); // Estimate max chars that fit
        const isTruncated = !!(glyph.label && glyph.label.length > maxLabelChars);
        const displayLabel = isTruncated
          ? glyph.label.slice(0, maxLabelChars - 3) + "..."
          : glyph.label;
        const connectors = getConnectors(glyph, size, height);
        const numInputs = glyph.inputs ?? 2; // fallback to 2 if not set
        // Determine if glyph is in a group and that group is selected
        const isGrouped =
          glyph.groupId &&
          glyphs.some(
            g =>
              g.groupId === glyph.groupId &&
              selectedGlyphIds.includes(g.id)
          );
          // Check if this glyph has any connections (for breakpoint logic)
          const hasConnections = connections.some(
            conn => conn.fromGlyphId === glyph.id || conn.toGlyphId === glyph.id
          );   
          // If it's a debug glyph and has connections, log a breakpoint message
          if (glyph.type === "debug" && hasConnections) {
            console.log(`Breakpoint triggered on Debug Glyph "${glyph.label || glyph.id}": Connection detected.`);
            // You can add more logic here, e.g., alert or custom action
          }                 
        return (        
          <svg
            key={glyph.id}
            // explicit svg width/height attrs + viewBox so inner glyph scales correctly
            width={size}
            height={height}
            viewBox={`0 0 ${size} ${height}`}
            preserveAspectRatio="xMidYMid meet"            
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
              if (e.shiftKey || e.ctrlKey) {
                setSelectedGlyphIds(ids => ids.includes(glyph.id) ? ids : [...ids, glyph.id]);
              } else {
                setSelectedGlyphIds([glyph.id]);
              }
              setSelectedGlyphId(glyph.id); // highlight this glyph
//              if (onGlyphClick) onGlyphClick(glyph);
            }}
            onDoubleClick={e => {
              e.stopPropagation();
              setSelectedGlyphIds([glyph.id]);
              setSelectedGlyphId(glyph.id); // highlight this glyph
              if (onGlyphClick) onGlyphClick(glyph);
            }}
            
            // Right-click to open menu
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
            width={size}
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
            size={size} 
            height={height}
            label={displayLabel}
            orinLabel={glyph.label}
            isTruncated={isTruncated}
            attributes={glyph.attributes}
            methods={glyph.methods}
            hasConnections={hasConnections}
            glyph={glyph}  />
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
                    type: "default", // or "inheritance" or another valid type
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
            style={{
              display: "block",
              width: "100%",
              padding: "6px 16px",
              background: "none",
              border: "none",
              textAlign: "left",
              cursor: "pointer"
            }}
            onClick={() => {
              // Example: bring to front
              bringGlyphToFront(glyphMenu.glyphId);
              setGlyphMenu(null);
            }}
          >
            Bring to Front
          </button>
          <button
            style={{
              display: "block",
              width: "100%",
              padding: "6px 16px",
              background: "none",
              border: "none",
              textAlign: "left",
              cursor: "pointer"
            }}
            onClick={() => {
              sendGlyphToBack(glyphMenu.glyphId);
              setGlyphMenu(null);
            }}
          >
            Send to Back
          </button>
          <button
            style={{
              display: "block",
              width: "100%",
              padding: "6px 16px",
              background: "none",
              border: "none",
              textAlign: "left",
              cursor: "pointer"
            }}
            onClick={() => {
              // Group all selected glyphs and the one from the menu
              const idsToGroup = Array.from(new Set([glyphMenu.glyphId, ...selectedGlyphIds]));
              groupGlyphs(idsToGroup);
              setGlyphMenu(null);
            }}
          >
            Group
          </button>
          <button
            style={{
              display: "block",
              width: "100%",
              padding: "6px 16px",
              background: "none",
              border: "none",
              textAlign: "left",
              cursor: "pointer"
            }}
            onClick={() => {
              // Ungroup all selected glyphs and the one from the menu
              const idsToUngroup = Array.from(new Set([glyphMenu.glyphId, ...selectedGlyphIds]));
              ungroupGlyphs(idsToUngroup);
              setGlyphMenu(null);
            }}
          >
            Ungroup
          </button>
          {/* Add more menu actions as needed */}
        </div>
      )}
      </div>
    </div>
  )
}