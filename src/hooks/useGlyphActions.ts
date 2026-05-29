import { Glyph } from '../glyph/Glyph';
import type { Page } from '../glyph/Page';
import iconPng from '../image/free-sample.png';

/**
 * Hook that provides all glyph manipulation handlers.
 * Functions are recreated each render so they always close over the latest
 * `activePage` / `pages` values (matching the original App.tsx pattern).
 */
export function useGlyphActions(
  activePage: Page,
  pages: Page[],
  activePageIdx: number,
  addMessage: (msg: string) => void,
  updateHistory: (newPages: Page[]) => void
) {
  const groupGlyphs = (glyphIds: string[]) => {
    const newGroupId = 'group-' + Date.now();
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
        g.groupId === glyph.groupId ? { ...g, x: g.x + dx, y: g.y + dy } : g
      );
      addMessage(`Moved group ${glyph.groupId}`);
    } else {
      addMessage(`Moved glyph ${id} to (${x}, ${y})`);
      activePage.glyphs = activePage.glyphs.map(g => (g.id === id ? { ...g, x, y } : g));
    }
  };

  const handleResizeGlyph = (id: string, x: number, y: number, width: number, height: number) => {
    activePage.glyphs = activePage.glyphs.map(g =>
      g.id === id ? { ...g, x, y, width, height } : g
    );
  };

  const bringGlyphToFront = (glyphId: string) => {
    const idx = activePage.glyphs.findIndex(g => g.id === glyphId);
    if (idx !== -1) {
      const newGlyphs = [...activePage.glyphs];
      const [glyph] = newGlyphs.splice(idx, 1);
      newGlyphs.push(glyph);
      activePage.glyphs = newGlyphs;

      const glyphIdsBehind = newGlyphs.slice(0, -1).map(g => g.id);
      const allConns = [...activePage.connections];
      const connsBehind = allConns.filter(
        c => glyphIdsBehind.includes(c.fromGlyphId) || glyphIdsBehind.includes(c.toGlyphId)
      );
      const otherConns = allConns.filter(
        c => !glyphIdsBehind.includes(c.fromGlyphId) && !glyphIdsBehind.includes(c.toGlyphId)
      );
      activePage.connections = [...connsBehind, ...otherConns];

      addMessage(`Brought glyph ${glyphId} to front and sent connections of glyphs behind to back`);
    }
  };

  const sendGlyphToBack = (glyphId: string) => {
    const idx = activePage.glyphs.findIndex(g => g.id === glyphId);
    if (idx !== -1) {
      const newGlyphs = [...activePage.glyphs];
      const [glyph] = newGlyphs.splice(idx, 1);
      newGlyphs.unshift(glyph);
      activePage.glyphs = newGlyphs;

      const allConns = [...activePage.connections];
      const glyphConns = allConns.filter(
        c => c.fromGlyphId === glyphId || c.toGlyphId === glyphId
      );
      const otherConns = allConns.filter(
        c => c.fromGlyphId !== glyphId && c.toGlyphId !== glyphId
      );
      activePage.connections = [...otherConns, ...glyphConns];

      addMessage(`Sent glyph ${glyphId} to back and brought its connections to front`);
    }
  };

  const handleAutoArrange = () => {
    const glyphSize = 80;
    const cols = Math.ceil(Math.sqrt(activePage.glyphs.length));
    activePage.glyphs = activePage.glyphs.map((g, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      return new Glyph(
        g.id, g.type,
        60 + col * glyphSize,
        60 + row * glyphSize,
        g.ports, g.data, g.label
      );
    });
    addMessage('Auto-arranged glyphs');
  };

  const handleAddGlyph = (
    type: string,
    x: number,
    y: number,
    inputs?: number,
    outputs?: number
  ) => {
    const newGlyph = new Glyph(
      `glyph-${Date.now()}`,
      type, x, y,
      [], {}, '',
      inputs ?? 1, outputs ?? 1,
      [], [],
      undefined, undefined,
      type === 'png-glyph' ? iconPng : undefined
    );
    const newPages = pages.map((page, index) => {
      if (index === activePageIdx) {
        addMessage(`Added glyph ${newGlyph.id} of type ${type} at (${x}, ${y})`);
        return { ...page, glyphs: [...page.glyphs, newGlyph] };
      }
      return page;
    });
    updateHistory(newPages);
  };

  const handleUpdateGlyph = (id: string, updates: Partial<Glyph>) => {
    const newPages = pages.map(page => ({
      ...page,
      glyphs: page.glyphs.map(glyph => (glyph.id === id ? { ...glyph, ...updates } : glyph)),
    }));
    updateHistory(newPages);
    addMessage(`Updated glyph ${id}`);
  };

  return {
    groupGlyphs,
    ungroupGlyphs,
    handleMoveGlyph,
    handleResizeGlyph,
    bringGlyphToFront,
    sendGlyphToBack,
    handleAutoArrange,
    handleAddGlyph,
    handleUpdateGlyph,
  };
}
