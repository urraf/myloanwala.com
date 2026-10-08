import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Finds a cover photo for a blog post — no API key needed.
 * 1. Pexels (only if PEXELS_API_KEY is set)
 * 2. Openverse (free, open-licence search by WordPress) — CC0 photos from rawpixel,
 *    downloaded and stored on our own server in /uploads so they never break
 * 3. A built-in photo from /public/blog matching the post category
 */
export type FoundImage = { url: string; credit: string };

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const UA = "MyLoanWala-website/1.0 (blog cover images)";

// Simple keywords that return good photos for each category
const CATEGORY_QUERIES: Record<string, string[]> = {
  "Personal Loan": ["indian rupees", "money cash", "laptop finance"],
  "Home Loan": ["house keys", "new home", "house"],
  "Business Loan": ["shop owner", "small business", "store"],
  "Credit Score": ["credit card", "payment card", "calculator"],
  "Gold Loan": ["gold jewelry", "gold", "gold bar"],
  "Car Loan": ["car keys", "new car", "car"],
  "Personal Finance": ["piggy bank", "savings coins", "calculator"],
  "Banking News": ["bank building", "bank", "finance office"],
};

// Built-in photos (always available) — last resort
const LOCAL: Record<string, string[]> = {
  "Personal Loan": ["/blog/personal-loan.webp", "/blog/loan-documents.webp"],
  "Home Loan": ["/blog/home-loan.webp", "/blog/top-up-loan.webp"],
  "Business Loan": ["/blog/business-loan.webp"],
  "Credit Score": ["/blog/credit-score.webp", "/blog/credit-card.webp"],
  "Gold Loan": ["/blog/gold-loan.webp", "/blog/gold-rate.webp"],
  "Car Loan": ["/blog/car-loan.webp"],
  "Personal Finance": ["/blog/savings.webp", "/blog/emi-calculator.webp"],
  "Banking News": ["/blog/loan-against-property.webp", "/blog/digital-loan.webp"],
};

// A photo must carry at least one of these words (title or tags) to count as relevant
const CATEGORY_TERMS: Record<string, string[]> = {
  "Personal Loan": ["money", "rupee", "cash", "currency", "finance", "wallet", "bank", "payment", "laptop"],
  "Home Loan": ["house", "home", "key", "real estate", "property", "apartment", "residential", "building"],
  "Business Loan": ["shop", "store", "retail", "entrepreneur", "business owner", "small business", "office", "market stall"],
  "Credit Score": ["credit card", "card", "payment", "finance", "calculator", "bank"],
  "Gold Loan": ["gold", "jewelry", "jewellery", "necklace", "bangle", "ornament"],
  "Car Loan": ["car key", "new car", "sedan", "suv", "car dealer", "driving", "automobile", "car"],
  "Personal Finance": ["money", "saving", "piggy", "coin", "finance", "budget", "calculator", "cash"],
  "Banking News": ["bank", "finance", "money", "office building", "skyscraper", "currency"],
};
// Never use photos tagged with these
const OFF_TOPIC = /\b(fire|firefighter|police|truck|bar|cocktail|alcohol|beer|wine|protest|war|military|soldier|weapon|gun|cemetery|grave|funeral|blood|accident|crash|watch|toy|cartoon|nude|bikini|art|artwork|painting|folk|historic|history|archive|antique|monochrome|black and white|old|ancient|museum|parliament|god|goddess|deity|hindu|religious|religion|temple|church|mosque|worship|miniature)\b/i;

const BAD_WORDS = /png|sticker|silhouette|illustration|vector|drawing|vintage|engraving|collage|pattern|clipart|icon|mockup|transparent|poster|painting|lithograph|map/i;
// Photos already shipped in /public/blog — don't download them again
const BUILT_IN_IDS = new Set([
  "feb51dbb-0117-41d3-862d-ff947ee24bee",
  "d02070cd-81a9-4afb-9197-7ec5b68866f5",
  "51ae66d1-6a74-4dd8-a1e6-c2114926edce",
  "95d5ed00-6fda-4186-a1a3-4c471b3be4b5",
  "a6a647e6-730f-4078-844a-7939ccba8578",
  "4c7470c1-4d87-43fe-b563-e2b1ef8236bf",
  "60403665-2c92-4668-8755-82333cf03bf0",
  "a05a02c0-ca97-41b2-84a3-79a9e646b252",
  "7584aea4-09cc-4a2d-ab97-9ac8ba5e9a45",
  "e5c54964-bc90-48d5-9efe-40ecddbf6f53",
  "88785b36-31a9-4348-b677-1fc27b6317b9",
  "fd276d15-0f78-4a69-aec5-4aad0108b9d7",
  "7e3a030d-457e-4ecd-beb8-b4d51118b548",
  "9d224b3d-d28d-4830-8edf-e8130e0e286b",
]);

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

async function pexels(query: string): Promise<FoundImage | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=15`, {
      headers: { Authorization: key },
    });
    if (!res.ok) return null;
    const { photos } = await res.json();
    if (!photos?.length) return null;
    const photo = photos[Math.floor(Math.random() * Math.min(photos.length, 8))];
    return { url: photo.src.large2x || photo.src.large, credit: `Photo by ${photo.photographer} on Pexels` };
  } catch {
    return null;
  }
}

type OVResult = { id: string; url: string; title?: string; width?: number; height?: number; tags?: { name: string }[] };

async function openverse(query: string, category: string): Promise<FoundImage | null> {
  try {
    const params = new URLSearchParams({ q: query, license: "cc0,pdm", source: "rawpixel", aspect_ratio: "wide", mature: "false", page_size: "20" });
    const res = await fetch(`https://api.openverse.org/v1/images/?${params}`, { headers: { "User-Agent": UA } });
    if (!res.ok) return null;
    const { results } = (await res.json()) as { results: OVResult[] };
    const terms = CATEGORY_TERMS[category] || CATEGORY_TERMS["Personal Finance"];
    const good = (results || []).filter((r) => {
      const text = `${r.title || ""} ${(r.tags || []).map((t) => t.name).join(" ")}`.toLowerCase();
      return (
        r.url &&
        !BAD_WORDS.test(`${r.title || ""} ${r.url}`) &&
        !OFF_TOPIC.test(text) &&
        terms.some((t) => new RegExp(`\\b${t}`).test(text)) && // whole-word match ("key" must not match "Kartikeya")
        (r.width || 0) >= 1200 &&
        (r.width || 0) / (r.height || 1) >= 1.25
      );
    });
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const existing = new Set(await fs.readdir(UPLOAD_DIR));
    for (const r of good.slice(0, 8)) {
      if (BUILT_IN_IDS.has(r.id) || [...existing].some((f) => f.startsWith(`ov-${r.id}.`))) continue; // already used on the site
      const img = await fetch(r.url, { headers: { "User-Agent": UA } });
      const ext = EXT[(img.headers.get("content-type") || "").split(";")[0]];
      if (!img.ok || !ext) continue;
      const buf = Buffer.from(await img.arrayBuffer());
      if (buf.length < 20_000 || buf.length > 6_000_000) continue;
      const name = `ov-${r.id}.${ext}`;
      await fs.writeFile(path.join(UPLOAD_DIR, name), buf);
      return { url: `/uploads/${name}`, credit: "Photo: rawpixel (CC0) via Openverse" };
    }
    return null;
  } catch {
    return null;
  }
}

export async function findImage(query: string, category = "Personal Finance"): Promise<FoundImage> {
  const q = (query || "").trim();
  const words = q.split(/\s+/).filter((w) => w.length > 3);
  const queries = [
    q,
    words.slice(0, 2).join(" "),
    ...(CATEGORY_QUERIES[category] || CATEGORY_QUERIES["Personal Finance"]),
  ].filter((x, i, a) => x && a.indexOf(x) === i);

  for (const term of queries.slice(0, 5)) {
    const found = (await pexels(term)) || (await openverse(term, category));
    if (found) return found;
  }
  const local = LOCAL[category] || LOCAL["Personal Finance"];
  return { url: local[crypto.randomInt(local.length)], credit: "Photo: rawpixel (CC0)" };
}
