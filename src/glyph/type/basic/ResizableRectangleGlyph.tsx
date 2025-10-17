// ...existing code...
import React, { useRef } from "react";

export interface ResizableRectangleGlyphProps {
  x: number;
  y: number;
  width: number;
  height: number;
  selected?: boolean;
  onResize?: (rect: { x: number; y: number; width: number; height: number }) => void;
}

const HANDLE_RADIUS = 6;

export const ResizableRectangleGlyph: React.FC<ResizableRectangleGlyphProps> = ({
  x,
  y,
  width,
  height,
  selected = true,
  onResize,
}) => {
  const pointerIdRef = useRef<number | null>(null);

  const startDrag = (corner: "tl" | "tr" | "bl" | "br") => (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    pointerIdRef.current = e.pointerId;
    const startX = e.clientX;
    const startY = e.clientY;
    const startRect = { x, y, width, height };

    const onPointerMove = (ev: PointerEvent) => {
      if (pointerIdRef.current !== (ev as any).pointerId && pointerIdRef.current != null) return;
      ev.preventDefault();
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      console.log("Dragging", dx, dy);
      let newRect = { ...startRect };

      if (corner === "tl") {
        newRect.x = startRect.x + dx;
        newRect.y = startRect.y + dy;
        newRect.width = startRect.width - dx;
        newRect.height = startRect.height - dy;
      } else if (corner === "tr") {
        newRect.y = startRect.y + dy;
        newRect.width = startRect.width + dx;
        newRect.height = startRect.height - dy;
      } else if (corner === "bl") {
        newRect.x = startRect.x + dx;
        newRect.width = startRect.width - dx;
        newRect.height = startRect.height + dy;
      } else if (corner === "br") {
        newRect.width = startRect.width + dx;
        newRect.height = startRect.height + dy;
      }

      newRect.width = Math.max(20, newRect.width);
      newRect.height = Math.max(20, newRect.height);

      onResize?.(newRect);
    };

    const onPointerUp = (upEv: PointerEvent) => {
      if (pointerIdRef.current !== (upEv as any).pointerId && pointerIdRef.current != null) return;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      pointerIdRef.current = null;
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {}
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp, { once: true });
  };

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#f1f5f9"
        stroke="#2563eb"
        strokeWidth={2}
        rx={6}
      />
      {selected && (
        <>
          <circle
            cx={x}
            cy={y}
            r={HANDLE_RADIUS}
            fill="#2563eb"
            style={{ cursor: "nwse-resize", touchAction: "none" }}
            onPointerDown={startDrag("tl")}
          />
          <circle
            cx={x + width}
            cy={y}
            r={HANDLE_RADIUS}
            fill="#2563eb"
            style={{ cursor: "nesw-resize", touchAction: "none" }}
            onPointerDown={startDrag("tr")}
          />
          <circle
            cx={x}
            cy={y + height}
            r={HANDLE_RADIUS}
            fill="#2563eb"
            style={{ cursor: "nesw-resize", touchAction: "none" }}
            onPointerDown={startDrag("bl")}
          />
          <circle
            cx={x + width}
            cy={y + height}
            r={HANDLE_RADIUS}
            fill="#2563eb"
            style={{ cursor: "nwse-resize", touchAction: "none" }}
            onPointerDown={startDrag("br")}
          />
        </>
      )}
    </g>
  );
};

export default ResizableRectangleGlyph;
// ...existing code...