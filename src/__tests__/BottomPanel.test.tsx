import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BottomPanel } from "../BottomPanel";

describe("BottomPanel", () => {
  it("renders with the message count in the header", () => {
    render(<BottomPanel messages={["msg1", "msg2"]} onClose={vi.fn()} />);
    expect(screen.getByText("Messages (2)")).toBeTruthy();
  });

  it("shows 'No messages' when the messages array is empty", () => {
    render(<BottomPanel messages={[]} onClose={vi.fn()} />);
    expect(screen.getByText("No messages")).toBeTruthy();
  });

  it("renders each message as its own div", () => {
    const { container } = render(
      <BottomPanel messages={["alpha", "beta", "gamma"]} onClose={vi.fn()} />
    );
    expect(screen.getByText("alpha")).toBeTruthy();
    expect(screen.getByText("beta")).toBeTruthy();
    expect(screen.getByText("gamma")).toBeTruthy();
  });

  it("shows messages in newest-first order by default", () => {
    render(
      <BottomPanel messages={["first", "second", "third"]} onClose={vi.fn()} />
    );
    const all = ["first", "second", "third"].map(t => screen.getByText(t));
    // newest-first DOM order: third → second → first
    // all[2] ("third") precedes all[1] ("second") → DOCUMENT_POSITION_FOLLOWING set
    expect(all[2].compareDocumentPosition(all[1]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(all[1].compareDocumentPosition(all[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("toggles to oldest-first when sort button is clicked", () => {
    render(
      <BottomPanel messages={["first", "second", "third"]} onClose={vi.fn()} />
    );
    const sortBtn = screen.getByTitle(/Showing newest first/);
    fireEvent.click(sortBtn);
    // oldest-first DOM order: first → second → third
    const all = ["first", "second", "third"].map(t => screen.getByText(t));
    expect(all[0].compareDocumentPosition(all[1]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(all[1].compareDocumentPosition(all[2]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("sort button label reflects current order", () => {
    render(<BottomPanel messages={["a"]} onClose={vi.fn()} />);
    expect(screen.getByText("Newest")).toBeTruthy();

    fireEvent.click(screen.getByTitle(/Showing newest first/));
    expect(screen.getByText("Oldest")).toBeTruthy();
  });

  it("shows Clear button when not collapsed and onClear is provided", () => {
    render(<BottomPanel messages={["x"]} onClose={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByText("Clear")).toBeTruthy();
  });

  it("calls onClear when Clear button is clicked", () => {
    const onClear = vi.fn();
    render(<BottomPanel messages={["x"]} onClose={vi.fn()} onClear={onClear} />);
    fireEvent.click(screen.getByText("Clear"));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("collapses panel when the collapse toggle button is clicked", () => {
    const { container } = render(
      <BottomPanel messages={["x"]} onClose={vi.fn()} height={120} />
    );
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv.style.height).toBe("120px");

    const collapseBtn = screen.getByRole("button", { name: /Collapse messages panel/ });
    fireEvent.click(collapseBtn);
    expect(outerDiv.style.height).toBe("36px");
  });

  it("expands panel when collapse toggle is clicked again", () => {
    const { container } = render(
      <BottomPanel messages={["x"]} onClose={vi.fn()} height={120} defaultCollapsed />
    );
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv.style.height).toBe("36px");

    const expandBtn = screen.getByRole("button", { name: /Expand messages panel/ });
    fireEvent.click(expandBtn);
    expect(outerDiv.style.height).toBe("120px");
  });

  it("hides Clear button when panel is collapsed", () => {
    render(
      <BottomPanel messages={["x"]} onClose={vi.fn()} onClear={vi.fn()} defaultCollapsed />
    );
    expect(screen.queryByText("Clear")).toBeNull();
  });

  it("calls onCollapseChange when collapse state changes", () => {
    const onCollapseChange = vi.fn();
    render(
      <BottomPanel
        messages={["x"]}
        onClose={vi.fn()}
        height={100}
        onCollapseChange={onCollapseChange}
      />
    );
    // Called once on mount with initial state
    expect(onCollapseChange).toHaveBeenCalledWith(false, 100);

    fireEvent.click(screen.getByRole("button", { name: /Collapse messages panel/ }));
    expect(onCollapseChange).toHaveBeenCalledWith(true, 36);
  });

  it("starts collapsed when defaultCollapsed=true", () => {
    const { container } = render(
      <BottomPanel messages={[]} onClose={vi.fn()} height={96} defaultCollapsed />
    );
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv.style.height).toBe("36px");
  });

  it("starts with oldest sort when defaultSort='oldest'", () => {
    render(
      <BottomPanel messages={["a"]} onClose={vi.fn()} defaultSort="oldest" />
    );
    expect(screen.getByText("Oldest")).toBeTruthy();
  });
});
