// Copyright (c) 2025 Vippul Pandit. All rights reserved.

import React, { useState } from "react";

const TABS = [
  { key: "diagram", label: "Diagram" },
  { key: "properties", label: "Properties" },
  { key: "history", label: "History" },
  // Add more tabs as needed
];

export const BottomTabs: React.FC<{
  onTabChange?: (tab: string) => void;
  children?: React.ReactNode[];
}> = ({ onTabChange, children }) => {
  const [activeTab, setActiveTab] = useState(TABS[0].key);

  const handleTabClick = (key: string) => {
    setActiveTab(key);
    if (onTabChange) onTabChange(key);
  };

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        background: "#f1f5f9",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            style={{
              flex: 1,
              padding: "12px 0",
              background: activeTab === tab.key ? "#e0e7ef" : "transparent",
              border: "none",
              borderBottom: activeTab === tab.key ? "3px solid #2563eb" : "3px solid transparent",
              color: activeTab === tab.key ? "#2563eb" : "#64748b",
              fontWeight: activeTab === tab.key ? 700 : 500,
              fontSize: 16,
              cursor: "pointer",
              transition: "background 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ minHeight: 120, padding: 16 }}>
        {children
          ? React.Children.toArray(children)[TABS.findIndex(t => t.key === activeTab)]
          : null}
      </div>
    </div>
  );
};