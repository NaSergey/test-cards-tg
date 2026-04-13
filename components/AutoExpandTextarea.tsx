"use client";

import { useEffect, useRef, forwardRef } from "react";

interface AutoExpandTextareaProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}

const AutoExpandTextarea = forwardRef<
  HTMLTextAreaElement,
  AutoExpandTextareaProps
>(
  (
    { value, onChange, className = "", style = {}, placeholder = "" },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = ref || internalRef;

    useEffect(() => {
      const textarea = textareaRef && "current" in textareaRef ? textareaRef.current : null;
      if (!textarea) return;

      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = scrollHeight + "px";
    }, [value, textareaRef]);

    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={1}
        className={`resize-none block  focus:outline-none overflow-hidden ${className}`}
      />
    );
  }
);

AutoExpandTextarea.displayName = "AutoExpandTextarea";

export default AutoExpandTextarea;
