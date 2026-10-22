import type { MetadataRoute } from "next";
import { getBrand } from "@/lib/brand";

/** Web app manifest per domain ("Add to Home Screen" name, icons, colours). */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const brand = await getBrand();
  return {
    name: brand.seoTitle,
    short_name: brand.name,
    description: brand.seoDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0066ff",
    lang: "en-IN",
    categories: ["finance", "business"],
    icons: [
      { src: "/icon", sizes: "192x192", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
