"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Phone, RotateCcw, Send, X } from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";
import { whatsappLink, type Brand } from "@/lib/site";
import { useBrand } from "./BrandProvider";

type Msg = { role: "user" | "assistant"; content: string };

const STORE_KEY = "mlw-chat";
const welcomeFor = (brand: Brand): Msg => ({
  role: "assistant",
  content: `Namaste! 👋 I'm **${brand.botName}**, ${brand.name}'s AI loan assistant.\n\nI can help you compare loan offers, calculate EMI, check eligibility and even apply — ask me anything about loans!`,
});
const QUICK = [
  "Check my personal loan eligibility",
  "Calculate EMI for ₹5 Lakh",
  "Best home loan interest rates",
  "Documents for business loan",
  "How to improve CIBIL score?",
  "I want to apply for a loan",
];

function loadHistory(WELCOME: Msg): Msg[] {
  if (typeof window === "undefined") return [WELCOME];
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || "null");
    return Array.isArray(saved) && saved.length ? saved : [WELCOME];
  } catch {
    return [WELCOME];
  }
}

export default function ChatWidget() {
  const SITE = useBrand();
  const WELCOME = welcomeFor(SITE);
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => loadHistory(WELCOME));
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Small "Need help?" bubble a few seconds after page load (once per session)
  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem("mlw-chat-teaser");
    } catch {}
    if (seen) return;
    const t = setTimeout(() => setTeaser(true), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {}
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  const openChat = () => {
    setOpen(true);
    setTeaser(false);
    try {
      sessionStorage.setItem("mlw-chat-teaser", "1");
    } catch {}
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m.content !== WELCOME.content).slice(-12) }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply || "Sorry, please try again." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: `Network issue. Please try again or call us at ${SITE.phone}.` }]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => setMessages([WELCOME]);
  const tel = `tel:${SITE.phone.replace(/\s/g, "")}`;
  const wa = whatsappLink(SITE);

  return (
    <>
      {/* Floating button + teaser */}
      {!open && (
        <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 sm:right-5">
          <a
            href={wa}
            target="_blank"
            rel="noopener"
            aria-label="Chat on WhatsApp"
            className="mr-1 grid h-14 w-14 place-items-center rounded-full border-4 border-white bg-[#25D366] text-white shadow-[0_6px_20px_rgba(37,211,102,0.45)] transition hover:scale-105"
          >
            <WhatsAppIcon className="h-7 w-7" />
          </a>
          <div className="flex items-end gap-3">
          {teaser && (
            <div className="relative mb-2 max-w-[220px] rounded-2xl rounded-br-sm bg-white p-3 text-sm text-ink shadow-[0_6px_24px_rgba(0,0,0,0.15)]">
              <button onClick={() => setTeaser(false)} className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-ink text-white" aria-label="Dismiss">
                <X className="h-3 w-3" />
              </button>
              <button onClick={openChat} className="text-left">
                Hi! 👋 Need a loan? <b className="text-brand">Ask {SITE.botName}</b> — I reply instantly.
              </button>
            </div>
          )}
          <button
            onClick={openChat}
            aria-label="Chat with AI loan assistant"
            className="relative grid h-16 w-16 place-items-center rounded-full border-4 border-white bg-linear-to-br from-brand to-brand-dark shadow-[0_6px_20px_rgba(0,102,255,0.45)] transition hover:scale-105"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-brand/30 [animation-duration:2.5s]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/robot.png" alt="" className="relative h-10 w-10" />
            <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-success" />
          </button>
          </div>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[620px] sm:max-h-[calc(100vh-40px)] sm:w-[390px] sm:rounded-2xl sm:shadow-[0_12px_48px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-3 bg-linear-to-r from-brand-dark to-brand px-4 py-3 text-white">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/robot.png" alt="" className="h-8 w-8" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-tight">{SITE.botName}</p>
              <p className="flex items-center gap-1.5 truncate text-xs text-white/80">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#4ade80]" /> Online · AI
              </p>
            </div>
            <a href={tel} className="rounded-lg p-2 hover:bg-white/15" title="Call an expert" aria-label="Call"><Phone className="h-4 w-4" /></a>
            <a href={wa} target="_blank" rel="noopener" className="rounded-lg p-2 hover:bg-white/15" title="WhatsApp" aria-label="WhatsApp"><MessageCircle className="h-4 w-4" /></a>
            <button onClick={reset} className="rounded-lg p-2 hover:bg-white/15" title="New chat" aria-label="New chat"><RotateCcw className="h-4 w-4" /></button>
            <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-white/15" aria-label="Close chat"><X className="h-5 w-5" /></button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#f5f7fb] px-3 py-4">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="ml-auto max-w-[82%] whitespace-pre-wrap break-words rounded-2xl rounded-br-sm bg-brand px-3.5 py-2.5 text-sm text-white">
                  {m.content}
                </div>
              ) : (
                <div key={i} className="flex max-w-[90%] items-end gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/robot.png" alt="" className="h-7 w-7 shrink-0 rounded-full bg-white p-0.5 shadow-sm" />
                  <div
                    className="prose-chat min-w-0 break-words rounded-2xl rounded-bl-sm border border-line bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm [overflow-wrap:anywhere]"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}
                  />
                </div>
              )
            )}
            {loading && (
              <div className="flex items-end gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/robot.png" alt="" className="h-7 w-7 rounded-full bg-white p-0.5 shadow-sm" />
                <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-line bg-white px-4 py-3.5 shadow-sm">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pl-9 pt-1">
                {QUICK.map((q) => (
                  <button key={q} onClick={() => send(q)} className="rounded-full border border-brand/40 bg-white px-3 py-1.5 text-xs font-medium text-brand hover:bg-tile">
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-line bg-white p-3"
          >
            <div className="flex items-end gap-2 rounded-xl border border-line px-3 py-1.5 focus-within:border-brand">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 1000))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder="Ask about loans, EMI, CIBIL…"
                className="max-h-28 flex-1 resize-none bg-transparent py-1.5 text-sm outline-none"
              />
              <button disabled={!input.trim() || loading} className="mb-0.5 grid h-8 w-8 place-items-center rounded-lg bg-brand text-white disabled:opacity-40" aria-label="Send">
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-muted">AI assistant · may make mistakes · rates are indicative</p>
          </form>
        </div>
      )}
    </>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
