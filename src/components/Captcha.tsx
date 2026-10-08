"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

/** Captcha image + input. Submits fields "captchaToken" and "captcha". A new `refreshKey` value loads a new code. */
export default function Captcha({ refreshKey }: { refreshKey?: unknown }) {
  const [data, setData] = useState<{ svg: string; token: string } | null>(null);
  const [value, setValue] = useState("");

  const load = useCallback(() => {
    fetch("/api/captcha", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setValue("");
      })
      .catch(() => setData(null));
  }, []);

  useEffect(load, [load, refreshKey]);

  return (
    <div>
      <label className="label">Enter the code shown</label>
      <div className="flex items-center gap-2">
        <div
          className="h-[46px] w-[150px] shrink-0 overflow-hidden rounded-lg border border-line bg-tile"
          dangerouslySetInnerHTML={{ __html: data?.svg || "" }}
        />
        <button type="button" onClick={load} className="rounded-lg p-2 text-brand hover:bg-tile" aria-label="New captcha" title="New code">
          <RefreshCw className="h-4 w-4" />
        </button>
        <input type="hidden" name="captchaToken" value={data?.token || ""} />
        <input
          name="captcha"
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          className="input min-w-0 uppercase tracking-widest"
          placeholder="Code"
          autoComplete="off"
          maxLength={5}
          required
        />
      </div>
    </div>
  );
}
