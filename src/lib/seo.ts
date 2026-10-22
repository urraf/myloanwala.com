import type { Metadata } from "next";
import { getBrand } from "./brand";
import type { Brand } from "./site";

/**
 * Standard SEO metadata for a page: unique title + description, canonical URL on the visited domain,
 * Open Graph / Twitter cards and keywords. The share image comes from app/opengraph-image.tsx.
 */
export async function pageMetadata(opts: {
  title: string;
  description: string;
  path: string; // e.g. "/home-loan" (no query string)
  keywords?: string[];
  absoluteTitle?: boolean; // don't append " | Brand"
  noindex?: boolean;
}): Promise<Metadata> {
  const brand = await getBrand();
  const url = `${brand.url}${opts.path === "/" ? "" : opts.path}`;
  const title = opts.absoluteTitle ? { absolute: opts.title } : opts.title;
  const fullTitle = opts.absoluteTitle ? opts.title : `${opts.title} | ${brand.name}`;
  return {
    title,
    description: opts.description,
    keywords: [...(opts.keywords || []), ...brand.seoKeywords].slice(0, 15),
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: fullTitle, description: opts.description, siteName: brand.name, locale: "en_IN", images: [shareImage(brand)] },
    twitter: { card: "summary_large_image", title: fullTitle, description: opts.description, images: [shareImage(brand).url] },
    ...(opts.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** The branded 1200×630 share image (app/opengraph-image.tsx) for WhatsApp / Facebook / X previews. */
export const shareImage = (brand: Brand) => ({ url: `${brand.url}/opengraph-image`, width: 1200, height: 630, alt: brand.seoTitle });

/* ---------------- Structured data (JSON-LD) for Google rich results ---------------- */

export function organizationJsonLd(brand: Brand) {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": `${brand.url}/#organization`,
    name: brand.name,
    url: brand.url,
    logo: brand.logoImage ? `${brand.url}${brand.logoImage}` : `${brand.url}/icon`,
    image: `${brand.url}/opengraph-image`,
    description: brand.seoDescription,
    telephone: brand.phone.replace(/\s/g, ""),
    email: brand.email,
    priceRange: "Free service",
    address: {
      "@type": "PostalAddress",
      streetAddress: brand.address.split(", New Delhi")[0],
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      postalCode: brand.address.match(/\b\d{6}\b/)?.[0] || "",
      addressCountry: "IN",
    },
    areaServed: { "@type": "Country", name: "India" },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:30",
      closes: "19:00",
    },
    contactPoint: { "@type": "ContactPoint", telephone: brand.phone.replace(/\s/g, ""), contactType: "customer service", areaServed: "IN", availableLanguage: ["English", "Hindi"] },
  };
}

export function websiteJsonLd(brand: Brand) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${brand.url}/#website`,
    name: brand.name,
    url: brand.url,
    inLanguage: "en-IN",
    publisher: { "@id": `${brand.url}/#organization` },
    potentialAction: { "@type": "SearchAction", target: `${brand.url}/offers?q={search_term_string}`, "query-input": "required name=search_term_string" },
  };
}

export function breadcrumbJsonLd(brand: Brand, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${brand.url}${it.path === "/" ? "" : it.path}`,
    })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
