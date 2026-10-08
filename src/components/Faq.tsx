import { ChevronDown } from "lucide-react";

export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
      {items.map((f) => (
        <details key={f.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
            {f.q}
            <ChevronDown className="h-5 w-5 shrink-0 text-brand transition group-open:rotate-180" />
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-body">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
