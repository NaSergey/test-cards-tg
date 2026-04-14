"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

import Block from "./Block";
import RevealWhenLoaded from "./RevealWhenLoaded";
import LayoutSelector, { LayoutType } from "./LayoutSelector";

const presetBlocks = [
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
  {
    id: 5,
    text: "Climate change impacts water availability across the globe.",
    count: 99,
    imageSrc: "/bg.png",
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
  const [inputText, setInputText] = useLocalStorage<string>("preview-text", "Hello world!");
  const [countInput, setCountInput] = useState("42");
  const [layout, setLayout] = useLocalStorage<LayoutType>("preview-layout", "text");

  // Сохранение текстов/лейаутов блоков в localStorage
  const [blocksData, setBlocksData] = useLocalStorage<Record<number, { text: string; layout?: LayoutType }>>(
    "blocks-data",
    {}
  );

  const getBlockText = (blockId: number, defaultText: string) =>
    blocksData[blockId]?.text ?? defaultText;

  const getBlockLayout = (blockId: number, defaultLayout: LayoutType) =>
    blocksData[blockId]?.layout ?? defaultLayout;

  const handleBlockSave = (blockId: number, newText: string, newLayout: LayoutType) => {
    setBlocksData({ ...blocksData, [blockId]: { text: newText, layout: newLayout } });
  };

  // Новые блоки, созданные пользователем
  const [newBlocks, setNewBlocks] = useState<Array<{ id: string; text: string; count: number; layout: LayoutType }>>(
    []
  );

  // Фокус, выделение и редактирование блоков
  const [focusedBlockId, setFocusedBlockId] = useState<string | number | null>(`preset-1`);
  const [selectedBlockIds, setSelectedBlockIds] = useState<Set<string | number>>(new Set());
  const [editingBlockId, setEditingBlockId] = useState<string | number | null>(null);
  const blockContainerRef = useRef<HTMLDivElement>(null);

  const { count, active: countActive } = parseCountInput(countInput);

  // Получить все блоки для навигации
  const allBlocks = useMemo(
    () => [
      ...presetBlocks.map((b) => ({ id: `preset-${b.id}`, isPreset: true })),
      ...newBlocks.map((b) => ({ id: b.id, isPreset: false })),
    ],
    [newBlocks]
  );

  // Обработка клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isInputFocused = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;
      if (!editingBlockId && !isInputFocused) {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          const currentIndex = allBlocks.findIndex((b) => b.id === focusedBlockId);
          if (currentIndex > 0) {
            setFocusedBlockId(allBlocks[currentIndex - 1].id);
          }
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          const currentIndex = allBlocks.findIndex((b) => b.id === focusedBlockId);
          if (currentIndex < allBlocks.length - 1) {
            setFocusedBlockId(allBlocks[currentIndex + 1].id);
          }
        } else if (e.key === " ") {
          e.preventDefault();
          if (focusedBlockId) {
            setSelectedBlockIds((prev) => {
              const newSet = new Set(prev);
              if (newSet.has(focusedBlockId)) {
                newSet.delete(focusedBlockId);
              } else {
                newSet.add(focusedBlockId);
              }
              return newSet;
            });
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedBlockId, allBlocks, editingBlockId]);


  // Создание нового блока
  const handleCreateBlock = () => {
    if (!inputText.trim()) return;

    const { count: newCount } = parseCountInput(countInput);
    const newBlock = {
      id: `new-${Date.now()}`,
      text: inputText,
      count: newCount || 0,
      layout: layout as LayoutType,
    };

    setNewBlocks([...newBlocks, newBlock]);
    setInputText("Hello world!");
    setCountInput("42");
    setLayout("text");
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] flex flex-col overflow-x-auto">
      {/* Header */}
      <div className="flex justify-end px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100">
        <button
          onClick={handleCreateBlock}
          disabled={!inputText.trim()}
          className="px-4 py-3 rounded-2xl bg-[#068DFB] text-white font-medium text-[15px] shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] hover:bg-[#0573D2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          Добавить
        </button>
      </div>

      {/* Main content */}
      <div className="flex justify-center min-w-fit px-4 sm:px-8 py-4 sm:py-8 flex-1">
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
          onSave={(newText, newLayout) => {
            setInputText(newText);
            setLayout(newLayout);
          }}
        />
      </div>

      {/* Right — container with preset and new blocks in single column */}
      <div ref={blockContainerRef} className="flex flex-col gap-3 ml-4">
        <div className="flex flex-col gap-3">
          {presetBlocks.map((block) => {
            const blockId = `preset-${block.id}`;
            return (
              <Block
                key={blockId}
                id={block.id}
                initialLayout={getBlockLayout(block.id, block.imageSrc ? "horizontal" : "text")}
                text={getBlockText(block.id, block.text)}
                count={block.count}
                imageSrc={block.imageSrc}
                isFocused={focusedBlockId === blockId}
                isSelected={selectedBlockIds.has(blockId)}
                onFocus={() => { if (!editingBlockId) setFocusedBlockId(blockId); }}
                onSave={(newText, newLayout) => handleBlockSave(block.id, newText, newLayout)}
                onEditChange={(editing) => setEditingBlockId(editing ? blockId : null)}
                onSelectToggle={() => {
                  if (editingBlockId) return;
                  setSelectedBlockIds((prev) => {
                    const newSet = new Set(prev);
                    if (newSet.has(blockId)) {
                      newSet.delete(blockId);
                    } else {
                      newSet.add(blockId);
                    }
                    return newSet;
                  });
                }}
              />
            );
          })}
          {newBlocks.map((block) => (
            <Block
              key={block.id}
              id={block.id}
              initialLayout={block.layout}
              text={block.text}
              count={block.count}
              isFocused={focusedBlockId === block.id}
              isSelected={selectedBlockIds.has(block.id)}
              onFocus={() => { if (!editingBlockId) setFocusedBlockId(block.id); }}
              onEditChange={(editing) => setEditingBlockId(editing ? block.id : null)}
              onSelectToggle={() => {
                if (editingBlockId) return;
                setSelectedBlockIds((prev) => {
                  const newSet = new Set(prev);
                  if (newSet.has(block.id)) {
                    newSet.delete(block.id);
                  } else {
                    newSet.add(block.id);
                  }
                  return newSet;
                });
              }}
            />
          ))}
        </div>
      </div>
      </RevealWhenLoaded>
      </div>
    </div>
  );
}
