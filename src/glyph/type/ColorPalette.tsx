import React, { useRef } from "react";

// Preset palette — 2 rows of 8
export const PRESET_COLORS: string[] = [
  "#ffffff", "#f1f5f9", "#e0e7ef", "#bae6fd", "#bbf7d0", "#fef9c3", "#fecaca", "#fde68a",
  "#38bdf8", "#4ade80", "#facc15", "#f87171", "#818cf8", "#f472b6", "#fb923c", "#222222",
];

export const TRANSPARENT = "none";

interface ColorPaletteProps {
  label: string;
  value: string | undefined;
  /** Called when user picks any color (preset, custom, or transparent). */
  onChange: (color: string) => void;
  /** Allow a "transparent/none" swatch. Defaults to false. */
  allowNone?: boolean;
}

const swatchSize = 22;
const swatchGap = 4;

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  label,
  value,
  onChange,
  allowNone = false,
}) => {
  const pickerRef = useRef<HTMLInputElement>(null);

  const active = value ?? "";

  return (
    <div style={{ marginBottom: "14px" }}>
      <label
        style={{
          display: "block",
          marginBottom: "6px",
          fontWeight: "bold",
          color: "#333",
          fontSize: "13px",
        }}
      >
        {label}
      </label>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: `${swatchGap}px`,
          alignItems: "center",
        }}
      >
        {/* "None / Transparent" swatch */}
        {allowNone && (
          <button
            title="None (transparent)"
            onClick={() => onChange(TRANSPARENT)}
            style={{
              width: swatchSize,
              height: swatchSize,
              borderRadius: "4px",
              border: active === TRANSPARENT ? "2px solid #2563eb" : "1px solid #ccc",
              cursor: "pointer",
              padding: 0,
              boxSizing: "border-box",
              background:
                "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 8px 8px",
              flexShrink: 0,
            }}
          />
        )}

        {/* Preset swatches */}
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            title={c}
            onClick={() => onChange(c)}
            style={{
              width: swatchSize,
              height: swatchSize,
              borderRadius: "4px",
              border: active === c ? "2px solid #2563eb" : "1px solid #ccc",
              background: c,
              cursor: "pointer",
              padding: 0,
              boxSizing: "border-box",
              flexShrink: 0,
              boxShadow: active === c ? "0 0 0 1px #93c5fd" : undefined,
            }}
          />
        ))}

        {/* Custom color picker trigger */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <button
            title="Custom color…"
            onClick={() => pickerRef.current?.click()}
            style={{
              width: swatchSize,
              height: swatchSize,
              borderRadius: "4px",
              border: "1px dashed #888",
              background:
                !PRESET_COLORS.includes(active) && active && active !== TRANSPARENT
                  ? active
                  : "linear-gradient(135deg, #f43f5e 25%, #8b5cf6 50%, #06b6d4 75%)",
              cursor: "pointer",
              padding: 0,
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          />
          <input
            ref={pickerRef}
            type="color"
            // Show current custom color if it's not a preset
            value={
              !PRESET_COLORS.includes(active) && active && active !== TRANSPARENT
                ? active
                : "#ffffff"
            }
            onChange={(e) => onChange(e.target.value)}
            style={{
              position: "absolute",
              opacity: 0,
              width: 1,
              height: 1,
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Current value chip */}
        {active && active !== TRANSPARENT && (
          <span
            style={{
              fontSize: "11px",
              color: "#6b7280",
              marginLeft: "2px",
              fontFamily: "monospace",
            }}
          >
            {active}
          </span>
        )}
      </div>
    </div>
  );
};
