import React from "react";
import { GlyphRenderer } from "./glyph/GlyphRenderer";

const STENCIL_GLYPHS = {
  basic: [
    { type: "rect", label: "Rectangle" },
    { type: "circle", label: "Circle" },
    { type: "multi", label: "Multi I/O" },
  ],
  logic: [
    { type: "and", label: "AND" },
    { type: "or", label: "OR" },
    { type: "not", label: "NOT" },
    { type: "nand", label: "NAND" },
    { type: "nor", label: "NOR" },
    { type: "xor", label: "XOR" },
    { type: "xnor", label: "XNOR" },
  ],
  uml: [
    { type: "uml-class", label: "Class" },
    { type: "uml-interface", label: "Interface" },
    { type: "uml-abstract", label: "Abstract Class" },
    { type: "uml-enum", label: "Enum" },
    { type: "uml-package", label: "Package" },
  ],
  debug: [
    { type: "debug", label: "Debug", inputs: 1, outputs: 1 }
  ],
};

type StencilType = keyof typeof STENCIL_GLYPHS;

export const Stencil: React.FC<{ stencilType: StencilType; onGlyphDragStart?: (type: string) => void }> = ({ stencilType, onGlyphDragStart }) => {
  const glyphs = STENCIL_GLYPHS[stencilType] || [];

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("glyphType", type);
    if (onGlyphDragStart) onGlyphDragStart(type);
  };

  return (
    <div className="stencil">
      {glyphs.map(g => (
        <div
          key={g.type}
          draggable
          onDragStart={e => handleDragStart(e, g.type)}
          className="stencil-glyph"
          title={g.label}
        >
          <svg width={50} height={50}>
            <GlyphRenderer type={g.type} size={40}/>
          </svg>
          <div style={{ fontSize: 12, textAlign: "center" }}>{g.label}</div>
        </div>
      ))}
    </div>
  );
};