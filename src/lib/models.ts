import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

function model<T>(name: string, schema: Schema<T>): Model<T> {
  // In development, hot reload re-runs this file — rebuild the model so schema edits apply
  if (process.env.NODE_ENV !== "production" && mongoose.models[name]) mongoose.deleteModel(name);
  return (mongoose.models[name] as Model<T>) || mongoose.model<T>(name, schema);
}

/* ---------- Admin ---------- */
const adminSchema = new Schema(
  {
    name: { type: String, default: "Admin" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    // Forgot-password OTP
    otpHash: String,
    otpExp: Date,
    otpAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);
export const Admin = model("Admin", adminSchema);

/* ---------- Partner (NBFC / DSA) ---------- */
export const PARTNER_TYPES = ["NBFC", "DSA"] as const;
export const PARTNER_STATUS = ["pending", "approved", "blocked"] as const;

const partnerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    type: { type: String, enum: PARTNER_TYPES, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    city: { type: String, default: "" },
    passwordHash: { type: String, required: true },
    status: { type: String, enum: PARTNER_STATUS, default: "pending" },
    demo: { type: Boolean, default: false }, // sample data — removable from the dashboard
  },
  { timestamps: true }
);
export type PartnerDoc = InferSchemaType<typeof partnerSchema> & { _id: mongoose.Types.ObjectId };
export const Partner = model("Partner", partnerSchema);

/* ---------- Lead (loan application) ---------- */
export const LEAD_STATUS = ["new", "contacted", "in-process", "approved", "disbursed", "rejected"] as const;

const leadSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    city: { type: String, default: "" },
    loanType: { type: String, required: true },
    amount: { type: Number, default: 0 },
    monthlyIncome: { type: Number, default: 0 },
    employment: { type: String, default: "" },
    status: { type: String, enum: LEAD_STATUS, default: "new" },
    notes: { type: String, default: "" },
    source: { type: String, enum: ["website", "partner"], default: "website" },
    // DSA / NBFC who submitted the lead
    createdBy: { type: Schema.Types.ObjectId, ref: "Partner" },
    // Partner (NBFC / DSA) this lead is assigned to by admin
    assignedTo: { type: Schema.Types.ObjectId, ref: "Partner" },
    demo: { type: Boolean, default: false }, // sample data — removable from the dashboard
  },
  { timestamps: true }
);
export const Lead = model("Lead", leadSchema);

/* ---------- Blog ---------- */
const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" }, // markdown
    coverImage: { type: String, default: "" },
    imageCredit: { type: String, default: "" },
    category: { type: String, default: "Finance" },
    tags: { type: [String], default: [] }, // SEO keywords (also shown as tags)
    // SEO — how the post appears on Google
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    imageAlt: { type: String, default: "" },
    published: { type: Boolean, default: true },
    aiGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export const Blog = model("Blog", blogSchema);

/* ---------- Loan offers shown on the website ---------- */
const offerSchema = new Schema(
  {
    lender: { type: String, required: true, trim: true },
    loanType: { type: String, required: true },
    interestRate: { type: String, required: true }, // e.g. "10.49% onwards"
    maxAmount: { type: String, default: "" }, // e.g. "Up to ₹40 Lakh"
    tenure: { type: String, default: "" }, // e.g. "Up to 5 years"
    processingFee: { type: String, default: "" },
    highlight: { type: String, default: "" }, // e.g. "Instant approval"
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);
export const Offer = model("Offer", offerSchema);

/* ---------- Uploaded images (stored in the database, so they survive redeploys on any host) ---------- */
const uploadSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);
export const Upload = model("Upload", uploadSchema);

/* ---------- Settings (single document) ---------- */
const settingsSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true },
    autoBlogEnabled: { type: Boolean, default: false },
    autoPublish: { type: Boolean, default: true }, // false = AI posts are saved as drafts for review
    intervalHours: { type: Number, default: 1 },
    topics: { type: [String], default: [] },
    lastRunAt: Date,
    lastStatus: { type: String, default: "" },
    starterBlogsAdded: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export const Settings = model("Settings", settingsSchema);

export const DEFAULT_TOPICS = [
  "Personal loans in India",
  "Home loans and home loan interest rates",
  "Business loans and MSME loans",
  "Credit score / CIBIL score tips",
  "Loan EMI planning and prepayment",
  "Gold loans",
  "Loan against property",
  "Car loans",
  "RBI rules and banking news explained",
  "Personal finance and saving money tips",
  "Tax benefits on loans",
  "Debt management and loan consolidation",
];

export async function getSettings() {
  return Settings.findOneAndUpdate(
    { key: "main" },
    { $setOnInsert: { key: "main", topics: DEFAULT_TOPICS } },
    { upsert: true, returnDocument: "after" }
  );
}
