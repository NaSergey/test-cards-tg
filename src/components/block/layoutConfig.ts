import { LayoutType } from "../LayoutSelector";

interface LayoutConfig {
  dotsClass: string;
  textSectionRounded: string | null;
  imageRounded: string | null;
}

export const LAYOUT_CONFIG: Record<LayoutType, LayoutConfig> = {
  text: {
    dotsClass: "absolute top-0 right-4",
    textSectionRounded: null,
    imageRounded: null,
  },
  horizontal: {
    dotsClass: "absolute top-0 right-4 transition-colors",
    textSectionRounded: null,
    imageRounded: null,
  },
  "vertical-top": {
    dotsClass:
      "absolute top-0 mt-3 right-4 transition-colors flex items-center justify-center w-7 h-6.5 rounded-xl backdrop-blur-[4.4px] bg-[#858585]/30",
    textSectionRounded: "rounded-tl-[5px] rounded-tr-[5px] rounded-bl-[24px] rounded-br-[24px]",
    imageRounded: "rounded-t-3xl rounded-bl-[5px] rounded-br-[5px]",
  },
  "vertical-bottom": {
    dotsClass: "absolute top-0 right-4 transition-colors",
    textSectionRounded: "rounded-tl-[24px] rounded-tr-[24px]",
    imageRounded: "rounded-tl-[5px] rounded-tr-[5px] rounded-b-3xl",
  },
};

export function getWrapperClass(
  layout: LayoutType,
  shadowClass: string,
  borderClass: string,
  isMultiLine: boolean
): string {
  const base = `relative w-86.25 ${shadowClass} bg-white rounded-3xl border ${borderClass}`;
  switch (layout) {
    case "text":
      return `${base} px-4 ${isMultiLine ? "py-4" : "py-6"} overflow-hidden`;
    case "horizontal":
      return `${base} flex items-center gap-3 px-4 ${isMultiLine ? "py-4" : "py-6"} overflow-hidden`;
    default:
      return `${base} overflow-hidden`;
  }
}
