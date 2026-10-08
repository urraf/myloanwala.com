"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { HERO_SLIDES } from "@/lib/nav";

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % HERO_SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-w-0">
      <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl">
        <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${i * 100}%)` }}>
          {HERO_SLIDES.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="relative flex min-h-[176px] w-full shrink-0 items-center overflow-hidden px-5 py-6 sm:min-h-[220px] sm:px-7"
              style={{ background: `linear-gradient(115deg, ${s.from} 0%, ${s.to} 100%)` }}
            >
              {/* decorative rings */}
              <span className="absolute -right-10 -top-16 h-56 w-56 rounded-full border-[28px] border-white/5" />
              <span className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/5" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/icons/${s.icon}.png`} alt="" className="absolute -right-2 bottom-2 h-28 w-28 rotate-[-8deg] drop-shadow-2xl sm:right-6 sm:h-40 sm:w-40" />
              <div className="relative z-10 max-w-[72%]">
                <p className="font-serif text-xl font-semibold leading-snug text-white sm:text-2xl">
                  {s.title}
                  <br />
                  <span className="font-sans text-[#ffd84d]">{s.highlight}</span>
                </p>
                <p className="mt-3 flex items-center gap-2 text-xs text-white/90 sm:text-[13px]">
                  <span className="h-1 w-1 rounded-full bg-white" /> {s.point}
                </p>
                <span
                  className="mt-5 inline-flex items-center gap-0.5 rounded-full px-4 py-2 text-sm font-semibold text-ink shadow-md sm:text-[15px]"
                  style={{ background: s.btn }}
                >
                  Apply Now <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {HERO_SLIDES.map((s, n) => (
          <button
            key={s.title}
            onClick={() => setI(n)}
            aria-label={`Slide ${n + 1}`}
            className={`h-2 w-2 rounded-full transition ${n === i ? "bg-[#333]" : "bg-[#b5b5b5]"}`}
          />
        ))}
      </div>
    </div>
  );
}
