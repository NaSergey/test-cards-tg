"use client";

import { LayoutType, TextContentProps } from "@/entities/block/model/types";
import { BlockImage, TextContent } from "@/entities/block";

interface BlockContentProps {
  layout: LayoutType;
  textContentProps: TextContentProps;
  imageSrc?: string;
  isManyLines: boolean;
  textSectionRounded: string | null;
  imageRounded: string | null;
  bgColor: string;
}

type RendererProps = BlockContentProps;

const LAYOUT_RENDERERS: Record<LayoutType, (props: RendererProps) => React.ReactNode> = {
  text: ({ textContentProps }) => (
    <TextContent {...textContentProps} />
  ),

  horizontal: ({ textContentProps, imageSrc, isManyLines }) => (
    <>
      <BlockImage variant="horizontal" imageSrc={imageSrc} isManyLines={isManyLines} />
      <div className="flex-1 min-w-0">
        <TextContent {...textContentProps} minH />
      </div>
    </>
  ),

  "vertical-top": ({ textContentProps, imageSrc, imageRounded, textSectionRounded, bgColor }) => (
    <>
      <BlockImage variant="vertical" imageSrc={imageSrc} rounded={imageRounded!} />
      <div className={`px-4 py-4 ${textSectionRounded}`} style={{ backgroundColor: bgColor }}>
        <TextContent {...textContentProps} minH />
      </div>
    </>
  ),

  "vertical-bottom": ({ textContentProps, imageSrc, imageRounded, textSectionRounded, bgColor }) => (
    <>
      <div className={`px-4 py-4 ${textSectionRounded}`} style={{ backgroundColor: bgColor }}>
        <TextContent {...textContentProps} minH />
      </div>
      <BlockImage variant="vertical" imageSrc={imageSrc} rounded={imageRounded!} />
    </>
  ),
};

export default function BlockContent(props: BlockContentProps) {
  return <>{LAYOUT_RENDERERS[props.layout](props)}</>;
}
