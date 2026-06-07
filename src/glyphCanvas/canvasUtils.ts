// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import type { Glyph } from '../glyph/Glyph';

export const getConnectionPath = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  type: "bezier" | "manhattan" | "line" = "bezier"
): string => {
  if (type === "line") return `M${from.x},${from.y} L${to.x},${to.y}`;
  if (type === "manhattan") {
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);
    if (dx > dy) {
      const mx = (from.x + to.x) / 2;
      return `M${from.x},${from.y} L${mx},${from.y} L${mx},${to.y} L${to.x},${to.y}`;
    }
    const my = (from.y + to.y) / 2;
    return `M${from.x},${from.y} L${from.x},${my} L${to.x},${my} L${to.x},${to.y}`;
  }
  // Bezier curve
  const c1x = from.x + (to.x - from.x) * 0.3;
  const c1y = from.y;
  const c2x = to.x - (to.x - from.x) * 0.3;
  const c2y = to.y;
  return `M${from.x},${from.y} C${c1x},${c1y} ${c2x},${c2y} ${to.x},${to.y}`;
};

export const computeGlyphSize = (glyph: Glyph): { w: number; h: number } => {
  const defaultTileSize = 60;
  if (glyph.type === "text") {
    if (typeof glyph.width === "number" && typeof glyph.height === "number") {
      return { w: glyph.width, h: glyph.height };
    }
    const fontSize = glyph.data?.fontSize ?? 20;
    const label = glyph.label ?? "Text";
    const width = Math.max(60, label.length * (fontSize * 0.6) + 32);
    const height = Math.max(fontSize * 2, 40);
    return { w: width, h: height };
  }
  const labelWidth = Math.max(60, (glyph.label?.length ?? 0) * 10 + 32);
  const attrHeight = (glyph.attributes?.length ?? 0) * 18 + defaultTileSize;
  const w = Math.max(labelWidth, 100);
  const h = Math.max(attrHeight, 60);
  if (glyph.type === "resizable-rectangle") {
    return { w: glyph.width ?? 120, h: glyph.height ?? 80 };
  }
  if (typeof glyph.width === "number" && typeof glyph.height === "number") {
    return { w: glyph.width, h: glyph.height };
  }
  return { w, h };
};

export const getConnectors = (glyph: Glyph, width: number, height: number) => {
  const connectors: Array<{
    cx: number;
    cy: number;
    type: string;
    id: string;
    attrIdx?: number;
  }> = [];
  const numInputs = glyph.inputs ?? 2;
  const numOutputs = glyph.outputs ?? 1;

  let inputCount = 0;
  let outputCount = 0;
  for (let i = 0; i < glyph.ports?.length; i++) {
    const port = glyph.ports[i];
    if (port.type === "input") {
      connectors.push({
        cx: port.x !== undefined ? port.x : 0,
        cy: port.y !== undefined ? port.y : height * ((inputCount + 1) / (numInputs + 1)),
        type: "input",
        id: port.id ?? `input-${i + 1}`,
      });
      inputCount++;
    } else if (port.type === "output") {
      connectors.push({
        cx: port.x !== undefined ? port.x : width,
        cy: port.y !== undefined ? port.y : height * ((outputCount + 1) / (numOutputs + 1)),
        type: "output",
        id: port.id ?? `output-${i + 1}`,
      });
      outputCount++;
    }
  }
  // Attribute outbound connectors for self-defined attributes
  if (glyph.type === "uml-class" && Array.isArray(glyph.attributes)) {
    const LABEL_SECTION_HEIGHT = 25;
    const ATTR_START_Y = LABEL_SECTION_HEIGHT + 8;
    glyph.attributes.forEach((attr, i) => {
      if (attr.type === "self-defined") {
        connectors.push({
          cx: width,
          cy: ATTR_START_Y + i * 20 + 10,
          type: "attribute-outbound",
          attrIdx: i,
          id: `attr-outbound-${i}`,
        });
      }
    });
  }
  return connectors;
};

export const getConnectorPos = (
  glyph: Glyph,
  portId: string,
  width: number,
  height: number
): { x: number; y: number } => {
  const conns = getConnectors(glyph, width, height);
  const connector = conns.find(c => c.id === portId);
  if (!connector) {
    return { x: glyph.x, y: glyph.y };
  }
  return {
    x: glyph.x + connector.cx,
    y: glyph.y + connector.cy,
  };
};

/**
 * Snaps a point (rx, ry) expressed in glyph-local coordinates to the nearest
 * edge of the glyph rectangle (0,0) → (w,h).
 */
export const snapToPerimeter = (
  rx: number,
  ry: number,
  w: number,
  h: number
): { x: number; y: number } => {
  const cx = Math.max(0, Math.min(w, rx));
  const cy = Math.max(0, Math.min(h, ry));
  const dLeft = cx;
  const dRight = w - cx;
  const dTop = cy;
  const dBottom = h - cy;
  const minDist = Math.min(dLeft, dRight, dTop, dBottom);
  if (minDist === dLeft)   return { x: 0, y: cy };
  if (minDist === dRight)  return { x: w, y: cy };
  if (minDist === dTop)    return { x: cx, y: 0 };
  return { x: cx, y: h };
};

/** Minimum pixel distance between two ports on the perimeter. */
const PORT_MIN_DIST = 14;

/**
 * Returns true if the snapped position is too close to any other port
 * (excluding the port being dragged, identified by `draggingPortId`).
 */
export const portOccupied = (
  glyph: Glyph,
  candidate: { x: number; y: number },
  draggingPortId: string
): boolean => {
  return (glyph.ports ?? []).some(p => {
    if (p.id === draggingPortId) return false;
    const px = p.x ?? 0;
    const py = p.y ?? 0;
    const dist = Math.sqrt((px - candidate.x) ** 2 + (py - candidate.y) ** 2);
    return dist < PORT_MIN_DIST;
  });
};

export const getConnectionPathMulti = (
  from: { x: number; y: number },
  points: { x: number; y: number }[],
  to: { x: number; y: number },
  _type: "bezier" | "manhattan" | "line" = "bezier"
): string => {
  let path = `M${from.x},${from.y}`;
  points.forEach(pt => {
    path += ` L${pt.x},${pt.y}`;
  });
  path += ` L${to.x},${to.y}`;
  return path;
};

// ─── Connection crossing / hop utilities ─────────────────────────────────────

export type Pt = { x: number; y: number };

/**
 * Segment-segment intersection. Returns the intersection point or null.
 * Ignores intersections very close to segment endpoints (t/u within 2%).
 */
export function segmentIntersect(a1: Pt, a2: Pt, b1: Pt, b2: Pt): Pt | null {
  const d1x = a2.x - a1.x, d1y = a2.y - a1.y;
  const d2x = b2.x - b1.x, d2y = b2.y - b1.y;
  const cross = d1x * d2y - d1y * d2x;
  if (Math.abs(cross) < 1e-6) return null; // parallel / collinear
  const dx = b1.x - a1.x, dy = b1.y - a1.y;
  const t = (dx * d2y - dy * d2x) / cross;
  const u = (dx * d1y - dy * d1x) / cross;
  if (t <= 0.02 || t >= 0.98 || u <= 0.02 || u >= 0.98) return null;
  return { x: a1.x + t * d1x, y: a1.y + t * d1y };
}

/**
 * Linearise a connection's absolute path into a flat array of [p1, p2] segments.
 * For bezier, the curve is sampled at 20 steps per segment.
 */
export function getConnectionSegments(
  allAbsPoints: Pt[],
  connType: "bezier" | "manhattan" | "line"
): Array<[Pt, Pt, number]> { // [from, to, angle-of-from-segment]
  const segs: Array<[Pt, Pt, number]> = [];
  for (let i = 0; i < allAbsPoints.length - 1; i++) {
    const p1 = allAbsPoints[i];
    const p2 = allAbsPoints[i + 1];
    const push = (a: Pt, b: Pt) =>
      segs.push([a, b, Math.atan2(b.y - a.y, b.x - a.x)]);
    if (connType === "line") {
      push(p1, p2);
    } else if (connType === "manhattan") {
      const dx = Math.abs(p2.x - p1.x);
      const dy = Math.abs(p2.y - p1.y);
      if (dx > dy) {
        const mx = (p1.x + p2.x) / 2;
        push(p1, { x: mx, y: p1.y });
        push({ x: mx, y: p1.y }, { x: mx, y: p2.y });
        push({ x: mx, y: p2.y }, p2);
      } else {
        const my = (p1.y + p2.y) / 2;
        push(p1, { x: p1.x, y: my });
        push({ x: p1.x, y: my }, { x: p2.x, y: my });
        push({ x: p2.x, y: my }, p2);
      }
    } else {
      // Cubic bezier – sample 20 sub-segments
      const N = 20;
      const c1x = p1.x + (p2.x - p1.x) * 0.3;
      const c1y = p1.y;
      const c2x = p2.x - (p2.x - p1.x) * 0.3;
      const c2y = p2.y;
      let prev = p1;
      for (let k = 1; k <= N; k++) {
        const t = k / N, mt = 1 - t;
        const cur: Pt = {
          x: mt ** 3 * p1.x + 3 * mt * mt * t * c1x + 3 * mt * t * t * c2x + t ** 3 * p2.x,
          y: mt ** 3 * p1.y + 3 * mt * mt * t * c1y + 3 * mt * t * t * c2y + t ** 3 * p2.y,
        };
        push(prev, cur);
        prev = cur;
      }
    }
  }
  return segs;
}
