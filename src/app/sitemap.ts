import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { Blog } from "@/lib/models";
import { PRODUCTS } from "@/lib/products";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/apply", "/offers", "/emi-calculator", "/blog", "/about", "/contact", "/partner", "/privacy-policy", "/terms"];
  const urls: MetadataRoute.Sitemap = [
    ...pages.map((p) => ({ url: `${SITE.url}${p}` })),
    ...PRODUCTS.map((p) => ({ url: `${SITE.url}/${p.slug}`, priority: 0.9 })),
  ];
  try {
    await connectDB();
    const blogs = await Blog.find({ published: true }).select("slug updatedAt").sort({ createdAt: -1 }).limit(5000).lean();
    urls.push(...blogs.map((b) => ({ url: `${SITE.url}/blog/${b.slug}`, lastModified: b.updatedAt })));
  } catch {
    // DB unavailable at build time — static pages only
  }
  return urls;
}
