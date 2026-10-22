"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Thin blue progress bar at the top of the page (like YouTube / Paisabazaar).
 * Starts the moment an internal link is clicked, finishes when the new page renders.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [progress, setProgress] = useState(0); // 0 = hidden
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  // Start on click of any internal link
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href") || "";
      if (!href || href.startsWith("#") || /^(mailto|tel|https?:\/\/wa\.me):?/.test(href)) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return; // same page
      clear();
      setProgress(12);
      // trickle towards 90% while the page loads
      [[150, 35], [400, 55], [900, 70], [1800, 82], [3500, 90]].forEach(([ms, p]) =>
        timers.current.push(window.setTimeout(() => setProgress((cur) => (cur > 0 ? Math.max(cur, p) : cur)), ms))
      );
      timers.current.push(window.setTimeout(() => setProgress(0), 15000)); // safety
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // URL changed (state adjusted during render — React's recommended pattern).
  // The new page may still be showing its loading skeleton, so keep going until it's gone.
  const routeKey = `${pathname}?${search.toString()}`;
  const [lastRoute, setLastRoute] = useState(routeKey);
  const [settling, setSettling] = useState(false);
  if (routeKey !== lastRoute) {
    setLastRoute(routeKey);
    if (progress > 0) {
      setProgress((p) => Math.max(p, 70));
      setSettling(true);
    }
  }

  // Finish once no loading skeleton ([aria-busy]) is left on screen
  useEffect(() => {
    if (!settling) return;
    const started = Date.now();
    const id = window.setInterval(() => {
      if (!document.querySelector('[aria-busy="true"]') || Date.now() - started > 15000) {
        window.clearInterval(id);
        setSettling(false);
        setProgress(100);
      }
    }, 120);
    return () => window.clearInterval(id);
  }, [settling]);

  // After reaching 100%, fade out
  useEffect(() => {
    if (progress !== 100) return;
    clear();
    const t = window.setTimeout(() => setProgress(0), 350);
    return () => window.clearTimeout(t);
  }, [progress]);

  if (!progress) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]" aria-hidden>
      <div
        className="h-full bg-brand shadow-[0_0_10px_rgba(0,102,255,0.7)] transition-[width,opacity] duration-300 ease-out"
        style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
      />
    </div>
  );
}
