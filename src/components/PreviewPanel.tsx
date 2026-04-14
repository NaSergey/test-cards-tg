"use client";

import Block from "./Block";
import { LayoutType } from "./LayoutSelector";

const PREVIEW_IMAGE = "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80";

const inputClass =
  "w-86.25 px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] text-[15px] text-gray-800 outline-none placeholder:text-gray-300";

interface PreviewPanelProps {
  inputText: string;
  onInputTextChange: (text: string) => void;
  countInput: string;
  onCountInputChange: (count: string) => void;
  layout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  count: number | undefined;
  countActive: boolean;
}

export default function PreviewPanel({
  inputText,
  onInputTextChange,
  countInput,
  onCountInputChange,
  layout,
  onLayoutChange,
  count,
  countActive,
}: PreviewPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={inputText}
        onChange={(e) => onInputTextChange(e.target.value)}
        placeholder="Введите текст..."
        className={inputClass}
      />
      <input
        type="text"
        value={countInput}
        onChange={(e) => onCountInputChange(e.target.value)}
        placeholder="0 / 42 / +5"
        className={inputClass}
      />
      <Block
        initialLayout={layout}
        text={inputText}
        imageSrc={PREVIEW_IMAGE}
        count={count}
        countActive={countActive}
        onSave={(newText, newLayout) => { onInputTextChange(newText); onLayoutChange(newLayout); }}
      />
    </div>
  );
}
