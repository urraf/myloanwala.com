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
          {HERO_SLIDES.map((s, n) => (
            <Link
              key={s.title}
              href={s.href}
              className="relative flex min-h-[184px] w-full shrink-0 items-center overflow-hidden px-5 py-6 sm:min-h-[220px] sm:px-7"
              style={{ background: s.from }}
            >
              {/* photo on the right, fading into the brand colour */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image}
                alt=""
                loading={n === 0 ? "eager" : "lazy"}
                className="absolute inset-y-0 right-0 h-full w-[68%] object-cover"
              />
              <span
                className="absolute inset-0"
                style={{ background: `linear-gradient(90deg, ${s.from} 0%, ${s.from} 34%, ${s.to}cc 58%, transparent 100%)` }}
              />
              <div className="relative z-10 max-w-[64%]">
                <p className="font-serif text-xl font-semibold leading-snug text-white drop-shadow sm:text-2xl">
                  {s.title}
                  <br />
                  <span className="font-sans text-[#ffd84d]">{s.highlight}</span>
                </p>
                <p className="mt-3 flex items-start gap-2 text-xs text-white/95 drop-shadow sm:text-[13px]">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white" /> {s.point}
                </p>
                <span
                  className="mt-5 inline-flex items-center gap-0.5 rounded-full px-4 py-2 text-sm font-semibold text-ink shadow-md sm:text-[15px]"
                  style={{ background: s.btn }}
                >
                  {s.cta || "Apply Now"} <ChevronRight className="h-4 w-4" />
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
