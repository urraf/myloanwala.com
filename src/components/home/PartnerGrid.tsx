"use client";

import { useState } from "react";
import type { Bank } from "@/lib/banks";

export default function PartnerGrid({ banks, filters }: { banks: Bank[]; filters: string[] }) {
  const [active, setActive] = useState("All");
  const list = active === "All" ? banks : banks.filter((b) => b.types.includes(active));

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
        {["All", ...filters].map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`shrink-0 rounded border px-4 py-1.5 text-sm font-medium transition ${
              active === f ? "border-brand bg-brand text-white" : "border-brand bg-white text-brand hover:bg-tile"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-6 lg:grid-cols-7 lg:gap-7">
        {list.map((b) => (
          <div key={b.name} title={b.name} className="grid h-16 place-items-center rounded-lg bg-white px-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.logo} alt={b.name} loading="lazy" className="max-h-9 w-full max-w-[110px] object-contain" />
          </div>
        ))}
      </div>
    </>
  );
}
