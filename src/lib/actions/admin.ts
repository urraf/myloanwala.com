"use server";

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { Admin, Blog, LEAD_STATUS, Lead, Offer, PARTNER_STATUS, PARTNER_TYPES, Partner, Settings, getSettings } from "@/lib/models";
import {
  checkPassword, createSession, destroySession, ensureAdminSeeded, hashPassword, requireAdmin,
} from "@/lib/auth";
import { sendMail } from "@/lib/mail";
import { verifyCaptcha } from "@/lib/captcha";
import { aiSeoForContent, aiWriteDraft, findImage, generateBlogPost, type BlogDraft } from "@/lib/ai-blog";
import { SAMPLE_OFFERS } from "@/lib/data";
import { LOAN_TYPES } from "@/lib/products";
import { SITE, slugify } from "@/lib/site";
import type { FormState } from "./public";

const str = (fd: FormData, k: string) => String(fd.get(k) || "").trim();
const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

/* =============== Auth =============== */

export async function adminLogin(_: FormState, fd: FormData): Promise<FormState> {
  if (!verifyCaptcha(str(fd, "captchaToken"), str(fd, "captcha"))) return { error: "Wrong captcha code. Please try again." };
  await ensureAdminSeeded();
  const admin = await Admin.findOne({ email: str(fd, "email").toLowerCase() });
  if (!admin || !(await checkPassword(str(fd, "password"), admin.passwordHash))) {
    return { error: "Invalid email or password" };
  }
  await createSession("admin", String(admin._id));
  redirect("/admin/dashboard");
}

export async function adminLogout() {
  await destroySession("admin");
  redirect("/admin");
}

/** Forgot password — step 1: email a 6-digit OTP (valid 10 minutes). */
export async function adminSendOtp(_: FormState, fd: FormData): Promise<FormState> {
  if (!verifyCaptcha(str(fd, "captchaToken"), str(fd, "captcha"))) return { error: "Wrong captcha code. Please try again." };
  await ensureAdminSeeded();
  const admin = await Admin.findOne({ email: str(fd, "email").toLowerCase() });
  if (admin) {
    const otp = String(crypto.randomInt(100000, 1000000));
    admin.otpHash = sha256(otp);
    admin.otpExp = new Date(Date.now() + 10 * 60_000);
    admin.otpAttempts = 0;
    await admin.save();
    console.log(`[admin-otp] OTP for ${admin.email}: ${otp}`);
    await sendMail(
      admin.email,
      `${SITE.name} admin — your password reset OTP`,
      `<p>Your OTP to reset the ${SITE.name} admin password is:</p>
       <p style="font-size:28px;font-weight:bold;letter-spacing:6px;color:#0066ff">${otp}</p>
       <p>This OTP is valid for 10 minutes. If you didn't request this, you can ignore this email.</p>`
    ).catch((e) => console.error("[admin-otp] email failed:", e));
  }
  // Same reply either way so nobody can guess the admin email
  return { ok: true, message: "If this email is registered, an OTP has been sent to it." };
}

/** Forgot password — step 2: verify OTP and set the new password. */
export async function adminResetWithOtp(_: FormState, fd: FormData): Promise<FormState> {
  const password = str(fd, "password");
  if (password.length < 8) return { error: "Password must be at least 8 characters" };
  if (password !== str(fd, "confirm")) return { error: "Passwords do not match" };
  await connectDB();
  const admin = await Admin.findOne({ email: str(fd, "email").toLowerCase() });
  const otp = str(fd, "otp");
  // DUMMY_OTP (testing only) — leave empty on the live server
  const dummy = process.env.DUMMY_OTP && otp === process.env.DUMMY_OTP;
  const valid = admin?.otpHash && admin.otpExp && admin.otpExp > new Date() && admin.otpAttempts < 5 && admin.otpHash === sha256(otp);
  if (!admin || !(dummy || valid)) {
    if (admin?.otpHash) await Admin.updateOne({ _id: admin._id }, { $inc: { otpAttempts: 1 } });
    return { error: "Invalid or expired OTP. Please request a new one." };
  }
  admin.passwordHash = await hashPassword(password);
  admin.otpHash = undefined;
  admin.otpExp = undefined;
  admin.otpAttempts = 0;
  await admin.save();
  return { ok: true, message: "Password updated successfully. You can now log in with your new password." };
}

export async function adminChangeEmail(_: FormState, fd: FormData): Promise<FormState> {
  const me = await requireAdmin();
  const admin = await Admin.findById(me._id);
  if (!admin || !(await checkPassword(str(fd, "current"), admin.passwordHash))) return { error: "Current password is incorrect" };
  const email = str(fd, "email").toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Enter a valid email address" };
  if (await Admin.exists({ email, _id: { $ne: admin._id } })) return { error: "This email is already in use" };
  admin.email = email;
  await admin.save();
  revalidatePath("/admin", "layout");
  return { ok: true, message: `Login email changed to ${email}. Use it next time you log in.` };
}

export async function adminChangePassword(_: FormState, fd: FormData): Promise<FormState> {
  const me = await requireAdmin();
  const admin = await Admin.findById(me._id);
  if (!admin || !(await checkPassword(str(fd, "current"), admin.passwordHash))) return { error: "Current password is incorrect" };
  const password = str(fd, "password");
  if (password.length < 8) return { error: "New password must be at least 8 characters" };
  if (password !== str(fd, "confirm")) return { error: "New passwords do not match" };
  admin.passwordHash = await hashPassword(password);
  await admin.save();
  return { ok: true, message: "Password changed successfully." };
}

/** Deletes the sample leads & partners added for the demo (marked demo: true). */
export async function removeDemoData() {
  await requireAdmin();
  await Promise.all([Lead.deleteMany({ demo: true }), Partner.deleteMany({ demo: true })]);
  revalidatePath("/admin", "layout");
}

/* =============== Leads =============== */

export async function updateLead(fd: FormData) {
  await requireAdmin();
  const status = str(fd, "status");
  const assignedTo = str(fd, "assignedTo");
  await Lead.updateOne(
    { _id: str(fd, "id") },
    {
      ...(LEAD_STATUS.includes(status as (typeof LEAD_STATUS)[number]) ? { status } : {}),
      assignedTo: assignedTo || null,
      notes: str(fd, "notes"),
    }
  );
  revalidatePath("/admin/leads");
}

export async function deleteLead(fd: FormData) {
  await requireAdmin();
  await Lead.deleteOne({ _id: str(fd, "id") });
  revalidatePath("/admin/leads");
}

/* =============== Partners =============== */

export async function setPartnerStatus(fd: FormData) {
  await requireAdmin();
  const status = str(fd, "status");
  if (!PARTNER_STATUS.includes(status as (typeof PARTNER_STATUS)[number])) return;
  await Partner.updateOne({ _id: str(fd, "id") }, { status });
  revalidatePath("/admin/partners");
}

export async function deletePartner(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await Partner.deleteOne({ _id: id });
  await Lead.updateMany({ assignedTo: id }, { $unset: { assignedTo: 1 } });
  revalidatePath("/admin/partners");
}

/** Admin creates an (already approved) partner account, or resets a partner's password. */
export async function adminSavePartner(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const email = str(fd, "email").toLowerCase();
  const password = str(fd, "password");
  const type = str(fd, "type");
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Enter a valid email" };
  if (password.length < 6) return { error: "Password must be at least 6 characters" };

  const existing = await Partner.findOne({ email });
  if (existing) {
    existing.passwordHash = await hashPassword(password);
    await existing.save();
    revalidatePath("/admin/partners");
    return { ok: true, message: `Password reset for ${email}` };
  }
  if (!PARTNER_TYPES.includes(type as (typeof PARTNER_TYPES)[number])) return { error: "Select partner type" };
  if (!str(fd, "name") || !str(fd, "company")) return { error: "Name and company are required" };
  await Partner.create({
    name: str(fd, "name"),
    company: str(fd, "company"),
    type,
    email,
    phone: str(fd, "phone"),
    city: str(fd, "city"),
    passwordHash: await hashPassword(password),
    status: "approved",
  });
  revalidatePath("/admin/partners");
  return { ok: true, message: `Partner ${email} created` };
}

/* =============== Offers =============== */

export async function saveOffer(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const data = {
    lender: str(fd, "lender"),
    loanType: str(fd, "loanType"),
    interestRate: str(fd, "interestRate"),
    maxAmount: str(fd, "maxAmount"),
    tenure: str(fd, "tenure"),
    processingFee: str(fd, "processingFee"),
    highlight: str(fd, "highlight"),
    order: Number(fd.get("order")) || 0,
    active: fd.get("active") === "on",
  };
  if (!data.lender || !data.interestRate) return { error: "Lender and interest rate are required" };
  if (!LOAN_TYPES.includes(data.loanType)) return { error: "Select loan type" };
  const id = str(fd, "id");
  if (id) await Offer.updateOne({ _id: id }, data);
  else await Offer.create(data);
  revalidatePath("/", "layout");
  if (id) redirect("/admin/offers");
  return { ok: true, message: "Offer saved" };
}

export async function deleteOffer(fd: FormData) {
  await requireAdmin();
  await Offer.deleteOne({ _id: str(fd, "id") });
  revalidatePath("/", "layout");
}

export async function importSampleOffers() {
  await requireAdmin();
  if ((await Offer.estimatedDocumentCount()) === 0) {
    await Offer.insertMany(SAMPLE_OFFERS.map((o, i) => ({ ...o, order: i })));
  }
  revalidatePath("/", "layout");
}

/* =============== Blogs =============== */

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };

async function saveUpload(file: File) {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new Error("Only JPG, PNG, WEBP or GIF images are allowed");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be smaller than 5MB");
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function saveBlog(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id");
  const title = str(fd, "title");
  if (!title) return { error: "Title is required" };
  const content = str(fd, "content");
  if (!content) return { error: "Content is required" };

  let coverImage = str(fd, "coverImage");
  const file = fd.get("coverFile");
  if (file instanceof File && file.size > 0) {
    try {
      coverImage = await saveUpload(file);
    } catch (e) {
      return { error: (e as Error).message };
    }
  }

  let slug = slugify(str(fd, "slug") || title) || `post-${Date.now()}`;
  if (await Blog.exists({ slug, ...(id ? { _id: { $ne: id } } : {}) })) slug = `${slug}-${Date.now().toString(36)}`;

  const data = {
    title,
    slug,
    excerpt: str(fd, "excerpt") || content.replace(/[#*_>`|-]/g, "").slice(0, 155),
    content,
    category: str(fd, "category") || "Personal Finance",
    tags: str(fd, "tags").split(",").map((t) => t.trim()).filter(Boolean),
    coverImage,
    imageCredit: str(fd, "imageCredit"),
    imageAlt: str(fd, "imageAlt"),
    metaTitle: str(fd, "metaTitle"),
    metaDescription: str(fd, "metaDescription"),
    published: fd.get("published") === "on",
    ...(fd.get("aiGenerated") === "1" ? { aiGenerated: true } : {}),
  };
  if (id) await Blog.updateOne({ _id: id }, data);
  else await Blog.create(data);
  revalidatePath("/", "layout");
  redirect("/admin/blogs");
}

/* ----- AI helpers used inside the blog editor (nothing is saved until "Save") ----- */

type AIResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function aiDraftBlog(topic: string): Promise<AIResult<BlogDraft>> {
  await requireAdmin();
  if (!topic.trim()) return { ok: false, error: "Enter a topic first" };
  try {
    const recent = await Blog.find().sort({ createdAt: -1 }).limit(30).select("title").lean();
    return { ok: true, data: await aiWriteDraft(topic, recent.map((r) => r.title)) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function aiFillSeo(title: string, content: string): Promise<AIResult<Awaited<ReturnType<typeof aiSeoForContent>>>> {
  await requireAdmin();
  if (content.trim().length < 100) return { ok: false, error: "Write some content first (at least a paragraph)" };
  try {
    return { ok: true, data: await aiSeoForContent(title, content) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function aiFindImage(query: string): Promise<AIResult<{ url: string; credit: string }>> {
  await requireAdmin();
  if (!process.env.PEXELS_API_KEY) return { ok: false, error: "PEXELS_API_KEY is not set in .env" };
  const img = await findImage(query);
  return img ? { ok: true, data: img } : { ok: false, error: "No image found — try other words" };
}

export async function deleteBlog(fd: FormData) {
  await requireAdmin();
  await Blog.deleteOne({ _id: str(fd, "id") });
  revalidatePath("/", "layout");
}

export async function toggleBlog(fd: FormData) {
  await requireAdmin();
  const blog = await Blog.findById(str(fd, "id"));
  if (blog) {
    blog.published = !blog.published;
    await blog.save();
  }
  revalidatePath("/", "layout");
}

/* =============== AI automation =============== */

export async function saveAutomation(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  await getSettings();
  const topics = str(fd, "topics").split("\n").map((t) => t.trim()).filter(Boolean);
  await Settings.updateOne(
    { key: "main" },
    {
      autoBlogEnabled: fd.get("autoBlogEnabled") === "on",
      autoPublish: fd.get("autoPublish") === "on",
      intervalHours: Math.min(168, Math.max(1, Number(fd.get("intervalHours")) || 1)),
      topics,
    }
  );
  revalidatePath("/admin/automation");
  return { ok: true, message: "Automation settings saved" };
}

export async function generateBlogNow(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const blog = await generateBlogPost({ topic: str(fd, "topic"), publish: fd.get("publish") === "on" });
    revalidatePath("/", "layout");
    return { ok: true, message: `Created: "${blog.title}"${blog.published ? " (published)" : " (saved as draft)"}` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
