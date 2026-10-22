import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { Blog } from "@/lib/models";
import { PRODUCTS } from "@/lib/products";
import { SITE } from "@/lib/site";
import { getBrand } from "@/lib/brand";

/** One sitemap per domain (built from the visited domain). Blog posts are listed on the main domain only. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const brand = await getBrand();
  const now = new Date();
  type Freq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  const page = (path: string, priority: number, changeFrequency: Freq) => ({ url: `${brand.url}${path}`, lastModified: now, changeFrequency, priority });

  const urls: MetadataRoute.Sitemap = [
    page("", 1, "daily"),
    // core products first
    ...PRODUCTS.map((p, i) => page(`/${p.slug}`, i < 2 ? 0.95 : 0.85, "weekly")),
    page("/credit-score", 0.9, "weekly"),
    page("/apply", 0.9, "monthly"),
    page("/offers", 0.85, "daily"),
    page("/emi-calculator", 0.8, "monthly"),
    page("/blog", 0.8, "daily"),
    page("/partner", 0.6, "monthly"),
    page("/about", 0.5, "yearly"),
    page("/contact", 0.6, "yearly"),
    page("/privacy-policy", 0.2, "yearly"),
    page("/terms", 0.2, "yearly"),
  ];

  // Shared blog posts point Google to the main domain, so only list them there
  if (brand.domain !== SITE.domain) return urls;
  try {
    const blogs = await publishedBlogs();
    urls.push(
      ...blogs.map((b) => ({
        url: `${brand.url}/blog/${b.slug}`,
        lastModified: b.updatedAt,
        changeFrequency: "monthly" as Freq,
        priority: 0.7,
        ...(b.coverImage ? { images: [b.coverImage.startsWith("http") ? b.coverImage : `${brand.url}${b.coverImage}`] } : {}),
      }))
    );
  } catch {
    // database slow/unavailable — pages only, so Google never gets an error
  }
  return urls;
}

type BlogRow = { slug: string; updatedAt: Date; coverImage?: string };
const g = globalThis as unknown as { _sitemapBlogs?: { at: number; rows: BlogRow[] } };

/** Published posts, cached 10 min and capped at 5s so a cold database can't make Googlebot time out. */
async function publishedBlogs(): Promise<BlogRow[]> {
  if (g._sitemapBlogs && Date.now() - g._sitemapBlogs.at < 10 * 60_000) return g._sitemapBlogs.rows;
  const query = connectDB().then(() =>
    Blog.find({ published: true }).select("slug updatedAt coverImage").sort({ createdAt: -1 }).limit(5000).lean<BlogRow[]>()
  );
  const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error("sitemap db timeout")), 5000));
  try {
    const rows = await Promise.race([query, timeout]);
    g._sitemapBlogs = { at: Date.now(), rows };
    return rows;
  } catch (e) {
    if (g._sitemapBlogs) return g._sitemapBlogs.rows; // stale is better than nothing
    throw e;
  }
}
