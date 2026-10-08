/**
 * Fills a fresh database so the website looks complete on day one.
 *   npm run seed            → admin, settings, offers, starter blogs, demo leads & partners
 *   npm run seed -- --ai    → also writes 6 extra blog posts with AI (needs GROQ_API_KEY)
 * Safe to run again: it only adds what is missing.
 * Demo leads/partners are marked demo:true — remove them from Admin → Dashboard.
 */
import fs from "node:fs";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// Load env: .env.local (your computer) → .env.production (server) → .env
const envFile = [".env.local", ".env.production", ".env"].find((f) => fs.existsSync(f));
if (envFile) process.loadEnvFile(envFile);

const { Admin, Blog, Lead, Offer, Partner, Settings, DEFAULT_TOPICS } = await import("../src/lib/models");
const { STARTER_BLOGS } = await import("../src/lib/starter-blogs");
const { SITE } = await import("../src/lib/site");

const day = 86_400_000;
const ago = (days: number, hour = 11) => {
  const d = new Date(Date.now() - days * day);
  d.setHours(hour, (days * 37) % 60, 0, 0);
  return d;
};

async function main() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`Connected (${envFile}) → database "${mongoose.connection.name}"`);

  /* ---------- Admin ---------- */
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
  if (email && process.env.ADMIN_PASSWORD && !(await Admin.exists({}))) {
    await Admin.create({ email, passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10) });
    console.log(`✔ Admin created: ${email}`);
  } else console.log("• Admin already exists — unchanged");

  /* ---------- Settings ---------- */
  await Settings.updateOne(
    { key: "main" },
    { $setOnInsert: { key: "main", topics: DEFAULT_TOPICS, autoBlogEnabled: false, intervalHours: 1 }, $set: { starterBlogsAdded: true } },
    { upsert: true }
  );
  console.log("✔ Settings");

  /* ---------- Offers (real lenders, indicative rates — edit in Admin → Offers) ---------- */
  if ((await Offer.estimatedDocumentCount()) === 0) {
    const offers = [
      ["HDFC Bank", "Personal Loan", "10.90% onwards", "Up to ₹40 Lakh", "Up to 6 years", "Up to ₹6,500", "Instant approval"],
      ["ICICI Bank", "Personal Loan", "10.85% onwards", "Up to ₹50 Lakh", "Up to 6 years", "Up to 2%", "Pre-approved offers"],
      ["Axis Bank", "Personal Loan", "11.25% onwards", "Up to ₹40 Lakh", "Up to 7 years", "Up to 2%", ""],
      ["IDFC FIRST Bank", "Personal Loan", "10.99% onwards", "Up to ₹10 Lakh", "Up to 5 years", "Up to 3.5%", ""],
      ["Tata Capital", "Personal Loan", "11.99% onwards", "Up to ₹35 Lakh", "Up to 6 years", "Up to 5.5%", "Low CIBIL options"],
      ["Kotak Mahindra Bank", "Personal Loan", "10.99% onwards", "Up to ₹40 Lakh", "Up to 6 years", "Up to 5%", ""],
      ["Tata Capital", "Business Loan", "14.50% onwards", "Up to ₹75 Lakh", "Up to 5 years", "Up to 2.5%", "No collateral"],
      ["Lendingkart", "Business Loan", "15% onwards", "Up to ₹2 Crore", "Up to 3 years", "Up to 3%", "Quick disbursal"],
      ["IndusInd Bank", "Business Loan", "14% onwards", "Up to ₹50 Lakh", "Up to 4 years", "Up to 2.5%", ""],
      ["SBI", "Home Loan", "7.50% onwards", "Up to ₹10 Crore", "Up to 30 years", "0.35%", "Lowest rate"],
      ["HDFC Bank", "Home Loan", "7.90% onwards", "Up to ₹10 Crore", "Up to 30 years", "Up to 0.5%", ""],
      ["ICICI Bank", "Home Loan", "8.00% onwards", "Up to ₹10 Crore", "Up to 30 years", "0.50%", "Balance transfer"],
      ["ICICI Bank", "Loan Against Property", "9% onwards", "Up to ₹5 Crore", "Up to 15 years", "Up to 1%", ""],
      ["Tata Capital Housing", "Loan Against Property", "9.25% onwards", "Up to ₹10 Crore", "Up to 20 years", "Up to 1%", "High loan value"],
      ["Muthoot Finance", "Gold Loan", "9.50% onwards", "Up to ₹1 Crore", "Up to 3 years", "Nil", "Cash in 30 min"],
      ["HDFC Bank", "Gold Loan", "9.30% onwards", "Up to ₹50 Lakh", "Up to 2 years", "Up to 1%", ""],
      ["Axis Bank", "Car Loan", "9.30% onwards", "Up to 100% on-road", "Up to 7 years", "Up to 1%", ""],
      ["HDFC Bank", "Car Loan", "9.40% onwards", "Up to 100% on-road", "Up to 7 years", "Up to ₹10,000", "Same-day approval"],
    ];
    await Offer.insertMany(
      offers.map(([lender, loanType, interestRate, maxAmount, tenure, processingFee, highlight], order) => ({
        lender, loanType, interestRate, maxAmount, tenure, processingFee, highlight, order, active: true,
      }))
    );
    console.log(`✔ ${offers.length} offers`);
  } else console.log("• Offers already exist — unchanged");

  /* ---------- Starter blogs ---------- */
  let added = 0;
  for (const { daysAgo, ...raw } of STARTER_BLOGS) {
    if (await Blog.exists({ slug: raw.slug })) continue;
    const b = JSON.parse(JSON.stringify(raw).replaceAll("MyLoanWala", SITE.name));
    await Blog.collection.insertOne({
      ...b, imageCredit: "Photo: rawpixel (CC0)", published: true, aiGenerated: false,
      createdAt: ago(daysAgo, 10), updatedAt: ago(daysAgo, 10), __v: 0,
    });
    added++;
  }
  console.log(`✔ ${added} starter blogs added`);

  /* ---------- Extra AI-written blogs (optional) ---------- */
  if (process.argv.includes("--ai")) {
    const { aiWriteDraft } = await import("../src/lib/ai-blog");
    const topics: [string, string, number][] = [
      ["Loan against property: how it works, eligibility and who should take it", "/blog/loan-against-property.webp", 1],
      ["Credit card EMI vs personal loan for big purchases — which is cheaper", "/blog/credit-card.webp", 4],
      ["How to save lakhs on your loan with smart prepayment", "/blog/savings.webp", 8],
      ["Instant loan apps in India: RBI digital lending rules to stay safe", "/blog/digital-loan.webp", 11],
      ["How gold loan amount is calculated: LTV, purity and gold rate explained", "/blog/gold-rate.webp", 15],
      ["Top-up home loan: what it is and when you should use it", "/blog/top-up-loan.webp", 19],
    ];
    for (const [topic, image, daysAgo] of topics) {
      if (await Blog.exists({ coverImage: image })) continue;
      const recent = await Blog.find().select("title").lean();
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const d = await aiWriteDraft(topic, recent.map((r) => r.title));
          let slug = d.slug;
          for (let i = 2; await Blog.exists({ slug }); i++) slug = `${d.slug}-${i}`;
          await Blog.collection.insertOne({
            ...d, slug, coverImage: image, imageCredit: "Photo: rawpixel (CC0)", imageAlt: d.imageAlt || d.title,
            published: true, aiGenerated: true, createdAt: ago(daysAgo, 15), updatedAt: ago(daysAgo, 15), __v: 0,
          });
          console.log(`✔ AI blog: ${d.title} (${d.content.split(/\s+/).length} words)`);
          break;
        } catch (e) {
          console.log(`  retry ${attempt} (${(e as Error).message.slice(0, 90)})`);
          await new Promise((r) => setTimeout(r, 25_000)); // free Groq plan: tokens-per-minute limit
        }
      }
      await new Promise((r) => setTimeout(r, 15_000));
    }
  }

  /* ---------- Demo partners & leads ---------- */
  if (!(await Partner.exists({ demo: true }))) {
    const pw = await bcrypt.hash("Partner@123", 10);
    const partners = await Partner.insertMany([
      { name: "Rakesh Agarwal", company: "Shree Finance Solutions", type: "DSA", email: "shreefinance@example.com", phone: "9000012001", city: "Jaipur", status: "approved", createdAt: ago(40) },
      { name: "Neha Kulkarni", company: "Capital Connect Associates", type: "DSA", email: "capitalconnect@example.com", phone: "9000012002", city: "Pune", status: "approved", createdAt: ago(32) },
      { name: "Vikram Malhotra", company: "Vridhi Fincorp Pvt Ltd", type: "NBFC", email: "vridhifincorp@example.com", phone: "9000012003", city: "New Delhi", status: "approved", createdAt: ago(27) },
      { name: "Ananya Mishra", company: "Ananya Loan Services", type: "DSA", email: "ananyaloans@example.com", phone: "9000012004", city: "Lucknow", status: "pending", createdAt: ago(1) },
    ].map((p) => ({ ...p, passwordHash: pw, demo: true })));
    const [shree, capital, vridhi] = partners;

    type L = [string, string, string, number, number, string, string, number, ("website" | "partner"), unknown, unknown, string?];
    const leads: L[] = [
      ["Rohit Sharma", "Personal Loan", "Delhi", 500000, 65000, "Salaried", "new", 0.1, "website", null, null],
      ["Priya Nair", "Home Loan", "Bengaluru", 4500000, 140000, "Salaried", "new", 0.3, "website", null, null, "Submitted via AI chat assistant"],
      ["Arjun Mehta", "Business Loan", "Ahmedabad", 1500000, 0, "Business Owner", "contacted", 1, "website", vridhi._id, null, "Garment shop, 4 yrs vintage. Docs requested."],
      ["Sneha Reddy", "Personal Loan", "Hyderabad", 300000, 48000, "Salaried", "in-process", 1.5, "website", shree._id, null, "Documents received, sent to lender"],
      ["Mohammed Imran", "Gold Loan", "Mumbai", 200000, 0, "Self Employed", "disbursed", 2, "website", vridhi._id, null, "Disbursed ₹2,00,000"],
      ["Kavita Joshi", "Car Loan", "Pune", 800000, 90000, "Salaried", "approved", 3, "partner", capital._id, capital._id, "Approved at 9.4%"],
      ["Amit Verma", "Loan Against Property", "Lucknow", 3000000, 0, "Business Owner", "in-process", 3.5, "website", vridhi._id, null, "Property valuation scheduled"],
      ["Deepak Yadav", "Personal Loan", "Gurgaon", 700000, 85000, "Salaried", "contacted", 4, "website", null, null, "Call back on Monday"],
      ["Pooja Iyer", "Home Loan", "Chennai", 6000000, 180000, "Salaried", "approved", 5, "partner", shree._id, shree._id, "Sanction letter issued"],
      ["Sanjay Gupta", "Business Loan", "Indore", 2500000, 0, "Business Owner", "new", 5.5, "partner", null, shree._id],
      ["Ritu Saxena", "Personal Loan", "Noida", 400000, 52000, "Salaried", "rejected", 6, "website", null, null, "Low CIBIL score (640)"],
      ["Harpreet Singh", "Car Loan", "Chandigarh", 1000000, 120000, "Self Employed", "disbursed", 7, "website", capital._id, null, "Disbursed — Creta"],
      ["Anjali Deshmukh", "Gold Loan", "Nagpur", 150000, 0, "Self Employed", "new", 8, "website", null, null, "Submitted via AI chat assistant"],
      ["Vivek Tiwari", "Personal Loan", "Bhopal", 250000, 38000, "Salaried", "in-process", 9, "partner", capital._id, capital._id],
      ["Meera Pillai", "Home Loan", "Kochi", 3500000, 110000, "Salaried", "contacted", 10, "website", shree._id, null],
      ["Rajesh Khanna", "Loan Against Property", "Delhi", 5000000, 0, "Business Owner", "approved", 12, "website", vridhi._id, null, "Approved ₹45 Lakh"],
      ["Nikita Bansal", "Personal Loan", "Jaipur", 600000, 72000, "Salaried", "disbursed", 13, "partner", shree._id, shree._id, "Disbursed — wedding expenses"],
      ["Suresh Patil", "Business Loan", "Surat", 1200000, 0, "Business Owner", "in-process", 15, "website", vridhi._id, null],
      ["Farhan Qureshi", "Car Loan", "Hyderabad", 650000, 70000, "Salaried", "new", 16, "website", null, null],
      ["Lakshmi Menon", "Personal Loan", "Bengaluru", 350000, 55000, "Salaried", "disbursed", 18, "website", capital._id, null],
      ["Gaurav Chauhan", "Home Loan", "Dehradun", 2800000, 95000, "Salaried", "rejected", 20, "website", null, null, "Property papers incomplete"],
      ["Shalini Dubey", "Gold Loan", "Varanasi", 300000, 0, "Self Employed", "disbursed", 22, "partner", vridhi._id, vridhi._id],
    ];
    await Lead.insertMany(
      leads.map(([name, loanType, city, amount, monthlyIncome, employment, status, daysAgo, source, assignedTo, createdBy, notes], i) => ({
        name, loanType, city, amount, monthlyIncome, employment, status, source, notes: notes || "",
        phone: `90000${String(30001 + i)}`, email: "",
        ...(assignedTo ? { assignedTo } : {}), ...(createdBy ? { createdBy } : {}),
        demo: true, createdAt: ago(daysAgo, 9 + (i % 9)), updatedAt: ago(daysAgo, 9 + (i % 9)),
      }))
    );
    console.log(`✔ ${partners.length} demo partners (password: Partner@123) and ${leads.length} demo leads`);
  } else console.log("• Demo data already present — unchanged");

  const counts = await Promise.all([Blog, Offer, Lead, Partner, Admin].map((m) => (m as typeof Blog).countDocuments()));
  console.log(`\nDatabase now has → blogs: ${counts[0]}, offers: ${counts[1]}, leads: ${counts[2]}, partners: ${counts[3]}, admins: ${counts[4]}`);
  await mongoose.disconnect();
}

main().catch(async (e) => {
  console.error("✘ Seed failed:", e.message);
  await mongoose.disconnect();
  process.exit(1);
});
