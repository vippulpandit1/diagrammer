import { useState, useCallback, useEffect } from 'react'
import { Glyph } from './glyph/Glyph'
import { GlyphCanvas } from './GlyphCanvas'
import { Toolbar } from './Toolbar'
import { Connection, CONNECTION_TYPE_INDEX } from './glyph/Connection' // or your connection model
import { HeaderBar } from './HeaderBar'
import { PropertySheet } from './PropertySheet'
import { BottomPanel } from './BottomPanel'
import './App.css'
import type { Page } from './glyph/Page'
import iconPng from './image/free-sample.png';

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
  const [selectedItem, setSelectedItem] = useState<Glyph | Connection | null>(null);

  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null) // for new connection in progress
  const [selectedGlyph, setSelectedGlyph] = useState<Glyph | null>(null);
  const [propertySheetOpen, setPropertySheetOpen] = useState(false);
  const [connectionType, setConnectionType] = useState<"association" | "inheritance" | "default">("association");
  const [stencilType, setStencilType] = useState("basic");  
  const [connectorType, setConnectorType] = useState<"bezier" | "manhattan" | "line">("bezier");
  const [messages, setMessages] = useState<string[]>([]);
  // Handler for switching pages
  const handlePageChange = (idx: number) => setActivePageIdx(idx);
  // track bottom panel height so tabs can sit above it
  const [panelHeight, setPanelHeight] = useState<number>(96);
  const [editingPageIdx, setEditingPageIdx] = useState<number | null>(null);
  const [editingPageName, setEditingPageName] = useState("");


    // Handler for adding a new page
  const handleAddPage = () => {
    const newPage = {
      id: `page-${Date.now()}`,
      name: `Page ${pages.length + 1}`,
      glyphs: [],
      connections: [],
    };
    setPages([...pages, newPage]);
    setActivePageIdx(pages.length);
  };
  // Handler for starting page name edit
  const handleStartEditPage = (idx: number, name: string) => {
    setEditingPageIdx(idx);
    setEditingPageName(name);
  };

  // Handler for saving page name edit
  const handleSaveEditPage = () => {
    if (editingPageIdx !== null && editingPageName.trim()) {
      setPages(pages =>
        pages.map((p, idx) =>
          idx === editingPageIdx ? { ...p, name: editingPageName } : p
        )
      );
    }
    setEditingPageIdx(null);
    setEditingPageName("");
  };

  // Handler for blur or Enter key
  const handleEditPageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveEditPage();
    if (e.key === "Escape") {
      setEditingPageIdx(null);
      setEditingPageName("");
    }
  };
  // 1. History Stack
  const [history, setHistory] = useState<Page[][]>([pages]);
  // 2. Current Index
  const [historyIndex, setHistoryIndex] = useState(0);
  const addMessage = useCallback((msg: string) => {
    setMessages(prev => [...prev, `${new Date().toLocaleTimeString()} — ${msg}`]);
  }, []);
  const clearMessages = useCallback(() => setMessages([]), []);

    // Function to add a new state to the history
  const updateHistory = useCallback(
    (newPages: Page[]) => {
      setPages(newPages);
      addMessage(`Updated canvas state`);
      setHistory(prevHistory => {
        const newHistory = [...prevHistory.slice(0, historyIndex + 1), newPages];
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
      });
    },
    [historyIndex]
  );

  // 3. Undo Function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prevIndex => prevIndex - 1);
      setPages(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  // 4. Redo Function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prevIndex => prevIndex + 1);
      setPages(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const handleUpdateConnectionType = (connId: string, newType: "bezier" | "manhattan" | "line") => {
    activePage.connections.map(conn =>{
          if (conn.id === connId) {
            conn.view[CONNECTION_TYPE_INDEX] = (newType);
            return conn;
          }
          return conn;
        });
  };
  const handleUpdateConnection = (connId: string, updates: Partial<Connection>) => {
    const newPages = pages.map(page => ({
      ...page,
      connections: page.connections.map(connection => (connection.id === connId ? { ...connection, ...updates } : connection)),
    }));
    addMessage(`Updated connection ${connId}`);
    updateHistory(newPages);
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
    if(!saved) return;
    try {
      const parsed = JSON.parse(saved);
      // support older format (array of pages) or { pages: [...] } envelope
      const newPages: Page[] = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.pages)
        ? parsed.pages
        : null;

      if (newPages && newPages.length > 0) {
        setPages(newPages);
        // ensure activePageIdx is within bounds after load
        setActivePageIdx(idx => Math.min(idx, newPages.length - 1));
        addMessage(`Loaded ${newPages.length} page(s) from sessionStorage`);
      }
    } catch (err) {
      console.warn("Failed to parse saved canvasData:", err);
      addMessage("Failed to load canvas data from sessionStorage");
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
      addMessage(`Moved group ${glyph.groupId}`);
    } else {
      addMessage(`Moved glyph ${id} to (${x}, ${y})`);
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
      addMessage(`Brought glyph ${glyphId} to front`);
    }
  };
  const sendGlyphToBack = (glyphId: string) => {
    const idx = activePage.glyphs.findIndex(g => g.id === glyphId);
    if (idx !== -1) {
      const newGlyphs = [...activePage.glyphs];
      const [glyph] = newGlyphs.splice(idx, 1);
      newGlyphs.unshift(glyph); // Add to start (background)
      activePage.glyphs = newGlyphs;
      addMessage(`Sent glyph ${glyphId} to back`);
    }
  };
  const handleGlyphClick = (glyph: Glyph) => {
    setSelectedItem(glyph);
  };

  const handleConnectionClick = (connection: Connection) => {
    setSelectedItem(connection);
  };

  const handleClosePropertySheet = () => {
    setSelectedItem(null);
    setPropertySheetOpen(false);
    addMessage("Closed PropertySheet");
  };
    // handler passed to BottomPanel
  const handlePanelCollapseChange = (collapsed: boolean, height: number) => {
    setPanelHeight(height);
  };
  // Handler to update glyph properties
  const handleUpdateGlyph = (id: string, updates: Partial<Glyph>) => {
    const newPages = pages.map(page => ({
      ...page,
      glyphs: page.glyphs.map(glyph => (glyph.id === id ? { ...glyph, ...updates } : glyph)),
    }));
    updateHistory(newPages);
    addMessage(`Updated glyph ${id}`)
  };
  const handleAddGlyph = (type: string, x: number, y: number, inputs?: number, outputs?: number) => {
/*    const newGlyph: Glyph = {
      id: `glyph-${Date.now()}`,
      type,
      x,
      y,
      ports: [],
      data: {},
      label: "",
      inputs: inputs ?? 1,
      outputs: outputs ?? 1,
      icon: type == "png-glyph" ? iconPng : undefined,
    };
    // Create a new pages array with the updated active page
    const newPages = pages.map((page, index) => {
      if (index === activePageIdx) {
        // Add the new glyph to this page's glyphs array
        addMessage(`Added glyph ${newGlyph.id} of type ${type} at (${x}, ${y})`);
        return { ...page, glyphs: [...page.glyphs, newGlyph] };
      }
      return page;
    });

    updateHistory(newPages);
*/
    const newGlyph = new Glyph(
      `glyph-${Date.now()}`,
      type,
      x,
      y,
      [],
      {},
      "",
      inputs ?? 1,
      outputs ?? 1,
      [],
      [],
      undefined,
      undefined,
      type == "png-glyph" ? iconPng : undefined
    );
    // Create a new pages array with the updated active page
    const newPages = pages.map((page, index) => {
      if (index === activePageIdx) {
        addMessage(`Added glyph ${newGlyph.id} of type ${type} at (${x}, ${y})`);
        return { ...page, glyphs: [...page.glyphs, newGlyph] };
      }
      return page;
    });

    updateHistory(newPages);
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
    addMessage("Auto-arranged glyphs");
  };
  const handleOpenPropertySheet = (glyph?: Glyph, connection?: Connection) => {
    setPropertySheetOpen(true);
    setSelectedGlyph(glyph ?? null);
    setSelectedConnection(connection ?? null);
    addMessage(
      `Opened PropertySheet for ${glyph ? `glyph ${glyph.id}` : ""}${connection ? `connection ${connection.id}` : ""}`.trim()
    );
  };

  const handleSave = () => {
    const json = JSON.stringify(pages);
    sessionStorage.setItem("canvasData", json);
    addMessage("Canvas data saved to sessionStorage");
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
        onClear={() => { activePage.glyphs=[]; activePage.connections=[]; addMessage("Cleared canvas"); updateHistory(pages); }}
        onZoomIn={() => {setZoom(z => Math.min(z + 0.1, 2));addMessage("Zoomed in");}}
        onZoomOut={() => {setZoom(z => Math.max(z - 0.1, 0.2));addMessage("Zoomed out");}}
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
            onPointerDown={e => {
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
`         <Toolbar
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
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" style={{ pointerEvents: "all", touchAction: "none" }}><rect x="6" y="12" width="16" height="4" rx="2"/></svg>
          </button>
        )}

        {/* Glyph Canvas */}
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

            bringGlyphToFront={bringGlyphToFront} 
            sendGlyphToBack={sendGlyphToBack}    
            groupGlyphs={groupGlyphs}
            ungroupGlyphs={ungroupGlyphs}
            connectorType={connectorType}  
            onGlyphClick={glyph => {
              setPropertySheetOpen(false);
              setSelectedConnection(null);
              setSelectedGlyph(glyph);
              handleOpenPropertySheet(glyph, undefined);
            }}
            onConnectionClick={conn => {
              setPropertySheetOpen(false);
              setSelectedGlyph(null);
              setSelectedConnection(conn);
              handleOpenPropertySheet(undefined, conn);
            }}
        />

      
      {/* Tabs for pages positioned relative to BottomPanel */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: panelHeight, // use dynamic height from BottomPanel
          background: "#f8fafc",
          borderTop: "1px solid #e6e9ee",
          borderBottom: "1px solid #e6e9ee",
          zIndex: 1201,
          display: "flex",
          alignItems: "center",
          height: 44,
          boxShadow: "0 -1px 4px rgba(16,24,40,0.03)",
        }}
      >
        {pages.map((page, idx) => (
          <div
            key={page.id}
            onClick={() => handlePageChange(idx)}
            style={{
              padding: "0 32px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              background: idx === activePageIdx ? "#fff" : "transparent",
              borderBottom: idx === activePageIdx ? "3px solid #2563eb" : "3px solid transparent",
              fontWeight: idx === activePageIdx ? 700 : 500,
              color: idx === activePageIdx ? "#2563eb" : "#64748b",
              fontSize: 16,
              letterSpacing: 0.2,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              marginRight: 4,
              marginLeft: idx === 0 ? 16 : 0,
              boxShadow: idx === activePageIdx ? "0 -2px 8px rgba(37,99,235,0.04)" : undefined,
              transition: "background 0.18s, color 0.18s, border-bottom 0.18s",
              position: "relative",
              userSelect: "none"
            }}
            onDoubleClick={e => {
              e.stopPropagation();
              handleStartEditPage(idx, page.name);
            }}
          >
           {editingPageIdx === idx ? (
              <input
                type="text"
                value={editingPageName}
                autoFocus
                onChange={e => setEditingPageName(e.target.value)}
                onBlur={handleSaveEditPage}
                onKeyDown={handleEditPageKeyDown}
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#2563eb",
                  border: "1px solid #2563eb",
                  borderRadius: 6,
                  padding: "2px 8px",
                  width: 120,
                  margin: "0 -8px",
                  background: "#fff"
                }}
              />
            ) : (
              <>
                {page.name}
                {idx === activePageIdx && (
                  <span
                    style={{
                      position: "absolute",
                      left: 8,
                      top: 8,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#2563eb22",
                      boxShadow: "0 0 0 2px #2563eb11",
                      display: "inline-block",
                    }}
                  />
                )}
              </>
            )}
          </div>
        ))}
        <button
          onClick={handleAddPage}
          style={{
            marginLeft: 16,
            padding: "4px 12px",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            background: "#f1f5f9",
            cursor: "pointer",
            fontSize: 15,
            color: "#2563eb",
          }}
        >
          ＋ Add Page
        </button>
      </div>

      {/* Bottom message panel - pass handler to report height/collapse */}
      <BottomPanel
        messages={messages}
        onClear={clearMessages}
        height={96}
        defaultCollapsed={false}
        onCollapseChange={handlePanelCollapseChange}
      />
      {/* render Property Sheet if open */}
      {propertySheetOpen && (selectedGlyph || selectedConnection) && (
        <>
          {selectedGlyph && (
            <PropertySheet
              glyph={selectedGlyph}
              connection={selectedConnection!}
              onClose={handleClosePropertySheet}
              onUpdateGlyph={handleUpdateGlyph}
              connectorType={selectedConnection?.view?.[CONNECTION_TYPE_INDEX] || connectorType}
              setConnectorType={setConnectorType}
              pages={pages}
              connections={activePage.connections}
            />
          )}
          {selectedConnection && (
            <PropertySheet
              glyph={selectedGlyph!}
              connection={selectedConnection}
              onClose={handleClosePropertySheet}
              onUpdateGlyph={handleUpdateGlyph}
              onUpdateConnection={handleUpdateConnection}
              connectorType={connectorType}
              setConnectorType={selectedConnection.view?.[CONNECTION_TYPE_INDEX] || connectorType}
              pages={pages}
              connections={activePage.connections}
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
