import { useState, useEffect } from 'react'
import { Glyph } from './glyph/Glyph'
import { GlyphCanvas } from './GlyphCanvas'
import { Toolbar } from './Toolbar'
import { Connection } from './glyph/GlyphDocument' // or your connection model
import { HeaderBar } from './HeaderBar'
import { PropertySheet } from './PropertySheet'
import './App.css'


function App() {
  const [toolbarOpen, setToolbarOpen] = useState(true)
  const [glyphs, setGlyphs] = useState<Glyph[]>([])
  const [toolbarPos, setToolbarPos] = useState({ x: 40, y: 100 });
  const [draggingToolbar, setDraggingToolbar] = useState(false);

  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedGlyph, setSelectedGlyph] = useState<Glyph | null>(null);
  const [propertySheetOpen, setPropertySheetOpen] = useState(false);
  const [connectionType, setConnectionType] = useState<"association" | "inheritance" | "default">("association");
  const [stencilType, setStencilType] = useState("basic");  
  // Load zoom from sessionStorage or default to 1
  const [zoom, setZoom] = useState(() => {
    const saved = sessionStorage.getItem("zoomRatio");
    return saved ? Number(saved) : 1;
  });

  // Save zoom to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("zoomRatio", String(zoom));
  }, [zoom]);

  useEffect(() => {
    const saved = sessionStorage.getItem("canvasData");

    if (saved) {
      try {
        const data = JSON.parse(saved);
        setGlyphs(data.glyphs || []);
        setConnections(data.connections || []);
      } catch {}
    }
  }, []);
  const handleMoveGlyph = (id: string, x: number, y: number) => {
    setGlyphs(glyphs =>
      glyphs.map(g =>
        g.id === id ? new Glyph(g.id, g.type, x, y) : g
      )
    )
  };
  // Handler to update glyph properties
  const handleUpdateGlyph = (id: string, updates: Partial<Glyph>) => {
    setGlyphs(glyphs =>
      glyphs.map(g => g.id === id ? { ...g, ...updates } : g)
    );
  };
  const handleAddGlyph = (type: string, x: number, y: number) => {
    setGlyphs(glyphs => [
      ...glyphs,
      new Glyph(`glyph-${Date.now()}`, type, x, y)
    ]);
  };
  const handleAutoArrange = () => {
    const glyphSize = 80; // space between glyphs
    const cols = Math.ceil(Math.sqrt(glyphs.length));
    setGlyphs(glyphs =>
      glyphs.map((g, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        return new Glyph(
          g.id,
          g.type,
          60 + col * glyphSize,
          60 + row * glyphSize,
          g.ports,
          g.data,
          g.label
        );
      })
    );
  };
  const handleSave = () => {
    const data = {
      glyphs,
      connections,
    };
    const json = JSON.stringify(data);
    sessionStorage.setItem("canvasData", json);
    alert("Canvas saved to browser session!");
/*
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas.json";
    a.click();
    URL.revokeObjectURL(url);
*/
  };
  return (
  <div className="workspace-root">
      {/* Header Bar */}
      <HeaderBar         
        onClear={() => { setGlyphs([]); setConnections([]); }}
        onZoomIn={() => setZoom(z => Math.min(z + 0.1, 2))}
        onZoomOut={() => setZoom(z => Math.max(z - 0.1, 0.2))}
        onSave={handleSave}
        zoom={zoom}
        onAutoArrange={handleAutoArrange}
      />
      {/* Floating Toolbar */}
      {toolbarOpen && (
        <div
          style={{
            position: "absolute",
            left: toolbarPos.x,
            top: toolbarPos.y,
            zIndex: 20,
            cursor: draggingToolbar ? "move" : "default",
            userSelect: "none",
          }}
        >   
        <div
            style={{
              width: "100%",
              height: 18,
              cursor: "grab",
              background: "#e0e7ef",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              marginBottom: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "#334155",
              fontWeight: 600,
              letterSpacing: 1,
            }}
            onMouseDown={e => {
              setDraggingToolbar(true);
              const startX = e.clientX;
              const startY = e.clientY;
              const origX = toolbarPos.x;
              const origY = toolbarPos.y;

              const handleMouseMove = (moveEvent: MouseEvent) => {
                setToolbarPos({
                  x: origX + (moveEvent.clientX - startX),
                  y: origY + (moveEvent.clientY - startY),
                });
              };
              const handleMouseUp = () => {
                setDraggingToolbar(false);
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
              };
              window.addEventListener("mousemove", handleMouseMove);
              window.addEventListener("mouseup", handleMouseUp);
            }}
          >
            Toolbar
          </div>
`          <Toolbar
            stencilType={stencilType}
            setStencilType={setStencilType}
            connectionType={connectionType}
            setConnectionType={(type: string) => setConnectionType(type as "default" | "association" | "inheritance")}
          />`
          </div>
        )}
        {!toolbarOpen && (
          <button
            className="workspace-toolbar-fab"
            title="Show Toolbar"
            onClick={() => setToolbarOpen(true)}
          >
            {/* Show icon */}
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="12" width="16" height="4" rx="2"/></svg>
          </button>
        )}
        <GlyphCanvas
          glyphs={glyphs}
          connections={connections}
          onMoveGlyph={handleMoveGlyph}
          onAddConnection={conn => setConnections(conns => [...conns, conn])}
          onDeleteConnection={idx => setConnections(conns => conns.filter((_, i) => i !== idx))}
          zoom={zoom}
          onAddGlyph={handleAddGlyph}
          onGlyphClick={glyph => {
            setSelectedGlyph(glyph);
            setPropertySheetOpen(true);
          }}
        />
      {/* render Property Sheet if open */}
      {propertySheetOpen && selectedGlyph && (
        <PropertySheet
          glyph={selectedGlyph}
          onClose={() => setPropertySheetOpen(false)}
          onUpdate={handleUpdateGlyph}
        />
      )}     
      {/* Footer */}
      <footer className="workspace-footer">
        <span>© {new Date().getFullYear()} R_js_draw &mdash; All rights reserved.</span>
      </footer>
    </div>
  )
}

export default App
