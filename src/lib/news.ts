/**
 * Latest loan & finance headlines from Google News RSS (free, no API key).
 * Used so automated blog posts are about what borrowers are reading about this week.
 */
export type Headline = { title: string; source: string; link: string; date: Date };

// Core products first — Home Loan & Loan Against Property get picked most often
const QUERIES = [
  "home loan", "home loan interest rate", "home loan EMI", "loan against property", "RBI repo rate loan",
  "housing finance India", "CIBIL score", "personal loan", "MSME business loan", "home loan balance transfer",
];

// Must mention at least one of these to be relevant for our readers
const RELEVANT = /home loan|housing|loan against property|\bLAP\b|mortgage|repo rate|\bRBI\b|\bEMI\b|interest rate|lending rate|MCLR|EBLR|RLLR|CIBIL|credit score|personal loan|business loan|MSME|gold loan|car loan|loan/i;
// Skip foreign markets, fraud/crime stories, magazine editions and similar noise
const SKIP = /forbes|\bUS\b|U\.S\.|america|federal reserve|\bFed\b|UK |britain|canada|australia|cyber|data leak|fraud|scam|arrest|ED raid|CBI|court|edition|podcast|live updates|stock|shares|sensex|nifty|IPO|quarter results|Q[1-4] result/i;

const decode = (s: string) =>
  s.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();

async function fetchQuery(q: string): Promise<Headline[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(`${q} India when:3d`)}&hl=en-IN&gl=IN&ceid=IN:en`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) return [];
  const xml = await res.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, it]) => {
    const source = decode(it.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] || "");
    let title = decode(it.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "");
    if (source && title.endsWith(` - ${source}`)) title = title.slice(0, -(source.length + 3));
    return {
      title,
      source,
      link: decode(it.match(/<link>([\s\S]*?)<\/link>/)?.[1] || ""),
      date: new Date(it.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || 0),
    };
  });
}

/** Returns fresh, relevant headlines (newest first). */
export async function latestHeadlines(): Promise<Headline[]> {
  const picks = [...QUERIES].sort(() => Math.random() - 0.5).slice(0, 3);
  const results = await Promise.allSettled(picks.map(fetchQuery));
  const all = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  const fresh = all.filter(
    (h) => h.title.length > 25 && Date.now() - h.date.getTime() < 4 * 86_400_000 && RELEVANT.test(h.title) && !SKIP.test(`${h.title} ${h.source}`)
  );
  return [...new Map(fresh.map((h) => [h.title.toLowerCase(), h])).values()].sort((a, b) => b.date.getTime() - a.date.getTime());
}
