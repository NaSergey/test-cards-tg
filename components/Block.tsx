"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion } from "framer-motion";
import ThreeDots from "./icon/ThreeDots";
import Badge from "./Badge";
import { useBadgeOverlap } from "../hooks/useBadgeOverlap";
import { LayoutType } from "./LayoutSelector";

interface BlockProps {
  text: string;
  layout?: LayoutType;
  imageSrc?: string;
  count?: number;
  countActive?: boolean;
}

export default function Block({
  text,
  layout = "text",
  imageSrc,
  count,
  countActive = false,
}: BlockProps) {
  const isText       = layout === "text";
  const isHorizontal = layout === "horizontal";
  const isVertTop    = layout === "vertical-top";
  const isVertBottom = layout === "vertical-bottom";

  const badgeVisible = count !== undefined && count > 0;
  const badgeOnImage = isVertBottom;

  const { textRef, endRef, badgeRef, extraBottomPad, isMultiLine, isManyLines } =
    useBadgeOverlap(text, badgeVisible && !badgeOnImage && !isText);

  const badgeLabel   = countActive ? `+${count}` : String(count ?? "");
  const badgeVariant = badgeOnImage
    ? (countActive ? "active" : "blur")
    : (countActive ? "active" : "border");

  const wrapperRef = useRef<HTMLDivElement>(null);

  const wrapperClass = isText
    ? "relative w-86.25 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] bg-white rounded-3xl border border-gray-100 px-4 py-4 overflow-hidden"
    : isHorizontal
    ? `relative w-86.25 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] bg-white rounded-3xl flex items-center gap-3 px-4 ${isMultiLine ? "py-4" : "py-6"} overflow-hidden`
    : "relative w-86.25 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] rounded-3xl overflow-hidden";

  const dotsClass = isText
    ? "absolute top-3 right-4 leading-none"
    : isHorizontal
    ? "absolute top-3 right-4 leading-none transition-colors"
    : isVertTop
    ? "absolute top-3 right-4 leading-none transition-colors flex items-center justify-center w-7 h-6.5 rounded-xl backdrop-blur-[4.4px] bg-[#858585]/30"
    : "absolute top-3 right-4 leading-none transition-colors";

  const textSectionRounded = isVertBottom
    ? "rounded-tl-[24px] rounded-tr-[24px] rounded-bl-[5px] rounded-br-[5px]"
    : "rounded-tl-[5px] rounded-tr-[5px] rounded-bl-[24px] rounded-br-[24px]";

  const imageRounded = isVertBottom
    ? "rounded-tl-[5px] rounded-tr-[5px] rounded-b-3xl"
    : "rounded-t-3xl rounded-bl-[5px] rounded-br-[5px]";

  return (
    <motion.div ref={wrapperRef} className={wrapperClass} layout>

      {/* vertical-bottom: text section on top */}
      {isVertBottom && (
        <div className={`bg-white px-4 py-3 ${textSectionRounded}`}>
          <p ref={textRef} className="text-[15px] leading-[1.4] text-gray-800 wrap-break-word min-h-5.25"
            style={{ paddingBottom: extraBottomPad }}>
            {text}<span ref={endRef} />
          </p>
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

      {/* vertical: full-width image */}
      {(isVertTop || isVertBottom) && imageSrc && (
        <div className={`w-full h-48 overflow-hidden ${imageRounded}`}>
          <Image src={imageSrc} alt="" width={400} height={200} className="w-full h-full object-cover" />
        </div>
      )}

      {/* text layout: plain paragraph */}
      {isText && (
        <p className="text-sm leading-[1.4] text-gray-800 wrap-break-word">{text}</p>
      )}

      {/* horizontal: text on the right */}
      {isHorizontal && (
        <div className="flex-1 min-w-0">
          <p ref={textRef} className="text-[15px] leading-[1.4] text-gray-800 wrap-break-word min-h-5.25"
            style={{ paddingBottom: extraBottomPad }}>
            {text}<span ref={endRef} />
          </p>
        </div>
      )}

      {/* vertical-top: text section on bottom */}
      {isVertTop && (
        <div className={`bg-white px-4 py-3 ${textSectionRounded}`}>
          <p ref={textRef} className="text-[15px] leading-[1.4] text-gray-800 wrap-break-word min-h-5.25"
            style={{ paddingBottom: extraBottomPad }}>
            {text}<span ref={endRef} />
          </p>
        </div>
      )}

      <button className={dotsClass}>
        <ThreeDots white={isVertTop} />
      </button>

      {!isText && (
        <Badge
          ref={badgeRef}
          variant={badgeVariant}
          className={`absolute bottom-2.5 right-3.5 ${!badgeVisible ? "invisible" : ""}`}
        >
          {badgeVisible ? badgeLabel : null}
        </Badge>
      )}

    </motion.div>
  );
}
