import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useGlyphActions } from "../../hooks/useGlyphActions";
import { Glyph } from "../../glyph/Glyph";
import { Connection } from "../../glyph/Connection";
import type { Page } from "../../glyph/Page";

// Mock the PNG import used inside the hook
vi.mock("../../image/free-sample.png", () => ({ default: "mock-icon.png" }));

function makeGlyph(id: string, x = 0, y = 0, groupId?: string): Glyph {
  const g = new Glyph(id, "rect", x, y, [], {}, "label", 1, 1);
  if (groupId) g.groupId = groupId;
  return g;
}

function makeConn(id: string, from: string, to: string): Connection {
  return Object.assign(new Connection("", "default"), {
    id,
    fromGlyphId: from,
    toGlyphId: to,
  });
}

function makePage(glyphs: Glyph[] = [], connections: Connection[] = []): Page {
  return { id: "p1", name: "Page 1", glyphs, connections };
}

describe("useGlyphActions", () => {
  const getHook = (activePage: Page, pages?: Page[]) => {
    const addMessage = vi.fn();
    const updateHistory = vi.fn();
    const pagesArr = pages ?? [activePage];

    const { result } = renderHook(() =>
      useGlyphActions(activePage, pagesArr, 0, addMessage, updateHistory)
    );
    return { result, addMessage, updateHistory };
  };

  // ─── groupGlyphs ─────────────────────────────────────────────────────────

  it("groupGlyphs assigns a new groupId to matched glyph ids", () => {
    const g1 = makeGlyph("g1");
    const g2 = makeGlyph("g2");
    const activePage = makePage([g1, g2]);
    const { result } = getHook(activePage);

    result.current.groupGlyphs(["g1"]);

    expect(activePage.glyphs[0].groupId).toMatch(/^group-/);
    expect(activePage.glyphs[1].groupId).toBeUndefined();
  });

  // ─── ungroupGlyphs ───────────────────────────────────────────────────────

  it("ungroupGlyphs clears groupId for matched glyph ids", () => {
    const g1 = makeGlyph("g1", 0, 0, "group-123");
    const activePage = makePage([g1]);
    const { result } = getHook(activePage);

    result.current.ungroupGlyphs(["g1"]);

    expect(activePage.glyphs[0].groupId).toBeUndefined();
  });

  // ─── handleMoveGlyph ─────────────────────────────────────────────────────

  it("handleMoveGlyph updates a single glyph position", () => {
    const g = makeGlyph("g1", 10, 20);
    const activePage = makePage([g]);
    const { result, addMessage } = getHook(activePage);

    result.current.handleMoveGlyph("g1", 50, 60);

    expect(activePage.glyphs[0].x).toBe(50);
    expect(activePage.glyphs[0].y).toBe(60);
    expect(addMessage).toHaveBeenCalledWith("Moved glyph g1 to (50, 60)");
  });

  it("handleMoveGlyph moves the whole group when glyph belongs to a group", () => {
    const g1 = makeGlyph("g1", 0, 0, "grp");
    const g2 = makeGlyph("g2", 20, 20, "grp");
    const activePage = makePage([g1, g2]);
    const { result, addMessage } = getHook(activePage);

    // Move g1 by (+10, +10)
    result.current.handleMoveGlyph("g1", 10, 10);

    expect(activePage.glyphs[0].x).toBe(10);
    expect(activePage.glyphs[0].y).toBe(10);
    expect(activePage.glyphs[1].x).toBe(30);
    expect(activePage.glyphs[1].y).toBe(30);
    expect(addMessage).toHaveBeenCalledWith("Moved group grp");
  });

  // ─── handleResizeGlyph ───────────────────────────────────────────────────

  it("handleResizeGlyph updates position and dimensions of a glyph", () => {
    const g = makeGlyph("g1", 0, 0);
    const activePage = makePage([g]);
    const { result } = getHook(activePage);

    result.current.handleResizeGlyph("g1", 5, 10, 200, 150);

    expect(activePage.glyphs[0].x).toBe(5);
    expect(activePage.glyphs[0].y).toBe(10);
    expect(activePage.glyphs[0].width).toBe(200);
    expect(activePage.glyphs[0].height).toBe(150);
  });

  // ─── bringGlyphToFront ───────────────────────────────────────────────────

  it("bringGlyphToFront moves the glyph to the end of the array", () => {
    const g1 = makeGlyph("g1");
    const g2 = makeGlyph("g2");
    const activePage = makePage([g1, g2]);
    const { result } = getHook(activePage);

    result.current.bringGlyphToFront("g1");

    expect(activePage.glyphs[activePage.glyphs.length - 1].id).toBe("g1");
  });

  it("bringGlyphToFront does nothing for unknown glyphId", () => {
    const g1 = makeGlyph("g1");
    const activePage = makePage([g1]);
    const { result, addMessage } = getHook(activePage);

    result.current.bringGlyphToFront("nonexistent");

    expect(addMessage).not.toHaveBeenCalled();
  });

  it("bringGlyphToFront repositions connections correctly", () => {
    const g1 = makeGlyph("g1");
    const g2 = makeGlyph("g2");
    const conn = makeConn("c1", "g1", "g2");
    const activePage = makePage([g1, g2], [conn]);
    const { result } = getHook(activePage);

    result.current.bringGlyphToFront("g2");

    // g2 is now at the front; conn involves g1 which is behind — it should be at start
    expect(activePage.connections[0].id).toBe("c1");
  });

  // ─── sendGlyphToBack ─────────────────────────────────────────────────────

  it("sendGlyphToBack moves the glyph to the start of the array", () => {
    const g1 = makeGlyph("g1");
    const g2 = makeGlyph("g2");
    const activePage = makePage([g1, g2]);
    const { result } = getHook(activePage);

    result.current.sendGlyphToBack("g2");

    expect(activePage.glyphs[0].id).toBe("g2");
  });

  it("sendGlyphToBack does nothing for unknown glyphId", () => {
    const g1 = makeGlyph("g1");
    const activePage = makePage([g1]);
    const { result, addMessage } = getHook(activePage);

    result.current.sendGlyphToBack("nonexistent");

    expect(addMessage).not.toHaveBeenCalled();
  });

  it("sendGlyphToBack moves glyph connections to the end", () => {
    const g1 = makeGlyph("g1");
    const g2 = makeGlyph("g2");
    const connG2 = makeConn("c-g2", "g2", "g1");
    const otherConn = makeConn("c-other", "g1", "g1");
    const activePage = makePage([g1, g2], [connG2, otherConn]);
    const { result } = getHook(activePage);

    result.current.sendGlyphToBack("g2");

    // glyph connections should be at end
    expect(activePage.connections[activePage.connections.length - 1].id).toBe("c-g2");
  });

  // ─── handleAutoArrange ───────────────────────────────────────────────────

  it("handleAutoArrange repositions all glyphs in a grid", () => {
    const glyphs = [makeGlyph("g1"), makeGlyph("g2"), makeGlyph("g3"), makeGlyph("g4")];
    const activePage = makePage(glyphs);
    const { result, addMessage } = getHook(activePage);

    result.current.handleAutoArrange();

    expect(addMessage).toHaveBeenCalledWith("Auto-arranged glyphs");
    // First glyph goes to (60, 60)
    expect(activePage.glyphs[0].x).toBe(60);
    expect(activePage.glyphs[0].y).toBe(60);
  });

  // ─── handleAddGlyph ──────────────────────────────────────────────────────

  it("handleAddGlyph calls updateHistory with new glyph appended", () => {
    const activePage = makePage([]);
    const { result, updateHistory, addMessage } = getHook(activePage);

    result.current.handleAddGlyph("rect", 100, 200);

    expect(updateHistory).toHaveBeenCalled();
    const newPages = updateHistory.mock.calls[0][0] as Page[];
    expect(newPages[0].glyphs).toHaveLength(1);
    expect(newPages[0].glyphs[0].type).toBe("rect");
    expect(addMessage).toHaveBeenCalledWith(
      expect.stringContaining("Added glyph")
    );
  });

  it("handleAddGlyph uses iconPng for png-glyph type", () => {
    const activePage = makePage([]);
    const { result, updateHistory } = getHook(activePage);

    result.current.handleAddGlyph("png-glyph", 0, 0);

    const newPages = updateHistory.mock.calls[0][0] as Page[];
    expect(newPages[0].glyphs[0].icon).toBe("mock-icon.png");
  });

  it("handleAddGlyph does not set icon for non-png types", () => {
    const activePage = makePage([]);
    const { result, updateHistory } = getHook(activePage);

    result.current.handleAddGlyph("rect", 0, 0);

    const newPages = updateHistory.mock.calls[0][0] as Page[];
    expect(newPages[0].glyphs[0].icon).toBeUndefined();
  });

  it("handleAddGlyph uses provided inputs/outputs", () => {
    const activePage = makePage([]);
    const { result, updateHistory } = getHook(activePage);

    result.current.handleAddGlyph("rect", 0, 0, 3, 2);

    const newPages = updateHistory.mock.calls[0][0] as Page[];
    expect(newPages[0].glyphs[0].inputs).toBe(3);
    expect(newPages[0].glyphs[0].outputs).toBe(2);
  });

  // ─── handleUpdateGlyph ───────────────────────────────────────────────────

  it("handleUpdateGlyph merges updates into matching glyph", () => {
    const g = makeGlyph("g1");
    const activePage = makePage([g]);
    const { result, updateHistory, addMessage } = getHook(activePage);

    result.current.handleUpdateGlyph("g1", { label: "Updated" });

    const newPages = updateHistory.mock.calls[0][0] as Page[];
    expect(newPages[0].glyphs[0].label).toBe("Updated");
    expect(addMessage).toHaveBeenCalledWith("Updated glyph g1");
  });
});
