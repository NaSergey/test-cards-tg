"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeDots from "./icon/ThreeDots";
import CloseIcon from "./icon/CloseIcon";
import ArrowUp from "./icon/ArrowUp";
import Badge from "./Badge";
import { useBadgeOverlap } from "../hooks/useBadgeOverlap";
import { LayoutType } from "./LayoutSelector";
import LayoutSelector from "./LayoutSelector";
import AutoExpandTextarea from "./AutoExpandTextarea";
import LayoutText from "./icon/LayoutText";
import LayoutHorizontal from "./icon/LayoutHorizontal";
import LayoutVerticalTop from "./icon/LayoutVerticalTop";
import LayoutVerticalBottom from "./icon/LayoutVerticalBottom";
import LogoImages from "./icon/LogoImages";

interface BlockProps {
  text: string;
  imageSrc?: string;
  count?: number;
  countActive?: boolean;
  initialLayout?: LayoutType;
  id?: string | number;
  onSave?: (text: string, layout: LayoutType) => void;
}

export default function Block({
  text,
  imageSrc,
  count,
  countActive = false,
  initialLayout = "text",
  onSave,
}: BlockProps) {
  const [layout, setLayout] = useState<LayoutType>(initialLayout);
  const [savedLayout, setSavedLayout] = useState<LayoutType>(initialLayout);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingText, setEditingText] = useState(text);
  const [hasChanges, setHasChanges] = useState(false);
  const [layoutSelectorOpen, setLayoutSelectorOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // При открытии меню - синхронизируем editingText с актуальным text пропом (из localStorage)
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

  const wrapperRef = useRef<HTMLDivElement>(null);

  const borderClass = menuOpen ? "border-[#229CFD]" : "border-gray-100";

  const wrapperClass = isText
    ? `relative w-86.25 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] bg-white rounded-3xl border ${borderClass} px-4 ${isMultiLine ? "py-4" : "py-6"} overflow-hidden`
    : isHorizontal
    ? `relative w-86.25 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] bg-white rounded-3xl flex items-center gap-3 px-4 ${isMultiLine ? "py-4" : "py-6"} overflow-hidden`
    : `relative w-86.25 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] bg-white rounded-3xl border ${borderClass} overflow-hidden`;

  const dotsClass = isText
    ? "absolute top-3 right-4 "
    : isHorizontal
    ? "absolute top-3 right-4  transition-colors"
    : isVertTop
    ? "absolute top-3 right-4  transition-colors flex items-center justify-center w-7 h-6.5 rounded-xl backdrop-blur-[4.4px] bg-[#858585]/30"
    : "absolute top-3 right-4  transition-colors";

  const textSectionRounded = isVertBottom
    ? "rounded-tl-[24px] rounded-tr-[24px]"
    : "rounded-tl-[5px] rounded-tr-[5px] rounded-bl-[24px] rounded-br-[24px]";

  const imageRounded = isVertBottom
    ? "rounded-tl-[5px] rounded-tr-[5px] rounded-b-3xl"
    : "rounded-t-3xl rounded-bl-[5px] rounded-br-[5px]";

  const getLayoutIcon = () => {
    switch (layout) {
      case "text":
        return <LayoutText />;
      case "horizontal":
        return <LayoutHorizontal />;
      case "vertical-top":
        return <LayoutVerticalTop />;
      case "vertical-bottom":
        return <LayoutVerticalBottom />;
      default:
        return <LayoutText />;
    }
  };

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

  return (
    <div className="relative flex flex-col items-center gap-2">
      {/* Layout Selector - выше всех блоков */}
      <AnimatePresence mode="wait">
        {menuOpen && layoutSelectorOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute z-50 -top-10 left-1/2 -translate-x-1/2"
          >
            <LayoutSelector value={layout} onChange={(newLayout) => {
              setLayout(newLayout);
              setHasChanges(newLayout !== savedLayout || editingText !== text);
              setLayoutSelectorOpen(false);
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Bar - выезжает сверху, позади блока */}
      <div className="absolute w-full z-0">
        <AnimatePresence mode="wait">
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 100, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden h-20 w-86.25 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)]  bg-white rounded-t-3xl"
            >
            <div className="flex items-center justify-between w-full p-4">
              <button onClick={handleCancel} className="p-2 cursor-pointer">
                <CloseIcon />
              </button>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setLayoutSelectorOpen(!layoutSelectorOpen)}
                  className="w-6 h-6 p-1 border border-gray-300 rounded flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  {getLayoutIcon()}
                </button>
                <button
                  onClick={handleSave}
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

      <motion.div ref={wrapperRef} className={`${wrapperClass} relative z-10`} layout animate={{ marginTop: menuOpen ? '58px' : '0px' }} transition={{ duration: 0.3 }}>

        {/* vertical-bottom: text section on top */}
        {isVertBottom && (
          <div className={`bg-white px-4 py-3 ${textSectionRounded}`}>
            {menuOpen ? (
              <AutoExpandTextarea
                ref={textareaRef}
                value={editingText}
                onChange={handleTextChange}
                className="text-[15px] leading-[1.4] text-gray-800 w-full border-0"
              />
            ) : (
              <p ref={textRef} className="text-[15px] leading-[1.4] text-gray-800 wrap-break-word min-h-5.25"
                style={{ paddingBottom: extraBottomPad }}>
                {text}<span ref={endRef} />
              </p>
            )}
          </div>
        )}

        {/* horizontal: small image on the left */}
        {isHorizontal && imageSrc && (
          <div className={`shrink-0 ${isManyLines ? "self-start" : "self-center"}`}>
            <div className="w-14 h-14 rounded-xl overflow-hidden">
              <Image src={imageSrc} alt="" width={56} height={56} className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* horizontal: image placeholder */}
        {isHorizontal && !imageSrc && (
          <div className={`shrink-0 ${isManyLines ? "self-start" : "self-center"}`}>
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F1F6FD] flex items-center justify-center">
              <LogoImages />
            </div>
          </div>
        )}

        {/* vertical: full-width image */}
        {(isVertTop || isVertBottom) && imageSrc && (
          <div className={`w-full h-48 overflow-hidden ${imageRounded}`}>
            <Image src={imageSrc} alt="" width={400} height={200} className="w-full h-full object-cover" />
          </div>
        )}

        {/* vertical: image placeholder */}
        {(isVertTop || isVertBottom) && !imageSrc && (
          <div className={`w-full h-48 overflow-hidden ${imageRounded} bg-[#F1F6FD] flex items-center justify-center`}>
            <LogoImages />
          </div>
        )}

        {/* text layout: plain paragraph */}
        {isText && (
          menuOpen ? (
            <AutoExpandTextarea
              ref={textareaRef}
              value={editingText}
              onChange={handleTextChange}
              className="text-sm leading-[1.4] text-gray-800 w-full border-0"
              style={{ paddingBottom: extraBottomPad }}
            />
          ) : (
            <p ref={textRef} className="text-sm leading-[1.4] text-gray-800 wrap-break-word"
              style={{ paddingBottom: extraBottomPad }}>
              {text}<span ref={endRef} />
            </p>
          )
        )}

        {/* horizontal: text on the right */}
        {isHorizontal && (
          <div className="flex-1 min-w-0">
            {menuOpen ? (
              <AutoExpandTextarea
                ref={textareaRef}
                value={editingText}
                onChange={handleTextChange}
                className="text-[15px] leading-[1.4] text-gray-800 w-full border-0"
              />
            ) : (
              <p ref={textRef} className="text-[15px] leading-[1.4] text-gray-800 wrap-break-word min-h-5.25"
                style={{ paddingBottom: extraBottomPad }}>
                {text}<span ref={endRef} />
              </p>
            )}
          </div>
        )}

        {/* vertical-top: text section on bottom */}
        {isVertTop && (
          <div className={`bg-white px-4 py-3 ${textSectionRounded}`}>
            {menuOpen ? (
              <AutoExpandTextarea
                ref={textareaRef}
                value={editingText}
                onChange={handleTextChange}
                className="text-[15px] leading-[1.4] text-gray-800 w-full border-0"
              />
            ) : (
              <p ref={textRef} className="text-[15px] leading-[1.4] text-gray-800 wrap-break-word min-h-5.25"
                style={{ paddingBottom: extraBottomPad }}>
                {text}<span ref={endRef} />
              </p>
            )}
          </div>
        )}

        {!menuOpen && (
          <button className={`cursor-pointer ${dotsClass}`} onClick={() => setMenuOpen(!menuOpen)}>
            <ThreeDots white={isVertTop} />
          </button>
        )}

        {badgeVisible && !menuOpen && (
          <Badge
            ref={badgeRef}
            variant={badgeVariant}
            className={`absolute bottom-2.5 right-3.5 ${!badgeVisible ? "invisible" : ""}`}
          >
            {badgeLabel}
          </Badge>
        )}

      </motion.div>
    </div>
  );
}
