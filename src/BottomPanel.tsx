import React, { useState, useMemo } from "react";

interface BottomPanelProps {
  messages: string[];
  height?: number;
  onClear?: () => void;
  defaultCollapsed?: boolean;
  defaultSort?: "newest" | "oldest";
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
  messages,
  height = 96,
  onClear,
  defaultCollapsed = false,
  defaultSort = "newest",
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">(defaultSort);

  const msgCount = messages.length;
  const containerHeight = collapsed ? 36 : height;

  const headerTitle = `Messages (${msgCount})`;

  const displayedMessages = useMemo(() => {
    if (sortOrder === "newest") return [...messages].reverse();
    return messages.slice();
  }, [messages, sortOrder]);

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: containerHeight,
        background: "rgba(255,255,255,0.98)",
        borderTop: "1px solid #e6e9ee",
        boxShadow: "0 -2px 8px rgba(16,24,40,0.06)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1200,
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        transition: "height 180ms ease",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "6px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: collapsed ? "none" : "1px solid #f1f5f9",
          minHeight: 36,
        }}
      >
        <strong style={{ fontSize: 13, color: "#111827" }}>{headerTitle}</strong>
        <div style={{ flex: 1 }} />

        {/* sort toggle */}
        <button
          onClick={() => setSortOrder(o => (o === "newest" ? "oldest" : "newest"))}
          title={sortOrder === "newest" ? "Showing newest first — click to show oldest first" : "Showing oldest first — click to show newest first"}
          style={{
            background: "none",
            border: "1px solid #e5e7eb",
            padding: "6px 8px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 13,
            marginRight: 8,
            display: "flex",
            alignItems: "center",
          }}
        >
          {sortOrder === "newest" ? "Newest" : "Oldest"}
        </button>

        {!collapsed && onClear && (
          <button
            onClick={onClear}
            style={{
              background: "none",
              border: "1px solid #e5e7eb",
              padding: "6px 10px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 13,
              marginRight: 8,
            }}
          >
            Clear
          </button>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? "Expand messages panel" : "Collapse messages panel"}
          style={{
            background: "none",
            border: "1px solid #e5e7eb",
            padding: "6px 8px",
            borderRadius: 6,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 160ms ease",
          }}
        >
          <span style={{ display: "inline-block", transform: collapsed ? "rotate(0deg)" : "rotate(180deg)" }}>
            ▾
          </span>
        </button>
      </div>

      <div
        style={{
          overflowY: "auto",
          padding: "8px 12px",
          fontSize: 13,
          color: "#374151",
          flex: 1,
          display: collapsed ? "none" : "block",
        }}
      >
        {msgCount === 0 ? (
          <div style={{ opacity: 0.6 }}>No messages</div>
        ) : (
          displayedMessages.map((m, i) => (
            <div key={i} style={{ marginBottom: 6, lineHeight: 1.25 }}>
              {m}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BottomPanel;