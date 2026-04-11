"use client";

import { useEffect, useRef, useState } from "react";

interface RevealWhenLoadedProps {
  children: React.ReactNode;
  className?: string;
}

export default function RevealWhenLoaded({ children, className = "" }: RevealWhenLoadedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const images = Array.from(el.querySelectorAll("img"));
    if (images.length === 0) {
      setReady(true);
      return;
    }

    let remaining = images.length;
    const onSettle = () => {
      remaining--;
      if (remaining === 0) setReady(true);
    };

    const cleanups: (() => void)[] = [];
    images.forEach((img) => {
      if (img.complete) {
        onSettle();
      } else {
        img.addEventListener("load", onSettle);
        img.addEventListener("error", onSettle);
        cleanups.push(() => {
          img.removeEventListener("load", onSettle);
          img.removeEventListener("error", onSettle);
        });
      }
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}
