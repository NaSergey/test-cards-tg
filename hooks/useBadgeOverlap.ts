"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useBadgeOverlap(text: string, enabled = true) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const endRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const [extraBottomPad, setExtraBottomPad] = useState(0);
  const [isMultiLine, setIsMultiLine] = useState(false);
  const [isManyLines, setIsManyLines] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const measure = () => {
      const style = getComputedStyle(el);
      const lineHeight = parseFloat(style.lineHeight);
      const paddingBottom = parseFloat(style.paddingBottom) || 0;
      const lines = Math.round((el.offsetHeight - paddingBottom) / lineHeight);
      setIsMultiLine(lines >= 2);
      setIsManyLines(lines >= 3);

      if (enabled && endRef.current && badgeRef.current) {
        const endRect = endRef.current.getBoundingClientRect();
        const badgeRect = badgeRef.current.getBoundingClientRect();
        setExtraBottomPad(endRect.left > badgeRect.left ? lineHeight : 0);
      } else {
        setExtraBottomPad(0);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, enabled]);

  return { textRef, endRef, badgeRef, extraBottomPad, isMultiLine, isManyLines };
}
