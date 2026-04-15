"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import ThreeDots from "../icon/ThreeDots";
import Badge from "../Badge";
import { useBadgeOverlap } from "../../hooks/useBadgeOverlap";
import { LayoutType } from "../LayoutSelector";
import { LAYOUT_CONFIG, getWrapperClass } from "./layoutConfig";
import BlockMenuBar from "./BlockMenuBar";
import BlockImage from "./BlockImage";
import TextContent from "./TextContent";
import { BlockProps } from "./types";

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
  const [layout, setLayout] = useState<LayoutType>(initialLayout);
  const [savedLayout, setSavedLayout] = useState<LayoutType>(initialLayout);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingText, setEditingText] = useState(text);
  const [hasChanges, setHasChanges] = useState(false);
  const [layoutSelectorOpen, setLayoutSelectorOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    onEditChange?.(menuOpen);
  }, [menuOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync editingText with the latest text prop when menu opens
  useEffect(() => {
    if (menuOpen) {
      // eslint-disable-next-line
      setEditingText(text);
      setSavedLayout(layout);
      setHasChanges(false);
    }
  }, [menuOpen, text]); // eslint-disable-line react-hooks/exhaustive-deps

  const isText       = layout === "text";
  const isHorizontal = layout === "horizontal";
  const isVertTop    = layout === "vertical-top";
  const isVertBottom = layout === "vertical-bottom";

  const badgeVisible = count !== undefined && count > 0;
  const badgeOnImage = isVertBottom;

  const { textRef, endRef, badgeRef, extraBottomPad, isMultiLine, isManyLines } =
    useBadgeOverlap(menuOpen ? editingText : text, badgeVisible && !badgeOnImage, `${layout}:${menuOpen}`);

  const badgeLabel   = countActive ? `+${count}` : String(count ?? "");
  const badgeVariant = badgeOnImage
    ? (countActive ? "active" : "blur")
    : (countActive ? "active" : "border");

  const borderClass = (menuOpen || isFocused) ? "border-[#229CFD]" : "border-gray-100";
  const shadowClass = !menuOpen && isSelected
    ? "shadow-[0px_1px_8px_0px_#149DFF36]"
    : "shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)]";
  const bgColor = !menuOpen && isSelected ? "#F1F6FD" : "white";

  const { dotsClass, textSectionRounded, imageRounded } = LAYOUT_CONFIG[layout];
  const wrapperClass = getWrapperClass(layout, shadowClass, borderClass, isMultiLine);

  const handleTextChange = (newText: string) => {
    setEditingText(newText);
    setHasChanges(newText !== text || layout !== savedLayout);
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

  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout);
    setHasChanges(newLayout !== savedLayout || editingText !== text);
    setLayoutSelectorOpen(false);
  };

  const textContentProps = {
    menuOpen,
    editingText,
    text,
    textRef,
    endRef,
    textareaRef,
    onChange: handleTextChange,
    extraBottomPad,
  };

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
        {/* vertical-bottom: text section on top */}
        {isVertBottom && (
          <div className={`px-4 py-4 ${textSectionRounded}`} style={{ backgroundColor: bgColor }}>
            <TextContent {...textContentProps} minH />
          </div>
        )}

        {/* horizontal: image on the left */}
        {isHorizontal && (
          <BlockImage variant="horizontal" imageSrc={imageSrc} isManyLines={isManyLines} />
        )}

        {/* vertical: full-width image */}
        {(isVertTop || isVertBottom) && (
          <BlockImage variant="vertical" imageSrc={imageSrc} rounded={imageRounded!} />
        )}

        {/* text layout: plain paragraph */}
        {isText && <TextContent {...textContentProps} />}

        {/* horizontal: text on the right */}
        {isHorizontal && (
          <div className="flex-1 min-w-0">
            <TextContent {...textContentProps} minH />
          </div>
        )}

        {/* vertical-top: text section on bottom */}
        {isVertTop && (
          <div className={`px-4 py-4 ${textSectionRounded}`} style={{ backgroundColor: bgColor }}>
            <TextContent {...textContentProps} minH />
          </div>
        )}

        {!menuOpen && (
          <button
            className={`cursor-pointer py-3 ${dotsClass}`}
            onClick={(e) => { e.stopPropagation(); setMenuOpen(true); }}
          >
            <ThreeDots white={isVertTop} />
          </button>
        )}

        {badgeVisible && !menuOpen && (
          <Badge
            ref={badgeRef}
            variant={badgeVariant}
            className="absolute bottom-2.5 right-2.5"
          >
            {badgeLabel}
          </Badge>
        )}
      </motion.div>
    </div>
  );
}
