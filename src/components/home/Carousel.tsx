"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Horizontal scroller with Paisabazaar-style round prev/next buttons and progress line. */
export default function Carousel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };
  const onScroll = () => {
    const el = ref.current;
    if (el) setProgress(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth));
  };

  return (
    <div className={className}>
      <div ref={ref} onScroll={onScroll} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
      <div className="mt-5 flex items-center justify-center gap-2">
        <button
          onClick={() => scroll(-1)}
          aria-label="Previous"
          className={`grid h-7 w-7 place-items-center rounded-full ${progress > 0.01 ? "bg-brand text-white" : "bg-[#d0d1d2] text-white"}`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="relative h-[3px] w-16 overflow-hidden rounded-full bg-line">
          <span className="absolute inset-y-0 left-0 rounded-full bg-[#9f9fa6]" style={{ width: `${30 + progress * 70}%` }} />
        </span>
        <button
          onClick={() => scroll(1)}
          aria-label="Next"
          className={`grid h-7 w-7 place-items-center rounded-full ${progress < 0.99 ? "bg-brand text-white" : "bg-[#d0d1d2] text-white"}`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
