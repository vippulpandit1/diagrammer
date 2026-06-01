// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React from 'react';
import { createPortal } from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import type { Glyph } from '../glyph/Glyph';
import { Port } from '../glyph/Port';
import type { Page } from '../glyph/Page';

export interface ContextMenusProps {
  glyphMenu: { glyphId: string; x: number; y: number } | null;
  connectionMenu: { connId: string; x: number; y: number } | null;
  selectedGlyphIds: string[];
  glyphsToRender: Glyph[];
  activePage: Page;
  pages: Page[];
  onSetGlyphMenu: (m: { glyphId: string; x: number; y: number } | null) => void;
  onSetConnectionMenu: (m: { connId: string; x: number; y: number } | null) => void;
  bringGlyphToFront: (id: string) => void;
  sendGlyphToBack: (id: string) => void;
  groupGlyphs: (ids: string[]) => void;
  ungroupGlyphs: (ids: string[]) => void;
  onPageChange: (index: number) => void;
  onMessage?: (msg: string) => void;
  onUpdateGlyph?: (id: string, updates: Partial<Glyph>) => void;
}

const menuButtonStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "6px 16px",
  background: "none",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
};

export const ContextMenus: React.FC<ContextMenusProps> = ({
  glyphMenu,
  connectionMenu,
  selectedGlyphIds,
  glyphsToRender,
  activePage,
  pages,
  onSetGlyphMenu,
  onSetConnectionMenu,
  bringGlyphToFront,
  sendGlyphToBack,
  groupGlyphs,
  ungroupGlyphs,
  onPageChange,
  onMessage,
  onUpdateGlyph,
}) => {
  return (
    <>
      {/* Glyph context menu */}
      {glyphMenu && createPortal(
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
            padding: "4px 0",
          }}
          onMouseLeave={() => onSetGlyphMenu(null)}
        >
          <button
            style={menuButtonStyle}
            onClick={() => {
              bringGlyphToFront(glyphMenu.glyphId);
              onSetGlyphMenu(null);
            }}
          >
            Bring to Front
          </button>
          <button
            style={menuButtonStyle}
            onClick={() => {
              sendGlyphToBack(glyphMenu.glyphId);
              onSetGlyphMenu(null);
            }}
          >
            Send to Back
          </button>
          <button
            style={menuButtonStyle}
            onClick={() => {
              const idsToGroup = Array.from(new Set([glyphMenu.glyphId, ...selectedGlyphIds]));
              groupGlyphs(idsToGroup);
              onSetGlyphMenu(null);
            }}
          >
            Group
          </button>
          <button
            style={menuButtonStyle}
            onClick={() => {
              const idsToUngroup = Array.from(new Set([glyphMenu.glyphId, ...selectedGlyphIds]));
              ungroupGlyphs(idsToUngroup);
              onSetGlyphMenu(null);
            }}
          >
            Ungroup
          </button>
          <button
            style={menuButtonStyle}
            onClick={() => {
              const glyphId = glyphMenu.glyphId;
              const glyphIdx = activePage.glyphs.findIndex(g => g.id === glyphId);
              if (glyphIdx !== -1) {
                activePage.glyphs.splice(glyphIdx, 1);
              }
              activePage.connections = activePage.connections.filter(
                conn => conn.fromGlyphId !== glyphId && conn.toGlyphId !== glyphId
              );
              onSetGlyphMenu(null);
              if (onMessage) onMessage(`Deleted glyph ${glyphId} and its connections`);
            }}
          >
            Delete
          </button>
          {/* Port management */}
          {(() => {
            const glyph = glyphsToRender.find(g => g.id === glyphMenu.glyphId);
            if (!glyph || !onUpdateGlyph) return null;
            const inputPorts = (glyph.ports ?? []).filter(p => p.type === 'input');
            const outputPorts = (glyph.ports ?? []).filter(p => p.type === 'output');
            const disabledStyle: React.CSSProperties = { color: '#bbb', cursor: 'not-allowed' };
            return (
              <>
                <hr style={{ margin: "4px 0", border: "none", borderTop: "1px solid #eee" }} />
                <button
                  style={menuButtonStyle}
                  onClick={() => {
                    const newPort = new Port(`input-${uuidv4()}`, 'input');
                    const newPorts = [...(glyph.ports ?? []), newPort];
                    onUpdateGlyph(glyph.id, { ports: newPorts, inputs: (glyph.inputs ?? 0) + 1 });
                    onSetGlyphMenu(null);
                  }}
                >
                  + Add Input Port
                </button>
                <button
                  style={menuButtonStyle}
                  onClick={() => {
                    const newPort = new Port(`output-${uuidv4()}`, 'output');
                    const newPorts = [...(glyph.ports ?? []), newPort];
                    onUpdateGlyph(glyph.id, { ports: newPorts, outputs: (glyph.outputs ?? 0) + 1 });
                    onSetGlyphMenu(null);
                  }}
                >
                  + Add Output Port
                </button>
                <button
                  style={inputPorts.length === 0 ? { ...menuButtonStyle, ...disabledStyle } : menuButtonStyle}
                  disabled={inputPorts.length === 0}
                  onClick={() => {
                    const lastInput = inputPorts[inputPorts.length - 1];
                    if (!lastInput) return;
                    const newPorts = (glyph.ports ?? []).filter(p => p.id !== lastInput.id);
                    activePage.connections = activePage.connections.filter(
                      c => c.fromPortId !== lastInput.id && c.toPortId !== lastInput.id
                    );
                    onUpdateGlyph(glyph.id, { ports: newPorts, inputs: Math.max(0, (glyph.inputs ?? 0) - 1) });
                    onSetGlyphMenu(null);
                  }}
                >
                  − Remove Input Port
                </button>
                <button
                  style={outputPorts.length === 0 ? { ...menuButtonStyle, ...disabledStyle } : menuButtonStyle}
                  disabled={outputPorts.length === 0}
                  onClick={() => {
                    const lastOutput = outputPorts[outputPorts.length - 1];
                    if (!lastOutput) return;
                    const newPorts = (glyph.ports ?? []).filter(p => p.id !== lastOutput.id);
                    activePage.connections = activePage.connections.filter(
                      c => c.fromPortId !== lastOutput.id && c.toPortId !== lastOutput.id
                    );
                    onUpdateGlyph(glyph.id, { ports: newPorts, outputs: Math.max(0, (glyph.outputs ?? 0) - 1) });
                    onSetGlyphMenu(null);
                  }}
                >
                  − Remove Output Port
                </button>
              </>
            );
          })()}
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
                      glyph.data = { ...glyph.data, targetPageId: e.target.value };
                      onSetGlyphMenu(null);
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
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const pageIdx = pages.findIndex(p => p.id === (glyph.data?.targetPageId || ""));
                      onSetGlyphMenu(null);
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
        </div>,
        document.body
      )}

      {/* Connection context menu */}
      {connectionMenu && createPortal(
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
            padding: "4px 0",
          }}
          onMouseLeave={() => onSetConnectionMenu(null)}
        >
          <button
            style={menuButtonStyle}
            onClick={() => {
              const connIdx = activePage.connections.findIndex(c => c.id === connectionMenu.connId);
              if (connIdx !== -1) {
                activePage.connections.splice(connIdx, 1);
              }
              onSetConnectionMenu(null);
              if (onMessage) onMessage(`Deleted connection ${connectionMenu.connId}`);
            }}
          >
            Delete Connection
          </button>
        </div>,
        document.body
      )}
    </>
  );
};
