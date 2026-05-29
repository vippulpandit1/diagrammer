import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BottomTabs } from "../BottomTabs";

describe("BottomTabs", () => {
  // ── Rendering ────────────────────────────────────────────────────────────
  it("renders all three tab buttons", () => {
    render(<BottomTabs />);
    expect(screen.getByRole("button", { name: "Diagram" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Properties" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "History" })).toBeInTheDocument();
  });

  it("activates the first tab (Diagram) by default", () => {
    render(<BottomTabs />);
    const diagramBtn = screen.getByRole("button", { name: "Diagram" });
    // Active tab has font-weight 700
    expect((diagramBtn as HTMLButtonElement).style.fontWeight).toBe("700");
  });

  // ── Tab switching ─────────────────────────────────────────────────────────
  it("switches active tab when clicked", () => {
    render(<BottomTabs />);
    const propertiesBtn = screen.getByRole("button", { name: "Properties" });
    fireEvent.click(propertiesBtn);
    expect((propertiesBtn as HTMLButtonElement).style.fontWeight).toBe("700");
  });

  it("deactivates the previously active tab when another is clicked", () => {
    render(<BottomTabs />);
    const diagramBtn = screen.getByRole("button", { name: "Diagram" });
    const historyBtn = screen.getByRole("button", { name: "History" });
    fireEvent.click(historyBtn);
    expect((diagramBtn as HTMLButtonElement).style.fontWeight).toBe("500");
  });

  // ── Callback ──────────────────────────────────────────────────────────────
  it("calls onTabChange with the clicked tab key", () => {
    const onTabChange = vi.fn();
    render(<BottomTabs onTabChange={onTabChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Properties" }));
    expect(onTabChange).toHaveBeenCalledWith("properties");
  });

  it("calls onTabChange with 'history' when History is clicked", () => {
    const onTabChange = vi.fn();
    render(<BottomTabs onTabChange={onTabChange} />);
    fireEvent.click(screen.getByRole("button", { name: "History" }));
    expect(onTabChange).toHaveBeenCalledWith("history");
  });

  it("does not throw when onTabChange is not provided", () => {
    expect(() => {
      render(<BottomTabs />);
      fireEvent.click(screen.getByRole("button", { name: "Properties" }));
    }).not.toThrow();
  });

  // ── Children ──────────────────────────────────────────────────────────────
  it("renders the first child panel when Diagram tab is active", () => {
    render(
      <BottomTabs>
        {[
          <div key="a">Diagram Panel</div>,
          <div key="b">Properties Panel</div>,
          <div key="c">History Panel</div>,
        ]}
      </BottomTabs>
    );
    expect(screen.getByText("Diagram Panel")).toBeInTheDocument();
    expect(screen.queryByText("Properties Panel")).not.toBeInTheDocument();
  });

  it("renders the correct child panel after switching tabs", () => {
    render(
      <BottomTabs>
        {[
          <div key="a">Diagram Panel</div>,
          <div key="b">Properties Panel</div>,
          <div key="c">History Panel</div>,
        ]}
      </BottomTabs>
    );
    fireEvent.click(screen.getByRole("button", { name: "Properties" }));
    expect(screen.getByText("Properties Panel")).toBeInTheDocument();
    expect(screen.queryByText("Diagram Panel")).not.toBeInTheDocument();
  });

  it("renders nothing in the content area when no children provided", () => {
    const { container } = render(<BottomTabs />);
    // The content div is the last div inside the outer fixed container
    const allDivs = container.querySelectorAll("div");
    const contentDiv = allDivs[allDivs.length - 1];
    expect(contentDiv.children).toHaveLength(0);
  });
});
