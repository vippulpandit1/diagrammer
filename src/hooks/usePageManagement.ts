import { useState } from 'react';
import type { Page } from '../glyph/Page';

/**
 * Hook that manages page CRUD state and handlers
 * (add, rename, switch pages).
 */
export function usePageManagement(
  pages: Page[],
  setPages: React.Dispatch<React.SetStateAction<Page[]>>,
  setActivePageIdx: React.Dispatch<React.SetStateAction<number>>
) {
  const [editingPageIdx, setEditingPageIdx] = useState<number | null>(null);
  const [editingPageName, setEditingPageName] = useState('');

  const handleAddPage = () => {
    const newPage: Page = {
      id: `page-${Date.now()}`,
      name: `Page ${pages.length + 1}`,
      glyphs: [],
      connections: [],
    };
    setPages(prev => [...prev, newPage]);
    setActivePageIdx(pages.length); // new page sits at the old length index
  };

  const handleStartEditPage = (idx: number, name: string) => {
    setEditingPageIdx(idx);
    setEditingPageName(name);
  };

  const handleSaveEditPage = () => {
    if (editingPageIdx !== null && editingPageName.trim()) {
      setPages(prev =>
        prev.map((p, idx) =>
          idx === editingPageIdx ? { ...p, name: editingPageName } : p
        )
      );
    }
    setEditingPageIdx(null);
    setEditingPageName('');
  };

  const handleEditPageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveEditPage();
    if (e.key === 'Escape') {
      setEditingPageIdx(null);
      setEditingPageName('');
    }
  };

  return {
    editingPageIdx,
    editingPageName,
    setEditingPageName,
    handleAddPage,
    handleStartEditPage,
    handleSaveEditPage,
    handleEditPageKeyDown,
  };
}
