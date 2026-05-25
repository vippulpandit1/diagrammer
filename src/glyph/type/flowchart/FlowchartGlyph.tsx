import React from "react";
import { FlowStart, FlowEnd, FlowProcess, FlowIo, FlowDecision, FlowAction } from "./FlowBasic";
import {
  FlowDocument, FlowMultiDocument, FlowData, FlowSortedData,
  FlowDatabase, FlowInternalStorage, FlowMagneticTape, FlowCard,
} from "./FlowDocument";
import { FlowSubroutine, FlowPredefinedProcess, FlowDelay, FlowPreparation, FlowDisplay, FlowCollate } from "./FlowProcess";
import { FlowManualInput, FlowManualOperation, FlowManualLoop, FlowLoopLimit, FlowMultiInput } from "./FlowManual";
import { FlowConnector, FlowOffPageConnector, FlowOnPageConnector, FlowOffPageConnectorAlt } from "./FlowConnector";
import { FlowMerge, FlowExtract, FlowSummarize, FlowDecisionAlt, FlowSplit, FlowArrow, FlowSentiment } from "./FlowControl";
import { FlowServer } from "./FlowMisc";

export const FlowchartGlyph: React.FC<{ type: string; width?: number; height?: number }> = ({
  type,
  width = 40,
  height = 40,
}) => {
  const p = { width, height };
  switch (type) {
    /* ── basic ── */
    case "flow-start":             return <FlowStart {...p} />;
    case "flow-end":               return <FlowEnd {...p} />;
    case "flow-process":           return <FlowProcess {...p} />;
    case "flow-io":                return <FlowIo {...p} />;
    case "flow-decision":          return <FlowDecision {...p} />;
    case "flow-action":            return <FlowAction {...p} />;
    /* ── document / data ── */
    case "flow-document":          return <FlowDocument {...p} />;
    case "flow-multidocument":
    case "flow-multi-document":    return <FlowMultiDocument {...p} />;
    case "flow-data":              return <FlowData {...p} />;
    case "flow-sorted-data":       return <FlowSortedData {...p} />;
    case "flow-database":          return <FlowDatabase {...p} />;
    case "flow-internal-storage":  return <FlowInternalStorage {...p} />;
    case "flow-magnetic-tape":     return <FlowMagneticTape {...p} />;
    case "flow-card":              return <FlowCard {...p} />;
    /* ── process ── */
    case "flow-subroutine":        return <FlowSubroutine {...p} />;
    case "flow-predefinedprocess":
    case "flow-predefined-process": return <FlowPredefinedProcess {...p} />;
    case "flow-delay":             return <FlowDelay {...p} />;
    case "flow-preparation":       return <FlowPreparation {...p} />;
    case "flow-display":           return <FlowDisplay {...p} />;
    case "flow-collate":           return <FlowCollate {...p} />;
    /* ── manual / loop ── */
    case "flow-manualinput":
    case "flow-manual-input":      return <FlowManualInput {...p} />;
    case "flow-manual-operation":  return <FlowManualOperation {...p} />;
    case "flow-manual-loop":       return <FlowManualLoop {...p} />;
    case "flow-loop-limit":        return <FlowLoopLimit {...p} />;
    case "flow-multiinput":        return <FlowMultiInput {...p} />;
    /* ── connectors ── */
    case "flow-connector":         return <FlowConnector {...p} />;
    case "flow-offpageconnector":  return <FlowOffPageConnector {...p} />;
    case "flow-on-page-connector": return <FlowOnPageConnector {...p} />;
    case "flow-off-page-connector": return <FlowOffPageConnectorAlt {...p} />;
    /* ── control flow ── */
    case "flow-merge":             return <FlowMerge {...p} />;
    case "flow-extract":           return <FlowExtract {...p} />;
    case "flow-summarize":         return <FlowSummarize {...p} />;
    case "flow-decision-alt":      return <FlowDecisionAlt {...p} />;
    case "flow-split":             return <FlowSplit {...p} />;
    case "flow-arrow":             return <FlowArrow {...p} />;
    case "flow-sentiment":         return <FlowSentiment {...p} />;
    /* ── misc ── */
    case "flow-server":            return <FlowServer {...p} />;
    /* ── fallback ── */
    default:
      return (
        <g>
          <rect x={8} y={8} width={24} height={24} fill="#eee" stroke="#222" />
        </g>
      );
  }
};
