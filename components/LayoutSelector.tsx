"use client";

import LayoutText from "./icon/LayoutText";
import LayoutHorizontal from "./icon/LayoutHorizontal";
import LayoutVerticalTop from "./icon/LayoutVerticalTop";
import LayoutVerticalBottom from "./icon/LayoutVerticalBottom";

export type LayoutType = "text" | "horizontal" | "vertical-top" | "vertical-bottom";

const layouts: { type: LayoutType; icon: React.ReactNode; label: string }[] = [
  { type: "text", icon: <LayoutText />, label: "Текст" },
  { type: "vertical-top", icon: <LayoutVerticalTop />, label: "Картинка сверху" },
  { type: "vertical-bottom", icon: <LayoutVerticalBottom />, label: "Картинка снизу" },
  { type: "horizontal", icon: <LayoutHorizontal />, label: "Картинка слева" },
];

interface LayoutSelectorProps {
  value: LayoutType;
  onChange: (layout: LayoutType) => void;
}

export default function LayoutSelector({ value, onChange }: LayoutSelectorProps) {
  return (
    <div className="flex gap-1 p-1 bg-white rounded-2xl shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] border border-gray-100 w-fit">
      {layouts.map(({ type, icon, label }) => (
        <button
          key={type}
          aria-label={label}
          onClick={() => onChange(type)}
          className={`flex cursor-pointer items-center justify-center rounded-xl p-2.5 transition-colors ${
            value === type
              ? "bg-gray-100"
              : "hover:bg-gray-50"
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
