import type { Metadata, Viewport } from "next";
import { Poppins, Roboto_Serif } from "next/font/google";
import { getBrand } from "@/lib/brand";
import { shareImage } from "@/lib/seo";
import { BrandProvider } from "@/components/BrandProvider";
import NavigationProgress from "@/components/NavigationProgress";
import { Suspense } from "react";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Paisabazaar-style serif headings
const robotoSerif = Roboto_Serif({
  variable: "--font-roboto-serif",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return {
    metadataBase: new URL(brand.url),
    title: { default: brand.seoTitle, template: `%s | ${brand.name}` },
    description: brand.seoDescription,
    keywords: brand.seoKeywords,
    applicationName: brand.name,
    authors: [{ name: brand.name, url: brand.url }],
    creator: brand.name,
    publisher: brand.name,
    category: "finance",
    alternates: { canonical: brand.url },
    openGraph: { siteName: brand.name, type: "website", locale: "en_IN", url: brand.url, title: brand.seoTitle, description: brand.seoDescription, images: [shareImage(brand)] },
    twitter: { card: "summary_large_image", title: brand.seoTitle, description: brand.seoDescription, images: [shareImage(brand).url] },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    formatDetection: { telephone: true, email: true, address: true },
    // Google Search Console HTML-tag verification (optional — DNS verification needs no code)
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION.split(",") } } : {}),
  };
}

export const viewport: Viewport = { themeColor: "#0066ff" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const brand = await getBrand();
  return (
    <html lang="en-IN" className={`${poppins.variable} ${robotoSerif.variable}`}>
      <body className="min-h-screen font-sans">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <BrandProvider brand={brand}>{children}</BrandProvider>
      </body>
    </html>
  );
}
