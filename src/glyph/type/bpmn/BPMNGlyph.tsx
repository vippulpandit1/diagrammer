// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React from "react";
import { BPMNStartEvent, BPMNEndEvent, BPMNIntermediateEvent, BPMNStartMessageEvent, BPMNEndMessageEvent, BPMNIntermediateTimerEvent, BPMNStartErrorEvent, BPMNStartSignalEvent } from "./BPMNEvents";
import { BPMNTask, BPMNSubProcess, BPMNCallActivity, BPMNUserTask, BPMNServiceTask, BPMNSendTask, BPMNReceiveTask, BPMNScriptTask } from "./BPMNActivities";
import { BPMNExclusiveGateway, BPMNParallelGateway, BPMNInclusiveGateway, BPMNEventBasedGateway } from "./BPMNGateways";
import { BPMNDataObject, BPMNDataStore } from "./BPMNDataObjects";
import { BPMNPool, BPMNLane } from "./BPMNSwimlanes";

export const BPMNGlyph: React.FC<{ type: string; width?: number; height?: number; selected?: boolean; onResize?: (rect: { x: number; y: number; width: number; height: number }) => void }> = ({
  type, width = 40, height = 40, selected, onResize,
}) => {
  const p = { width, height };
  switch (type) {
    // Events
    case "bpmn-start-event":           return <BPMNStartEvent {...p} />;
    case "bpmn-end-event":             return <BPMNEndEvent {...p} />;
    case "bpmn-intermediate-event":    return <BPMNIntermediateEvent {...p} />;
    case "bpmn-start-message":         return <BPMNStartMessageEvent {...p} />;
    case "bpmn-end-message":           return <BPMNEndMessageEvent {...p} />;
    case "bpmn-intermediate-timer":    return <BPMNIntermediateTimerEvent {...p} />;
    case "bpmn-start-error":           return <BPMNStartErrorEvent {...p} />;
    case "bpmn-start-signal":          return <BPMNStartSignalEvent {...p} />;
    // Activities
    case "bpmn-task":                  return <BPMNTask {...p} />;
    case "bpmn-subprocess":            return <BPMNSubProcess {...p} />;
    case "bpmn-call-activity":         return <BPMNCallActivity {...p} />;
    case "bpmn-user-task":             return <BPMNUserTask {...p} />;
    case "bpmn-service-task":          return <BPMNServiceTask {...p} />;
    case "bpmn-send-task":             return <BPMNSendTask {...p} />;
    case "bpmn-receive-task":          return <BPMNReceiveTask {...p} />;
    case "bpmn-script-task":           return <BPMNScriptTask {...p} />;
    // Gateways
    case "bpmn-exclusive-gateway":     return <BPMNExclusiveGateway {...p} />;
    case "bpmn-parallel-gateway":      return <BPMNParallelGateway {...p} />;
    case "bpmn-inclusive-gateway":     return <BPMNInclusiveGateway {...p} />;
    case "bpmn-event-gateway":         return <BPMNEventBasedGateway {...p} />;
    // Data
    case "bpmn-data-object":           return <BPMNDataObject {...p} />;
    case "bpmn-data-store":            return <BPMNDataStore {...p} />;
    // Swimlanes
    case "bpmn-pool":                  return <BPMNPool {...p} selected={selected} onResize={onResize} />;
    case "bpmn-lane":                  return <BPMNLane {...p} selected={selected} onResize={onResize} />;
    default:
      return <rect x={0} y={0} width={width} height={height} fill="#f0f9ff" stroke="#0369a1" strokeWidth={1.5} />;
  }
};
