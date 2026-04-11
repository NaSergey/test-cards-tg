"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useBadgeOverlap(text: string) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const endRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const [extraBottomPad, setExtraBottomPad] = useState(0);

  useIsomorphicLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const measure = () => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      if (endRef.current && badgeRef.current) {
        const endRect = endRef.current.getBoundingClientRect();
        const badgeRect = badgeRef.current.getBoundingClientRect();
        setExtraBottomPad(endRect.left > badgeRect.left ? lineHeight : 0);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  return { textRef, endRef, badgeRef, extraBottomPad };
}
