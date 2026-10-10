// Central place for business details — set these in .env to rebrand the whole website.
// Note: NEXT_PUBLIC_* must be written out literally so Next.js can include them in browser code.
export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "MyLoanWala",
  domain: process.env.NEXT_PUBLIC_DOMAIN || "myloanwala.com",
  // Logo: badge image (in /public) shown next to the two-colour wordmark + tagline
  logoImage: process.env.NEXT_PUBLIC_LOGO_IMAGE === "none" ? "" : process.env.NEXT_PUBLIC_LOGO_IMAGE || "/logo.png", // "none" = text-only logo
  logoText1: process.env.NEXT_PUBLIC_LOGO_TEXT_1 || "myloan",
  logoText2: process.env.NEXT_PUBLIC_LOGO_TEXT_2 || "wala",
  logoTagline: process.env.NEXT_PUBLIC_LOGO_TAGLINE || "LOAN HUA AASAN",
  botName: process.env.NEXT_PUBLIC_BOT_NAME || "Loan Mitra",
  tagline: "India's trusted platform for Loans & Offers",
  phone: process.env.NEXT_PUBLIC_PHONE || "+91 98765 43210",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "", // defaults to phone
  email: process.env.NEXT_PUBLIC_EMAIL || "support@myloanwala.com",
  address: process.env.NEXT_PUBLIC_ADDRESS || "New Delhi, India",
  hours: process.env.NEXT_PUBLIC_HOURS || "Mon – Sat, 9:30 AM – 7:00 PM",
  url: process.env.SITE_URL || "http://localhost:3000",
};

/** WhatsApp chat link (uses NEXT_PUBLIC_WHATSAPP, or the phone number). */
export const whatsappLink = (text = "Hi, I need help with a loan") =>
  `https://wa.me/${(SITE.whatsapp || SITE.phone).replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

export const formatINR = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN");

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export const BLOG_CATEGORIES = [
  "Personal Loan",
  "Home Loan",
  "Business Loan",
  "Credit Score",
  "Gold Loan",
  "Car Loan",
  "Personal Finance",
  "Banking News",
];
