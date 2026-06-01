import React from "react";
import {
  CloudVm, CloudContainer, CloudFunction, CloudKubernetes,
  CloudObjectStorage, CloudBlockStorage, CloudDatabase, CloudCache,
  CloudVpc, CloudLoadBalancer, CloudCdn, CloudApiGateway,
  CloudIam, CloudFirewall, CloudWaf, CloudKms,
  CloudQueue, CloudEventBus, CloudMonitoring, CloudCicd,
} from "./CloudGlyphs";

interface Props {
  type: string;
  width?: number;
  height?: number;
}

export const CloudGlyph: React.FC<Props> = ({ type, width = 60, height = 60 }) => {
  switch (type) {
    case "cloud-vm":             return <CloudVm width={width} height={height} />;
    case "cloud-container":      return <CloudContainer width={width} height={height} />;
    case "cloud-function":       return <CloudFunction width={width} height={height} />;
    case "cloud-kubernetes":     return <CloudKubernetes width={width} height={height} />;
    case "cloud-object-storage": return <CloudObjectStorage width={width} height={height} />;
    case "cloud-block-storage":  return <CloudBlockStorage width={width} height={height} />;
    case "cloud-database":       return <CloudDatabase width={width} height={height} />;
    case "cloud-cache":          return <CloudCache width={width} height={height} />;
    case "cloud-vpc":            return <CloudVpc width={width} height={height} />;
    case "cloud-load-balancer":  return <CloudLoadBalancer width={width} height={height} />;
    case "cloud-cdn":            return <CloudCdn width={width} height={height} />;
    case "cloud-api-gateway":    return <CloudApiGateway width={width} height={height} />;
    case "cloud-iam":            return <CloudIam width={width} height={height} />;
    case "cloud-firewall":       return <CloudFirewall width={width} height={height} />;
    case "cloud-waf":            return <CloudWaf width={width} height={height} />;
    case "cloud-kms":            return <CloudKms width={width} height={height} />;
    case "cloud-queue":          return <CloudQueue width={width} height={height} />;
    case "cloud-event-bus":      return <CloudEventBus width={width} height={height} />;
    case "cloud-monitoring":     return <CloudMonitoring width={width} height={height} />;
    case "cloud-cicd":           return <CloudCicd width={width} height={height} />;
    default:                     return null;
  }
};
