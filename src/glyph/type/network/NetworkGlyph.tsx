// Thin dispatcher — edit themed sub-files to change glyph rendering.
import React from "react";
import { NetworkServer, NetworkSwitch, NetworkRouter, NetworkFirewall, NetworkPc, NetworkLaptop, NetworkPhone, NetworkTablet, NetworkPrinter } from "./NetworkDevices";
import { NetworkCloud, NetworkDatabase, NetworkWifi, NetworkHub, NetworkCable, NetworkBridge, NetworkAccessPoint, NetworkLoadBalancer, NetworkServerRack } from "./NetworkInfra";
import { NetworkGenerator, NetworkPdu, NetworkUps, NetworkAntenna, NetworkCctv } from "./NetworkPower";
import { NetworkVoipPhone, NetworkOpticalNetwork, NetworkSatellite, NetworkTerminal } from "./NetworkTelecom";
import { NetworkDns, NetworkDhcp, NetworkNat, NetworkProxy, NetworkIds, NetworkGateway, NetworkVpn } from "./NetworkServices";
import { NetworkQuantumComputer, NetworkEdgeDevice, NetworkVirtualMachine, NetworkIotDevice, NetworkCloudStorage, NetworkContentDelivery, NetworkSdn, NetworkUtm, NetworkWirelessController, NetworkFunctionVirtualization, NetworkFirewallAlt } from "./NetworkVirtual";

export const NetworkGlyph: React.FC<{ type: string; width?: number; height?: number }> = ({
  type,
  width = 100,
  height = 100,
}) => {
  const p = { width, height };
  switch (type) {
    case "network-server":           return <NetworkServer {...p} />;
    case "network-switch":           return <NetworkSwitch {...p} />;
    case "network-router":           return <NetworkRouter {...p} />;
    case "network-firewall":         return <NetworkFirewall {...p} />;
    case "network-pc":               return <NetworkPc {...p} />;
    case "network-laptop":           return <NetworkLaptop {...p} />;
    case "network-phone":            return <NetworkPhone {...p} />;
    case "network-tablet":           return <NetworkTablet {...p} />;
    case "network-printer":          return <NetworkPrinter {...p} />;
    case "network-cloud":            return <NetworkCloud {...p} />;
    case "network-database":         return <NetworkDatabase {...p} />;
    case "network-wifi":             return <NetworkWifi {...p} />;
    case "network-hub":              return <NetworkHub {...p} />;
    case "network-cable":            return <NetworkCable {...p} />;
    case "network-bridge":           return <NetworkBridge {...p} />;
    case "network-access-point":     return <NetworkAccessPoint {...p} />;
    case "network-load-balancer":    return <NetworkLoadBalancer {...p} />;
    case "network-server-rack":      return <NetworkServerRack {...p} />;
    case "network-generator":        return <NetworkGenerator {...p} />;
    case "network-pdu":              return <NetworkPdu {...p} />;
    case "network-ups":              return <NetworkUps {...p} />;
    case "network-antenna":          return <NetworkAntenna {...p} />;
    case "network-cctv":             return <NetworkCctv {...p} />;
    case "network-voip-phone":       return <NetworkVoipPhone {...p} />;
    case "network-optical-network":  return <NetworkOpticalNetwork {...p} />;
    case "network-satellite":        return <NetworkSatellite {...p} />;
    case "network-terminal":         return <NetworkTerminal {...p} />;
    case "network-dns":              return <NetworkDns {...p} />;
    case "network-dhcp":             return <NetworkDhcp {...p} />;
    case "network-nat":              return <NetworkNat {...p} />;
    case "network-proxy":            return <NetworkProxy {...p} />;
    case "network-ids":              return <NetworkIds {...p} />;
    case "network-gateway":          return <NetworkGateway {...p} />;
    case "network-vpn":              return <NetworkVpn {...p} />;
    case "network-quantum-computer":          return <NetworkQuantumComputer {...p} />;
    case "network-edge-device":               return <NetworkEdgeDevice {...p} />;
    case "network-virtual-machine":           return <NetworkVirtualMachine {...p} />;
    case "network-iot-device":                return <NetworkIotDevice {...p} />;
    case "network-cloud-storage":             return <NetworkCloudStorage {...p} />;
    case "network-content-delivery":          return <NetworkContentDelivery {...p} />;
    case "network-software-defined-network":  return <NetworkSdn {...p} />;
    case "network-unified-threat-management": return <NetworkUtm {...p} />;
    case "network-wireless-controller":       return <NetworkWirelessController {...p} />;
    case "network-function-virtualization":   return <NetworkFunctionVirtualization {...p} />;
    case "network-firewall-alt":              return <NetworkFirewallAlt {...p} />;
    default:
      return (
        <g>
          <rect x={(8 / 40) * width} y={(8 / 40) * height} width={(24 / 40) * width} height={(24 / 40) * height} fill="#eee" stroke="#222" />
        </g>
      );
  }
};
