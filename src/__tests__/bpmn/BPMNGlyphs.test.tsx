import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Events
import {
  BPMNStartEvent,
  BPMNEndEvent,
  BPMNIntermediateEvent,
  BPMNStartMessageEvent,
  BPMNEndMessageEvent,
  BPMNIntermediateTimerEvent,
  BPMNStartErrorEvent,
  BPMNStartSignalEvent,
} from "../../glyph/type/bpmn/BPMNEvents";

// Activities
import {
  BPMNTask,
  BPMNSubProcess,
  BPMNCallActivity,
  BPMNUserTask,
  BPMNServiceTask,
  BPMNSendTask,
  BPMNReceiveTask,
  BPMNScriptTask,
} from "../../glyph/type/bpmn/BPMNActivities";

// Gateways
import {
  BPMNExclusiveGateway,
  BPMNParallelGateway,
  BPMNInclusiveGateway,
  BPMNEventBasedGateway,
} from "../../glyph/type/bpmn/BPMNGateways";

// Data
import {
  BPMNDataObject,
  BPMNDataStore,
} from "../../glyph/type/bpmn/BPMNDataObjects";

// Swimlanes
import { BPMNPool, BPMNLane } from "../../glyph/type/bpmn/BPMNSwimlanes";

// Dispatcher
import { BPMNGlyph } from "../../glyph/type/bpmn/BPMNGlyph";

const renderInSvg = (ui: React.ReactElement) => render(<svg>{ui}</svg>);
const W = 60;
const H = 60;

// ─── BPMNEvents ───────────────────────────────────────────────────────────────
describe("BPMNStartEvent", () => {
  it("renders a single circle", () => {
    const { container } = renderInSvg(<BPMNStartEvent width={W} height={H} />);
    expect(container.querySelectorAll("circle")).toHaveLength(1);
  });

  it("has a green fill and stroke", () => {
    const { container } = renderInSvg(<BPMNStartEvent width={W} height={H} />);
    const c = container.querySelector("circle")!;
    expect(c.getAttribute("fill")).toBe("#bbf7d0");
    expect(c.getAttribute("stroke")).toBe("#16a34a");
  });

  it("centres the circle at width/2 × height/2", () => {
    const { container } = renderInSvg(<BPMNStartEvent width={80} height={60} />);
    const c = container.querySelector("circle")!;
    expect(parseFloat(c.getAttribute("cx")!)).toBeCloseTo(40);
    expect(parseFloat(c.getAttribute("cy")!)).toBeCloseTo(30);
  });
});

describe("BPMNEndEvent", () => {
  it("renders a single circle with red fill", () => {
    const { container } = renderInSvg(<BPMNEndEvent width={W} height={H} />);
    const c = container.querySelector("circle")!;
    expect(c.getAttribute("fill")).toBe("#fecaca");
    expect(c.getAttribute("stroke")).toBe("#dc2626");
  });

  it("has a thick stroke (3)", () => {
    const { container } = renderInSvg(<BPMNEndEvent width={W} height={H} />);
    expect(container.querySelector("circle")!.getAttribute("stroke-width")).toBe("3");
  });
});

describe("BPMNIntermediateEvent", () => {
  it("renders two concentric circles", () => {
    const { container } = renderInSvg(<BPMNIntermediateEvent width={W} height={H} />);
    expect(container.querySelectorAll("circle")).toHaveLength(2);
  });

  it("inner circle has no fill (none)", () => {
    const { container } = renderInSvg(<BPMNIntermediateEvent width={W} height={H} />);
    const circles = container.querySelectorAll("circle");
    expect(circles[1].getAttribute("fill")).toBe("none");
  });

  it("outer circle has a yellow fill", () => {
    const { container } = renderInSvg(<BPMNIntermediateEvent width={W} height={H} />);
    expect(container.querySelectorAll("circle")[0].getAttribute("fill")).toBe("#fef9c3");
  });
});

describe("BPMNStartMessageEvent", () => {
  it("renders a circle, a rect (envelope), and a polyline", () => {
    const { container } = renderInSvg(<BPMNStartMessageEvent width={W} height={H} />);
    expect(container.querySelector("circle")).toBeTruthy();
    expect(container.querySelector("rect")).toBeTruthy();
    expect(container.querySelector("polyline")).toBeTruthy();
  });

  it("envelope rect is white", () => {
    const { container } = renderInSvg(<BPMNStartMessageEvent width={W} height={H} />);
    expect(container.querySelector("rect")!.getAttribute("fill")).toBe("#fff");
  });
});

describe("BPMNEndMessageEvent", () => {
  it("renders circle, rect, and polyline", () => {
    const { container } = renderInSvg(<BPMNEndMessageEvent width={W} height={H} />);
    expect(container.querySelector("circle")).toBeTruthy();
    expect(container.querySelector("rect")).toBeTruthy();
    expect(container.querySelector("polyline")).toBeTruthy();
  });

  it("envelope rect is filled red (matches end colour)", () => {
    const { container } = renderInSvg(<BPMNEndMessageEvent width={W} height={H} />);
    expect(container.querySelector("rect")!.getAttribute("fill")).toBe("#dc2626");
  });
});

describe("BPMNIntermediateTimerEvent", () => {
  it("renders 3 circles (outer, inner, centre dot)", () => {
    const { container } = renderInSvg(<BPMNIntermediateTimerEvent width={W} height={H} />);
    expect(container.querySelectorAll("circle")).toHaveLength(3);
  });

  it("renders 2 clock-hand lines", () => {
    const { container } = renderInSvg(<BPMNIntermediateTimerEvent width={W} height={H} />);
    expect(container.querySelectorAll("line")).toHaveLength(2);
  });
});

describe("BPMNStartErrorEvent", () => {
  it("renders a circle and a polyline (lightning bolt)", () => {
    const { container } = renderInSvg(<BPMNStartErrorEvent width={W} height={H} />);
    expect(container.querySelector("circle")).toBeTruthy();
    expect(container.querySelector("polyline")).toBeTruthy();
  });

  it("lightning bolt has green stroke matching start event", () => {
    const { container } = renderInSvg(<BPMNStartErrorEvent width={W} height={H} />);
    expect(container.querySelector("polyline")!.getAttribute("stroke")).toBe("#16a34a");
  });
});

describe("BPMNStartSignalEvent", () => {
  it("renders a circle and a triangle polygon", () => {
    const { container } = renderInSvg(<BPMNStartSignalEvent width={W} height={H} />);
    expect(container.querySelector("circle")).toBeTruthy();
    expect(container.querySelector("polygon")).toBeTruthy();
  });
});

// ─── BPMNActivities ───────────────────────────────────────────────────────────
describe("BPMNTask", () => {
  it("renders a single rounded rect with blue fill", () => {
    const { container } = renderInSvg(<BPMNTask width={120} height={60} />);
    const rect = container.querySelector("rect")!;
    expect(rect.getAttribute("fill")).toBe("#dbeafe");
    expect(rect.getAttribute("stroke")).toBe("#1d4ed8");
  });
});

describe("BPMNSubProcess", () => {
  it("renders multiple rects (base + + marker)", () => {
    const { container } = renderInSvg(<BPMNSubProcess width={120} height={60} />);
    expect(container.querySelectorAll("rect").length).toBeGreaterThanOrEqual(2);
  });

  it("has a purple stroke on the base rect", () => {
    const { container } = renderInSvg(<BPMNSubProcess width={120} height={60} />);
    expect(container.querySelector("rect")!.getAttribute("stroke")).toBe("#7c3aed");
  });

  it("renders the + marker lines", () => {
    const { container } = renderInSvg(<BPMNSubProcess width={120} height={60} />);
    expect(container.querySelectorAll("line").length).toBeGreaterThanOrEqual(2);
  });
});

describe("BPMNCallActivity", () => {
  it("renders a rect with thick stroke (3) to indicate reusability", () => {
    const { container } = renderInSvg(<BPMNCallActivity width={120} height={60} />);
    const rect = container.querySelector("rect")!;
    expect(rect.getAttribute("stroke-width")).toBe("3");
    expect(rect.getAttribute("fill")).toBe("#dbeafe");
  });
});

describe("BPMNUserTask", () => {
  it("renders the base rect and a circle (person head)", () => {
    const { container } = renderInSvg(<BPMNUserTask width={120} height={60} />);
    expect(container.querySelector("rect")).toBeTruthy();
    expect(container.querySelector("circle")).toBeTruthy();
  });

  it("renders a path for the person body", () => {
    const { container } = renderInSvg(<BPMNUserTask width={120} height={60} />);
    expect(container.querySelector("path")).toBeTruthy();
  });
});

describe("BPMNServiceTask", () => {
  it("renders the base rect and gear circles", () => {
    const { container } = renderInSvg(<BPMNServiceTask width={120} height={60} />);
    // base rect + at least 2 gear circles
    expect(container.querySelector("rect")).toBeTruthy();
    expect(container.querySelectorAll("circle").length).toBeGreaterThanOrEqual(2);
  });

  it("renders 8 gear tick lines", () => {
    const { container } = renderInSvg(<BPMNServiceTask width={120} height={60} />);
    expect(container.querySelectorAll("line")).toHaveLength(8);
  });
});

describe("BPMNSendTask", () => {
  it("renders base rect, filled envelope rect, and polyline", () => {
    const { container } = renderInSvg(<BPMNSendTask width={120} height={60} />);
    expect(container.querySelectorAll("rect").length).toBeGreaterThanOrEqual(2);
    expect(container.querySelector("polyline")).toBeTruthy();
  });

  it("envelope rect is filled blue", () => {
    const { container } = renderInSvg(<BPMNSendTask width={120} height={60} />);
    const rects = container.querySelectorAll("rect");
    // second rect is the envelope
    expect(rects[1].getAttribute("fill")).toBe("#1d4ed8");
  });
});

describe("BPMNReceiveTask", () => {
  it("renders base rect, outline envelope rect, and polyline", () => {
    const { container } = renderInSvg(<BPMNReceiveTask width={120} height={60} />);
    expect(container.querySelectorAll("rect").length).toBeGreaterThanOrEqual(2);
    expect(container.querySelector("polyline")).toBeTruthy();
  });

  it("envelope rect is white (outlined, not filled)", () => {
    const { container } = renderInSvg(<BPMNReceiveTask width={120} height={60} />);
    const rects = container.querySelectorAll("rect");
    expect(rects[1].getAttribute("fill")).toBe("#fff");
  });
});

describe("BPMNScriptTask", () => {
  it("renders base rect, script lines, and a scroll path", () => {
    const { container } = renderInSvg(<BPMNScriptTask width={120} height={60} />);
    expect(container.querySelector("rect")).toBeTruthy();
    expect(container.querySelectorAll("line").length).toBeGreaterThanOrEqual(3);
    expect(container.querySelector("path")).toBeTruthy();
  });
});

// ─── BPMNGateways ────────────────────────────────────────────────────────────
describe("BPMNExclusiveGateway", () => {
  it("renders a diamond polygon", () => {
    const { container } = renderInSvg(<BPMNExclusiveGateway width={W} height={H} />);
    expect(container.querySelector("polygon")).toBeTruthy();
  });

  it("has a yellow fill on the diamond", () => {
    const { container } = renderInSvg(<BPMNExclusiveGateway width={W} height={H} />);
    expect(container.querySelector("polygon")!.getAttribute("fill")).toBe("#fef9c3");
  });

  it("renders 2 diagonal lines forming an X", () => {
    const { container } = renderInSvg(<BPMNExclusiveGateway width={W} height={H} />);
    expect(container.querySelectorAll("line")).toHaveLength(2);
  });
});

describe("BPMNParallelGateway", () => {
  it("renders a green diamond polygon", () => {
    const { container } = renderInSvg(<BPMNParallelGateway width={W} height={H} />);
    expect(container.querySelector("polygon")!.getAttribute("fill")).toBe("#bbf7d0");
  });

  it("renders 2 perpendicular lines forming a +", () => {
    const { container } = renderInSvg(<BPMNParallelGateway width={W} height={H} />);
    expect(container.querySelectorAll("line")).toHaveLength(2);
  });
});

describe("BPMNInclusiveGateway", () => {
  it("renders a blue diamond and an inner circle (O)", () => {
    const { container } = renderInSvg(<BPMNInclusiveGateway width={W} height={H} />);
    expect(container.querySelector("polygon")!.getAttribute("fill")).toBe("#dbeafe");
    expect(container.querySelector("circle")).toBeTruthy();
  });

  it("inner circle has no fill (outline only)", () => {
    const { container } = renderInSvg(<BPMNInclusiveGateway width={W} height={H} />);
    expect(container.querySelector("circle")!.getAttribute("fill")).toBe("none");
  });
});

describe("BPMNEventBasedGateway", () => {
  it("renders a diamond and 2 circles", () => {
    const { container } = renderInSvg(<BPMNEventBasedGateway width={W} height={H} />);
    expect(container.querySelector("polygon")).toBeTruthy();
    expect(container.querySelectorAll("circle")).toHaveLength(2);
  });

  it("renders 5 pentagon lines", () => {
    const { container } = renderInSvg(<BPMNEventBasedGateway width={W} height={H} />);
    expect(container.querySelectorAll("line")).toHaveLength(5);
  });
});

// ─── BPMNDataObjects ─────────────────────────────────────────────────────────
describe("BPMNDataObject", () => {
  it("renders a polygon (document body) and a polyline (folded corner)", () => {
    const { container } = renderInSvg(<BPMNDataObject width={50} height={70} />);
    expect(container.querySelector("polygon")).toBeTruthy();
    expect(container.querySelector("polyline")).toBeTruthy();
  });

  it("polygon has an orange stroke", () => {
    const { container } = renderInSvg(<BPMNDataObject width={50} height={70} />);
    expect(container.querySelector("polygon")!.getAttribute("stroke")).toBe("#ea580c");
  });
});

describe("BPMNDataStore", () => {
  it("renders 2 ellipses (top and bottom caps)", () => {
    const { container } = renderInSvg(<BPMNDataStore width={80} height={70} />);
    expect(container.querySelectorAll("ellipse")).toHaveLength(2);
  });

  it("renders a rect (cylinder body)", () => {
    const { container } = renderInSvg(<BPMNDataStore width={80} height={70} />);
    expect(container.querySelector("rect")).toBeTruthy();
  });

  it("renders 2 vertical side lines", () => {
    const { container } = renderInSvg(<BPMNDataStore width={80} height={70} />);
    expect(container.querySelectorAll("line")).toHaveLength(2);
  });

  it("has a dark stroke on the ellipses", () => {
    const { container } = renderInSvg(<BPMNDataStore width={80} height={70} />);
    expect(container.querySelector("ellipse")!.getAttribute("stroke")).toBe("#334155");
  });
});

// ─── BPMNSwimlanes ───────────────────────────────────────────────────────────
describe("BPMNPool", () => {
  it("renders 2 rects (outer body + header strip)", () => {
    const { container } = renderInSvg(
      <BPMNPool width={600} height={160} />
    );
    expect(container.querySelectorAll("rect")).toHaveLength(2);
  });

  it("header strip has a light-blue fill", () => {
    const { container } = renderInSvg(
      <BPMNPool width={600} height={160} />
    );
    const rects = container.querySelectorAll("rect");
    expect(rects[1].getAttribute("fill")).toBe("#bae6fd");
  });

  it("renders 4 resize handles when selected=true", () => {
    const { container } = renderInSvg(
      <BPMNPool width={600} height={160} selected />
    );
    expect(container.querySelectorAll("circle")).toHaveLength(4);
  });

  it("renders no resize handles when selected=false", () => {
    const { container } = renderInSvg(
      <BPMNPool width={600} height={160} selected={false} />
    );
    expect(container.querySelectorAll("circle")).toHaveLength(0);
  });

  it("calls onResize when a handle is pointer-dragged", () => {
    const onResize = vi.fn();
    const { container } = renderInSvg(
      <BPMNPool width={600} height={160} selected onResize={onResize} />
    );
    const handle = container.querySelectorAll("circle")[3]; // br
    (handle as SVGElement & { setPointerCapture: (id: number) => void }).setPointerCapture =
      vi.fn();
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 600, clientY: 160 });
    fireEvent.pointerMove(window, { pointerId: 1, clientX: 650, clientY: 200 });
    expect(onResize).toHaveBeenCalled();
  });
});

describe("BPMNLane", () => {
  it("renders 2 rects and 1 dashed divider line", () => {
    const { container } = renderInSvg(
      <BPMNLane width={600} height={80} />
    );
    expect(container.querySelectorAll("rect")).toHaveLength(2);
    expect(container.querySelectorAll("line")).toHaveLength(1);
  });

  it("label strip has a lighter blue than Pool", () => {
    const { container } = renderInSvg(
      <BPMNLane width={600} height={80} />
    );
    const rects = container.querySelectorAll("rect");
    expect(rects[1].getAttribute("fill")).toBe("#e0f2fe");
  });

  it("renders 4 resize handles when selected=true", () => {
    const { container } = renderInSvg(
      <BPMNLane width={600} height={80} selected />
    );
    expect(container.querySelectorAll("circle")).toHaveLength(4);
  });

  it("renders no resize handles when selected=false", () => {
    const { container } = renderInSvg(
      <BPMNLane width={600} height={80} selected={false} />
    );
    expect(container.querySelectorAll("circle")).toHaveLength(0);
  });
});

// ─── BPMNGlyph dispatcher ─────────────────────────────────────────────────────
describe("BPMNGlyph dispatcher", () => {
  it.each([
    "bpmn-start-event",
    "bpmn-end-event",
    "bpmn-intermediate-event",
    "bpmn-start-message",
    "bpmn-end-message",
    "bpmn-intermediate-timer",
    "bpmn-start-error",
    "bpmn-start-signal",
    "bpmn-task",
    "bpmn-subprocess",
    "bpmn-call-activity",
    "bpmn-user-task",
    "bpmn-service-task",
    "bpmn-send-task",
    "bpmn-receive-task",
    "bpmn-script-task",
    "bpmn-exclusive-gateway",
    "bpmn-parallel-gateway",
    "bpmn-inclusive-gateway",
    "bpmn-event-gateway",
    "bpmn-data-object",
    "bpmn-data-store",
    "bpmn-pool",
    "bpmn-lane",
  ])('renders something for type "%s"', (type) => {
    const { container } = renderInSvg(
      <BPMNGlyph type={type} width={60} height={60} />
    );
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("renders a fallback rect for an unknown type", () => {
    const { container } = renderInSvg(
      <BPMNGlyph type="unknown-type" width={60} height={60} />
    );
    const rect = container.querySelector("rect")!;
    expect(rect).toBeTruthy();
    expect(rect.getAttribute("fill")).toBe("#f0f9ff");
  });

  it("passes selected and onResize to BPMNPool", () => {
    const onResize = vi.fn();
    const { container } = renderInSvg(
      <BPMNGlyph type="bpmn-pool" width={600} height={160} selected onResize={onResize} />
    );
    // selected=true means 4 circle handles appear
    expect(container.querySelectorAll("circle")).toHaveLength(4);
  });

  it("passes selected and onResize to BPMNLane", () => {
    const { container } = renderInSvg(
      <BPMNGlyph type="bpmn-lane" width={600} height={80} selected />
    );
    expect(container.querySelectorAll("circle")).toHaveLength(4);
  });
});
