"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { LEAD_STATUS, Lead, PARTNER_TYPES, Partner } from "@/lib/models";
import { checkPassword, createSession, destroySession, hashPassword, requirePartner } from "@/lib/auth";
import { LOAN_TYPES } from "@/lib/products";
import { notifyNewLead, notifyNewPartner } from "@/lib/notify";
import type { FormState } from "./public";
import { verifyCaptcha } from "@/lib/captcha";

const str = (fd: FormData, k: string) => String(fd.get(k) || "").trim();

export async function partnerRegister(_: FormState, fd: FormData): Promise<FormState> {
  const data = {
    name: str(fd, "name"),
    company: str(fd, "company"),
    type: str(fd, "type"),
    email: str(fd, "email").toLowerCase(),
    phone: str(fd, "phone").replace(/\D/g, "").slice(-10),
    city: str(fd, "city"),
  };
  const password = str(fd, "password");
  if (!verifyCaptcha(str(fd, "captchaToken"), str(fd, "captcha"))) return { error: "Wrong captcha code. Please try again." };
  if (!data.name || !data.company) return { error: "Please fill your name and company name" };
  if (!PARTNER_TYPES.includes(data.type as (typeof PARTNER_TYPES)[number])) return { error: "Select partner type" };
  if (!/^\S+@\S+\.\S+$/.test(data.email)) return { error: "Enter a valid email" };
  if (!/^[6-9]\d{9}$/.test(data.phone)) return { error: "Enter a valid 10-digit mobile number" };
  if (password.length < 6) return { error: "Password must be at least 6 characters" };

  await connectDB();
  if (await Partner.exists({ email: data.email })) return { error: "An account with this email already exists" };
  await Partner.create({ ...data, passwordHash: await hashPassword(password) });
  notifyNewPartner(data);
  return { ok: true, message: "Registration received! Your account will be activated after admin approval." };
}

export async function partnerLogin(_: FormState, fd: FormData): Promise<FormState> {
  if (!verifyCaptcha(str(fd, "captchaToken"), str(fd, "captcha"))) return { error: "Wrong captcha code. Please try again." };
  await connectDB();
  const partner = await Partner.findOne({ email: str(fd, "email").toLowerCase() });
  if (!partner || !(await checkPassword(str(fd, "password"), partner.passwordHash))) {
    return { error: "Invalid email or password" };
  }
  if (partner.status === "pending") return { error: "Your account is awaiting admin approval." };
  if (partner.status === "blocked") return { error: "Your account has been deactivated. Please contact support." };
  await createSession("partner", String(partner._id));
  redirect("/partner/dashboard");
}

export async function partnerLogout() {
  await destroySession("partner");
  redirect("/partner");
}

/** Partner (DSA / NBFC) submits a customer lead. */
export async function partnerAddLead(_: FormState, fd: FormData): Promise<FormState> {
  const partner = await requirePartner();
  const name = str(fd, "name");
  const phone = str(fd, "phone").replace(/\D/g, "").slice(-10);
  const loanType = str(fd, "loanType");
  if (name.length < 2) return { error: "Enter customer name" };
  if (!/^[6-9]\d{9}$/.test(phone)) return { error: "Enter a valid 10-digit mobile number" };
  if (!LOAN_TYPES.includes(loanType)) return { error: "Select loan type" };

  const lead = await Lead.create({
    name,
    phone,
    loanType,
    email: str(fd, "email"),
    city: str(fd, "city"),
    amount: Number(fd.get("amount")) || 0,
    monthlyIncome: Number(fd.get("monthlyIncome")) || 0,
    employment: str(fd, "employment"),
    notes: str(fd, "notes"),
    source: "partner",
    createdBy: partner._id,
  });
  notifyNewLead(lead, `Partner: ${partner.company} (${partner.type})`);
  revalidatePath("/partner/dashboard");
  return { ok: true, message: "Lead submitted successfully" };
}

/** Partner updates status / notes on a lead assigned to them. */
export async function partnerUpdateLead(fd: FormData) {
  const partner = await requirePartner();
  const status = str(fd, "status");
  if (!LEAD_STATUS.includes(status as (typeof LEAD_STATUS)[number])) return;
  await Lead.updateOne(
    { _id: str(fd, "id"), assignedTo: partner._id },
    { status, notes: str(fd, "notes") }
  );
  revalidatePath("/partner/dashboard");
}
