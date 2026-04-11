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
  countActive?: boolean;
}

export default function ImageBlock({ text, imageSrc, textPosition, count, countActive = false }: ImageBlockProps) {
  const badgeVisible = count !== undefined && count > 0;
  const badgeOnImage = textPosition === "top";

  const { textRef, endRef, badgeRef, extraBottomPad } = useBadgeOverlap(
    text,
    badgeVisible && !badgeOnImage
  );

  const textRounded =
    textPosition === "top"
      ? "rounded-tl-[24px] rounded-tr-[24px] rounded-bl-[5px] rounded-br-[5px]"
      : "rounded-tl-[5px] rounded-tr-[5px] rounded-bl-[24px] rounded-br-[24px]";

  const imageRounded =
    textPosition === "top"
      ? "rounded-tl-[5px] rounded-tr-[5px] rounded-b-3xl"
      : "rounded-t-3xl rounded-bl-[5px] rounded-br-[5px]";

  const badgeLabel = countActive ? `+${count}` : String(count ?? "");
  const badgeVariant = badgeOnImage
    ? (countActive ? "active" : "blur")
    : (countActive ? "active" : "border");

  const textSection = (
    <div className={`bg-white px-4 py-3 pr-4 ${textRounded}`}>
      <p
        ref={textRef}
        className="text-[15px] leading-[1.4] text-gray-800 wrap-break-word min-h-5.25"
        style={{ paddingBottom: !badgeOnImage && badgeVisible ? extraBottomPad : 0 }}
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

      {/* ThreeDots + badge — independently positioned */}
      <button className={`absolute top-2.5 right-4 transition-colors leading-none ${!badgeOnImage ? "flex items-center justify-center w-7 h-6.5 rounded-xl backdrop-blur-[4.4px] bg-[#858585]/30" : ""}`}>
        <ThreeDots white={!badgeOnImage} />
      </button>
      <Badge
        ref={badgeRef}
        variant={badgeVariant}
        className={`absolute bottom-2.5 right-3.5 ${!badgeVisible ? "invisible" : ""}`}
      >
        {badgeVisible ? badgeLabel : null}
      </Badge>

    </div>
  );
}
