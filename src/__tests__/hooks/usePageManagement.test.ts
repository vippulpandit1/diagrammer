import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { usePageManagement } from "../../hooks/usePageManagement";
import type { Page } from "../../glyph/Page";

const makePage = (id: string, name: string): Page => ({
  id,
  name,
  glyphs: [],
  connections: [],
});

describe("usePageManagement", () => {
  it("initialises with no editing state", () => {
    const pages = [makePage("p1", "Page 1")];
    const { result } = renderHook(() =>
      usePageManagement(pages, vi.fn(), vi.fn())
    );
    expect(result.current.editingPageIdx).toBeNull();
    expect(result.current.editingPageName).toBe("");
  });

  it("handleAddPage calls setPages and setActivePageIdx", () => {
    const pages = [makePage("p1", "Page 1")];
    const setPages = vi.fn();
    const setActivePageIdx = vi.fn();

    const { result } = renderHook(() =>
      usePageManagement(pages, setPages, setActivePageIdx)
    );

    act(() => {
      result.current.handleAddPage();
    });

    expect(setPages).toHaveBeenCalled();
    // New page index is pages.length (1)
    expect(setActivePageIdx).toHaveBeenCalledWith(1);
  });

  it("handleStartEditPage sets editingPageIdx and editingPageName", () => {
    const pages = [makePage("p1", "Page 1"), makePage("p2", "Page 2")];
    const { result } = renderHook(() =>
      usePageManagement(pages, vi.fn(), vi.fn())
    );

    act(() => {
      result.current.handleStartEditPage(1, "Page 2");
    });

    expect(result.current.editingPageIdx).toBe(1);
    expect(result.current.editingPageName).toBe("Page 2");
  });

  it("handleSaveEditPage calls setPages with updated name and resets editing state", () => {
    const pages = [makePage("p1", "Page 1")];
    const setPages = vi.fn();

    const { result } = renderHook(() =>
      usePageManagement(pages, setPages, vi.fn())
    );

    act(() => {
      result.current.handleStartEditPage(0, "Page 1");
    });
    act(() => {
      result.current.setEditingPageName("Renamed");
    });
    act(() => {
      result.current.handleSaveEditPage();
    });

    expect(setPages).toHaveBeenCalled();
    expect(result.current.editingPageIdx).toBeNull();
    expect(result.current.editingPageName).toBe("");
  });

  it("handleSaveEditPage does not call setPages when name is blank", () => {
    const pages = [makePage("p1", "Page 1")];
    const setPages = vi.fn();

    const { result } = renderHook(() =>
      usePageManagement(pages, setPages, vi.fn())
    );

    act(() => {
      result.current.handleStartEditPage(0, "Page 1");
    });
    act(() => {
      result.current.setEditingPageName("   "); // whitespace only
    });
    act(() => {
      result.current.handleSaveEditPage();
    });

    expect(setPages).not.toHaveBeenCalled();
    expect(result.current.editingPageIdx).toBeNull();
  });

  it("handleEditPageKeyDown on Enter calls handleSaveEditPage", () => {
    const pages = [makePage("p1", "Page 1")];
    const setPages = vi.fn();

    const { result } = renderHook(() =>
      usePageManagement(pages, setPages, vi.fn())
    );

    act(() => {
      result.current.handleStartEditPage(0, "Page 1");
    });
    act(() => {
      result.current.setEditingPageName("New Name");
    });
    act(() => {
      result.current.handleEditPageKeyDown({
        key: "Enter",
      } as React.KeyboardEvent);
    });

    expect(setPages).toHaveBeenCalled();
  });

  it("handleEditPageKeyDown on Escape resets editing state without saving", () => {
    const pages = [makePage("p1", "Page 1")];
    const setPages = vi.fn();

    const { result } = renderHook(() =>
      usePageManagement(pages, setPages, vi.fn())
    );

    act(() => {
      result.current.handleStartEditPage(0, "Page 1");
    });
    act(() => {
      result.current.handleEditPageKeyDown({
        key: "Escape",
      } as React.KeyboardEvent);
    });

    expect(setPages).not.toHaveBeenCalled();
    expect(result.current.editingPageIdx).toBeNull();
    expect(result.current.editingPageName).toBe("");
  });

  it("handleEditPageKeyDown on other keys does nothing", () => {
    const pages = [makePage("p1", "Page 1")];
    const setPages = vi.fn();

    const { result } = renderHook(() =>
      usePageManagement(pages, setPages, vi.fn())
    );

    act(() => {
      result.current.handleStartEditPage(0, "Page 1");
    });
    act(() => {
      result.current.handleEditPageKeyDown({
        key: "Tab",
      } as React.KeyboardEvent);
    });

    // editingPageIdx still set, setPages not called
    expect(result.current.editingPageIdx).toBe(0);
    expect(setPages).not.toHaveBeenCalled();
  });
});
