// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React, { useRef } from "react";

type Props = {
  width: number;
  height: number;
  selected?: boolean;
  onResize?: (rect: { x: number; y: number; width: number; height: number }) => void;
};

const HANDLE_RADIUS = 6;

const sx = (n: number, w: number) => (n / 40) * w;
const sy = (n: number, h: number) => (n / 40) * h;

function useResizeHandles(
  width: number,
  height: number,
  onResize?: Props["onResize"]
) {
  const pointerIdRef = useRef<number | null>(null);

  const startDrag = (corner: "tl" | "tr" | "bl" | "br") => (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    pointerIdRef.current = e.pointerId;
    const startX = e.clientX;
    const startY = e.clientY;
    const startRect = { x: 0, y: 0, width, height };

    const onPointerMove = (ev: PointerEvent) => {
      if (pointerIdRef.current !== ev.pointerId && pointerIdRef.current != null) return;
      ev.preventDefault();
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const newRect = { ...startRect };

      if (corner === "tl") {
        newRect.x = ev.clientX;
        newRect.y = ev.clientY;
        newRect.width = startRect.width - dx;
        newRect.height = startRect.height - dy;
      } else if (corner === "tr") {
        newRect.x = startX - startRect.width;
        newRect.y = startY + dy;
        newRect.width = startRect.width + dx;
        newRect.height = startRect.height - dy;
      } else if (corner === "bl") {
        newRect.x = startX + dx;
        newRect.y = startY - startRect.height;
        newRect.width = startRect.width - dx;
        newRect.height = startRect.height + dy;
      } else if (corner === "br") {
        newRect.x = startX - startRect.width;
        newRect.y = startY - startRect.height;
        newRect.width = startRect.width + dx;
        newRect.height = startRect.height + dy;
      }

      newRect.width = Math.max(80, newRect.width);
      newRect.height = Math.max(40, newRect.height);

      onResize?.(newRect);
    };

    const onPointerUp = (upEv: PointerEvent) => {
      if (pointerIdRef.current !== upEv.pointerId && pointerIdRef.current != null) return;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      pointerIdRef.current = null;
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch { /* noop */ }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp, { once: true });
  };

  return startDrag;
}

export const BPMNPool: React.FC<Props> = ({ width, height, selected, onResize }) => {
  const startDrag = useResizeHandles(width, height, onResize);
  return (
  <g>
    <rect x={sx(2,width)} y={sy(2,height)} width={sx(36,width)} height={sy(36,height)}
      fill="#f0f9ff" stroke="#0369a1" strokeWidth={1.5} rx={2} />
    {/* header strip */}
    <rect x={sx(2,width)} y={sy(2,height)} width={sx(8,width)} height={sy(36,height)}
      fill="#bae6fd" stroke="#0369a1" strokeWidth={1.5} rx={2} />
    {selected && (
      <>
        <circle cx={0} cy={0} r={HANDLE_RADIUS} fill="#0369a1" style={{ cursor: "nwse-resize", touchAction: "none" }} onPointerDown={startDrag("tl")} />
        <circle cx={width} cy={0} r={HANDLE_RADIUS} fill="#0369a1" style={{ cursor: "nesw-resize", touchAction: "none" }} onPointerDown={startDrag("tr")} />
        <circle cx={0} cy={height} r={HANDLE_RADIUS} fill="#0369a1" style={{ cursor: "nesw-resize", touchAction: "none" }} onPointerDown={startDrag("bl")} />
        <circle cx={width} cy={height} r={HANDLE_RADIUS} fill="#0369a1" style={{ cursor: "nwse-resize", touchAction: "none" }} onPointerDown={startDrag("br")} />
      </>
    )}
  </g>
);
};

export const BPMNLane: React.FC<Props> = ({ width, height, selected, onResize }) => {
  const startDrag = useResizeHandles(width, height, onResize);
  return (
  <g>
    <rect x={sx(2,width)} y={sy(2,height)} width={sx(36,width)} height={sy(36,height)}
      fill="#f0f9ff" stroke="#0369a1" strokeWidth={1.5} rx={2} />
    {/* label strip */}
    <rect x={sx(2,width)} y={sy(2,height)} width={sx(8,width)} height={sy(36,height)}
      fill="#e0f2fe" stroke="#0369a1" strokeWidth={1} rx={2} />
    {/* divider */}
    <line x1={sx(2,width)} y1={sy(20,height)} x2={sx(38,width)} y2={sy(20,height)}
      stroke="#0369a1" strokeWidth={0.8} strokeDasharray="3,2" />
    {selected && (
      <>
        <circle cx={0} cy={0} r={HANDLE_RADIUS} fill="#0369a1" style={{ cursor: "nwse-resize", touchAction: "none" }} onPointerDown={startDrag("tl")} />
        <circle cx={width} cy={0} r={HANDLE_RADIUS} fill="#0369a1" style={{ cursor: "nesw-resize", touchAction: "none" }} onPointerDown={startDrag("tr")} />
        <circle cx={0} cy={height} r={HANDLE_RADIUS} fill="#0369a1" style={{ cursor: "nesw-resize", touchAction: "none" }} onPointerDown={startDrag("bl")} />
        <circle cx={width} cy={height} r={HANDLE_RADIUS} fill="#0369a1" style={{ cursor: "nwse-resize", touchAction: "none" }} onPointerDown={startDrag("br")} />
      </>
    )}
  </g>
  );
};
