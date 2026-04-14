"use client";

import AutoExpandTextarea from "../AutoExpandTextarea";
import { TextContentProps } from "./types";

export default function TextContent({
  menuOpen,
  editingText,
  text,
  textRef,
  endRef,
  textareaRef,
  onChange,
  extraBottomPad,
  minH,
}: TextContentProps) {
  const baseClass = "text-[15px] leading-[1.4] text-gray-800";

  if (menuOpen) {
    return (
      <AutoExpandTextarea
        ref={textareaRef}
        value={editingText}
        onChange={onChange}
        className={`${baseClass} w-full border-0`}
      />
    );
  }

  return (
    <p
      ref={textRef}
      className={`${baseClass} wrap-break-word${minH ? " min-h-5.25" : ""}`}
      style={{ paddingBottom: extraBottomPad }}
    >
      {text}
      <span ref={endRef} />
    </p>
  );
}
