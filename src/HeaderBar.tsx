// Copyright (c) 2025 Vippul Pandit. All rights reserved.
import React from "react";

interface HeaderBarProps {
  onClear: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSave: () => void;
  zoom: number;
  onAutoArrange: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ onClear, onZoomIn, onZoomOut, onSave, zoom, onAutoArrange }) => (
  <header className="workspace-header">
    <span className="workspace-title">Graphic Workspace</span>
    <div className="workspace-header-actions">
      <button title="Save" onClick={onSave}>
        {/* Save icon */}
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
          <polyline points="17 21 17 13 7 13 7 21"/>
          <polyline points="7 3 7 8 15 8"/>
        </svg>
      </button>
      <button title="Undo">
        {/* Undo icon */}
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 14H4v-5"/>
          <path d="M4 9a9 9 0 1 1 3 7.7"/>
        </svg>
      </button>
      <button title="Redo">
        {/* Redo icon */}
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 14h5v-5"/>
          <path d="M19 9a9 9 0 1 0-3 7.7"/>
        </svg>
      </button>
      <button title="Zoom Out" onClick={onZoomOut}>
        {/* Minus icon */}
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="5" y1="10" x2="15" y2="10"/>
        </svg>
      </button>
      <span style={{ minWidth: 38, textAlign: 'center', color: '#38bdf8', fontWeight: 600 }}>
        {(zoom * 100).toFixed(0)}%
      </span>
      <button title="Zoom In" onClick={onZoomIn}>
        {/* Plus icon */}
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="10" y1="5" x2="10" y2="15"/>
          <line x1="5" y1="10" x2="15" y2="10"/>
        </svg>
      </button>
      <button title="Auto-Arrange" onClick={onAutoArrange}>
        {/* Arrange icon */}
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="5" height="5"/><rect x="14" y="3" width="5" height="5"/>
            <rect x="3" y="14" width="5" height="5"/><rect x="14" y="14" width="5" height="5"/>
        </svg>
      </button>
      <button
        title="Clear Canvas"
        onClick={onClear}
      >
        {/* Trash icon */}
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
          <line x1="10" y1="11" x2="10" y2="17"/>
          <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
      </button>
    </div>
  </header>
);