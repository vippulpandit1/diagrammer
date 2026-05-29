// Tests for ContextMenus component
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { ContextMenus } from "../../glyphCanvas/ContextMenus";
import { Glyph } from "../../glyph/Glyph";
import { Connection } from "../../glyph/Connection";
import type { Page } from "../../glyph/Page";

// Helper: create a minimal Glyph
const makeGlyph = (id: string, type = "rect") =>
  new Glyph(id, type, 0, 0, [], {}, id, 1, 1, [], [], 120, 80);

// Helper: create a minimal Page
const makePage = (id: string, glyphs: Glyph[] = [], connections: Connection[] = []): Page => ({
  id,
  name: id,
  glyphs,
  connections,
});

const noopCallbacks = {
  onSetGlyphMenu: vi.fn(),
  onSetConnectionMenu: vi.fn(),
  bringGlyphToFront: vi.fn(),
  sendGlyphToBack: vi.fn(),
  groupGlyphs: vi.fn(),
  ungroupGlyphs: vi.fn(),
  onPageChange: vi.fn(),
  onMessage: vi.fn(),
};

const renderContextMenus = (overrides: Partial<React.ComponentProps<typeof ContextMenus>> = {}) => {
  const glyph = makeGlyph("g1");
  const page = makePage("page1", [glyph]);

  return render(
    <ContextMenus
      glyphMenu={null}
      connectionMenu={null}
      selectedGlyphIds={[]}
      glyphsToRender={[glyph]}
      activePage={page}
      pages={[page]}
      {...noopCallbacks}
      {...overrides}
    />
  );
};

describe("ContextMenus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("renders nothing by default", () => {
    it("renders empty fragment when both menus are null", () => {
      const { container } = renderContextMenus();
      expect(container.firstChild).toBeNull();
    });
  });

  describe("glyph context menu", () => {
    const glyphMenu = { glyphId: "g1", x: 100, y: 200 };

    it("renders glyph menu when glyphMenu is set", () => {
      renderContextMenus({ glyphMenu });
      expect(screen.getByText("Bring to Front")).not.toBeNull();
      expect(screen.getByText("Send to Back")).not.toBeNull();
      expect(screen.getByText("Group")).not.toBeNull();
      expect(screen.getByText("Ungroup")).not.toBeNull();
      expect(screen.getByText("Delete")).not.toBeNull();
    });

    it("calls bringGlyphToFront and clears menu on click", () => {
      const onSetGlyphMenu = vi.fn();
      const bringGlyphToFront = vi.fn();
      renderContextMenus({ glyphMenu, onSetGlyphMenu, bringGlyphToFront });
      fireEvent.click(screen.getByText("Bring to Front"));
      expect(bringGlyphToFront).toHaveBeenCalledWith("g1");
      expect(onSetGlyphMenu).toHaveBeenCalledWith(null);
    });

    it("calls sendGlyphToBack and clears menu on click", () => {
      const onSetGlyphMenu = vi.fn();
      const sendGlyphToBack = vi.fn();
      renderContextMenus({ glyphMenu, onSetGlyphMenu, sendGlyphToBack });
      fireEvent.click(screen.getByText("Send to Back"));
      expect(sendGlyphToBack).toHaveBeenCalledWith("g1");
      expect(onSetGlyphMenu).toHaveBeenCalledWith(null);
    });

    it("calls groupGlyphs with selected + right-clicked glyph on Group click", () => {
      const onSetGlyphMenu = vi.fn();
      const groupGlyphs = vi.fn();
      renderContextMenus({ glyphMenu, onSetGlyphMenu, groupGlyphs, selectedGlyphIds: ["g2"] });
      fireEvent.click(screen.getByText("Group"));
      expect(groupGlyphs).toHaveBeenCalledWith(expect.arrayContaining(["g1", "g2"]));
      expect(onSetGlyphMenu).toHaveBeenCalledWith(null);
    });

    it("calls ungroupGlyphs on Ungroup click", () => {
      const onSetGlyphMenu = vi.fn();
      const ungroupGlyphs = vi.fn();
      renderContextMenus({ glyphMenu, onSetGlyphMenu, ungroupGlyphs, selectedGlyphIds: ["g1"] });
      fireEvent.click(screen.getByText("Ungroup"));
      expect(ungroupGlyphs).toHaveBeenCalledWith(expect.arrayContaining(["g1"]));
      expect(onSetGlyphMenu).toHaveBeenCalledWith(null);
    });

    it("removes glyph from activePage on Delete click", () => {
      const glyph = makeGlyph("g1");
      const page = makePage("page1", [glyph]);
      const onSetGlyphMenu = vi.fn();
      const onMessage = vi.fn();
      renderContextMenus({ glyphMenu, activePage: page, glyphsToRender: [glyph], onSetGlyphMenu, onMessage });
      fireEvent.click(screen.getByText("Delete"));
      expect(page.glyphs).toHaveLength(0);
      expect(onSetGlyphMenu).toHaveBeenCalledWith(null);
      expect(onMessage).toHaveBeenCalledWith(expect.stringContaining("g1"));
    });

    it("clears menu on mouse leave", () => {
      const onSetGlyphMenu = vi.fn();
      renderContextMenus({ glyphMenu, onSetGlyphMenu });
      const menuDiv = document.querySelector("[style*='position: fixed']")!;
      fireEvent.mouseLeave(menuDiv);
      expect(onSetGlyphMenu).toHaveBeenCalledWith(null);
    });
  });

  describe("connection context menu", () => {
    it("renders connection menu when connectionMenu is set", () => {
      renderContextMenus({ connectionMenu: { connId: "c1", x: 150, y: 250 } });
      expect(screen.getByText("Delete Connection")).not.toBeNull();
    });

    it("removes connection from activePage on Delete Connection click", () => {
      const conn = new Connection("c1", "g1", "port-1", "g2", "port-2");
      const page = makePage("page1", [], [conn]);
      const onSetConnectionMenu = vi.fn();
      const onMessage = vi.fn();
      renderContextMenus({
        connectionMenu: { connId: "c1", x: 150, y: 250 },
        activePage: page,
        onSetConnectionMenu,
        onMessage,
      });
      fireEvent.click(screen.getByText("Delete Connection"));
      expect(page.connections).toHaveLength(0);
      expect(onSetConnectionMenu).toHaveBeenCalledWith(null);
      expect(onMessage).toHaveBeenCalledWith(expect.stringContaining("c1"));
    });

    it("clears connection menu on mouse leave", () => {
      const onSetConnectionMenu = vi.fn();
      renderContextMenus({
        connectionMenu: { connId: "c1", x: 150, y: 250 },
        onSetConnectionMenu,
      });
      // The fixed div for the connection menu
      const menus = document.querySelectorAll("[style*='position: fixed']");
      fireEvent.mouseLeave(menus[menus.length - 1]);
      expect(onSetConnectionMenu).toHaveBeenCalledWith(null);
    });
  });

  describe("flow-off-page-connector glyph menu", () => {
    it("renders Goto Page section for flow-off-page-connector glyph", () => {
      const glyph = makeGlyph("g1", "flow-off-page-connector");
      const page = makePage("page1", [glyph]);
      const page2 = makePage("page2");
      renderContextMenus({
        glyphMenu: { glyphId: "g1", x: 100, y: 200 },
        glyphsToRender: [glyph],
        activePage: page,
        pages: [page, page2],
      });
      expect(screen.getByText("Goto Page")).not.toBeNull();
    });

    it("does not render Goto Page for non-flow-off-page-connector glyph", () => {
      renderContextMenus({ glyphMenu: { glyphId: "g1", x: 100, y: 200 } });
      expect(screen.queryByText("Goto Page")).toBeNull();
    });

    it("calls onPageChange when Go button is clicked", () => {
      const glyph = makeGlyph("g1", "flow-off-page-connector");
      glyph.data = { targetPageId: "page2" };
      const page1 = makePage("page1", [glyph]);
      const page2 = makePage("page2");
      const onPageChange = vi.fn();
      const onSetGlyphMenu = vi.fn();
      renderContextMenus({
        glyphMenu: { glyphId: "g1", x: 100, y: 200 },
        glyphsToRender: [glyph],
        activePage: page1,
        pages: [page1, page2],
        onPageChange,
        onSetGlyphMenu,
      });
      fireEvent.click(screen.getByText("Go"));
      expect(onPageChange).toHaveBeenCalledWith(1);
      expect(onSetGlyphMenu).toHaveBeenCalledWith(null);
    });
  });
});
