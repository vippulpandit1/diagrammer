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
    case "network-access-point":
      return <NetworkGlyph type="network-access-point" width={width} height={height}  />;
    case "network-vpn":
      return <NetworkGlyph type="network-vpn" width={width} height={height}  />;
    case "network-load-balancer":
      return <NetworkGlyph type="network-load-balancer" width={width} height={height}  />;
    case "network-modem":
      return <NetworkGlyph type="network-modem" width={width} height={height}  />;
    case "network-bridge-router":
      return <NetworkGlyph type="network-bridge-router" width={width} height={height}  />;
    case "network-fiber-optic":
      return <NetworkGlyph type="network-fiber-optic" width={width} height={height}  />;
    case "network-satellite":
      return <NetworkGlyph type="network-satellite" width={width} height={height}  />;
    case "network-server-rack":
      return <NetworkGlyph type="network-server-rack" width={width} height={height}  />;
    case "network-mainframe":
      return <NetworkGlyph type="network-mainframe" width={width} height={height}  />;
    case "network-terminal":
      return <NetworkGlyph type="network-terminal" width={width} height={height}  />;
    case "network-virtual-machine":
      return <NetworkGlyph type="network-virtual-machine" width={width} height={height}  />;
    case "network-cloud-storage":
      return <NetworkGlyph type="network-cloud-storage" width={width} height={height}  />;
    case "network-edge-device":
      return <NetworkGlyph type="network-edge-device" width={width} height={height}  />;
    case "network-iot-device":
      return <NetworkGlyph type="network-iot-device" width={width} height={height}  />;
    case "network-security-camera":
      return <NetworkGlyph type="network-security-camera" width={width} height={height}  />;
    case "network-voip-phone":
      return <NetworkGlyph type="network-voip-phone" width={width} height={height}  />;
    case "network-smart-tv":
      return <NetworkGlyph type="network-smart-tv" width={width} height={height}  />;
    case "network-gateway":
      return <NetworkGlyph type="network-gateway" width={width} height={height}  />;
    case "network-proxy":
      return <NetworkGlyph type="network-proxy" width={width} height={height}  />;
    case "network-dmz":
      return <NetworkGlyph type="network-dmz" width={width} height={height}  />;
    case "network-internet":
      return <NetworkGlyph type="network-internet" width={width} height={height}  />;
    case "network-extranet":
      return <NetworkGlyph type="network-extranet" width={width} height={height}  />;
    case "network-intranet":
      return <NetworkGlyph type="network-intranet" width={width} height={height}  />;
    case "network-vlan":
      return <NetworkGlyph type="network-vlan" width={width} height={height}  />;
    case "network-subnet":
      return <NetworkGlyph type="network-subnet" width={width} height={height}  />;
    case "network-bastion-host":
      return <NetworkGlyph type="network-bastion-host" width={width} height={height}  />;
    case "network-cloud-compute":
      return <NetworkGlyph type="network-cloud-compute" width={width} height={height}  />;
    case "network-content-delivery":
      return <NetworkGlyph type="network-content-delivery" width={width} height={height}  />;
    case "network-dns":
      return <NetworkGlyph type="network-dns" width={width} height={height}  />;
    case "network-email-server":
      return <NetworkGlyph type="network-email-server" width={width} height={height}  />;
    case "network-web-server":
      return <NetworkGlyph type="network-web-server" width={width} height={height}  />;
    case "network-application-server":
      return <NetworkGlyph type="network-application-server" width={width} height={height}  />;
    case "network-file-server":
      return <NetworkGlyph type="network-file-server" width={width} height={height}  />;
    case "network-print-server":
      return <NetworkGlyph type="network-print-server" width={width} height={height}  />;
    case "network-dhcp":
      return <NetworkGlyph type="network-dhcp" width={width} height={height}  />;
    case "network-nat":
      return <NetworkGlyph type="network-nat" width={width} height={height}  />;
    case "network-load-balancing-cluster":
      return <NetworkGlyph type="network-load-balancing-cluster" width={width} height={height}  />;
    case "network-storage-area-network":
      return <NetworkGlyph type="network-storage-area-network" width={width} height={height}  />;
    case "network-virtual-private-cloud":
      return <NetworkGlyph type="network-virtual-private-cloud" width={width} height={height}  />;
    case "network-hybrid-cloud":
      return <NetworkGlyph type="network-hybrid-cloud" width={width} height={height}  />;
    case "network-edge-computing":
      return <NetworkGlyph type="network-edge-computing" width={width} height={height}  />;
    case "network-software-defined-network":
      return <NetworkGlyph type="network-software-defined-network" width={width} height={height}  />;
    case "network-network-function-virtualization":
      return <NetworkGlyph type="network-network-function-virtualization" width={width} height={height}  />;
    case "network-5g-tower":
      return <NetworkGlyph type="network-5g-tower" width={width} height={height}  />;
    case "network-sd-wan":
      return <NetworkGlyph type="network-sd-wan" width={width} height={height}  />;
    case "network-optical-network":
      return <NetworkGlyph type="network-optical-network" width={width} height={height}  />;
    case "network-quantum-computer":
      return <NetworkGlyph type="network-quantum-computer" width={width} height={height}  />;
    case "network-pdu":
      return <NetworkGlyph type="network-pdu" width={width} height={height}  />;
    case "network-kvm-switch":
      return <NetworkGlyph type="network-kvm-switch" width={width} height={height}  />;
    case "network-raspberry-pi":
      return <NetworkGlyph type="network-raspberry-pi" width={width} height={height}  />;
    case "network-nas":
      return <NetworkGlyph type="network-nas" width={width} height={height}  />;
    case "network-uninterruptible-power-supply":
      return <NetworkGlyph type="network-uninterruptible-power-supply" width={width} height={height}  />;
    case "network-ups":
      return <NetworkGlyph type="network-ups" width={width} height={height}  />;
    case "network-antenna":
      return <NetworkGlyph type="network-antenna" width={width} height={height}  />;
    case "network-satellite":
      return <NetworkGlyph type="network-satellite" width={width} height={height}  />;
    case "network-cctv":
      return <NetworkGlyph type="network-cctv" width={width} height={height}  />;
    case "network-ids":
      return <NetworkGlyph type="network-ids" width={width} height={height}  />;
    case "network-quantum-computer":
      return <NetworkGlyph type="network-quantum-computer" width={width} height={height}  />;
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