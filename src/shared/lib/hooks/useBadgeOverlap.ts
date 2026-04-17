"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useBadgeOverlap(_text: string, enabled = true, layoutKey?: string) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const endRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const [extraBottomPad, setExtraBottomPad] = useState(0);
  const [isMultiLine, setIsMultiLine] = useState(false);
  const [isManyLines, setIsManyLines] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = textRef.current;
    if (!el || !enabled) {
      setExtraBottomPad(0);
      setIsMultiLine(false);
      setIsManyLines(false);
      return;
    }

    let timerId: NodeJS.Timeout;

    const measure = () => {
      const style = getComputedStyle(el);
      const lineHeight = parseFloat(style.lineHeight);
      const paddingBottom = parseFloat(style.paddingBottom) || 0;

      if (isNaN(lineHeight) || lineHeight <= 0) {
        setIsMultiLine(false);
        setIsManyLines(false);
        setExtraBottomPad(0);
        return;
      }

      const lines = Math.round((el.offsetHeight - paddingBottom) / lineHeight);
      setIsMultiLine(lines >= 2);
      setIsManyLines(lines >= 3);

      if (endRef.current && badgeRef.current) {
        const endRect = endRef.current.getBoundingClientRect();
        const badgeRect = badgeRef.current.getBoundingClientRect();
        const pad = endRect.left > badgeRect.left ? lineHeight : 0;
        setExtraBottomPad(isNaN(pad) ? 0 : pad);
      }
    };

    measure();

    const observer = new ResizeObserver(() => {
      clearTimeout(timerId);
      timerId = setTimeout(measure, 100);
    });
    observer.observe(el);
    if (badgeRef.current) {
      observer.observe(badgeRef.current);
    }

    return () => {
      clearTimeout(timerId);
      observer.disconnect();
    };
  }, [_text, enabled, layoutKey]);

  return { textRef, endRef, badgeRef, extraBottomPad, isMultiLine, isManyLines };
}
