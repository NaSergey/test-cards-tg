"use client";

import { useState } from "react";

import ImageBlock from "./ImageBlock";
import BlockCard from "./BlockCard";
import RevealWhenLoaded from "./RevealWhenLoaded";

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

const left = blocks.filter((_, i) => i % 2 === 0);
const right = blocks.filter((_, i) => i % 2 === 1);

export default function BlockPlayground() {
  const [inputText, setInputText] = useState("Hello world!");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center overflow-x-auto py-4 sm:py-8">
      <div className="flex justify-center min-w-fit px-4 sm:px-8">
      <RevealWhenLoaded className="flex gap-3 items-start">

      {/* Left — input + two preview cards */}
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Введите текст..."
          className="w-86.25 px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] text-[15px] text-gray-800 outline-none placeholder:text-gray-300"
        />
        <BlockCard text={inputText} />
        <ImageBlock
          imageSrc="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80"
          text={inputText}
          textPosition="bottom"
          count={42}
        />
        <BlockCard text={inputText} count={42} />
      </div>

      {/* Right — blocks in two columns */}
        <div className="flex flex-col gap-3">
          {left.map((block) => (
            <BlockCard
              key={block.id}
              text={block.text}
              count={block.count}
              imageSrc={block.imageSrc}
            />
          ))}
          <ImageBlock
            imageSrc="/bg.png"
            text="Hello world!"
            textPosition="top"
            count={10}
          />
        </div>
        <div className="flex flex-col gap-3">
          {right.map((block) => (
            <BlockCard
              key={block.id}
              text={block.text}
              count={block.count}
              imageSrc={block.imageSrc}
            />
          ))}
          <ImageBlock
            imageSrc="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80"
            text="Drinking water isn't just about quenching aaa bbbb"
            textPosition="bottom"
            count={42}
          />
        </div>
      </RevealWhenLoaded>
      </div>
    </div>
  );
}
