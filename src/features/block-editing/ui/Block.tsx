"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import ThreeDots from "@/shared/ui/icons/ThreeDots";
import { useBadgeOverlap } from "@/shared/lib/hooks/useBadgeOverlap";
import { BlockProps } from "@/entities/block/model/types";
import { LAYOUT_CONFIG, getWrapperClass } from "@/entities/block/model/layoutConfig";
import { Badge } from "@/entities/block";
import { useBlockEditor } from "../model/useBlockEditor";
import BlockMenuBar from "./BlockMenuBar";
import BlockContent from "./BlockContent";

export default function Block({
  text,
  imageSrc,
  count,
  countActive = false,
  initialLayout = "text",
  onSave,
  isFocused = false,
  isSelected = false,
  onFocus,
  onSelectToggle,
  onEditChange,
}: BlockProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
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
  } = useBlockEditor({ text, initialLayout, onSave, onEditChange });

  const badgeVisible = count !== undefined && count > 0;
  const badgeOnImage = layout === "vertical-bottom";

  const { textRef, endRef, badgeRef, extraBottomPad, isMultiLine, isManyLines } =
    useBadgeOverlap(menuOpen ? editingText : text, badgeVisible && !badgeOnImage, `${layout}:${menuOpen}`);

  const borderClass = (menuOpen || isFocused) ? "border-[#229CFD]" : "border-gray-100";
  const shadowClass = !menuOpen && isSelected
    ? "shadow-[0px_1px_8px_0px_#149DFF36]"
    : "shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)]";
  const bgColor = !menuOpen && isSelected ? "#F1F6FD" : "white";

  const { dotsClass, textSectionRounded, imageRounded } = LAYOUT_CONFIG[layout];
  const wrapperClass = getWrapperClass(layout, shadowClass, borderClass, isMultiLine);

  const badgeLabel = countActive ? `+${count}` : String(count ?? "");
  const badgeVariant = badgeOnImage
    ? (countActive ? "active" : "blur")
    : (countActive ? "active" : "border");

  return (
    <div className="relative flex flex-col items-center gap-2">
      <BlockMenuBar
        menuOpen={menuOpen}
        layoutSelectorOpen={layoutSelectorOpen}
        layout={layout}
        hasChanges={hasChanges}
        editingText={editingText}
        onCancel={handleCancel}
        onSave={handleSave}
        onLayoutSelectorToggle={() => setLayoutSelectorOpen(!layoutSelectorOpen)}
        onLayoutChange={handleLayoutChange}
      />

      <motion.div
        className={`${wrapperClass} relative z-10 cursor-pointer`}
        style={{ backgroundColor: bgColor }}
        layout
        animate={{ marginTop: menuOpen ? "58px" : "0px" }}
        transition={{ duration: 0.3 }}
        onClick={() => onSelectToggle?.()}
        onMouseEnter={() => onFocus?.()}
      >
        <BlockContent
          layout={layout}
          textContentProps={{ menuOpen, editingText, text, textRef, endRef, textareaRef, onChange: handleTextChange, extraBottomPad }}
          imageSrc={imageSrc}
          isManyLines={isManyLines}
          textSectionRounded={textSectionRounded}
          imageRounded={imageRounded}
          bgColor={bgColor}
        />

        {!menuOpen && (
          <button
            className={`cursor-pointer py-3 ${dotsClass}`}
            onClick={(e) => { e.stopPropagation(); setMenuOpen(true); }}
          >
            <ThreeDots white={layout === "vertical-top"} />
          </button>
        )}

        {badgeVisible && !menuOpen && (
          <Badge ref={badgeRef} variant={badgeVariant} className="absolute bottom-2.5 right-2.5">
            {badgeLabel}
          </Badge>
        )}
      </motion.div>
    </div>
  );
}
