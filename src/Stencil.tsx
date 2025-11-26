// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React, { useState } from "react";
import { GlyphRenderer } from "./glyph/GlyphRenderer";

const STENCIL_GLYPHS = {
  basic: [
    { type: "rect", label: "Rectangle", inputs: 1, outputs: 1 },
    { type: "circle", label: "Circle", inputs: 1, outputs: 1 },
    { type: "multi", label: "Multi I/O", inputs: 2, outputs: 2 },
    { type: "text", label: "Text", inputs: 0, outputs: 0 },
    { type: "png-glyph", label: "PNG", inputs: 1, outputs: 1 },
    { type: "resizable-rectangle", label: "Resizable Rectangle", inputs: 1, outputs: 1, width: 120, height: 80, selected: true },
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
    { type: "network-access-point", label: "Access Point", inputs: 1, outputs: 1 },
    { type: "network-load-balancer", label: "Load Balancer", inputs: 1, outputs: 1 },
    { type: "network-proxy", label: "Proxy", inputs: 1, outputs: 1 },
    { type: "network-dns", label: "DNS", inputs: 1, outputs: 1 },
    { type: "network-dhcp", label: "DHCP", inputs: 1, outputs: 1 },
    { type: "network-nat", label: "NAT", inputs: 1, outputs: 1 },
    { type: "network-pdu", label: "PDU", inputs: 1, outputs: 1 },
    { type: "network-antenna", label: "Antenna", inputs: 1, outputs: 1 },
    { type: "network-cctv", label: "CCTV", inputs: 1, outputs: 1 },
    { type: "network-voip-phone", label: "VoIP Phone", inputs: 1, outputs: 1 },
    { type: "network-optical-network", label: "Optical Network", inputs: 1, outputs: 1 },
    { type: "network-satellite", label: "Satellite", inputs: 1, outputs: 1 },
    { type: "network-ids", label: "Intrusion Detection", inputs: 1, outputs: 1 },
    { type: "network-quantum-computer", label: "Quantum Computer", inputs: 1, outputs: 1 },
    { type: "network-terminal", label: "Terminal", inputs: 1, outputs: 0 },
    { type: "network-edge-device", label: "Edge Device", inputs: 1, outputs: 1 },
    { type: "network-iot-device", label: "IoT Device", inputs: 1, outputs: 1 },
    { type: "network-gateway", label: "Gateway", inputs: 1, outputs: 1 },
    { type: "network-vpn", label: "VPN", inputs: 1, outputs: 1 },
    { type: "network-cloud-storage", label: "Cloud Storage", inputs: 1, outputs: 1 },
    { type: "network-content-delivery", label: "Content Delivery", inputs: 1, outputs: 1 },
    { type: "network-firewall-alt", label: "Firewall Alt", inputs: 1, outputs: 1 },
    { type: "network-server-rack", label: "Server Rack", inputs: 1, outputs: 1 },
    { type: "network-wireless-controller", label: "Wireless Controller", inputs: 1, outputs: 1 },
    { type: "network-unified-threat-management", label: "UTM", inputs: 1, outputs: 1 },
    { type: "network-virtual-machine", label: "Virtual Machine", inputs: 1, outputs: 1 },
    { type: "network-software-defined-network", label: "SDN", inputs: 1, outputs: 1 },
    { type: "network-function-virtualization", label: "NFV", inputs: 1, outputs: 1 },
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
    { type: "flow-server", label: "Server", inputs: 1, outputs: 1 },
  ],
  mcp: [
    { type: "mcp-glyph", label: "MCP Glyph", inputs: 2, outputs: 2 },
  ],
};
// small helper that returns a short explanation for a glyph type.
// you can expand this mapping or add `description` to individual stencil entries.
function getGlyphDescription(type: string, label?: string) {
  const map: Record<string, string> = {
    // flowchart examples
    "flow-start": "Start: entry point of the flowchart (no inputs, one output).",
    "flow-end": "End: termination point of the flowchart (one input, no outputs).",
    "flow-process": "Process: a step or action in the workflow.",
    "flow-decision": "Decision: branching point with Yes/No or True/False (two outputs).",
    "flow-io": "I/O: input or output operation (parallelogram).",
    "flow-database": "Database: stored data (cylindrical symbol).",
    "flow-display": "Display: output shown to user (curved bottom).",
    "flow-manual-input": "Manual Input: user-provided data (slanted top).",
    "flow-manual-operation": "Manual Operation: manual task (beveled shape).",
    "flow-connector": "Connector: flow connector, use for internal links.",
    "flow-on-page-connector": "On-Page Connector: small circle to connect flows on same page.",
    "flow-off-page-connector": "Off-Page Connector: denotes continuation on another page.",
    "flow-arrow": "Arrow: directional connector (use to show flow).",
    "flow-merge": "Merge: join multiple flows into one.",
    "flow-split": "Split: split one flow into multiple paths.",
    "flow-internal-storage": "Internal Storage: data stored within the program (rectangle with L-line).",
    // generic fallback
  };
  return map[type] ?? label ?? "Glyph";
}
type StencilType = keyof typeof STENCIL_GLYPHS;

export const Stencil: React.FC<{ stencilType: StencilType; onGlyphDragStart?: (type: string) => void }> = ({ stencilType, onGlyphDragStart }) => {
  const glyphs = STENCIL_GLYPHS[stencilType] || [];
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; text: string }>({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });
  const handleDragStart = (e: React.DragEvent, g: { type: string; inputs?: number; outputs?: number }) => {
    // put both a simple type and a JSON payload (includes ports) onto the drag data
    e.dataTransfer.setData("glyphType", g.type);
    try {
      const json = JSON.stringify({ type: g.type, inputs: g.inputs, outputs: g.outputs });
      e.dataTransfer.setData("glyphJSON", json);
      // Add text/plain for Safari compatibility
      e.dataTransfer.setData("text/plain", json);
    } catch (err) {
      // ignore
    }
    if (onGlyphDragStart) onGlyphDragStart(g.type);
  };
  const showTooltip = (e: React.MouseEvent, g: any) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.right + 8; // place tooltip to the right of glyph
    const y = rect.top;
    const text = g.description ?? getGlyphDescription(g.type, g.label);
    setTooltip({ visible: true, x, y, text });
  };

  const moveTooltip = (e: React.MouseEvent) => {
    // keep tooltip near mouse (small offset)
    setTooltip(t => ({ ...t, x: e.clientX + 12, y: e.clientY + 12 }));
  };

  const hideTooltip = () => setTooltip(t => ({ ...t, visible: false }));

  return (
    <div className="stencil">
      {glyphs.map(g => (
        <div
          key={g.type}
          draggable
          onDragStart={e => handleDragStart(e, g)}
          onMouseEnter={e => showTooltip(e, g)}
          onPointerMove={moveTooltip}
          onMouseLeave={hideTooltip}
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
      {tooltip.visible && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x,
            top: tooltip.y,
            background: "rgba(17,24,39,0.95)",
            color: "#fff",
            padding: "8px 10px",
            borderRadius: 6,
            maxWidth: 300,
            fontSize: 13,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 2000,
            pointerEvents: "none",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};
