import React from 'react';
import type { Page } from './glyph/Page';

interface PageTabsProps {
  pages: Page[];
  activePageIdx: number;
  panelHeight: number;
  editingPageIdx: number | null;
  editingPageName: string;
  onPageChange: (idx: number) => void;
  onAddPage: () => void;
  onEditPageNameChange: (name: string) => void;
  onStartEditPage: (idx: number, name: string) => void;
  onSaveEditPage: () => void;
  onEditPageKeyDown: (e: React.KeyboardEvent) => void;
}

export const PageTabs: React.FC<PageTabsProps> = ({
  pages,
  activePageIdx,
  panelHeight,
  editingPageIdx,
  editingPageName,
  onPageChange,
  onAddPage,
  onEditPageNameChange,
  onStartEditPage,
  onSaveEditPage,
  onEditPageKeyDown,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: panelHeight,
        background: '#f8fafc',
        borderTop: '1px solid #e6e9ee',
        borderBottom: '1px solid #e6e9ee',
        zIndex: 1201,
        display: 'flex',
        alignItems: 'center',
        height: 44,
        boxShadow: '0 -1px 4px rgba(16,24,40,0.03)',
      }}
    >
      {pages.map((page, idx) => (
        <div
          key={page.id}
          onClick={() => onPageChange(idx)}
          style={{
            padding: '0 32px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            background: idx === activePageIdx ? '#fff' : 'transparent',
            borderBottom: idx === activePageIdx ? '3px solid #2563eb' : '3px solid transparent',
            fontWeight: idx === activePageIdx ? 700 : 500,
            color: idx === activePageIdx ? '#2563eb' : '#64748b',
            fontSize: 16,
            letterSpacing: 0.2,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            marginRight: 4,
            marginLeft: idx === 0 ? 16 : 0,
            boxShadow: idx === activePageIdx ? '0 -2px 8px rgba(37,99,235,0.04)' : undefined,
            transition: 'background 0.18s, color 0.18s, border-bottom 0.18s',
            position: 'relative',
            userSelect: 'none',
          }}
          onDoubleClick={e => {
            e.stopPropagation();
            onStartEditPage(idx, page.name);
          }}
        >
          {editingPageIdx === idx ? (
            <input
              type="text"
              value={editingPageName}
              autoFocus
              onChange={e => onEditPageNameChange(e.target.value)}
              onBlur={onSaveEditPage}
              onKeyDown={onEditPageKeyDown}
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#2563eb',
                border: '1px solid #2563eb',
                borderRadius: 6,
                padding: '2px 8px',
                width: 120,
                margin: '0 -8px',
                background: '#fff',
              }}
            />
          ) : (
            <>
              {page.name}
              {idx === activePageIdx && (
                <span
                  style={{
                    position: 'absolute',
                    left: 8,
                    top: 8,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#2563eb22',
                    boxShadow: '0 0 0 2px #2563eb11',
                    display: 'inline-block',
                  }}
                />
              )}
            </>
          )}
        </div>
      ))}

      <button
        onClick={onAddPage}
        style={{
          marginLeft: 16,
          padding: '4px 12px',
          border: '1px solid #e5e7eb',
          borderRadius: 6,
          background: '#f1f5f9',
          cursor: 'pointer',
          fontSize: 15,
          color: '#2563eb',
        }}
      >
        ＋ Add Page
      </button>
    </div>
  );
};
