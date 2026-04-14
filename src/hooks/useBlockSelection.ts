import { useState, useCallback } from "react";

export function useBlockSelection() {
  const [selectedBlockIds, setSelectedBlockIds] = useState<Set<string | number>>(new Set());

  const toggleSelection = useCallback((id: string | number) => {
    setSelectedBlockIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return { selectedBlockIds, toggleSelection };
}
