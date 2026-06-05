import { Glyph } from '../glyph/Glyph';
import type { Page } from '../glyph/Page';
import iconPng from '../image/free-sample.png';
import { glyphRegistry } from '../glyph/type/GlyphRegistry';

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
    activePage.glyphs = activePage.glyphs.map(g => {
      if (g.id !== id) return g;

      const oldW = g.width ?? 120;
      const oldH = g.height ?? 80;

      // Rescale any port that has an explicit (user-dragged) position so it
      // stays on the same perimeter edge of the resized glyph.
      const updatedPorts = g.ports.map(port => {
        if (port.x === undefined || port.y === undefined) return port;

        let newX = port.x;
        let newY = port.y;

        if (port.x === 0) {
          // Left edge — keep on left, scale y
          newX = 0;
          newY = oldH > 0 ? (port.y / oldH) * height : port.y;
        } else if (port.x === oldW) {
          // Right edge — keep on right (new width), scale y
          newX = width;
          newY = oldH > 0 ? (port.y / oldH) * height : port.y;
        } else if (port.y === 0) {
          // Top edge — scale x, keep on top
          newX = oldW > 0 ? (port.x / oldW) * width : port.x;
          newY = 0;
        } else if (port.y === oldH) {
          // Bottom edge — scale x, keep on bottom (new height)
          newX = oldW > 0 ? (port.x / oldW) * width : port.x;
          newY = height;
        } else {
          // Port not exactly on a perimeter edge — scale both axes proportionally
          newX = oldW > 0 ? (port.x / oldW) * width : port.x;
          newY = oldH > 0 ? (port.y / oldH) * height : port.y;
        }

        return { ...port, x: newX, y: newY };
      });

      return { ...g, x, y, width, height, ports: updatedPorts };
    });
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
    const registryDefaults = glyphRegistry[type]?.defaultProps;
    const newGlyph = new Glyph(
      `glyph-${Date.now()}`,
      type, x, y,
      [], { ...(registryDefaults?.data ?? {}) }, '',
      inputs ?? 1, outputs ?? 1,
      [], [],
      registryDefaults?.width,
      registryDefaults?.height,
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
