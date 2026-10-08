import type { Metadata, Viewport } from "next";
import { Poppins, Roboto_Serif } from "next/font/google";
import { SITE } from "@/lib/site";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Compare & Apply for Personal, Home & Business Loans`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Compare loan offers from top banks & NBFCs. Apply online for personal loan, business loan, home loan, loan against property, gold loan and car loan at the best interest rates.",
  openGraph: { siteName: SITE.name, type: "website" },
};

export const viewport: Viewport = { themeColor: "#0066ff" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${robotoSerif.variable}`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
