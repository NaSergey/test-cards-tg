"use client";

import Image from "next/image";
import ThreeDots from "./ThreeDots";
import Badge from "./Badge";
import { useBadgeOverlap } from "../hooks/useBadgeOverlap";

interface BlockCardProps {
  text: string;
  count?: number;
  countActive?: boolean;
  imageSrc?: string;
}

export default function BlockCard({ text, count, countActive = false, imageSrc }: BlockCardProps) {
  const badgeVisible = count !== undefined && count > 0;

  const { textRef, endRef, badgeRef, extraBottomPad, isMultiLine, isManyLines } =
    useBadgeOverlap(text, badgeVisible);

  const paddingY = isMultiLine ? "py-4" : "py-6";
  const badgeLabel = countActive ? `+${count}` : String(count ?? "");

  return (
    <div
      className={`relative flex items-center gap-3 bg-white rounded-3xl shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] px-4 w-86.25 ${paddingY} transition-[padding] duration-150`}
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
          style={{ paddingBottom: extraBottomPad }}
        >
          {text}<span ref={endRef} />
        </p>
      </div>

      <button className="absolute top-2.5 right-5 transition-colors leading-none">
        <ThreeDots />
      </button>
      <Badge
        ref={badgeRef}
        variant={countActive ? "active" : "border"}
        className={`absolute bottom-2.5 right-3.5 ${!badgeVisible ? "invisible" : ""}`}
      >
        {badgeVisible ? badgeLabel : null}
      </Badge>
    </div>
  );
}
