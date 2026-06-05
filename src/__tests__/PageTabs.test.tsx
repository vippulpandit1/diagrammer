import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PageTabs } from "../PageTabs";
import type { Page } from "../glyph/Page";

const makePage = (id: string, name: string): Page => ({
  id,
  name,
  glyphs: [],
  connections: [],
});

const pages: Page[] = [makePage("p1", "Page 1"), makePage("p2", "Page 2")];

const defaultProps = {
  pages,
  activePageIdx: 0,
  panelHeight: 96,
  editingPageIdx: null,
  editingPageName: "",
  onPageChange: vi.fn(),
  onAddPage: vi.fn(),
  onEditPageNameChange: vi.fn(),
  onStartEditPage: vi.fn(),
  onSaveEditPage: vi.fn(),
  onEditPageKeyDown: vi.fn(),
};

describe("PageTabs", () => {
  it("renders a tab for each page", () => {
    const { getByText } = render(<PageTabs {...defaultProps} />);
    expect(getByText("Page 1")).toBeTruthy();
    expect(getByText("Page 2")).toBeTruthy();
  });

  it("renders the '+ Add Page' button", () => {
    const { getByText } = render(<PageTabs {...defaultProps} />);
    expect(getByText("＋ Add Page")).toBeTruthy();
  });

  it("clicking a tab calls onPageChange with its index", () => {
    const onPageChange = vi.fn();
    const { getByText } = render(
      <PageTabs {...defaultProps} onPageChange={onPageChange} />
    );
    fireEvent.click(getByText("Page 2"));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("clicking '+ Add Page' calls onAddPage", () => {
    const onAddPage = vi.fn();
    const { getByText } = render(
      <PageTabs {...defaultProps} onAddPage={onAddPage} />
    );
    fireEvent.click(getByText("＋ Add Page"));
    expect(onAddPage).toHaveBeenCalled();
  });

  it("active tab has blue color style", () => {
    const { getByText } = render(<PageTabs {...defaultProps} activePageIdx={0} />);
    const activeTab = getByText("Page 1").closest("div") as HTMLElement;
    expect(activeTab.style.color).toBe("rgb(37, 99, 235)");
  });

  it("double-clicking a tab calls onStartEditPage", () => {
    const onStartEditPage = vi.fn();
    const { getByText } = render(
      <PageTabs {...defaultProps} onStartEditPage={onStartEditPage} />
    );
    fireEvent.dblClick(getByText("Page 1").closest("div") as HTMLElement);
    expect(onStartEditPage).toHaveBeenCalledWith(0, "Page 1");
  });

  it("clicking rename button calls onStartEditPage", () => {
    const onStartEditPage = vi.fn();
    const { getByLabelText } = render(
      <PageTabs {...defaultProps} onStartEditPage={onStartEditPage} />
    );
    fireEvent.click(getByLabelText("Rename Page 1"));
    expect(onStartEditPage).toHaveBeenCalledWith(0, "Page 1");
  });

  it("shows an input when editingPageIdx matches a tab", () => {
    const { container } = render(
      <PageTabs
        {...defaultProps}
        editingPageIdx={0}
        editingPageName="Renamed"
      />
    );
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.value).toBe("Renamed");
  });

  it("input change calls onEditPageNameChange", () => {
    const onEditPageNameChange = vi.fn();
    const { container } = render(
      <PageTabs
        {...defaultProps}
        editingPageIdx={0}
        editingPageName="Old"
        onEditPageNameChange={onEditPageNameChange}
      />
    );
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "New" } });
    expect(onEditPageNameChange).toHaveBeenCalledWith("New");
  });

  it("input blur calls onSaveEditPage", () => {
    const onSaveEditPage = vi.fn();
    const { container } = render(
      <PageTabs
        {...defaultProps}
        editingPageIdx={0}
        editingPageName="Test"
        onSaveEditPage={onSaveEditPage}
      />
    );
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.blur(input);
    expect(onSaveEditPage).toHaveBeenCalled();
  });

  it("input keyDown calls onEditPageKeyDown", () => {
    const onEditPageKeyDown = vi.fn();
    const { container } = render(
      <PageTabs
        {...defaultProps}
        editingPageIdx={0}
        editingPageName="Test"
        onEditPageKeyDown={onEditPageKeyDown}
      />
    );
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onEditPageKeyDown).toHaveBeenCalled();
  });

  it("shows active indicator dot for active page", () => {
    const { container } = render(<PageTabs {...defaultProps} activePageIdx={0} />);
    // The active indicator is a span inside the active tab div
    const spans = container.querySelectorAll("span");
    // One of them should have the dot style (borderRadius 50%)
    const dot = Array.from(spans).find(s => s.style.borderRadius === "50%");
    expect(dot).toBeTruthy();
  });

  it("positions the bar above the panel using panelHeight", () => {
    const { container } = render(<PageTabs {...defaultProps} panelHeight={150} />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.style.bottom).toBe("150px");
  });
});
