import { connection } from "next/server";
import { connectDB } from "./db";
import { Blog, Offer, Settings, getSettings } from "./models";
import { STARTER_BLOGS } from "./starter-blogs";
import { SITE } from "./site";
import type { BlogItem, OfferItem } from "@/components/Cards";

// Shown on the website until the admin adds offers in /admin/offers (rates are indicative — update them there)
export const SAMPLE_OFFERS: Omit<OfferItem, "_id">[] = [
  { lender: "HDFC Bank", loanType: "Personal Loan", interestRate: "10.90% onwards", maxAmount: "Up to ₹40 Lakh", tenure: "Up to 6 years", processingFee: "Up to ₹6,500", highlight: "Instant approval" },
  { lender: "ICICI Bank", loanType: "Personal Loan", interestRate: "10.85% onwards", maxAmount: "Up to ₹50 Lakh", tenure: "Up to 6 years", processingFee: "Up to 2%", highlight: "Pre-approved offers" },
  { lender: "Axis Bank", loanType: "Personal Loan", interestRate: "11.25% onwards", maxAmount: "Up to ₹40 Lakh", tenure: "Up to 7 years", processingFee: "Up to 2%", highlight: "" },
  { lender: "IDFC FIRST Bank", loanType: "Personal Loan", interestRate: "10.99% onwards", maxAmount: "Up to ₹10 Lakh", tenure: "Up to 5 years", processingFee: "Up to 3.5%", highlight: "" },
  { lender: "Tata Capital", loanType: "Business Loan", interestRate: "14.50% onwards", maxAmount: "Up to ₹75 Lakh", tenure: "Up to 5 years", processingFee: "Up to 2.5%", highlight: "No collateral" },
  { lender: "Lendingkart", loanType: "Business Loan", interestRate: "15% onwards", maxAmount: "Up to ₹2 Crore", tenure: "Up to 3 years", processingFee: "Up to 3%", highlight: "Quick disbursal" },
  { lender: "SBI", loanType: "Home Loan", interestRate: "7.50% onwards", maxAmount: "Up to ₹10 Crore", tenure: "Up to 30 years", processingFee: "0.35%", highlight: "Lowest rate" },
  { lender: "HDFC Bank", loanType: "Home Loan", interestRate: "7.90% onwards", maxAmount: "Up to ₹10 Crore", tenure: "Up to 30 years", processingFee: "Up to 0.5%", highlight: "" },
  { lender: "ICICI Bank", loanType: "Loan Against Property", interestRate: "9% onwards", maxAmount: "Up to ₹5 Crore", tenure: "Up to 15 years", processingFee: "Up to 1%", highlight: "" },
  { lender: "Muthoot Finance", loanType: "Gold Loan", interestRate: "9.50% onwards", maxAmount: "Up to ₹1 Crore", tenure: "Up to 3 years", processingFee: "Nil", highlight: "Cash in 30 min" },
  { lender: "Axis Bank", loanType: "Car Loan", interestRate: "9.30% onwards", maxAmount: "Up to 100% on-road", tenure: "Up to 7 years", processingFee: "Up to 1%", highlight: "" },
];

export async function getOffers(loanType?: string): Promise<OfferItem[]> {
  await connection(); // always fresh from DB (no build-time caching)
  try {
    await connectDB();
    if ((await Offer.estimatedDocumentCount()) === 0) {
      return SAMPLE_OFFERS.filter((o) => !loanType || o.loanType === loanType).map((o, i) => ({ ...o, _id: `s${i}` }));
    }
    const rows = await Offer.find({ active: true, ...(loanType ? { loanType } : {}) })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return rows.map((o) => ({ ...o, _id: String(o._id) })) as unknown as OfferItem[];
  } catch (e) {
    console.error("[getOffers]", (e as Error).message);
    return SAMPLE_OFFERS.filter((o) => !loanType || o.loanType === loanType).map((o, i) => ({ ...o, _id: `s${i}` }));
  }
}

/** Adds the starter articles once, when the blog is empty (deleted posts are never re-added). */
export async function ensureStarterBlogs() {
  const settings = await getSettings();
  if (settings.starterBlogsAdded) return;
  const claimed = await Settings.findOneAndUpdate({ key: "main", starterBlogsAdded: { $ne: true } }, { starterBlogsAdded: true });
  if (!claimed || (await Blog.estimatedDocumentCount()) > 0) return;
  await Blog.insertMany(
    STARTER_BLOGS.map(({ daysAgo, ...raw }) => {
      const date = new Date(Date.now() - daysAgo * 86_400_000);
      // Articles are written for "MyLoanWala" — swap in the configured brand name
      const b = JSON.parse(JSON.stringify(raw).replaceAll("MyLoanWala", SITE.name));
      return { ...b, imageCredit: "Photo: rawpixel (CC0)", published: true, createdAt: date, updatedAt: date };
    })
  );
}

export async function getBlogs(opts: { limit?: number; category?: string; skip?: number } = {}) {
  await connection();
  try {
    await connectDB();
    await ensureStarterBlogs();
    const filter = { published: true, ...(opts.category ? { category: opts.category } : {}) };
    const [rows, total] = await Promise.all([
      Blog.find(filter)
        .sort({ createdAt: -1 })
        .skip(opts.skip || 0)
        .limit(opts.limit || 12)
        .select("slug title excerpt coverImage category createdAt")
        .lean(),
      Blog.countDocuments(filter),
    ]);
    return { blogs: rows.map((b) => ({ ...b, _id: String(b._id) })) as unknown as BlogItem[], total };
  } catch (e) {
    console.error("[getBlogs]", (e as Error).message);
    return { blogs: [] as BlogItem[], total: 0 };
  }
}
