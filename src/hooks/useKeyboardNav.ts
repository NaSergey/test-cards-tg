import { useState, useEffect, useMemo } from "react";

interface UseKeyboardNavParams {
  columns: string[][];
  editingBlockId: string | number | null;
  toggleSelection: (id: string | number) => void;
}

export function useKeyboardNav({ columns, editingBlockId, toggleSelection }: UseKeyboardNavParams) {
  const [focusedBlockId, setFocusedBlockId] = useState<string | number | null>("preset-1");

  // Flat list only needed for dep tracking — not used directly inside effect
  const allBlockIds = useMemo(() => columns.flat(), [columns]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isInputFocused = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;
      if (editingBlockId || isInputFocused) return;

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const colIdx = columns.findIndex((col) => col.includes(focusedBlockId as string));
        if (colIdx === -1) return;
        const col = columns[colIdx];
        const rowIdx = col.indexOf(focusedBlockId as string);
        const nextRow = e.key === "ArrowUp" ? rowIdx - 1 : rowIdx + 1;
        if (nextRow >= 0 && nextRow < col.length) setFocusedBlockId(col[nextRow]);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const colIdx = columns.findIndex((col) => col.includes(focusedBlockId as string));
        if (colIdx === -1) return;
        const rowIdx = columns[colIdx].indexOf(focusedBlockId as string);
        const nextCol = e.key === "ArrowLeft" ? colIdx - 1 : colIdx + 1;
        if (nextCol >= 0 && nextCol < columns.length) {
          setFocusedBlockId(columns[nextCol][Math.min(rowIdx, columns[nextCol].length - 1)]);
        }
      } else if (e.key === " ") {
        e.preventDefault();
        if (focusedBlockId) toggleSelection(focusedBlockId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedBlockId, allBlockIds, editingBlockId, columns, toggleSelection]);

  return { focusedBlockId, setFocusedBlockId };
}
