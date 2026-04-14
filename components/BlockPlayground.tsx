"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

import Block from "./Block";
import RevealWhenLoaded from "./RevealWhenLoaded";
import LayoutSelector, { LayoutType } from "./LayoutSelector";

const presetBlocks2 = [
  {
    id: 6,
    text: "Mountains cover about 27% of Earth's land surface.",
    count: 5,
    imageSrc: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=80",
  },
  {
    id: 7,
    text: "The Amazon rainforest produces 20% of the world's oxygen.",
    count: 88,
    imageSrc: undefined,
  },
  {
    id: 8,
    text: "Every year, approximately 500,000 earthquakes occur worldwide.",
    count: 500,
    imageSrc: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
  },
  {
    id: 9,
    text: "Light travels at 299,792 kilometres per second.",
    count: 12,
    imageSrc: undefined,
  },
  {
    id: 10,
    text: "There are more trees on Earth than stars in the Milky Way.",
    count: 42,
    imageSrc: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=200&q=80",
  },
];

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

  // Колонки для навигации
  const columns = useMemo(
    () => [
      [
        ...presetBlocks.map((b) => `preset-${b.id}`),
        ...newBlocks.map((b) => b.id),
      ],
      presetBlocks2.map((b) => `preset2-${b.id}`),
    ],
    [newBlocks]
  );

  const allBlocks = useMemo(
    () => columns.flat().map((id) => ({ id })),
    [columns]
  );

  // Обработка клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isInputFocused = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;
      if (!editingBlockId && !isInputFocused) {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
          const colIdx = columns.findIndex((col) => col.includes(focusedBlockId as string));
          if (colIdx === -1) return;
          const col = columns[colIdx];
          const rowIdx = col.indexOf(focusedBlockId as string);
          const nextRow = e.key === "ArrowUp" ? rowIdx - 1 : rowIdx + 1;
          if (nextRow >= 0 && nextRow < col.length) {
            setFocusedBlockId(col[nextRow]);
          }
        } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          const colIdx = columns.findIndex((col) => col.includes(focusedBlockId as string));
          if (colIdx === -1) return;
          const rowIdx = columns[colIdx].indexOf(focusedBlockId as string);
          const nextCol = e.key === "ArrowLeft" ? colIdx - 1 : colIdx + 1;
          if (nextCol >= 0 && nextCol < columns.length) {
            const targetRow = Math.min(rowIdx, columns[nextCol].length - 1);
            setFocusedBlockId(columns[nextCol][targetRow]);
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
  }, [focusedBlockId, allBlocks, editingBlockId, columns]);


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
      <div className="flex justify-end px-4 py-4 border-b border-gray-100">
        <button
          onClick={handleCreateBlock}
          disabled={!inputText.trim()}
          className="px-3 py-2 rounded-2xl bg-[#068DFB] text-white font-medium text-[15px] shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] hover:bg-[#0573D2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
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
      {/* 3rd column */}
      <div className="flex flex-col gap-3 ml-4">
        {presetBlocks2.map((block) => {
          const blockId = `preset2-${block.id}`;
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
                  if (newSet.has(blockId)) newSet.delete(blockId);
                  else newSet.add(blockId);
                  return newSet;
                });
              }}
            />
          );
        })}
      </div>

      </RevealWhenLoaded>
      </div>
    </div>
  );
}
