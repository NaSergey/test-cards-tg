"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CloseIcon from "@/shared/ui/icons/CloseIcon";
import ArrowUp from "@/shared/ui/icons/ArrowUp";
import LayoutText from "@/shared/ui/icons/LayoutText";
import LayoutHorizontal from "@/shared/ui/icons/LayoutHorizontal";
import LayoutVerticalTop from "@/shared/ui/icons/LayoutVerticalTop";
import LayoutVerticalBottom from "@/shared/ui/icons/LayoutVerticalBottom";
import LayoutSelector from "./LayoutSelector";
import { LayoutType, BlockMenuBarProps } from "@/entities/block/model/types";

const LAYOUT_ICONS: Record<LayoutType, ReactNode> = {
  text: <LayoutText />,
  horizontal: <LayoutHorizontal />,
  "vertical-top": <LayoutVerticalTop />,
  "vertical-bottom": <LayoutVerticalBottom />,
};

export default function BlockMenuBar({
  menuOpen,
  layoutSelectorOpen,
  layout,
  hasChanges,
  editingText,
  onCancel,
  onSave,
  onLayoutSelectorToggle,
  onLayoutChange,
}: BlockMenuBarProps) {
  return (
    <>
      <AnimatePresence mode="wait">
        {menuOpen && layoutSelectorOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute z-50 -top-10 left-1/2 -translate-x-1/2"
          >
            <LayoutSelector value={layout} onChange={onLayoutChange} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute w-full z-0 pointer-events-none">
        <div className="pointer-events-auto">
          <AnimatePresence mode="wait">
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 100, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden h-20 w-86.25 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] bg-white rounded-t-3xl"
              >
                <div className="flex items-center justify-between w-full p-4">
                  <button onClick={onCancel} className="p-2 cursor-pointer">
                    <CloseIcon />
                  </button>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={onLayoutSelectorToggle}
                      className="w-6 h-6 p-1 border border-gray-300 rounded flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      {LAYOUT_ICONS[layout]}
                    </button>
                    <button
                      onClick={onSave}
                      disabled={!editingText.trim()}
                      className={`cursor-pointer transition-colors ${!editingText.trim() ? "opacity-50" : ""}`}
                    >
                      <ArrowUp bgColor={hasChanges ? "#068DFB" : "#DCDCDC"} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
