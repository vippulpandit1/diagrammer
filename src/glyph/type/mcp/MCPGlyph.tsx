import * as React from "react";
import type { JSX } from "react";

export interface MCPGlyph {
  id: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  label?: string;
  data?: Record<string, any>;
  groupId?: string;
  ports?: Array<{
    id: string;
    type: "input" | "output";
  }>;
  attributes?: Array<{
    name: string;
    type: string;
  }>;
  methods?: Array<{
    name: string;
    returnType: string;
  }>;

  // Methods
  onUpdate?: (id: string, updates: Partial<MCPGlyph>) => void;
  onRender?: () => JSX.Element;
}
