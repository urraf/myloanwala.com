import { connectDB } from "./db";
import { Blog, getSettings } from "./models";
import { BLOG_CATEGORIES, SITE, slugify } from "./site";
import { groqChat } from "./groq";

/** Everything the blog editor has — AI fills all of it. */
export type BlogDraft = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  coverImage: string;
  imageAlt: string;
  imageCredit: string;
};

/** Calls Groq in JSON mode and returns the parsed object (one retry on malformed JSON). */
async function groqJSON<T>(system: string, user: string, maxTokens = 8000): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const msg = await groqChat({
        temperature: 0.7,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      });
      return JSON.parse(String(msg?.content || "")) as T;
    } catch (e) {
      lastError = e as Error;
      if (lastError.message.startsWith("Groq API error 401") || lastError.message.includes("not set")) break;
    }
  }
  throw lastError!;
}

const SEO_RULES = `"metaTitle" (SEO title for Google, 50-60 characters, include the main keyword, end with " | ${SITE.name}" if it fits),
"metaDescription" (150-160 characters, include the main keyword, persuasive, invites a click),
"slug" (short URL slug, lowercase words joined by hyphens, 3-7 words, main keyword first),
"tags" (array of 5-8 SEO keywords people search on Google India, most important first),
"category" (one of: ${BLOG_CATEGORIES.join(", ")}),
"excerpt" (1-2 sentence summary, under 160 characters),
"imageQuery" (2-4 word English stock-photo search phrase matching the post, e.g. "indian family new home"),
"imageAlt" (descriptive alt text for the cover image, under 120 characters, include the main keyword)`;

type AIResult = Omit<BlogDraft, "coverImage" | "imageCredit"> & { imageQuery: string };

function cleanDraft(r: Partial<AIResult>): AIResult {
  const title = String(r.title || "").trim();
  return {
    title,
    slug: slugify(r.slug || title),
    excerpt: String(r.excerpt || "").trim(),
    content: String(r.content || "").trim(),
    category: BLOG_CATEGORIES.includes(String(r.category)) ? String(r.category) : "Personal Finance",
    tags: Array.isArray(r.tags) ? r.tags.map(String).map((t) => t.trim()).filter(Boolean).slice(0, 8) : [],
    metaTitle: String(r.metaTitle || title).trim().slice(0, 70),
    metaDescription: String(r.metaDescription || r.excerpt || "").trim().slice(0, 170),
    imageQuery: String(r.imageQuery || "finance money india"),
    imageAlt: String(r.imageAlt || title).trim(),
  };
}

/** Finds a relevant photo on Pexels (free API key: pexels.com/api). */
export async function findImage(query: string): Promise<{ url: string; credit: string } | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;
  try {
    const q = encodeURIComponent(query || "finance money india");
    const res = await fetch(`https://api.pexels.com/v1/search?query=${q}&orientation=landscape&per_page=15`, {
      headers: { Authorization: key },
    });
    if (!res.ok) return null;
    const { photos } = await res.json();
    if (!photos?.length) return query === "finance money" ? null : findImage("finance money");
    const photo = photos[Math.floor(Math.random() * Math.min(photos.length, 8))];
    return { url: photo.src.large2x || photo.src.large, credit: `Photo by ${photo.photographer} on Pexels` };
  } catch {
    return null;
  }
}

/** AI writes a complete post (content + all SEO fields + image). Nothing is saved. */
export async function aiWriteDraft(topic: string, avoidTitles: string[] = []): Promise<BlogDraft> {
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const system = `You are a senior finance content writer and SEO expert for ${SITE.name}, an Indian loan comparison website.
Write helpful, accurate, SEO-optimised blog posts for Indian readers in simple English.
Use ₹ for money, Indian examples (CIBIL, RBI, EMI, Lakh, Crore). Do not invent specific bank offers or exact current rates — use typical ranges and say rates vary by lender.
ACCURACY RULES (very important — this is a finance website):
- Never state current market prices (gold rate per gram, repo rate, today's bank rates); tell readers to check the latest figures.
- Only mention RBI rules, tax sections, limits or dates you are completely sure about. Never invent caps, limits, years or rule names. If unsure, describe it generally ("RBI rules require...") or leave it out.
- Do NOT write tables or examples with calculated EMI, interest or savings figures — instead suggest using the EMI calculator on the website.
Respond ONLY with a JSON object with these keys:
"title" (catchy H1 headline, under 70 characters),
"content" (the full article in Markdown, 900-1200 words, using ## and ### headings, bullet lists, one simple table if useful, a short FAQ section at the end, and a closing line inviting readers to compare loan offers on ${SITE.name}. Use the main keyword naturally in the first paragraph and in at least one heading. Do NOT repeat the title as a heading),
${SEO_RULES}`;
  const user = `Today is ${today}. Write a fresh blog post on: "${topic}".
Pick a specific, useful angle people search for in India.
Avoid these titles we already published: ${avoidTitles.slice(0, 30).map((t) => `"${t}"`).join(", ") || "none"}.`;

  const r = cleanDraft(await groqJSON<AIResult>(system, user));
  if (!r.title || !r.content) throw new Error("AI returned an incomplete post. Please try again.");
  const image = await findImage(r.imageQuery);
  return { ...r, coverImage: image?.url || "", imageCredit: image?.credit || "" };
}

/** For posts written by hand: AI fills slug, keywords, meta title/description, excerpt, category, image alt. */
export async function aiSeoForContent(title: string, content: string) {
  const system = `You are an SEO expert for ${SITE.name}, an Indian loan comparison website.
Given a blog post, respond ONLY with a JSON object with these keys:
"title" (keep the given title unless empty — then write one under 70 characters),
${SEO_RULES}`;
  const user = `Title: ${title || "(none)"}\n\nArticle:\n${content.slice(0, 12000)}`;
  const r = cleanDraft(await groqJSON<AIResult>(system, user, 3000));
  return { ...r, content: undefined };
}

async function uniqueSlug(base: string) {
  const root = slugify(base) || "post";
  let slug = root;
  for (let i = 2; await Blog.exists({ slug }); i++) slug = `${root}-${i}`;
  return slug;
}

/** Automation: AI writes a post on a random topic and saves it. */
export async function generateBlogPost(opts: { topic?: string; publish?: boolean } = {}) {
  await connectDB();
  const settings = await getSettings();
  const topics = settings.topics?.length ? settings.topics : ["Personal finance in India"];
  const topic = opts.topic?.trim() || topics[Math.floor(Math.random() * topics.length)];
  const recent = await Blog.find().sort({ createdAt: -1 }).limit(30).select("title").lean();

  const d = await aiWriteDraft(topic, recent.map((r) => r.title));
  return Blog.create({
    ...d,
    slug: await uniqueSlug(d.slug || d.title),
    published: opts.publish ?? true,
    aiGenerated: true,
  });
}
