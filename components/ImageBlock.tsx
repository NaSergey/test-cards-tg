"use client";

import Image from "next/image";
import ThreeDots from "./ThreeDots";
import Badge from "./Badge";
import { useBadgeOverlap } from "../hooks/useBadgeOverlap";

interface ImageBlockProps {
  text: string;
  imageSrc: string;
  textPosition: "top" | "bottom";
  count?: number;
}

export default function ImageBlock({ text, imageSrc, textPosition, count }: ImageBlockProps) {
  const { textRef, endRef, badgeRef, extraBottomPad } = useBadgeOverlap(text);
  const hasCount = count !== undefined;
  const badgeOnImage = textPosition === "top";

  const textRounded =
    textPosition === "top"
      ? "rounded-tl-[24px] rounded-tr-[24px] rounded-bl-[5px] rounded-br-[5px]"
      : "rounded-tl-[5px] rounded-tr-[5px] rounded-bl-[24px] rounded-br-[24px]";

  const imageRounded =
    textPosition === "top"
      ? "rounded-tl-[5px] rounded-tr-[5px] rounded-b-3xl"
      : "rounded-t-3xl rounded-bl-[5px] rounded-br-[5px]";

  const textSection = (
    <div className={`bg-white px-4 py-3 pr-4 ${textRounded}`}>
      <p
        ref={textRef}
        className="text-[15px] leading-[1.4] text-gray-800 wrap-break-word"
        style={{ paddingBottom: !badgeOnImage && hasCount ? extraBottomPad : 0 }}
      >
        {text}<span ref={endRef} />
      </p>
    </div>
  );

  return (
    <div className="relative rounded-3xl shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] w-86.25">

      {textPosition === "top" && textSection}

      <div className={`w-full h-48 overflow-hidden ${imageRounded}`}>
        <Image
          src={imageSrc}
          alt=""
          width={400}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>

      {textPosition === "bottom" && textSection}

      {/* ThreeDots + badge column */}
      <div className="absolute py-2.5 inset-y-0 right-3.5 flex flex-col justify-between items-center">
        <button className={`transition-colors leading-none ${!badgeOnImage ? "flex items-center justify-center w-7 h-6.5 rounded-xl backdrop-blur-[4.4px] bg-[#858585]/30" : ""}`}>
          <ThreeDots white={!badgeOnImage} />
        </button>
        {hasCount && (
          badgeOnImage
            ? <Badge ref={badgeRef} variant="blur">{count}</Badge>
            : <Badge ref={badgeRef} variant="border">{count}</Badge>
        )}
      </div>

    </div>
  );
}
