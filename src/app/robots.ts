import type { MetadataRoute } from "next";
import { getBrand } from "@/lib/brand";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const brand = await getBrand();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/partner/dashboard"] },
    sitemap: `${brand.url}/sitemap.xml`,
  };
}
