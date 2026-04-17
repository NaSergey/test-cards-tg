import { useState, useEffect, useRef } from "react";
import { LayoutType } from "@/entities/block/model/types";

interface UseBlockEditorParams {
  text: string;
  initialLayout: LayoutType;
  onSave?: (text: string, layout: LayoutType) => void;
  onEditChange?: (editing: boolean) => void;
}

export function useBlockEditor({ text, initialLayout, onSave, onEditChange }: UseBlockEditorParams) {
  const [layout, setLayout] = useState<LayoutType>(initialLayout);
  const [savedLayout, setSavedLayout] = useState<LayoutType>(initialLayout);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingText, setEditingText] = useState(text);
  const [hasChanges, setHasChanges] = useState(false);
  const [layoutSelectorOpen, setLayoutSelectorOpen] = useState(false);

  // Ref pattern: avoid stale closure without adding unstable callback to deps
  const onEditChangeRef = useRef(onEditChange);
  onEditChangeRef.current = onEditChange;

  useEffect(() => {
    onEditChangeRef.current?.(menuOpen);
  }, [menuOpen]);

  // When menu opens, snapshot current state as the baseline to diff against
  useEffect(() => {
    if (menuOpen) {
      setEditingText(text);
      setSavedLayout(layout);
      setHasChanges(false);
    }
    // layout intentionally omitted: we don't reset hasChanges when layout prop changes mid-edit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen, text]);

  const handleTextChange = (newText: string) => {
    setEditingText(newText);
    setHasChanges(newText !== text || layout !== savedLayout);
  };

  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout);
    setHasChanges(newLayout !== savedLayout || editingText !== text);
    setLayoutSelectorOpen(false);
  };

  const handleCancel = () => {
    setEditingText(text);
    setLayout(savedLayout);
    setHasChanges(false);
    setMenuOpen(false);
  };

  const handleSave = () => {
    if (editingText.trim() && hasChanges) {
      onSave?.(editingText, layout);
      setHasChanges(false);
      setMenuOpen(false);
    }
  };

  return {
    layout,
    menuOpen,
    setMenuOpen,
    editingText,
    hasChanges,
    layoutSelectorOpen,
    setLayoutSelectorOpen,
    handleTextChange,
    handleLayoutChange,
    handleCancel,
    handleSave,
  };
}
