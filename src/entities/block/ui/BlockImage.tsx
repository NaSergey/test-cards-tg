"use client";

import Image from "next/image";
import LogoImages from "@/shared/ui/icons/LogoImages";

interface HorizontalProps {
  variant: "horizontal";
  imageSrc?: string;
  isManyLines: boolean;
}

interface VerticalProps {
  variant: "vertical";
  imageSrc?: string;
  rounded: string;
}

type BlockImageProps = HorizontalProps | VerticalProps;

export default function BlockImage(props: BlockImageProps) {
  if (props.variant === "horizontal") {
    const { imageSrc, isManyLines } = props;
    return (
      <div className={`shrink-0 ${isManyLines ? "self-start" : "self-center"}`}>
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F1F6FD] flex items-center justify-center">
          {imageSrc ? (
            <Image src={imageSrc} alt="" width={56} height={56} className="w-full h-full object-cover" />
          ) : (
            <LogoImages />
          )}
        </div>
      </div>
    );
  }

  const { imageSrc, rounded } = props;
  return (
    <div
      className={`w-full h-48 overflow-hidden ${rounded}${
        !imageSrc ? " bg-[#F1F6FD] flex items-center justify-center" : ""
      }`}
    >
      {imageSrc ? (
        <Image src={imageSrc} alt="" width={400} height={200} className="w-full h-full object-cover" />
      ) : (
        <LogoImages />
      )}
    </div>
  );
}
