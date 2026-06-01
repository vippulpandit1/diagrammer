import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

// Cloud glyph SVG components
import {
  CloudVm,
  CloudContainer,
  CloudFunction,
  CloudKubernetes,
} from "../../glyph/type/cloud/CloudComputeGlyphs";
import {
  CloudObjectStorage,
  CloudBlockStorage,
  CloudDatabase,
  CloudCache,
} from "../../glyph/type/cloud/CloudStorageGlyphs";
import {
  CloudVpc,
  CloudLoadBalancer,
  CloudCdn,
  CloudApiGateway,
} from "../../glyph/type/cloud/CloudNetworkGlyphs";
import {
  CloudIam,
  CloudFirewall,
  CloudWaf,
  CloudKms,
} from "../../glyph/type/cloud/CloudSecurityGlyphs";
import {
  CloudQueue,
  CloudEventBus,
  CloudMonitoring,
  CloudCicd,
} from "../../glyph/type/cloud/CloudServicesGlyphs";
import { CloudGlyph } from "../../glyph/type/cloud/CloudGlyph";

const renderInSvg = (ui: React.ReactElement) => render(<svg>{ui}</svg>);

// ─── Compute ──────────────────────────────────────────────────────────────────
describe("CloudComputeGlyphs", () => {
  it("CloudVm renders a <g> element", () => {
    const { container } = renderInSvg(<CloudVm width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudVm renders text label 'VM'", () => {
    const { container } = renderInSvg(<CloudVm width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    const labels = Array.from(texts).map((t) => t.textContent);
    expect(labels).toContain("VM");
  });

  it("CloudContainer renders a <g> element", () => {
    const { container } = renderInSvg(<CloudContainer width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudContainer renders text label 'Container'", () => {
    const { container } = renderInSvg(<CloudContainer width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    expect(Array.from(texts).map((t) => t.textContent)).toContain("Container");
  });

  it("CloudFunction renders a <g> element", () => {
    const { container } = renderInSvg(<CloudFunction width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudFunction renders text label 'Function'", () => {
    const { container } = renderInSvg(<CloudFunction width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    expect(Array.from(texts).map((t) => t.textContent)).toContain("Function");
  });

  it("CloudKubernetes renders a <g> element", () => {
    const { container } = renderInSvg(<CloudKubernetes width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudKubernetes renders text label 'Kubernetes'", () => {
    const { container } = renderInSvg(<CloudKubernetes width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    expect(Array.from(texts).map((t) => t.textContent)).toContain("Kubernetes");
  });
});

// ─── Storage ──────────────────────────────────────────────────────────────────
describe("CloudStorageGlyphs", () => {
  it("CloudObjectStorage renders a <g> element", () => {
    const { container } = renderInSvg(<CloudObjectStorage width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudObjectStorage renders text label 'Object Storage'", () => {
    const { container } = renderInSvg(<CloudObjectStorage width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    expect(Array.from(texts).map((t) => t.textContent)).toContain("Object Storage");
  });

  it("CloudBlockStorage renders a <g> element", () => {
    const { container } = renderInSvg(<CloudBlockStorage width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudBlockStorage renders text label 'Block Storage'", () => {
    const { container } = renderInSvg(<CloudBlockStorage width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    expect(Array.from(texts).map((t) => t.textContent)).toContain("Block Storage");
  });

  it("CloudDatabase renders a <g> element", () => {
    const { container } = renderInSvg(<CloudDatabase width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudDatabase renders text label 'Database'", () => {
    const { container } = renderInSvg(<CloudDatabase width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    expect(Array.from(texts).map((t) => t.textContent)).toContain("Database");
  });

  it("CloudCache renders a <g> element", () => {
    const { container } = renderInSvg(<CloudCache width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudCache renders text label 'Cache'", () => {
    const { container } = renderInSvg(<CloudCache width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    expect(Array.from(texts).map((t) => t.textContent)).toContain("Cache");
  });
});

// ─── Network ──────────────────────────────────────────────────────────────────
describe("CloudNetworkGlyphs", () => {
  it("CloudVpc renders a <g> element", () => {
    const { container } = renderInSvg(<CloudVpc width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudVpc renders text label 'VPC'", () => {
    const { container } = renderInSvg(<CloudVpc width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    expect(Array.from(texts).map((t) => t.textContent)).toContain("VPC");
  });

  it("CloudLoadBalancer renders a <g> element", () => {
    const { container } = renderInSvg(<CloudLoadBalancer width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudLoadBalancer renders text label 'Load Balancer'", () => {
    const { container } = renderInSvg(<CloudLoadBalancer width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    expect(Array.from(texts).map((t) => t.textContent)).toContain("Load Balancer");
  });

  it("CloudCdn renders a <g> element", () => {
    const { container } = renderInSvg(<CloudCdn width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudCdn renders text label 'CDN'", () => {
    const { container } = renderInSvg(<CloudCdn width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    expect(Array.from(texts).map((t) => t.textContent)).toContain("CDN");
  });

  it("CloudApiGateway renders a <g> element", () => {
    const { container } = renderInSvg(<CloudApiGateway width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudApiGateway renders text label 'API Gateway'", () => {
    const { container } = renderInSvg(<CloudApiGateway width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    expect(Array.from(texts).map((t) => t.textContent)).toContain("API Gateway");
  });
});

// ─── Security ─────────────────────────────────────────────────────────────────
describe("CloudSecurityGlyphs", () => {
  it("CloudIam renders a <g> element", () => {
    const { container } = renderInSvg(<CloudIam width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudIam renders text label 'IAM'", () => {
    const { container } = renderInSvg(<CloudIam width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    expect(Array.from(texts).map((t) => t.textContent)).toContain("IAM");
  });

  it("CloudFirewall renders a <g> element", () => {
    const { container } = renderInSvg(<CloudFirewall width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudFirewall renders text label 'Firewall'", () => {
    const { container } = renderInSvg(<CloudFirewall width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    expect(Array.from(texts).map((t) => t.textContent)).toContain("Firewall");
  });

  it("CloudWaf renders a <g> element", () => {
    const { container } = renderInSvg(<CloudWaf width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudWaf renders text label 'WAF'", () => {
    const { container } = renderInSvg(<CloudWaf width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    expect(Array.from(texts).map((t) => t.textContent)).toContain("WAF");
  });

  it("CloudKms renders a <g> element", () => {
    const { container } = renderInSvg(<CloudKms width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudKms renders text label 'KMS'", () => {
    const { container } = renderInSvg(<CloudKms width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    expect(Array.from(texts).map((t) => t.textContent)).toContain("KMS");
  });
});

// ─── Services ─────────────────────────────────────────────────────────────────
describe("CloudServicesGlyphs", () => {
  it("CloudQueue renders a <g> element", () => {
    const { container } = renderInSvg(<CloudQueue width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudQueue renders text label 'Queue'", () => {
    const { container } = renderInSvg(<CloudQueue width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    expect(Array.from(texts).map((t) => t.textContent)).toContain("Queue");
  });

  it("CloudEventBus renders a <g> element", () => {
    const { container } = renderInSvg(<CloudEventBus width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudEventBus renders text label 'Event Bus'", () => {
    const { container } = renderInSvg(<CloudEventBus width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    expect(Array.from(texts).map((t) => t.textContent)).toContain("Event Bus");
  });

  it("CloudMonitoring renders a <g> element", () => {
    const { container } = renderInSvg(<CloudMonitoring width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudMonitoring renders text label 'Monitoring'", () => {
    const { container } = renderInSvg(<CloudMonitoring width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    expect(Array.from(texts).map((t) => t.textContent)).toContain("Monitoring");
  });

  it("CloudCicd renders a <g> element", () => {
    const { container } = renderInSvg(<CloudCicd width={60} height={60} />);
    expect(container.querySelector("g")).toBeTruthy();
  });

  it("CloudCicd renders text label 'CI/CD'", () => {
    const { container } = renderInSvg(<CloudCicd width={60} height={60} />);
    const texts = container.querySelectorAll("text");
    expect(Array.from(texts).map((t) => t.textContent)).toContain("CI/CD");
  });
});

// ─── CloudGlyph dispatcher ────────────────────────────────────────────────────
describe("CloudGlyph dispatcher", () => {
  const allTypes = [
    "cloud-vm",
    "cloud-container",
    "cloud-function",
    "cloud-kubernetes",
    "cloud-object-storage",
    "cloud-block-storage",
    "cloud-database",
    "cloud-cache",
    "cloud-vpc",
    "cloud-load-balancer",
    "cloud-cdn",
    "cloud-api-gateway",
    "cloud-iam",
    "cloud-firewall",
    "cloud-waf",
    "cloud-kms",
    "cloud-queue",
    "cloud-event-bus",
    "cloud-monitoring",
    "cloud-cicd",
  ];

  allTypes.forEach((type) => {
    it(`renders a <g> for type="${type}"`, () => {
      const { container } = renderInSvg(
        <CloudGlyph type={type} width={60} height={60} />
      );
      expect(container.querySelector("g")).toBeTruthy();
    });
  });

  it("renders nothing for an unknown type", () => {
    const { container } = renderInSvg(
      <CloudGlyph type="cloud-unknown" width={60} height={60} />
    );
    // default case returns null — the svg wrapper contains only the svg element itself
    expect(container.querySelector("g")).toBeNull();
  });

  it("uses default width/height of 60 when not supplied", () => {
    // Just ensure it doesn't throw with defaults
    const { container } = renderInSvg(<CloudGlyph type="cloud-vm" />);
    expect(container.querySelector("g")).toBeTruthy();
  });
});
