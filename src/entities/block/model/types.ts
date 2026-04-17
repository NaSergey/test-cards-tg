export type LayoutType = "text" | "horizontal" | "vertical-top" | "vertical-bottom";

export interface BlockProps {
  text: string;
  imageSrc?: string;
  count?: number;
  countActive?: boolean;
  initialLayout?: LayoutType;
  id?: string | number;
  onSave?: (text: string, layout: LayoutType) => void;
  isFocused?: boolean;
  isSelected?: boolean;
  onFocus?: () => void;
  onSelectToggle?: () => void;
  onEditChange?: (editing: boolean) => void;
}

export interface TextContentProps {
  menuOpen: boolean;
  editingText: string;
  text: string;
  textRef: React.RefObject<HTMLParagraphElement | null>;
  endRef: React.RefObject<HTMLSpanElement | null>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (text: string) => void;
  extraBottomPad: number;
  minH?: boolean;
}

export interface BlockMenuBarProps {
  menuOpen: boolean;
  layoutSelectorOpen: boolean;
  layout: LayoutType;
  hasChanges: boolean;
  editingText: string;
  onCancel: () => void;
  onSave: () => void;
  onLayoutSelectorToggle: () => void;
  onLayoutChange: (layout: LayoutType) => void;
}
