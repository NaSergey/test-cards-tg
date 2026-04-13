import ThreeDots from "./icon/ThreeDots";

interface TextBlockProps {
  text: string;
}

export default function TextBlock({ text }: TextBlockProps) {
  return (
    <div className="relative bg-white rounded-2xl shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] border border-gray-100 px-4 py-4 w-86.25">
      <button className="absolute top-3 right-3 leading-none">
        <ThreeDots />
      </button>
      <p className="text-sm leading-[1.4] text-gray-800 pr-8 wrap-break-word">{text}</p>
    </div>
  );
}
