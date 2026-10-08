"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Phone, RotateCcw, Send, X } from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";
import { SITE, whatsappLink } from "@/lib/site";

type Msg = { role: "user" | "assistant"; content: string };

const STORE_KEY = "mlw-chat";
const WELCOME: Msg = {
  role: "assistant",
  content: `Namaste! 👋 I'm **${SITE.botName}**, ${SITE.name}'s AI loan assistant.\n\nI can help you compare loan offers, calculate EMI, check eligibility and even apply — ask me anything about loans!`,
};
const QUICK = [
  "Check my personal loan eligibility",
  "Calculate EMI for ₹5 Lakh",
  "Best home loan interest rates",
  "Documents for business loan",
  "How to improve CIBIL score?",
  "I want to apply for a loan",
];

function loadHistory(): Msg[] {
  if (typeof window === "undefined") return [WELCOME];
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || "null");
    return Array.isArray(saved) && saved.length ? saved : [WELCOME];
  } catch {
    return [WELCOME];
  }
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(loadHistory);
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
        body: JSON.stringify({ messages: next.filter((m) => m !== WELCOME).slice(-12) }),
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
  const wa = whatsappLink();

  return (
    <>
      {/* Floating button + teaser */}
      {!open && (
        <div className="fixed bottom-5 right-4 z-50 flex items-end gap-3 sm:right-5">
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
