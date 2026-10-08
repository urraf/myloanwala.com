"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ImageIcon, Loader2, Sparkles, Wand2 } from "lucide-react";
import { keepValuesOnSubmit } from "@/lib/form";
import { aiDraftBlog, aiFillSeo, aiFindImage, saveBlog } from "@/lib/actions/admin";
import { renderMarkdown } from "@/lib/markdown";
import { BLOG_CATEGORIES, SITE, slugify } from "@/lib/site";

export type BlogFormData = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  imageCredit?: string;
  imageAlt?: string;
  metaTitle?: string;
  metaDescription?: string;
  category?: string;
  tags?: string[];
  published?: boolean;
};

const DOMAIN = SITE.domain;

function Counter({ value, min, max }: { value: string; min: number; max: number }) {
  const n = value.length;
  const color = n === 0 ? "text-muted" : n < min || n > max ? "text-amber-600" : "text-success";
  return <span className={`text-[11px] font-medium ${color}`}>{n} / {max}</span>;
}

export default function BlogEditor({ blog = {} }: { blog?: BlogFormData }) {
  const [state, action, pending] = useActionState(saveBlog, {});
  const [f, setF] = useState({
    title: blog.title || "",
    slug: blog.slug || "",
    excerpt: blog.excerpt || "",
    content: blog.content || "",
    category: blog.category || BLOG_CATEGORIES[0],
    tags: blog.tags?.join(", ") || "",
    metaTitle: blog.metaTitle || "",
    metaDescription: blog.metaDescription || "",
    coverImage: blog.coverImage || "",
    imageAlt: blog.imageAlt || "",
    imageCredit: blog.imageCredit || "",
  });
  const [preview, setPreview] = useState(blog.coverImage || "");
  const [slugTouched, setSlugTouched] = useState(!!blog.slug);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [topic, setTopic] = useState("");
  const [aiMsg, setAiMsg] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState<"" | "draft" | "seo" | "image">("");
  const [, startTransition] = useTransition();

  const set = (k: keyof typeof f, v: string) =>
    setF((p) => ({ ...p, [k]: v, ...(k === "title" && !slugTouched ? { slug: slugify(v) } : {}) }));

  const run = (kind: "draft" | "seo" | "image", job: () => Promise<void>) => {
    setBusy(kind);
    setAiMsg(null);
    startTransition(async () => {
      try {
        await job();
      } finally {
        setBusy("");
      }
    });
  };

  const writeWithAI = () =>
    run("draft", async () => {
      const r = await aiDraftBlog(topic);
      if (!r.ok) return setAiMsg({ type: "error", text: r.error });
      const d = r.data;
      setF({
        title: d.title, slug: d.slug, excerpt: d.excerpt, content: d.content, category: d.category, tags: d.tags.join(", "),
        metaTitle: d.metaTitle, metaDescription: d.metaDescription, coverImage: d.coverImage, imageAlt: d.imageAlt, imageCredit: d.imageCredit,
      });
      setPreview(d.coverImage);
      setSlugTouched(true);
      setAiGenerated(true);
      setAiMsg({ type: "ok", text: "Done! AI filled every field below — review, edit anything, then click Save." });
    });

  const fillSeo = () =>
    run("seo", async () => {
      const r = await aiFillSeo(f.title, f.content);
      if (!r.ok) return setAiMsg({ type: "error", text: r.error });
      const d = r.data;
      setF((p) => ({
        ...p,
        title: p.title || d.title,
        slug: d.slug || p.slug,
        excerpt: p.excerpt || d.excerpt,
        category: d.category,
        tags: d.tags.join(", "),
        metaTitle: d.metaTitle,
        metaDescription: d.metaDescription,
        imageAlt: p.imageAlt || d.imageAlt,
      }));
      setSlugTouched(true);
      setAiMsg({ type: "ok", text: "SEO fields filled by AI — slug, keywords, meta title & description." });
    });

  const findImage = () =>
    run("image", async () => {
      const q = f.tags.split(",")[0]?.trim() || f.title;
      const r = await aiFindImage(q || "finance", f.category);
      if (!r.ok) return setAiMsg({ type: "error", text: r.error });
      setF((p) => ({ ...p, coverImage: r.data.url, imageCredit: r.data.credit, imageAlt: p.imageAlt || f.title }));
      setPreview(r.data.url);
    });

  // Simple SEO checklist
  const mainKeyword = f.tags.split(",")[0]?.trim().toLowerCase() || "";
  const words = f.content.split(/\s+/).filter(Boolean).length;
  const seoTitle = f.metaTitle || f.title;
  const seoDesc = f.metaDescription || f.excerpt;
  const checks = [
    { ok: seoTitle.length >= 30 && seoTitle.length <= 65, text: "SEO title is 30–65 characters" },
    { ok: seoDesc.length >= 110 && seoDesc.length <= 165, text: "Meta description is 110–165 characters" },
    { ok: !!mainKeyword && seoTitle.toLowerCase().includes(mainKeyword), text: "Main keyword (first keyword) is in the SEO title" },
    { ok: !!mainKeyword && f.content.toLowerCase().includes(mainKeyword), text: "Main keyword appears in the content" },
    { ok: words >= 600, text: `Content has 600+ words (now ${words})` },
    { ok: !!preview && !!f.imageAlt, text: "Cover image with alt text" },
    { ok: /^##\s/m.test(f.content), text: "Content uses ## headings" },
  ];
  const score = checks.filter((c) => c.ok).length;

  return (
    <form onSubmit={keepValuesOnSubmit(action)} className="space-y-6">
      <input type="hidden" name="id" value={blog.id || ""} />
      <input type="hidden" name="aiGenerated" value={aiGenerated ? "1" : ""} />

      {/* ---------- AI writer ---------- */}
      <div className="rounded-2xl border border-[#d6c9ff] bg-linear-to-r from-[#f4efff] to-[#eef4ff] p-5">
        <h2 className="flex items-center gap-2 font-semibold"><Sparkles className="h-5 w-5 text-[#7b3fe4]" /> Write with AI</h2>
        <p className="mt-1 text-xs text-body">
          Type a topic — AI writes the full blog and fills <b>everything</b>: title, content, slug, keywords, meta title,
          meta description, category and a matching cover image. Or write it yourself below.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), writeWithAI())}
            className="input bg-white"
            placeholder="e.g. How to get a personal loan with low CIBIL score"
          />
          <button type="button" onClick={writeWithAI} disabled={!!busy} className="btn shrink-0 bg-[#7b3fe4] text-white hover:bg-[#6a2fd4]">
            {busy === "draft" ? <><Loader2 className="h-4 w-4 animate-spin" /> Writing… (20-40 sec)</> : <><Wand2 className="h-4 w-4" /> Generate Full Blog</>}
          </button>
        </div>
        {aiMsg && (
          <p className={`mt-3 rounded-lg px-3 py-2 text-sm ${aiMsg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>{aiMsg.text}</p>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          {/* ---------- Title + content ---------- */}
          <div className="card space-y-4 p-5">
            <div>
              <label className="label">Blog Title (H1) *</label>
              <input name="title" value={f.title} onChange={(e) => set("title", e.target.value)} className="input text-base font-medium" required />
            </div>
            <div>
              <label className="label">Short Summary (shown on blog cards)</label>
              <textarea name="excerpt" value={f.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} maxLength={300} className="input" />
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-2">
              <div className="flex gap-1 text-sm font-medium">
                {(["write", "preview"] as const).map((t) => (
                  <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-lg px-3 py-1.5 capitalize ${tab === t ? "bg-soft text-brand" : "text-body"}`}>{t}</button>
                ))}
              </div>
              <span className="hidden text-xs text-muted sm:block">## Heading · **bold** · - bullet · [link](url) · {words} words</span>
            </div>
            <textarea
              name="content"
              value={f.content}
              onChange={(e) => set("content", e.target.value)}
              rows={26}
              className={`w-full resize-y p-4 font-mono text-sm outline-none ${tab === "preview" ? "hidden" : ""}`}
              placeholder={"## Introduction\n\nWrite your article here...\n\n## Key points\n\n- Point one\n- Point two"}
            />
            {tab === "preview" && <div className="prose-blog min-h-[400px] p-5" dangerouslySetInnerHTML={{ __html: renderMarkdown(f.content) }} />}
          </div>

          {/* ---------- SEO / Google preview ---------- */}
          <div className="card space-y-5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold">SEO — how it looks on Google</h2>
              <button type="button" onClick={fillSeo} disabled={!!busy} className="btn border border-[#7b3fe4] px-3 py-2 text-xs text-[#7b3fe4] hover:bg-[#f4efff]">
                {busy === "seo" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Auto-fill SEO with AI
              </button>
            </div>

            {/* Google search result preview */}
            <div className="rounded-xl border border-line bg-white p-4 font-[arial,sans-serif] shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f1f3f4] text-xs font-bold text-brand">₹</span>
                <div className="leading-tight">
                  <p className="text-sm text-[#202124]">{SITE.name}</p>
                  <p className="truncate text-xs text-[#4d5156]">https://{DOMAIN} › blog › {f.slug || "your-post-url"}</p>
                </div>
              </div>
              <p className="mt-2 line-clamp-1 text-xl leading-snug text-[#1a0dab] hover:underline">
                {seoTitle || "Your SEO title will appear here"}
              </p>
              <p className="mt-1 line-clamp-2 text-sm leading-snug text-[#4d5156]">
                <span className="text-[#70757a]">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} — </span>
                {seoDesc || "Your meta description will appear here. Write 150-160 characters that make people want to click."}
              </p>
            </div>

            <div>
              <label className="label">URL Slug</label>
              <div className="flex">
                <span className="hidden items-center rounded-l-lg border border-r-0 border-line bg-tile px-3 text-xs text-body sm:flex">{DOMAIN}/blog/</span>
                <input
                  name="slug"
                  value={f.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                  }}
                  className="input sm:rounded-l-none"
                  placeholder="auto-from-title"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between"><label className="label">SEO Title (meta title)</label><Counter value={f.metaTitle} min={30} max={60} /></div>
              <input name="metaTitle" value={f.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} className="input" placeholder="Leave empty to use the blog title" />
            </div>
            <div>
              <div className="flex items-center justify-between"><label className="label">Meta Description</label><Counter value={f.metaDescription} min={110} max={160} /></div>
              <textarea name="metaDescription" value={f.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} rows={3} className="input" placeholder="Leave empty to use the short summary" />
            </div>
            <div>
              <label className="label">Keywords (comma separated — first one is the main keyword)</label>
              <input name="tags" value={f.tags} onChange={(e) => set("tags", e.target.value)} className="input" placeholder="personal loan, low cibil score, instant loan" />
            </div>

            <div className="rounded-xl bg-tile p-4">
              <p className="text-sm font-semibold">SEO score: <span className={score >= 6 ? "text-success" : score >= 4 ? "text-amber-600" : "text-red-600"}>{score} / {checks.length}</span></p>
              <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {checks.map((c) => (
                  <li key={c.text} className="flex items-start gap-2 text-xs text-body">
                    {c.ok ? <CheckCircle2 className="h-4 w-4 shrink-0 text-success" /> : <Circle className="h-4 w-4 shrink-0 text-muted" />} {c.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ---------- Sidebar ---------- */}
        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <div className="card space-y-4 p-5">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" name="published" defaultChecked={blog.published ?? true} className="h-4 w-4 accent-brand" /> Published (visible on website)
            </label>
            {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>}
            <button disabled={pending || !!busy} className="btn-primary w-full">
              {pending && <Loader2 className="h-4 w-4 animate-spin" />} {blog.id ? "Update Post" : "Save Post"}
            </button>
            <Link href="/admin/blogs" className="btn-outline w-full">Cancel</Link>
          </div>

          <div className="card p-5">
            <label className="label">Category</label>
            <select name="category" value={f.category} onChange={(e) => set("category", e.target.value)} className="input">
              {BLOG_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="card space-y-3 p-5">
            <p className="label">Cover Image</p>
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt={f.imageAlt} className="aspect-video w-full rounded-lg object-cover" />
            ) : (
              <div className="grid aspect-video place-items-center rounded-lg bg-tile text-muted"><ImageIcon className="h-8 w-8" /></div>
            )}
            <input
              type="file"
              name="coverFile"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
              className="block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-soft file:px-3 file:py-2 file:text-brand"
            />
            <button type="button" onClick={findImage} disabled={!!busy} className="btn w-full border border-line text-xs text-body hover:bg-tile">
              {busy === "image" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-[#7b3fe4]" />} Find matching image automatically
            </button>
            <p className="text-center text-xs text-muted">— or paste image URL —</p>
            <input
              name="coverImage"
              value={f.coverImage}
              onChange={(e) => {
                set("coverImage", e.target.value);
                setPreview(e.target.value);
              }}
              className="input"
              placeholder="https://..."
            />
            <div>
              <label className="label">Image alt text (for Google Images)</label>
              <input name="imageAlt" value={f.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} className="input" placeholder="Describe the image" />
            </div>
            <input name="imageCredit" value={f.imageCredit} onChange={(e) => set("imageCredit", e.target.value)} className="input" placeholder="Image credit (optional)" />
          </div>
        </div>
      </div>
    </form>
  );
}
