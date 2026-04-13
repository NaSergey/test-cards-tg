"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

import Block from "./Block";
import RevealWhenLoaded from "./RevealWhenLoaded";
import LayoutSelector, { LayoutType } from "./LayoutSelector";

const blocks = [
  {
    id: 1,
    text: "Drinking water isn't just about quenching about",
    count: 1,
    imageSrc: undefined,
  },
  {
    id: 2,
    text: "Staying hydrated throughout the day keeps your energy levels stable and your mind sharp.",
    count: 10,
    imageSrc: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200&q=80",
  },
  {
    id: 3,
    text: "The ocean covers more than 70% of Earth's surface.",
    count: 4,
    imageSrc: undefined,
  },
  {
    id: 4,
    text: "Deep beneath the waves lies an entire world of creatures, currents, and geological formations we have",
    count: 2333,
    imageSrc: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=200&q=80",
  },
];

function parseCountInput(raw: string): { count: number | undefined; active: boolean } {
  const s = raw.trim();
  if (s.startsWith("+")) {
    const n = parseInt(s.slice(1), 10);
    if (!isNaN(n) && n >= 1 && n <= 999) return { count: n, active: true };
    return { count: undefined, active: false };
  }
  const n = parseInt(s, 10);
  if (isNaN(n) || n < 0) return { count: undefined, active: false };
  if (n === 0) return { count: 0, active: false };
  if (n <= 9999) return { count: n, active: false };
  return { count: 9999, active: false };
}

const inputClass =
  "w-86.25 px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] text-[15px] text-gray-800 outline-none placeholder:text-gray-300";

const PREVIEW_IMAGE = "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80";

export default function BlockPlayground() {
  const [inputText, setInputText] = useState("Hello world!");
  const [countInput, setCountInput] = useState("42");
  const [layout, setLayout] = useState<LayoutType>("text");

  // Загрузка/сохранение текстов блоков из localStorage
  const [blocksData, setBlocksData] = useLocalStorage<Record<number, { text: string }>>(
    "blocks-data",
    {}
  );

  const { count, active: countActive } = parseCountInput(countInput);

  // Получить текст блока - если сохранён в localStorage, то оттуда, иначе исходный
  const getBlockText = (blockId: number, defaultText: string) => {
    return blocksData[blockId]?.text ?? defaultText;
  };

  // Обработчик сохранения текста блока
  const handleBlockSave = (blockId: number, newText: string) => {
    const updated = { ...blocksData, [blockId]: { text: newText } };
    setBlocksData(updated);
  };

  const left = blocks.filter((_, i) => i % 2 === 0);
  const right = blocks.filter((_, i) => i % 2 === 1);

  return (
    <div className="min-h-screen bg-gray-400 flex flex-col justify-center overflow-x-auto py-4 sm:py-8">
      <div className="flex justify-center min-w-fit px-4 sm:px-8">
      <RevealWhenLoaded className="flex gap-3 items-start">

      {/* Left — inputs + preview cards */}
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Введите текст..."
          className={inputClass}
        />
        <input
          type="text"
          value={countInput}
          onChange={(e) => setCountInput(e.target.value)}
          placeholder="0 / 42 / +5"
          className={inputClass}
        />
        <Block
          key="preview"
          initialLayout={layout}
          text={inputText}
          imageSrc={PREVIEW_IMAGE}
          count={count}
          countActive={countActive}
        />
      </div>

      {/* Right — blocks in two columns */}
        <div className="flex flex-col gap-3">
          {left.map((block) => (
            <Block
              key={block.id}
              id={block.id}
              initialLayout={block.imageSrc ? "horizontal" : "text"}
              text={getBlockText(block.id, block.text)}
              count={block.count}
              imageSrc={block.imageSrc}
              onSave={(newText) => handleBlockSave(block.id, newText)}
            />
          ))}
          <Block
            key="static-1"
            initialLayout="vertical-bottom"
            imageSrc="/bg.png"
            text="Hello world!"
            count={10}
          />
        </div>
        <div className="flex flex-col gap-3">
          {right.map((block) => (
            <Block
              key={block.id}
              id={block.id}
              initialLayout={block.imageSrc ? "horizontal" : "text"}
              text={getBlockText(block.id, block.text)}
              count={block.count}
              imageSrc={block.imageSrc}
              onSave={(newText) => handleBlockSave(block.id, newText)}
            />
          ))}
          <Block
            key="static-2"
            initialLayout="vertical-top"
            imageSrc="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80"
            text="Drinking water isn't just about quenching aaa bbbb"
            count={42}
          />
        </div>
      </RevealWhenLoaded>
      </div>
    </div>
  );
}
