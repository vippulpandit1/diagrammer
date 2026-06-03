// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import type { Glyph } from '../glyph/Glyph';
import type { Connection } from '../glyph/Connection';
import type { Page } from '../glyph/Page';

export interface GlyphCanvasProps {
  pages: Page[];
  activePageIdx: number;
  onPageChange: (index: number) => void;
  glyphs: Glyph[];
  onMoveGlyph: (id: string, x: number, y: number) => void;
  onDragCommit?: () => void;
  connections: Connection[];
  onAddConnection: (conn: Connection) => void;
  onDeleteConnection: (connIndex: number) => void;
  onUpdateConnection: (connId: string, updates: Partial<Connection>) => void;
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
  onResizeGlyph?: (id: string, x: number, y: number, width: number, height: number) => void;
  onUpdateGlyph?: (id: string, updates: Partial<Glyph>) => void;
}

export type ResizingState = {
  id: string;
  handle: 'tl' | 'tr' | 'bl' | 'br' | 'tc' | 'bc' | 'ml' | 'mr';
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  origW: number;
  origH: number;
};

export type DragConnState = {
  fromGlyphId: string;
  fromPortIdx: string;
  fromX: number;
  fromY: number;
};

export type DraggingPortState = {
  glyphId: string;
  portId: string;
};
