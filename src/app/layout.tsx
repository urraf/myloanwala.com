import type { Metadata, Viewport } from "next";
import { Poppins, Roboto_Serif } from "next/font/google";
import { getBrand } from "@/lib/brand";
import { BrandProvider } from "@/components/BrandProvider";
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
    title: {
      default: `${brand.name} — Home Loan & Loan Against Property at Lowest Rates`,
      template: `%s | ${brand.name}`,
    },
    description:
      "Compare home loan and loan against property offers from 30+ banks & NBFCs at the lowest interest rates. Also personal & business loans and a free CIBIL score check.",
    openGraph: { siteName: brand.name, type: "website" },
  };
}

export const viewport: Viewport = { themeColor: "#0066ff" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const brand = await getBrand();
  return (
    <html lang="en" className={`${poppins.variable} ${robotoSerif.variable}`}>
      <body className="min-h-screen font-sans">
        <BrandProvider brand={brand}>{children}</BrandProvider>
      </body>
    </html>
  );
}
