import { useLocalStorage } from "@/shared/lib/hooks/useLocalStorage";
import { LayoutType } from "@/entities/block/model/types";

type BlockData = { text: string; layout?: LayoutType };

export function useBlocksData() {
  const [blocksData, setBlocksData] = useLocalStorage<Record<number, BlockData>>(
    "blocks-data",
    {}
  );

  const getBlockText = (blockId: number, defaultText: string) =>
    blocksData[blockId]?.text ?? defaultText;

  const getBlockLayout = (blockId: number, defaultLayout: LayoutType) =>
    blocksData[blockId]?.layout ?? defaultLayout;

  const saveBlock = (blockId: number, newText: string, newLayout: LayoutType) => {
    setBlocksData({ ...blocksData, [blockId]: { text: newText, layout: newLayout } });
  };

  return { getBlockText, getBlockLayout, saveBlock };
}
