"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import LeadForm from "./LeadForm";

// Pages that already show the form — no popup there
const SKIP = ["/apply", "/contact", "/credit-score", "/partner"];

/** "Check your loan offers" popup a few seconds after the first page load (once per browser session). */
export default function LeadPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (SKIP.some((p) => pathname.startsWith(p))) return;
    try {
      if (sessionStorage.getItem("mlw-lead-popup")) return;
    } catch {}
    const t = setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem("mlw-lead-popup", "1");
      } catch {}
    }, 3000);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/50" role="dialog" aria-modal="true" aria-label="Check your loan offers" onClick={() => setOpen(false)}>
      <div className="flex min-h-full items-center justify-center p-4">
      <div className="relative mt-10 w-full max-w-[400px]" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute -top-11 right-0 grid h-9 w-9 place-items-center rounded-full bg-white text-ink shadow hover:bg-soft"
        >
          <X className="h-4 w-4" />
        </button>
        <LeadForm />
      </div>
      </div>
    </div>
  );
}
