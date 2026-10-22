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
  phone: process.env.NEXT_PUBLIC_PHONE || "+91 99537 10961",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "", // defaults to phone
  email: process.env.NEXT_PUBLIC_EMAIL || "myloanwala050@gmail.com",
  address: process.env.NEXT_PUBLIC_ADDRESS || "Plot No. 29, 3rd Floor, Bhagwati Garden, Shisha Godam Rd, Block B, Uttam Nagar, New Delhi, Delhi 110059",
  hours: process.env.NEXT_PUBLIC_HOURS || "Mon – Sat, 9:30 AM – 7:00 PM",
  url: process.env.SITE_URL || "http://localhost:3000",
};

export type Brand = typeof SITE;

/**
 * One app, several domains: each domain shows its own brand (name, logo, chatbot name…).
 * Design, database, admin and blogs are shared. SITE (above) is the main brand.
 */
export const BRANDS: Brand[] = [
  SITE,
  {
    ...SITE,
    name: "Best Home Loan",
    domain: "besthomeloanindia.com",
    logoImage: "", // text logo with ₹ badge
    logoText1: "besthome",
    logoText2: "loan",
    phone: "+91 98182 50309",
    whatsapp: "", // uses the phone number
    email: "infobesthomeloan191@gmail.com",
    url: "https://www.besthomeloanindia.com",
  },
];

/** Picks the brand for a request host (e.g. "www.besthomeloanindia.com"). Unknown hosts → main brand. */
export function brandForHost(host?: string | null): Brand {
  const h = (host || "").toLowerCase().split(":")[0];
  // match the domain itself, any subdomain, or "<name>.localhost" for local testing
  return BRANDS.find((b) => h === b.domain || h.endsWith(`.${b.domain}`) || h.startsWith(`${b.domain.split(".")[0]}.`)) || SITE;
}

/** WhatsApp chat link for a brand (uses its WhatsApp number, or the phone number). */
export const whatsappLink = (brand: Brand = SITE, text = "Hi, I need help with a loan") =>
  `https://wa.me/${(brand.whatsapp || brand.phone).replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

/** Article text is written with the main brand name — show the visitor's brand instead. */
export const withBrand = (text: string, brand: Brand) =>
  brand.name === SITE.name || !text ? text : text.replaceAll(SITE.name, brand.name);

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
