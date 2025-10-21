import React from "react";
import { RectGlyph } from "./type/basic/RectGlyph";
import { CircleGlyph } from "./type/basic/CircleGlyph";
import { AndGateGlyph } from "./type/logic/AndGateGlyph";
import { OrGateGlyph } from "./type/logic/OrGateGlyph";
import { NotGateGlyph } from "./type/logic/NotGateGlyph";
import { MultiPortGlyph } from "./type/basic/MultiPortGlyph";
import { NandGateGlyph } from "./type/logic/NandGateGlyph";
import { NorGateGlyph } from "./type/logic/NorGateGlyph";
import { XorGateGlyph } from "./type/logic/XorGateGlyph";
import { XnorGateGlyph } from "./type/logic/XnorGateGlyph";
import { UMLClassGlyph } from "./type/uml/UMLClassGlyph";
import { UMLInterfaceGlyph } from "./type/uml/UMLInterfaceGlyph";
import { UMLAbstractGlyph } from "./type/uml/UMLAbstractGlyph";
import { UMLEnumGlyph } from "./type/uml/UMLEnumGlyph";
import { UMLPackageGlyph } from "./type/uml/UMLPackageGlyph";
import { UMLAssociationGlyph } from "./type/uml/UMLAssociationGlyph";
import { UMLInheritanceGlyph } from "./type/uml/UMLInheritanceGlyph";
import type { UMLAttr } from "./type/uml/UMLAttr";
import type { UMLMethod } from "./type/uml/UMLMethod";
import { DebugGlyph } from "./type/util/DebugGlyph";
import type { Glyph } from "./Glyph";
import { NetworkGlyph } from "./type/network/NetworkGlyph";
import { TextGlyph } from "./type/basic/TextGlyph";
import { FlowchartGlyph } from "./type/flowchart/FlowchartGlyph";
import ResizableRectangleGlyph from "./type/basic/ResizableRectangleGlyph";
import PngGlyph from "./type/basic/PngGlyph";
import iconPng from '../image/free-sample.png';
// import other glyphs as needed

export function GlyphRenderer({ type, width, height, label, orinLabel, isTruncated, attributes, methods, hasConnections, glyph, onResize }: { type: string; width: number; height?: number; label?: string; orinLabel?: string; isTruncated?: boolean; attributes?: UMLAttr[]; methods?: UMLMethod[]; hasConnections?: boolean, glyph?: Glyph, onResize?: (rect: { x: number; y: number; width: number; height: number }) => void }) {
  switch (type) {
    case "rect":
      return <RectGlyph size={width} />;
    case "circle":
      return <CircleGlyph size={width} />;
    case "resizable-rectangle":
      return <ResizableRectangleGlyph width={width} height={height ?? width} selected={true} onResize={onResize}/>;
    case "png-glyph":
      return <PngGlyph
          x={0}
          y={0}
          width={width}
          height={height ?? width}
          imageUrl={iconPng}
          selected={true}
        />;
    case "text":
      return (
        <TextGlyph
          label={label}
          width={width}
          height={height ?? 40}
          fontSize={glyph?.data?.fontSize}
          fontFamily={glyph?.data?.fontFamily}
          textColor={glyph?.data?.textColor}
        />
      );
    case "and":
      return <AndGateGlyph width={width} height={height} glyph={glyph}/>;
    case "or":
      return <OrGateGlyph width={width} height={height} />;
    case "not":
      return <NotGateGlyph width={width} height={height} />;
    case "multi":
      return <MultiPortGlyph size={width} />;
    case "nand":
      return <NandGateGlyph width={width} height={height} />;
    case "nor":
      return <NorGateGlyph width={width} height={height} />;
    case "xor":
      return <XorGateGlyph width={width} height={height} />;
    case "xnor":
      return <XnorGateGlyph width={width} height={height} />;
    case "uml-class":
      return <UMLClassGlyph width={width} height={height} label={label} orinLabel={orinLabel} isTruncated={isTruncated} attributes={attributes} methods={methods}/>;
    case "uml-interface":
      return <UMLInterfaceGlyph size={width} />;
    case "uml-abstract":
      return <UMLAbstractGlyph size={width} />;
    case "uml-enum":
      return <UMLEnumGlyph size={width} />;
    case "uml-package":
      return <UMLPackageGlyph size={width} />;
    case "uml-association":
      return <UMLAssociationGlyph size={width} />;
    case "uml-inheritance":
      return <UMLInheritanceGlyph size={width} />;
    case "debug":
      return <DebugGlyph size={width}  height={height} hasConnections={hasConnections} />;
    case "network-server":
      return <NetworkGlyph type="network-server" width={width} height={height}  />;
    case "network-switch":
      return <NetworkGlyph type="network-switch" width={width} height={height}  />;
    case "network-router":
      return <NetworkGlyph type="network-router" width={width} height={height}  />;
    case "network-firewall":
      return <NetworkGlyph type="network-firewall" width={width} height={height}  />;
    case "network-pc":
      return <NetworkGlyph type="network-pc" width={width} height={height}  />;
    case "network-cloud":
      return <NetworkGlyph type="network-cloud" width={width} height={height}  />;
    case "network-database":
      return <NetworkGlyph type="network-database" width={width} height={height}  />;
    case "network-laptop":
      return <NetworkGlyph type="network-laptop" width={width} height={height}  />;
    case "network-phone":
      return <NetworkGlyph type="network-phone" width={width} height={height}  />;
    case "network-tablet":
      return <NetworkGlyph type="network-tablet" width={width} height={height}  />;
    case "network-wifi":
      return <NetworkGlyph type="network-wifi" width={width} height={height}  />;
    case "network-printer":
      return <NetworkGlyph type="network-printer" width={width} height={height}  />;
    case "network-hub":
      return <NetworkGlyph type="network-hub" width={width} height={height}  />;
    case "network-cable":
      return <NetworkGlyph type="network-cable" width={width} height={height}  />;
    case "network-bridge":
      return <NetworkGlyph type="network-bridge" width={width} height={height}  />;
    case "flow-start":
    case "flow-end":
    case "flow-process":
    case "flow-io":
    case "flow-decision":
    case "flow-connector":
    case "flow-predefined-process":
    case "flow-document":
    case "flow-multi-document":
    case "flow-data":
    case "flow-database":
    case "flow-display":
    case "flow-terminator":
    case "flow-preparation":
    case "flow-on-page-connector":
    case "flow-off-page-connector":
    case "flow-card":
    case "flow-sorted-data":
    case "flow-collate":
    case "flow-summarize":
    case "flow-extract":
    case "flow-decision-alt":
    case "flow-delay":
    case "flow-arrow":
    case "flow-subroutine":
    case "flow-merge":
    case "flow-split":
    case "flow-manual-input":
    case "flow-manual-operation":
    case "flow-manual-loop":
    case "flow-loop-limit":
    case "flow-internal-storage":
    case "flow-server":
      return <FlowchartGlyph type={type} width={width} height={height} />;
    default:
      return null;
  }
}