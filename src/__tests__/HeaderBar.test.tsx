import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { HeaderBar } from "../HeaderBar";

const defaultProps = {
  onClear: vi.fn(),
  onZoomIn: vi.fn(),
  onZoomOut: vi.fn(),
  onSave: vi.fn(),
  zoom: 1,
  onAutoArrange: vi.fn(),
  onPrint: vi.fn(),
  onImport: vi.fn(),
};

describe("HeaderBar", () => {
  // ── Rendering ──────────────────────────────────────────────────────────────
  it("renders the app title", () => {
    render(<HeaderBar {...defaultProps} />);
    expect(screen.getByText("Graphic Workspace")).toBeInTheDocument();
  });

  it("renders the Save button", () => {
    render(<HeaderBar {...defaultProps} />);
    expect(screen.getByTitle("Save")).toBeInTheDocument();
  });

  it("renders zoom controls", () => {
    render(<HeaderBar {...defaultProps} />);
    expect(screen.getByTitle("Zoom In")).toBeInTheDocument();
    expect(screen.getByTitle("Zoom Out")).toBeInTheDocument();
  });

  it("displays the zoom percentage correctly", () => {
    render(<HeaderBar {...defaultProps} zoom={1.5} />);
    expect(screen.getByText("150%")).toBeInTheDocument();
  });

  it("displays 100% zoom at default zoom level", () => {
    render(<HeaderBar {...defaultProps} zoom={1} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("renders the Import button", () => {
    render(<HeaderBar {...defaultProps} />);
    expect(screen.getByTitle("Import JSON")).toBeInTheDocument();
  });

  it("renders the Clear Canvas button", () => {
    render(<HeaderBar {...defaultProps} />);
    expect(screen.getByTitle("Clear Canvas")).toBeInTheDocument();
  });

  it("renders the Print Canvas button", () => {
    render(<HeaderBar {...defaultProps} />);
    expect(screen.getByTitle("Print Canvas")).toBeInTheDocument();
  });

  // ── Interactions ───────────────────────────────────────────────────────────
  it("calls onSave when Save is clicked", () => {
    const onSave = vi.fn();
    render(<HeaderBar {...defaultProps} onSave={onSave} />);
    fireEvent.click(screen.getByTitle("Save"));
    expect(onSave).toHaveBeenCalledOnce();
  });

  it("calls onZoomIn when Zoom In is clicked", () => {
    const onZoomIn = vi.fn();
    render(<HeaderBar {...defaultProps} onZoomIn={onZoomIn} />);
    fireEvent.click(screen.getByTitle("Zoom In"));
    expect(onZoomIn).toHaveBeenCalledOnce();
  });

  it("calls onZoomOut when Zoom Out is clicked", () => {
    const onZoomOut = vi.fn();
    render(<HeaderBar {...defaultProps} onZoomOut={onZoomOut} />);
    fireEvent.click(screen.getByTitle("Zoom Out"));
    expect(onZoomOut).toHaveBeenCalledOnce();
  });

  it("calls onClear when Clear Canvas is clicked", () => {
    const onClear = vi.fn();
    render(<HeaderBar {...defaultProps} onClear={onClear} />);
    fireEvent.click(screen.getByTitle("Clear Canvas"));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("calls onAutoArrange when Auto-Arrange is clicked", () => {
    const onAutoArrange = vi.fn();
    render(<HeaderBar {...defaultProps} onAutoArrange={onAutoArrange} />);
    fireEvent.click(screen.getByTitle("Auto-Arrange"));
    expect(onAutoArrange).toHaveBeenCalledOnce();
  });

  it("calls onPrint when Print Canvas is clicked", () => {
    const onPrint = vi.fn();
    render(<HeaderBar {...defaultProps} onPrint={onPrint} />);
    fireEvent.click(screen.getByTitle("Print Canvas"));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  // ── File import (handleFileChange) ─────────────────────────────────────────
  it("reads a selected file and calls onImport with its text content", () => {
    const onImport = vi.fn();
    render(<HeaderBar {...defaultProps} onImport={onImport} />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    // Mock FileReader to synchronously invoke onload
    const readerInstance = {
      onload: null as any,
      readAsText(_file: File) {
        if (this.onload) {
          this.onload({ target: { result: "file content" } } as any);
        }
      },
    };
    const spy = vi.spyOn(global, "FileReader").mockImplementation(
      () => readerInstance as any
    );

    const mockFile = new File(["file content"], "test.json", { type: "application/json" });
    Object.defineProperty(fileInput, "files", { value: [mockFile], configurable: true });
    fireEvent.change(fileInput);

    expect(onImport).toHaveBeenCalledWith("file content", "test.json");
    spy.mockRestore();
  });

  it("does nothing when no file is selected", () => {
    const onImport = vi.fn();
    render(<HeaderBar {...defaultProps} onImport={onImport} />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(fileInput, "files", { value: [], configurable: true });
    fireEvent.change(fileInput);

    expect(onImport).not.toHaveBeenCalled();
  });

  it("does not call onImport when FileReader result is not a string", () => {
    const onImport = vi.fn();
    render(<HeaderBar {...defaultProps} onImport={onImport} />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    const readerInstance = {
      onload: null as any,
      readAsText(_file: File) {
        if (this.onload) {
          this.onload({ target: { result: null } } as any);
        }
      },
    };
    const spy = vi.spyOn(global, "FileReader").mockImplementation(
      () => readerInstance as any
    );

    const mockFile = new File([""], "empty.json");
    Object.defineProperty(fileInput, "files", { value: [mockFile], configurable: true });
    fireEvent.change(fileInput);

    expect(onImport).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("clicking the Import JSON button triggers the hidden file input click", () => {
    const onImport = vi.fn();
    render(<HeaderBar {...defaultProps} onImport={onImport} />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, "click").mockImplementation(() => {});

    fireEvent.click(screen.getByTitle("Import JSON"));

    expect(clickSpy).toHaveBeenCalledOnce();
    clickSpy.mockRestore();
  });
});
