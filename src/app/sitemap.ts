import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { Blog } from "@/lib/models";
import { PRODUCTS } from "@/lib/products";
import { SITE } from "@/lib/site";
import { getBrand } from "@/lib/brand";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const brand = await getBrand();
  const pages = ["", "/credit-score", "/apply", "/offers", "/emi-calculator", "/blog", "/about", "/contact", "/partner", "/privacy-policy", "/terms"];
  const urls: MetadataRoute.Sitemap = [
    ...pages.map((p) => ({ url: `${brand.url}${p}` })),
    ...PRODUCTS.map((p) => ({ url: `${brand.url}/${p.slug}`, priority: 0.9 })),
  ];
  // Blog posts are listed only on the main domain (other domains point Google there)
  if (brand.domain !== SITE.domain) return urls;
  try {
    await connectDB();
    const blogs = await Blog.find({ published: true }).select("slug updatedAt").sort({ createdAt: -1 }).limit(5000).lean();
    urls.push(...blogs.map((b) => ({ url: `${brand.url}/blog/${b.slug}`, lastModified: b.updatedAt })));
  } catch {
    // DB unavailable at build time — static pages only
  }
  return urls;
}
