import React from "react";
import { GlyphRenderer } from "./glyph/GlyphRenderer";

const STENCIL_GLYPHS = {
  basic: [
    { type: "rect", label: "Rectangle", inputs: 1, outputs: 1 },
    { type: "circle", label: "Circle", inputs: 1, outputs: 1 },
    { type: "multi", label: "Multi I/O", inputs: 2, outputs: 2 },
    { type: "text", label: "Text", inputs: 0, outputs: 0 },
  ],
  logic: [
    { type: "and", label: "AND", inputs: 2, outputs: 1 },
    { type: "or", label: "OR", inputs: 2, outputs: 1 },
    { type: "not", label: "NOT", inputs: 1, outputs: 1 },
    { type: "nand", label: "NAND", inputs: 2, outputs: 1 },
    { type: "nor", label: "NOR", inputs: 2, outputs: 1 },
    { type: "xor", label: "XOR", inputs: 2, outputs: 1 },
    { type: "xnor", label: "XNOR", inputs: 2, outputs: 1 },
  ],
  uml: [
    { type: "uml-class", label: "Class", inputs: 0, outputs: 0 },
    { type: "uml-interface", label: "Interface", inputs: 0, outputs: 0 },
    { type: "uml-abstract", label: "Abstract Class", inputs: 0, outputs: 0 },
    { type: "uml-enum", label: "Enum", inputs: 0, outputs: 0 },
    { type: "uml-package", label: "Package", inputs: 0, outputs: 0 },
  ],
  debug: [
    { type: "debug", label: "Debug", inputs: 1, outputs: 1 }
  ],
  network: [
    { type: "network-server", label: "Server", inputs: 1, outputs: 1 },
    { type: "network-switch", label: "Switch", inputs: 1, outputs: 1 },
    { type: "network-router", label: "Router", inputs: 1, outputs: 1 },
    { type: "network-firewall", label: "Firewall", inputs: 1, outputs: 1 },
    { type: "network-pc", label: "PC", inputs: 1, outputs: 1 },
    { type: "network-cloud", label: "Cloud", inputs: 1, outputs: 1 },
    { type: "network-database", label: "Database", inputs: 1, outputs: 1 },
    { type: "network-laptop", label: "Laptop", inputs: 1, outputs: 1 },
    { type: "network-phone", label: "Phone", inputs: 1, outputs: 1 },
    { type: "network-tablet", label: "Tablet", inputs: 1, outputs: 1 },
    { type: "network-wifi", label: "WiFi", inputs: 1, outputs: 1 },
    { type: "network-printer", label: "Printer", inputs: 1, outputs: 1 },
    { type: "network-hub", label: "Hub", inputs: 1, outputs: 1 },
    { type: "network-cable", label: "Cable", inputs: 1, outputs: 1 },
    { type: "network-bridge", label: "Bridge", inputs: 1, outputs: 1 },
  ],
  flowchart: [
    { type: "flow-start", label: "Start", inputs: 0, outputs: 1 },
    { type: "flow-end", label: "End", inputs: 1, outputs: 0 },
    { type: "flow-process", label: "Process", inputs: 1, outputs: 1 },
    { type: "flow-io", label: "I/O", inputs: 1, outputs: 1 },
    { type: "flow-decision", label: "Decision", inputs: 1, outputs: 2 },
    { type: "flow-connector", label: "Connector", inputs: 1, outputs: 1 },
    { type: "flow-arrow", label: "Arrow", inputs: 1, outputs: 1 },
    { type: "flow-card", label: "Card", inputs: 1, outputs: 1 },
    { type: "flow-document", label: "Document", inputs: 1, outputs: 1 },
    { type: "flow-predefined-process", label: "Predefined Process", inputs: 1, outputs: 1 },
    { type: "flow-data", label: "Data", inputs: 1, outputs: 1 },
    { type: "flow-delay", label: "Delay", inputs: 1, outputs: 1 },
    { type: "flow-display", label: "Display", inputs: 1, outputs: 1 },
    { type: "flow-subroutine", label: "Subroutine", inputs: 1, outputs: 1 },
    { type: "flow-multi-document", label: "Multi-Document", inputs: 1, outputs: 1 },
    { type: "flow-sorted-data", label: "Sorted Data", inputs: 1, outputs: 1 },
    { type: "flow-collate", label: "Collate", inputs: 1, outputs: 1 },
    { type: "flow-summarize", label: "Summarize", inputs: 1, outputs: 1 },
    { type: "flow-extract", label: "Extract", inputs: 1, outputs: 1 },
    { type: "flow-manual-input", label: "Manual Input", inputs: 1, outputs: 1 },
    { type: "flow-manual-operation", label: "Manual Operation", inputs: 1, outputs: 1 },
    { type: "flow-preparation", label: "Preparation", inputs: 1, outputs: 1 },
    { type: "flow-on-page-connector", label: "On-Page Connector", inputs: 1, outputs: 1 },
    { type: "flow-off-page-connector", label: "Off-Page Connector", inputs: 1, outputs: 1 },
    { type: "flow-merge", label: "Merge", inputs: 2, outputs: 1 },
    { type: "flow-decision-alt", label: "Decision Alt", inputs: 1, outputs: 2 },
    { type: "flow-split", label: "Split", inputs: 1, outputs: 2 },
    { type: "flow-database", label: "Database", inputs: 1, outputs: 1 },
    { type: "flow-manual-loop", label: "Manual Loop", inputs: 1, outputs: 1 },
    { type: "flow-loop-limit", label: "Loop Limit", inputs: 1, outputs: 1 },
    { type: "flow-internal-storage", label: "Internal Storage", inputs: 1, outputs: 1 },
  ],
};

type StencilType = keyof typeof STENCIL_GLYPHS;

export const Stencil: React.FC<{ stencilType: StencilType; onGlyphDragStart?: (type: string) => void }> = ({ stencilType, onGlyphDragStart }) => {
  const glyphs = STENCIL_GLYPHS[stencilType] || [];

  const handleDragStart = (e: React.DragEvent, g: { type: string; inputs?: number; outputs?: number }) => {
    // put both a simple type and a JSON payload (includes ports) onto the drag data
    e.dataTransfer.setData("glyphType", g.type);
    try {
      e.dataTransfer.setData("glyphJSON", JSON.stringify({ type: g.type, inputs: g.inputs, outputs: g.outputs }));
    } catch (err) {
      // ignore
    }
    if (onGlyphDragStart) onGlyphDragStart(g.type);
  };

  return (
    <div className="stencil">
      {glyphs.map(g => (
        <div
          key={g.type}
          draggable
          onDragStart={e => handleDragStart(e, g)}
          className="stencil-glyph"
          title={g.label}
        >
          <svg width={45} height={45}>
            <GlyphRenderer type={g.type} width={40} height={40} />
            {/* port preview overlay based on stencil defaults */}
            <g className="stencil-ports">
              {(() => {
                const inputs = typeof g.inputs === "number" ? g.inputs : 0;
                const outputs = typeof g.outputs === "number" ? g.outputs : 0;
                const yStart = 10;
                const yEnd = 30;
                const renderPorts = (count: number, side: "left" | "right") => {
                  if (count <= 0) return null;
                  if (count === 1) {
                    const y = (yStart + yEnd) / 2;
                    const cx = side === "left" ? 6 : 34;
                    return (
                      <circle key={`${side}-0`} cx={cx} cy={y} r={2.2} fill="#222" />
                    );
                  }
                  const step = (yEnd - yStart) / (count - 1);
                  return new Array(count).fill(0).map((_, i) => {
                    const y = yStart + step * i;
                    const cx = side === "left" ? 6 : 34;
                    return <circle key={`${side}-${i}`} cx={cx} cy={y} r={2.2} fill="#222" />;
                  });
                };
                return (
                  <>
                    {renderPorts(inputs, "left")}
                    {renderPorts(outputs, "right")}
                  </>
                );
              })()}
            </g>
          </svg>
          <div style={{ fontSize: 12, textAlign: "center" }}>{g.label}</div>
        </div>
      ))}
    </div>
  );
};
