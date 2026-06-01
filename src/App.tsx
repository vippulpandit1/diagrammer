import { useState, useCallback, useEffect, useRef } from 'react'
import { Glyph } from './glyph/Glyph'
import { GlyphCanvas } from './GlyphCanvas'
import { Connection, CONNECTION_TYPE_INDEX } from './glyph/Connection'
import { HeaderBar } from './HeaderBar'
import { PropertySheet } from './PropertySheet'
import { BottomPanel } from './BottomPanel'
import { FloatingToolbar } from './FloatingToolbar'
import { PageTabs } from './PageTabs'
import { useGlyphActions } from './hooks/useGlyphActions'
import { usePageManagement } from './hooks/usePageManagement'
import type { StencilType } from './Toolbar'
import './App.css'
import type { Page } from './glyph/Page'

const INITIAL_PAGE: Page = {
  id: 'page-1',
  name: 'Page 1',
  glyphs: [],
  connections: [],
};

function App() {
  
  const [pages, setPages] = useState<Page[]>([INITIAL_PAGE]);
  const [activePageIdx, setActivePageIdx] = useState(0);

  // Get the currently active page
  const activePage = pages[activePageIdx];
  const [toolbarOpen, setToolbarOpen] = useState(true)
  const [toolbarPos, setToolbarPos] = useState({ x: 40, y: 100 });
  const [draggingToolbar, setDraggingToolbar] = useState(false);
  const [toolbarOrientation, setToolbarOrientation] = useState<"vertical" | "horizontal">("vertical");
  const [, setSelectedItem] = useState<Glyph | Connection | null>(null);

  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null) // for new connection in progress
  const [selectedGlyph, setSelectedGlyph] = useState<Glyph | null>(null);
  const [propertySheetOpen, setPropertySheetOpen] = useState(false);
  const [connectionType, setConnectionType] = useState<"association" | "inheritance" | "default">("association");
  const [stencilType, setStencilType] = useState<StencilType>("basic");  
  const [connectorType, setConnectorType] = useState<"bezier" | "manhattan" | "line">("bezier");
  const [messages, setMessages] = useState<string[]>([]);
  // Handler for switching pages
  // track bottom panel height so tabs can sit above it
  const [panelHeight, setPanelHeight] = useState<number>(96);
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    editingPageIdx,
    editingPageName,
    setEditingPageName,
    handleAddPage,
    handleStartEditPage,
    handleSaveEditPage,
    handleEditPageKeyDown,
  } = usePageManagement(pages, setPages, setActivePageIdx);

  const printCanvas = () => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    // Temporarily hide the toolbar
    const toolbarElement = document.querySelector(".workspace-toolbar");
    if (toolbarElement) {
      toolbarElement.classList.add("hide-for-print");
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      if (toolbarElement) toolbarElement.classList.remove("hide-for-print");
      return;
    }

    // Build the print document using DOM APIs instead of document.write()
    // to avoid XSS via innerHTML interpolation (OWASP A03).
    const doc = printWindow.document;
    doc.title = "Print Canvas";

    const style = doc.createElement("style");
    style.textContent =
      "body { margin: 0; padding: 0; } .workspace-canvas { position: relative; width: 100%; height: 100%; }";
    doc.head.appendChild(style);

    const wrapper = doc.createElement("div");
    wrapper.className = "workspace-canvas";
    // cloneNode + importNode copies the live DOM without going through innerHTML serialization
    wrapper.appendChild(doc.importNode(canvasElement.cloneNode(true) as HTMLElement, true));
    doc.body.appendChild(wrapper);

    printWindow.print();
    printWindow.close();

    if (toolbarElement) {
      toolbarElement.classList.remove("hide-for-print");
    }
  };

    // Handler for adding a new page
  // 1. History Stack
  const [, setHistory] = useState<Page[][]>([pages]);
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
    const parsed = saved ? Number(saved) : 1;
    // Guard against NaN / Infinity / out-of-range values from tampered storage
    return Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0.2), 2) : 1;
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
      // Guard: reject payloads that could exploit prototype pollution
      if (parsed === null || typeof parsed !== "object") return;
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
        if (!Array.isArray(parsed)) {
          if (typeof parsed.stencilType === "string") {
            setStencilType(parsed.stencilType as StencilType);
          }
          if (typeof parsed.connectionType === "string") {
            setConnectionType(parsed.connectionType as "association" | "inheritance" | "default");
          }
          if (parsed.toolbarOrientation === "vertical" || parsed.toolbarOrientation === "horizontal") {
            setToolbarOrientation(parsed.toolbarOrientation);
          }
          if (
            parsed.toolbarPos &&
            typeof parsed.toolbarPos.x === "number" &&
            typeof parsed.toolbarPos.y === "number"
          ) {
            setToolbarPos(parsed.toolbarPos);
          }
        }
        addMessage(`Loaded ${newPages.length} page(s) from sessionStorage`);
      }
    } catch (_err) {
      console.warn("Failed to parse saved canvasData");
      addMessage("Failed to load canvas data from sessionStorage");
    }
  }, []);
  const {
    groupGlyphs,
    ungroupGlyphs,
    handleMoveGlyph,
    handleResizeGlyph,
    bringGlyphToFront,
    sendGlyphToBack,
    handleAutoArrange,
    handleAddGlyph,
    handleUpdateGlyph: _handleUpdateGlyph,
  } = useGlyphActions(activePage, pages, activePageIdx, addMessage, updateHistory);

  // Wrap so that selectedGlyph stays in sync when properties are updated live
  const handleUpdateGlyph = (id: string, updates: Partial<Glyph>) => {
    _handleUpdateGlyph(id, updates);
    setSelectedGlyph(prev => (prev && prev.id === id ? { ...prev, ...updates } as Glyph : prev));
  };

  const handleClosePropertySheet = () => {
    setSelectedItem(null);
    setPropertySheetOpen(false);
    addMessage("Closed PropertySheet");
  };
    // handler passed to BottomPanel
  const handlePanelCollapseChange = (_collapsed: boolean, height: number) => {
    setPanelHeight(height);
  };
  const handleOpenPropertySheet = (glyph?: Glyph, connection?: Connection) => {
    setPropertySheetOpen(true);
    setSelectedGlyph(glyph ?? null);
    setSelectedConnection(connection ?? null);
    addMessage(
      `Opened PropertySheet for ${glyph ? `glyph ${glyph.id}` : ""}${connection ? `connection ${connection.id}` : ""}`.trim()
    );
  };

  const handleImport = (json: string, fileName?: string) => {
    try {
      const parsed = JSON.parse(json);
      if (parsed === null || typeof parsed !== "object") throw new Error("Invalid JSON");
      const importedPages: Page[] = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.pages)
        ? parsed.pages
        : null;
      if (!importedPages || importedPages.length === 0) throw new Error("No pages found");
      // Derive the tab name from the filename (strip extension) or fall back to the imported page name
      const tabName = fileName
        ? fileName.replace(/\.[^.]+$/, "")
        : importedPages[0].name;
      // Merge first imported page into the active tab (keep its id, update name),
      // then append any additional imported pages as new tabs.
      const [firstPage, ...extraPages] = importedPages;
      setPages(prev => {
        const updated = [...prev];
        updated[activePageIdx] = {
          ...updated[activePageIdx],
          name: tabName,
          glyphs: firstPage.glyphs ?? [],
          connections: firstPage.connections ?? [],
        };
        return [...updated, ...extraPages];
      });
      if (!Array.isArray(parsed)) {
        if (typeof parsed.stencilType === "string") setStencilType(parsed.stencilType as StencilType);
        if (typeof parsed.connectionType === "string") setConnectionType(parsed.connectionType as "association" | "inheritance" | "default");
        if (parsed.toolbarOrientation === "vertical" || parsed.toolbarOrientation === "horizontal") setToolbarOrientation(parsed.toolbarOrientation);
        if (parsed.toolbarPos && typeof parsed.toolbarPos.x === "number" && typeof parsed.toolbarPos.y === "number") setToolbarPos(parsed.toolbarPos);
      }
      sessionStorage.setItem("canvasData", json);
      addMessage(`Imported ${importedPages.length} page(s) into current tab`);
    } catch (err) {
      addMessage(`Import failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  const handleSave = () => {
    const json = JSON.stringify({ pages, stencilType, connectionType, toolbarOrientation, toolbarPos });
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
        onPrint={printCanvas}
        onImport={handleImport}
      />
      <div
        ref={canvasRef}
        className="workspace-canvas"
        style={{ position: "relative", width: "100%", height: "100%", overflow: "auto" }}
      >
      {/* Floating Toolbar */}
      <FloatingToolbar
        toolbarOpen={toolbarOpen}
        setToolbarOpen={setToolbarOpen}
        toolbarPos={toolbarPos}
        setToolbarPos={setToolbarPos}
        draggingToolbar={draggingToolbar}
        setDraggingToolbar={setDraggingToolbar}
        toolbarOrientation={toolbarOrientation}
        setToolbarOrientation={setToolbarOrientation}
        stencilType={stencilType}
        setStencilType={setStencilType}
        connectionType={connectionType}
        setConnectionType={(type: string) => setConnectionType(type as "default" | "association" | "inheritance")}
      />

        {/* Glyph Canvas */}
        <GlyphCanvas
            pages={pages}
            activePageIdx={activePageIdx}
            onPageChange={setActivePageIdx}
            glyphs={activePage.glyphs}
            connections={activePage.connections}
            onMoveGlyph={handleMoveGlyph}
            onResizeGlyph={handleResizeGlyph}
            onAddConnection={conn => {
              activePage.connections = [...activePage.connections, conn];
            }}
            onDeleteConnection={idx => {
              activePage.connections = activePage.connections.filter((_, i) => i !== idx);
            }}
            onUpdateConnection={handleUpdateConnection}
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
            onUpdateGlyph={handleUpdateGlyph}
        />

      {/* Tabs for pages positioned relative to BottomPanel */}
      <PageTabs
        pages={pages}
        activePageIdx={activePageIdx}
        panelHeight={panelHeight}
        editingPageIdx={editingPageIdx}
        editingPageName={editingPageName}
        onPageChange={idx => setActivePageIdx(idx)}
        onAddPage={handleAddPage}
        onEditPageNameChange={setEditingPageName}
        onStartEditPage={handleStartEditPage}
        onSaveEditPage={handleSaveEditPage}
        onEditPageKeyDown={handleEditPageKeyDown}
      />
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
              bottomInset={panelHeight + 44}
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
              bottomInset={panelHeight + 44}
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
