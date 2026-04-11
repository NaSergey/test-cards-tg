"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ThreeDots from "./ThreeDots";
import Badge from "./Badge";
import { useBadgeOverlap } from "../hooks/useBadgeOverlap";

interface BlockCardProps {
  text: string;
  count?: number;
  imageSrc?: string;
}

export default function BlockCard({ text, count, imageSrc }: BlockCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMultiLine, setIsMultiLine] = useState(false);
  const [isManyLines, setIsManyLines] = useState(false);
  const { textRef, endRef, badgeRef, extraBottomPad } = useBadgeOverlap(text);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const measure = () => {
      const style = getComputedStyle(el);
      const lineHeight = parseFloat(style.lineHeight);
      const paddingBottom = parseFloat(style.paddingBottom) || 0;
      const lines = Math.round((el.offsetHeight - paddingBottom) / lineHeight);
      setIsMultiLine(lines >= 2);
      setIsManyLines(lines >= 3);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, textRef]);

  const paddingY = isMultiLine ? "py-4" : "py-6";

  return (
    <div
      ref={cardRef}
      className={`relative flex items-center gap-3 bg-white rounded-3xl shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] px-4 w-86.25 ${paddingY} transition-all duration-150`}
    >
      {imageSrc && (
        <div className={`shrink-0 ${isManyLines ? "self-start" : "self-center"}`}>
          <div className="w-14 h-14 rounded-xl overflow-hidden">
            <Image
              src={imageSrc}
              alt=""
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p
          ref={textRef}
          className="text-[15px] leading-[1.4] text-gray-800 wrap-break-word min-h-5.25"
          style={{ paddingBottom: count !== undefined ? extraBottomPad : 0 }}
        >
          {text}<span ref={endRef} />
        </p>
      </div>

        <div className="absolute py-2.5 inset-y-0 right-3.5 flex flex-col justify-between items-center">
          <button className="transition-colors leading-none">
            <ThreeDots />
          </button>
          <Badge ref={badgeRef} variant="border" className={count === undefined ? "invisible" : ""}>
            {count}
          </Badge>
        </div>
    </div>
  );
}
