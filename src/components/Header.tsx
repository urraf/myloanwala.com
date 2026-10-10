"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Headphones, Handshake, Menu, MessageCircle, PhoneCall, X } from "lucide-react";
import Logo from "./Logo";
import { NAV_MENUS } from "@/lib/nav";
import { SITE, whatsappLink } from "@/lib/site";

const tel = `tel:${SITE.phone.replace(/\s/g, "")}`;
const whatsapp = whatsappLink();

export default function Header() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>("Loans");

  return (
    <header className="sticky top-0 z-40 bg-white">
      {/* Top utility strip */}
      <div className="hidden border-b border-line bg-[#f5f5f5] lg:block">
        <div className="container-x flex h-10 items-center justify-end gap-4 text-[13px] font-medium text-brand">
          <a href={tel} className="flex items-center gap-1.5 hover:underline">
            <PhoneCall className="h-4 w-4" /> Talk to Expert
          </a>
          <span className="h-4 w-px bg-line" />
          <a href={whatsapp} target="_blank" rel="noopener" className="flex items-center gap-1.5 hover:underline">
            <MessageCircle className="h-4 w-4" /> Apply on WhatsApp
          </a>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-line">
        <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[74px]">
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="-ml-1 p-1 text-ink xl:hidden" onClick={() => setOpen(true)} aria-label="Menu">
              <Menu className="h-6 w-6" />
            </button>
            <Logo />
          </div>

          <nav className="hidden items-center gap-4 xl:flex 2xl:gap-6">
            {NAV_MENUS.map((m) => (
              <div key={m.label} className="group relative">
                <button className="flex items-center gap-1 whitespace-nowrap py-6 text-[15px] font-medium text-ink group-hover:text-brand">
                  {m.label}
                  <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
                </button>
                <div className="invisible absolute left-1/2 top-full -translate-x-1/2 opacity-0 transition group-hover:visible group-hover:opacity-100">
                  <div className="min-w-[260px] rounded-lg border border-line bg-white py-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                    {m.links.map((l) => (
                      <Link key={l.label} href={l.href} className="block px-5 py-2.5 text-sm text-body hover:bg-tile hover:text-brand">
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href={tel} className="text-ink lg:hidden" aria-label="Call us">
              <Headphones className="h-6 w-6" />
            </a>
            <Link
              href="/partner"
              className="hidden items-center gap-1.5 whitespace-nowrap rounded border border-brand px-3 py-1.5 text-[13px] font-medium text-brand hover:bg-tile sm:flex xl:hidden 2xl:flex"
            >
              <Handshake className="h-4 w-4" /> Partner Login
            </Link>
            <Link href="/apply" className="whitespace-nowrap rounded border border-brand px-3 py-1.5 text-sm font-medium text-brand hover:bg-tile sm:px-4 sm:text-[15px] lg:px-5 lg:py-2">
              Apply Now
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile / tablet drawer */}
      {open && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-1"><X className="h-6 w-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {NAV_MENUS.map((m) => (
                <div key={m.label} className="border-b border-line">
                  <button
                    onClick={() => setSection(section === m.label ? null : m.label)}
                    className="flex w-full items-center justify-between px-4 py-3.5 text-left font-medium"
                  >
                    {m.label}
                    <ChevronDown className={`h-4 w-4 transition ${section === m.label ? "rotate-180" : ""}`} />
                  </button>
                  {section === m.label && (
                    <div className="bg-tile pb-2">
                      {m.links.map((l) => (
                        <Link key={l.label} href={l.href} onClick={() => setOpen(false)} className="block px-6 py-2.5 text-sm text-body">
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-line p-4">
              <a href={tel} className="btn-outline">Call Expert</a>
              <Link href="/apply" onClick={() => setOpen(false)} className="btn-primary">Apply Now</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
