import React, { useRef } from "react";

interface HeaderBarProps {
  onClearSession: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSave: () => void;
  zoom: number;
  onAutoArrange: () => void;
  onPrint: () => void;
  onImport: (json: string, fileName?: string) => void;
  autoSave: boolean;
  onAutoSaveToggle: (v: boolean) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onClearSession,
  onZoomIn,
  onZoomOut,
  onSave,
  zoom,
  onAutoArrange,
  onPrint,
  onImport,
  autoSave,
  onAutoSaveToggle,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === "string") onImport(text, file.name);
    };
    reader.readAsText(file);
    // reset so the same file can be re-imported
    e.target.value = "";
  };

  return (
  <header className="workspace-header">
    <span className="workspace-title">
      {/* App icon */}
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#38bdf8" strokeWidth="1.8">
        <rect x="2" y="2" width="7" height="7" rx="1.5"/>
        <rect x="13" y="2" width="7" height="7" rx="1.5"/>
        <rect x="2" y="13" width="7" height="7" rx="1.5"/>
        <rect x="13" y="13" width="7" height="7" rx="1.5"/>
      </svg>
      Graphic Workspace
    </span>

    <div className="workspace-header-actions">
      {/* Save */}
      <button title="Save" className="workspace-header-btn-primary" onClick={onSave} disabled={autoSave}>
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
          <polyline points="17 21 17 13 7 13 7 21"/>
          <polyline points="7 3 7 8 15 8"/>
        </svg>
      </button>

      {/* Clear Session */}
      <button title="Clear Session" onClick={onClearSession}>
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 19 6"/>
          <path d="M17 6v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
          <line x1="10" y1="11" x2="10" y2="16"/>
          <line x1="14" y1="11" x2="14" y2="16"/>
        </svg>
      </button>

      {/* Auto Save toggle */}
      <label
        title="Auto Save"
        style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontSize: 13, userSelect: 'none', color: autoSave ? '#38bdf8' : 'inherit' }}
      >
        <input
          type="checkbox"
          checked={autoSave}
          onChange={e => onAutoSaveToggle(e.target.checked)}
          style={{ accentColor: '#38bdf8', width: 14, height: 14, cursor: 'pointer' }}
        />
        Auto Save
      </label>

      <span className="workspace-header-divider" />

      {/* Undo / Redo */}
      <button title="Undo">
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 14H4v-5"/>
          <path d="M4 9a9 9 0 1 1 3 7.7"/>
        </svg>
      </button>
      <button title="Redo">
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 14h5v-5"/>
          <path d="M19 9a9 9 0 1 0-3 7.7"/>
        </svg>
      </button>

      <span className="workspace-header-divider" />

      {/* Zoom */}
      <button title="Zoom Out" onClick={onZoomOut}>
        <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="8.5" x2="13" y2="8.5"/>
        </svg>
      </button>
      <span className="workspace-zoom-badge">
        {(zoom * 100).toFixed(0)}%
      </span>
      <button title="Zoom In" onClick={onZoomIn}>
        <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8.5" y1="3" x2="8.5" y2="14"/>
          <line x1="3" y1="8.5" x2="14" y2="8.5"/>
        </svg>
      </button>

      <span className="workspace-header-divider" />

      {/* Auto-Arrange & Print */}
      <button title="Auto-Arrange" onClick={onAutoArrange}>
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="5" height="5" rx="1"/>
          <rect x="13" y="2" width="5" height="5" rx="1"/>
          <rect x="2" y="13" width="5" height="5" rx="1"/>
          <rect x="13" y="13" width="5" height="5" rx="1"/>
        </svg>
      </button>
      <button title="Print Canvas" onClick={onPrint}>
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9V2h10v7"/>
          <rect x="2" y="9" width="14" height="9" rx="1.5"/>
          <path d="M6 14h6"/>
        </svg>
      </button>

      <span className="workspace-header-divider" />

      {/* Import JSON */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button title="Import JSON" onClick={() => fileInputRef.current?.click()}>
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </button>

      <span className="workspace-header-divider" />

    </div>
  </header>
  );
};