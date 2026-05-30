import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FloatingToolbar } from "../FloatingToolbar";

// Mock Toolbar so we don't pull in all glyph imports
vi.mock("../Toolbar", () => ({
  Toolbar: (props: { orientation: string }) => (
    <div data-testid="mock-toolbar" data-orientation={props.orientation} />
  ),
}));

const defaultProps = {
  toolbarOpen: true,
  setToolbarOpen: vi.fn(),
  toolbarPos: { x: 40, y: 100 },
  setToolbarPos: vi.fn(),
  draggingToolbar: false,
  setDraggingToolbar: vi.fn(),
  toolbarOrientation: "vertical" as const,
  setToolbarOrientation: vi.fn(),
  stencilType: "basic" as const,
  setStencilType: vi.fn(),
  connectionType: "association",
  setConnectionType: vi.fn(),
};

describe("FloatingToolbar", () => {
  it("renders the toolbar container when toolbarOpen=true", () => {
    const { getByTestId } = render(<FloatingToolbar {...defaultProps} />);
    expect(getByTestId("mock-toolbar")).toBeTruthy();
  });

  it("renders the FAB when toolbarOpen=false", () => {
    const { getByTitle } = render(
      <FloatingToolbar {...defaultProps} toolbarOpen={false} />
    );
    expect(getByTitle("Show Toolbar")).toBeTruthy();
  });

  it("does not render the toolbar div when toolbarOpen=false", () => {
    const { queryByTestId } = render(
      <FloatingToolbar {...defaultProps} toolbarOpen={false} />
    );
    expect(queryByTestId("mock-toolbar")).toBeNull();
  });

  it("clicking FAB calls setToolbarOpen(true)", () => {
    const setToolbarOpen = vi.fn();
    const { getByTitle } = render(
      <FloatingToolbar {...defaultProps} toolbarOpen={false} setToolbarOpen={setToolbarOpen} />
    );
    fireEvent.click(getByTitle("Show Toolbar"));
    expect(setToolbarOpen).toHaveBeenCalledWith(true);
  });

  it("shows vertical orientation icon when orientation is 'vertical'", () => {
    const { container } = render(
      <FloatingToolbar {...defaultProps} toolbarOrientation="vertical" />
    );
    // The orientation button title should say switch to horizontal
    const btn = container.querySelector("button[title='Switch to horizontal']");
    expect(btn).toBeTruthy();
  });

  it("shows horizontal orientation icon when orientation is 'horizontal'", () => {
    const { container } = render(
      <FloatingToolbar {...defaultProps} toolbarOrientation="horizontal" />
    );
    const btn = container.querySelector("button[title='Switch to vertical']");
    expect(btn).toBeTruthy();
  });

  it("clicking orientation button calls setToolbarOrientation", () => {
    const setToolbarOrientation = vi.fn();
    const { container } = render(
      <FloatingToolbar
        {...defaultProps}
        toolbarOrientation="vertical"
        setToolbarOrientation={setToolbarOrientation}
      />
    );
    const btn = container.querySelector("button[title='Switch to horizontal']") as HTMLElement;
    fireEvent.click(btn);
    expect(setToolbarOrientation).toHaveBeenCalled();
  });

  it("applies 'move' cursor when draggingToolbar=true", () => {
    const { container } = render(
      <FloatingToolbar {...defaultProps} draggingToolbar={true} />
    );
    const wrapper = container.querySelector(".workspace-toolbar") as HTMLElement;
    expect(wrapper.style.cursor).toBe("move");
  });

  it("applies 'default' cursor when draggingToolbar=false", () => {
    const { container } = render(
      <FloatingToolbar {...defaultProps} draggingToolbar={false} />
    );
    const wrapper = container.querySelector(".workspace-toolbar") as HTMLElement;
    expect(wrapper.style.cursor).toBe("default");
  });

  it("positions toolbar at toolbarPos", () => {
    const { container } = render(
      <FloatingToolbar {...defaultProps} toolbarPos={{ x: 200, y: 300 }} />
    );
    const wrapper = container.querySelector(".workspace-toolbar") as HTMLElement;
    expect(wrapper.style.left).toBe("200px");
    expect(wrapper.style.top).toBe("300px");
  });

  it("pointerDown on drag handle starts drag and calls setDraggingToolbar", () => {
    const setDraggingToolbar = vi.fn();
    const setToolbarPos = vi.fn();
    const { getByText } = render(
      <FloatingToolbar
        {...defaultProps}
        setDraggingToolbar={setDraggingToolbar}
        setToolbarPos={setToolbarPos}
      />
    );
    const handle = getByText("Toolbar").parentElement as HTMLElement;
    fireEvent.pointerDown(handle, { clientX: 100, clientY: 100 });
    expect(setDraggingToolbar).toHaveBeenCalledWith(true);
  });

  it("pointerDown on orientation button does NOT start drag", () => {
    const setDraggingToolbar = vi.fn();
    const { container } = render(
      <FloatingToolbar {...defaultProps} setDraggingToolbar={setDraggingToolbar} />
    );
    const btn = container.querySelector("button[title='Switch to horizontal']") as HTMLElement;
    // Fire the pointerDown directly on the button; it bubbles to the handle div.
    // The handler checks e.target.closest('button') — since target IS the button, drag is skipped.
    fireEvent.pointerDown(btn, { clientX: 100, clientY: 100 });
    expect(setDraggingToolbar).not.toHaveBeenCalled();
  });

  it("passes orientation to the Toolbar child", () => {
    const { getByTestId } = render(
      <FloatingToolbar {...defaultProps} toolbarOrientation="horizontal" />
    );
    expect(getByTestId("mock-toolbar").getAttribute("data-orientation")).toBe("horizontal");
  });
});
