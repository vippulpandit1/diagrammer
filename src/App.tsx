import { useState, useEffect, act } from 'react'
import { Glyph } from './glyph/Glyph'
import { GlyphCanvas } from './GlyphCanvas'
import { Toolbar } from './Toolbar'
import { Connection } from './glyph/Connection' // or your connection model
import { HeaderBar } from './HeaderBar'
import { PropertySheet } from './PropertySheet'
import './App.css'
import type { Page } from './glyph/Page'

const INITIAL_PAGE: Page = {
  id: "page-1",
  name: "Page 1",
  glyphs: [/* your initial glyphs can go here */],
  connections: [/* your initial connections can go here */],
};

function App() {
  const [pages, setPages] = useState<Page[]>([INITIAL_PAGE]);
  const [activePageIdx, setActivePageIdx] = useState(0);

  // Get the currently active page
  const activePage = pages[activePageIdx];
  const [toolbarOpen, setToolbarOpen] = useState(true)
  const [toolbarPos, setToolbarPos] = useState({ x: 40, y: 100 });
  const [draggingToolbar, setDraggingToolbar] = useState(false);

  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null) // for new connection in progress
  const [selectedGlyph, setSelectedGlyph] = useState<Glyph | null>(null);
  const [propertySheetOpen, setPropertySheetOpen] = useState(false);
  const [connectionType, setConnectionType] = useState<"association" | "inheritance" | "default">("association");
  const [stencilType, setStencilType] = useState("basic");  
  const [connectorType, setConnectorType] = useState<"bezier" | "manhattan" | "line">("bezier");

  const handleUpdateConnectionType = (connId: string, newType: "bezier" | "manhattan" | "line") => {
    activePage.connections.map(conn =>
      conn.id === connId ? { ...conn, 
        type: newType as "bezier" | "manhattan" | "line" } : conn
    );
  };
  const handleUpdateConnection = (connId: string, updates: Partial<Connection>) => {
    activePage.connections = activePage.connections.map(c => 
      c.id === connId ? { ...c, ...updates } : c
    );
  };
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
        const updatedPage = { ...activePage, glyphs: data.glyphs || [], connections: data.connections || [] };
        setPages(pages => pages.map((page, idx) => idx === activePageIdx ? updatedPage : page));

      } catch {}
    }
  }, []);
  const groupGlyphs = (glyphIds: string[]) => {
    const newGroupId = "group-" + Date.now();
    activePage.glyphs = activePage.glyphs.map(g =>
      glyphIds.includes(g.id) ? { ...g, groupId: newGroupId } : g
    );
  };
  const ungroupGlyphs = (glyphIds: string[]) => {
    activePage.glyphs = activePage.glyphs.map(g =>
      glyphIds.includes(g.id) ? { ...g, groupId: undefined } : g
    );
  };
  const handleMoveGlyph = (id: string, x: number, y: number) => {
    const glyph = activePage.glyphs.find(g => g.id === id);
    if (glyph?.groupId) {
      const dx = x - glyph.x;
      const dy = y - glyph.y;
      activePage.glyphs = activePage.glyphs.map(g =>
        g.groupId === glyph.groupId
          ? { ...g, x: g.x + dx, y: g.y + dy }
          : g
      );
    } else {
      activePage.glyphs = activePage.glyphs.map(g => (g.id === id ? { ...g, x, y } : g));
    }
  };
  const bringGlyphToFront = (glyphId: string) => {
    const idx = activePage.glyphs.findIndex(g => g.id === glyphId);
    if (idx !== -1) {
      const newGlyphs = [...activePage.glyphs];
      const [glyph] = newGlyphs.splice(idx, 1);
      newGlyphs.push(glyph); // Add to end (foreground)
      // Update your glyphs state here
      activePage.glyphs = newGlyphs;
    }
  };
  const sendGlyphToBack = (glyphId: string) => {
    const idx = activePage.glyphs.findIndex(g => g.id === glyphId);
    if (idx !== -1) {
      const newGlyphs = [...activePage.glyphs];
      const [glyph] = newGlyphs.splice(idx, 1);
      newGlyphs.unshift(glyph); // Add to start (background)
      activePage.glyphs = newGlyphs;
    }
  };
  // Handler to update glyph properties
  const handleUpdateGlyph = (id: string, updates: Partial<Glyph>) => {
    activePage.glyphs = activePage.glyphs.map(g => 
      g.id === id ? { ...g, ...updates } : g
    );
  };
  const handleAddGlyph = (type: string, x: number, y: number, inputs?: number, outputs?: number) => {
    const newGlyph: Glyph = {
      id: `glyph-${Date.now()}`,
      type,
      x,
      y,
      ports: [],
      data: {},
      label: "",
      inputs: inputs ?? 1,
      outputs: outputs ?? 1,
    };
    // Create a new pages array with the updated active page
    const newPages = pages.map((page, index) => {
      if (index === activePageIdx) {
        // Add the new glyph to this page's glyphs array
        return { ...page, glyphs: [...page.glyphs, newGlyph] };
      }
      return page;
    });

    setPages(newPages);
  };
  const handleAutoArrange = () => {
    const glyphSize = 80; // space between glyphs
    const cols = Math.ceil(Math.sqrt(activePage.glyphs.length));
    activePage.glyphs = activePage.glyphs.map((g, i) => {
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
    });
  };
  const handleSave = () => {
    const json = JSON.stringify(activePage);
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
        onClear={() => { activePage.glyphs=[]; activePage.connections=[]; }}
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
          pages={pages}
          activePageIdx={activePageIdx}
          onPageChange={setActivePageIdx}
          glyphs={activePage.glyphs}
          connections={activePage.connections}
          onMoveGlyph={handleMoveGlyph}
          onAddConnection={conn => {
            activePage.connections = [...activePage.connections, conn];
          }}
          onDeleteConnection={idx => {
            activePage.connections = activePage.connections.filter((_, i) => i !== idx);
          }}
          zoom={zoom}
          onAddGlyph={handleAddGlyph}
          onGlyphClick={glyph => {
            setPropertySheetOpen(false);
            setSelectedConnection(null);
            setSelectedGlyph(glyph);
            setPropertySheetOpen(true);
          }}
          bringGlyphToFront={bringGlyphToFront} 
          sendGlyphToBack={sendGlyphToBack}    
          groupGlyphs={groupGlyphs}
          ungroupGlyphs={ungroupGlyphs}
          connectorType={connectorType}  
          onConnectionClick={conn => {
            setPropertySheetOpen(false);
            setSelectedGlyph(null);
            setSelectedConnection(conn);
            setPropertySheetOpen(true);
          }} 
        />
      {/* render Property Sheet if open */}
      {propertySheetOpen && (selectedGlyph || selectedConnection) && (
        <>
          {selectedGlyph && (
            <PropertySheet
              glyph={selectedGlyph}
              connection={selectedConnection!}
              onClose={() => setPropertySheetOpen(false)}
              onUpdateGlyph={handleUpdateGlyph}
              connectorType={connectorType}
              setConnectorType={setConnectorType}
            />
          )}
          {selectedConnection && (
            <PropertySheet
              glyph={selectedGlyph!}
              connection={selectedConnection}
              onClose={() => setPropertySheetOpen(false)}
              onUpdateGlyph={handleUpdateGlyph}
              onUpdateConnection={handleUpdateConnection}
              connectorType={connectorType}
              setConnectorType={setConnectorType}
              onUpdateConnectionType={handleUpdateConnectionType}
            />
          )}
        </>
      )}
      {/* Footer */}
      <footer className="workspace-footer">
        <span>© {new Date().getFullYear()} R_js_draw &mdash; All rights reserved.</span>
      </footer>
    </div>
  )
}

export default App
