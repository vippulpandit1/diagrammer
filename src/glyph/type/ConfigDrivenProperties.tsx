// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React from "react";
import type { Glyph } from "../Glyph";

// ── Field schema ──────────────────────────────────────────────────────────────

export type PropertyFieldType =
  | "text"
  | "number"
  | "color"
  | "select"
  | "checkbox"
  | "textarea";

export interface SelectOption {
  label: string;
  value: string;
}

export interface PropertyFieldConfig {
  /** Key within `glyph.data` where the value is stored/read. */
  key: string;
  /** Human-readable label shown in the panel. */
  label: string;
  type: PropertyFieldType;
  defaultValue?: string | number | boolean;
  /** Options list — required when `type === "select"`. */
  options?: SelectOption[];
  /** Inclusive minimum — applies to `type === "number"`. */
  min?: number;
  /** Inclusive maximum — applies to `type === "number"`. */
  max?: number;
  /** Step increment — applies to `type === "number"`. */
  step?: number;
  placeholder?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ConfigDrivenPropertiesProps {
  glyph: Glyph;
  fields: PropertyFieldConfig[];
  onUpdate: (glyph: Glyph) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box",
  fontSize: "14px",
};

export const ConfigDrivenProperties: React.FC<ConfigDrivenPropertiesProps> = ({
  glyph,
  fields,
  onUpdate,
}) => {
  const handleChange = (key: string, value: string | number | boolean) => {
    onUpdate({ ...glyph, data: { ...glyph.data, [key]: value } } as Glyph);
  };

  return (
    <div style={{ padding: "8px" }}>
      {fields.map((field) => {
        const raw = glyph.data?.[field.key];
        const value = raw !== undefined && raw !== null ? raw : (field.defaultValue ?? "");

        return (
          <div key={field.key} style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "bold",
                color: "#333",
                fontSize: "13px",
              }}
            >
              {field.label}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                style={inputStyle}
                value={String(value)}
                placeholder={field.placeholder}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            )}

            {field.type === "number" && (
              <input
                type="number"
                min={field.min}
                max={field.max}
                step={field.step ?? 1}
                style={inputStyle}
                value={Number(value)}
                placeholder={field.placeholder}
                onChange={(e) =>
                  handleChange(field.key, parseFloat(e.target.value) || 0)
                }
              />
            )}

            {field.type === "color" && (
              <input
                type="color"
                style={{ ...inputStyle, padding: "4px", height: "38px" }}
                value={String(value)}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            )}

            {field.type === "checkbox" && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  checked={Boolean(value)}
                  onChange={(e) => handleChange(field.key, e.target.checked)}
                />
                <span style={{ fontSize: "13px", color: "#555" }}>
                  {field.placeholder ?? ""}
                </span>
              </div>
            )}

            {field.type === "select" && (
              <select
                style={inputStyle}
                value={String(value)}
                onChange={(e) => handleChange(field.key, e.target.value)}
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === "textarea" && (
              <textarea
                style={{ ...inputStyle, resize: "vertical" }}
                value={String(value)}
                placeholder={field.placeholder}
                rows={3}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
