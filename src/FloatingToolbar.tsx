import React from 'react';
import { Toolbar } from './Toolbar';
import type { StencilType } from './Toolbar';

interface FloatingToolbarProps {
  toolbarOpen: boolean;
  setToolbarOpen: (open: boolean) => void;
  toolbarPos: { x: number; y: number };
  setToolbarPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  draggingToolbar: boolean;
  setDraggingToolbar: React.Dispatch<React.SetStateAction<boolean>>;
  toolbarOrientation: 'vertical' | 'horizontal';
  setToolbarOrientation: React.Dispatch<React.SetStateAction<'vertical' | 'horizontal'>>;
  stencilType: StencilType;
  setStencilType: (type: StencilType) => void;
  connectionType: string;
  setConnectionType: (type: string) => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  toolbarOpen,
  setToolbarOpen,
  toolbarPos,
  setToolbarPos,
  draggingToolbar,
  setDraggingToolbar,
  toolbarOrientation,
  setToolbarOrientation,
  stencilType,
  setStencilType,
  connectionType,
  setConnectionType,
}) => {
  const [minimized, setMinimized] = React.useState(false);
  return (
    <>
      {toolbarOpen && (
        <div
          className={`workspace-toolbar workspace-toolbar--${toolbarOrientation}`}
          style={{
            position: 'absolute',
            left: toolbarPos.x,
            top: toolbarPos.y,
            zIndex: 20,
            cursor: draggingToolbar ? 'move' : 'default',
            userSelect: 'none',
          }}
        >
          {/* Drag handle */}
          <div
            style={{
              width: '100%',
              height: 22,
              cursor: 'grab',
              background: '#e0e7ef',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              marginBottom: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 8,
              paddingRight: 4,
              fontSize: 12,
              color: '#334155',
              fontWeight: 600,
              letterSpacing: 1,
              flexShrink: 0,
            }}
            onPointerDown={e => {
              // Don't drag when clicking the orientation button
              if ((e.target as HTMLElement).closest('button')) return;
              setDraggingToolbar(true);
              const startX = e.clientX;
              const startY = e.clientY;
              const origX = toolbarPos.x;
              const origY = toolbarPos.y;

              const handleMouseMove = (moveEvent: MouseEvent) => {
                setToolbarPos({
                  x: origX + (moveEvent.clientX - startX),
                  y: origY + (moveEvent.clientY - startY),
                });
              };
              const handleMouseUp = () => {
                setDraggingToolbar(false);
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
              };
              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <span>Toolbar</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Minimize / Expand */}
              <button
                title={minimized ? 'Expand toolbar' : 'Minimize toolbar'}
                onClick={() => setMinimized(m => !m)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '1px 3px',
                  borderRadius: 4,
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {minimized ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <polyline points="4 6 8 10 12 6" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <polyline points="4 10 8 6 12 10" />
                  </svg>
                )}
              </button>
              {/* Orientation toggle */}
              <button
                title={toolbarOrientation === 'vertical' ? 'Switch to horizontal' : 'Switch to vertical'}
                onClick={() =>
                  setToolbarOrientation(o => (o === 'vertical' ? 'horizontal' : 'vertical'))
                }
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '1px 3px',
                  borderRadius: 4,
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {toolbarOrientation === 'vertical' ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="3" width="4" height="10" rx="1" />
                    <rect x="6" y="3" width="4" height="10" rx="1" />
                    <rect x="11" y="3" width="4" height="10" rx="1" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="1" width="10" height="4" rx="1" />
                    <rect x="3" y="6" width="10" height="4" rx="1" />
                    <rect x="3" y="11" width="10" height="4" rx="1" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <Toolbar
            stencilType={stencilType}
            setStencilType={setStencilType}
            connectionType={connectionType}
            setConnectionType={setConnectionType}
            orientation={toolbarOrientation}
            minimized={minimized}
          />
        </div>
      )}

      {!toolbarOpen && (
        <button
          className="workspace-toolbar-fab"
          title="Show Toolbar"
          onClick={() => setToolbarOpen(true)}
        >
          <svg
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ pointerEvents: 'all', touchAction: 'none' }}
          >
            <rect x="6" y="12" width="16" height="4" rx="2" />
          </svg>
        </button>
      )}
    </>
  );
};
