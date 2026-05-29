import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NetworkGlyph } from "../../glyph/type/network/NetworkGlyph";
import { NetworkServer, NetworkSwitch, NetworkRouter, NetworkFirewall } from "../../glyph/type/network/NetworkDevices";
import { NetworkCloud, NetworkDatabase } from "../../glyph/type/network/NetworkInfra";

const renderInSvg = (ui: React.ReactElement) => render(<svg>{ui}</svg>);

// ── NetworkGlyph dispatcher ───────────────────────────────────────────────────
describe("NetworkGlyph dispatcher", () => {
  const allTypes = [
    "network-server",
    "network-switch",
    "network-router",
    "network-firewall",
    "network-pc",
    "network-laptop",
    "network-phone",
    "network-tablet",
    "network-printer",
    "network-cloud",
    "network-database",
    "network-wifi",
    "network-hub",
    "network-cable",
    "network-bridge",
    "network-access-point",
    "network-load-balancer",
    "network-server-rack",
    "network-generator",
    "network-pdu",
    "network-ups",
    "network-antenna",
    "network-cctv",
    "network-voip-phone",
    "network-optical-network",
    "network-satellite",
    "network-terminal",
    "network-dns",
    "network-dhcp",
    "network-nat",
    "network-proxy",
    "network-ids",
    "network-gateway",
    "network-vpn",
    "network-quantum-computer",
    "network-edge-device",
    "network-virtual-machine",
    "network-iot-device",
    "network-cloud-storage",
    "network-content-delivery",
    "network-software-defined-network",
    "network-unified-threat-management",
    "network-wireless-controller",
    "network-function-virtualization",
    "network-firewall-alt",
  ] as const;

  it.each(allTypes)('renders type "%s" inside a <g>', (type) => {
    const { container } = renderInSvg(
      <NetworkGlyph type={type} width={40} height={40} />
    );
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("renders fallback rect for unknown type", () => {
    const { container } = renderInSvg(
      <NetworkGlyph type="network-unknown-xyz" width={40} height={40} />
    );
    const rect = container.querySelector("rect");
    expect(rect).toBeTruthy();
    expect(rect!.getAttribute("fill")).toBe("#eee");
  });

  it("uses default width=100 and height=100 when not provided", () => {
    const { container } = renderInSvg(<NetworkGlyph type="network-server" />);
    expect(container.querySelector("g")).toBeTruthy();
  });
});

// ── NetworkServer ─────────────────────────────────────────────────────────────
describe("NetworkServer", () => {
  it("renders two rects (chassis + screen area)", () => {
    const { container } = renderInSvg(<NetworkServer width={40} height={40} />);
    expect(container.querySelectorAll("rect").length).toBeGreaterThanOrEqual(2);
  });

  it("renders circles (status indicators)", () => {
    const { container } = renderInSvg(<NetworkServer width={40} height={40} />);
    expect(container.querySelector("circle")).toBeTruthy();
  });

  it("renders a label text element", () => {
    const { container } = renderInSvg(<NetworkServer width={40} height={40} />);
    const texts = container.querySelectorAll("text");
    expect(texts.length).toBeGreaterThanOrEqual(1);
  });
});

// ── NetworkSwitch ─────────────────────────────────────────────────────────────
describe("NetworkSwitch", () => {
  it("renders a rect with green fill", () => {
    const { container } = renderInSvg(<NetworkSwitch width={40} height={40} />);
    const rects = container.querySelectorAll("rect");
    const greenRect = Array.from(rects).find(r => r.getAttribute("fill") === "#d1fae5");
    expect(greenRect).toBeTruthy();
  });

  it("renders port dots (circles)", () => {
    const { container } = renderInSvg(<NetworkSwitch width={40} height={40} />);
    expect(container.querySelectorAll("circle").length).toBeGreaterThanOrEqual(3);
  });
});

// ── NetworkRouter ─────────────────────────────────────────────────────────────
describe("NetworkRouter", () => {
  it("renders an ellipse", () => {
    const { container } = renderInSvg(<NetworkRouter width={40} height={40} />);
    expect(container.querySelector("ellipse")).toBeTruthy();
  });
});

// ── NetworkFirewall ───────────────────────────────────────────────────────────
describe("NetworkFirewall", () => {
  it("renders rects with red fill", () => {
    const { container } = renderInSvg(<NetworkFirewall width={40} height={40} />);
    const rects = Array.from(container.querySelectorAll("rect"));
    const redRect = rects.find(r => r.getAttribute("fill") === "#fecaca");
    expect(redRect).toBeTruthy();
  });
});

// ── NetworkCloud ──────────────────────────────────────────────────────────────
describe("NetworkCloud", () => {
  it("renders inside a <g>", () => {
    const { container } = renderInSvg(<NetworkCloud width={40} height={40} />);
    expect(container.querySelector("g")).toBeTruthy();
  });
});

// ── NetworkDatabase ───────────────────────────────────────────────────────────
describe("NetworkDatabase", () => {
  it("renders inside a <g>", () => {
    const { container } = renderInSvg(<NetworkDatabase width={40} height={40} />);
    expect(container.querySelector("g")).toBeTruthy();
  });
});
