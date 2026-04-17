"use client";

import { useState, useMemo, useCallback } from "react";
import { useLocalStorage } from "@/shared/lib/hooks/useLocalStorage";
import { useBlockSelection } from "@/shared/lib/hooks/useBlockSelection";
import { useKeyboardNav } from "@/shared/lib/hooks/useKeyboardNav";
import { parseCountInput } from "@/shared/lib/utilities/parseCountInput";
import RevealWhenLoaded from "@/shared/ui/RevealWhenLoaded";
import { Block, useBlocksData } from "@/features/block-editing";
import PreviewPanel from "@/app/(main)/playground/preview-panel/PreviewPanel";
import { LayoutType } from "@/entities/block/model/types";
import { presetBlocks, presetBlocks2 } from "@/entities/block/model/presets";

export default function PlaygroundPage() {
  const [inputText, setInputText] = useLocalStorage<string>("preview-text", "Hello world!");
  const [countInput, setCountInput] = useState("42");
  const [layout, setLayout] = useLocalStorage<LayoutType>("preview-layout", "text");
  const [newBlocks, setNewBlocks] = useState<Array<{ id: string; text: string; count: number; layout: LayoutType }>>([]);
  const [editingBlockId, setEditingBlockId] = useState<string | number | null>(null);

  const { getBlockText, getBlockLayout, saveBlock } = useBlocksData();
  const { selectedBlockIds, toggleSelection } = useBlockSelection();

  const columns = useMemo(
    () => [
      [...presetBlocks.map((b) => `preset-${b.id}`), ...newBlocks.map((b) => b.id)],
      presetBlocks2.map((b) => `preset2-${b.id}`),
    ],
    [newBlocks]
  );

  const { focusedBlockId, setFocusedBlockId } = useKeyboardNav({ columns, editingBlockId, toggleSelection });

  const { count, active: countActive } = parseCountInput(countInput);

  const handleCreateBlock = () => {
    if (!inputText.trim()) return;
    const { count: newCount } = parseCountInput(countInput);
    setNewBlocks([...newBlocks, { id: `new-${Date.now()}`, text: inputText, count: newCount || 0, layout }]);
    setInputText("Hello world!");
    setCountInput("42");
    setLayout("text");
  };

  const makeHandlers = useCallback((blockId: string) => ({
    isFocused: focusedBlockId === blockId,
    isSelected: selectedBlockIds.has(blockId),
    onFocus: () => { if (!editingBlockId) setFocusedBlockId(blockId); },
    onSelectToggle: () => { if (!editingBlockId) toggleSelection(blockId); },
    onEditChange: (editing: boolean) => setEditingBlockId(editing ? blockId : null),
  }), [focusedBlockId, selectedBlockIds, editingBlockId, setFocusedBlockId, toggleSelection]);

  return (
    <div className="min-h-screen bg-[#FCFCFC] flex flex-col overflow-x-auto">
      <div className="flex justify-end px-4 py-4 border-b border-gray-100">
        <button
          onClick={handleCreateBlock}
          disabled={!inputText.trim()}
          className="px-3 py-2 rounded-2xl bg-[#068DFB] text-white font-medium text-[15px] shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] hover:bg-[#0573D2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          Добавить
        </button>
      </div>

      <div className="flex justify-center min-w-fit px-4 sm:px-8 py-4 sm:py-8 flex-1">
        <RevealWhenLoaded className="flex gap-3 items-start">

          <PreviewPanel
            inputText={inputText}
            onInputTextChange={setInputText}
            countInput={countInput}
            onCountInputChange={setCountInput}
            layout={layout}
            onLayoutChange={setLayout}
            count={count}
            countActive={countActive}
          />

          <div className="flex flex-col gap-3 ml-4">
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
                  onSave={(newText, newLayout) => saveBlock(block.id, newText, newLayout)}
                  {...makeHandlers(blockId)}
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
                {...makeHandlers(block.id)}
              />
            ))}
          </div>

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
                  onSave={(newText, newLayout) => saveBlock(block.id, newText, newLayout)}
                  {...makeHandlers(blockId)}
                />
              );
            })}
          </div>

        </RevealWhenLoaded>
      </div>
    </div>
  );
}
