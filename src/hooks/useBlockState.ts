"use client";

import { useState } from "react";

interface BlockState {
  isFocused: boolean;
  isSelected: boolean;
}

export function useBlockState(initialFocused = false, initialSelected = false) {
  const [state, setState] = useState<BlockState>({
    isFocused: initialFocused,
    isSelected: initialSelected,
  });

  const setFocused = (value: boolean) => {
    setState((prev) => ({ ...prev, isFocused: value }));
  };

  const setSelected = (value: boolean) => {
    setState((prev) => ({ ...prev, isSelected: value }));
  };

  const toggleFocused = () => {
    setState((prev) => ({ ...prev, isFocused: !prev.isFocused }));
  };

  const toggleSelected = () => {
    setState((prev) => ({ ...prev, isSelected: !prev.isSelected }));
  };

  const getBlockClasses = (baseClass = "") => {
    let classes = baseClass;

    // Рамочка фокуса (focus border)
    if (state.isFocused) {
      classes += " ring-2 ring-[#068DFB] ring-offset-1";
    }

    // Голубая заливка при выделении (blue fill when selected)
    if (state.isSelected) {
      classes += " bg-[#068DFB]/10";
    }

    return classes;
  };

  return {
    isFocused: state.isFocused,
    isSelected: state.isSelected,
    setFocused,
    setSelected,
    toggleFocused,
    toggleSelected,
    getBlockClasses,
  };
}
