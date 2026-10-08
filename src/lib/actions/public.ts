"use server";

import { connectDB } from "@/lib/db";
import { Lead } from "@/lib/models";
import { LOAN_TYPES } from "@/lib/products";
import { notifyNewLead } from "@/lib/notify";

export type FormState = { ok?: boolean; error?: string; message?: string };

const PHONE_RE = /^[6-9]\d{9}$/;

/** Public loan application form → saves a lead for the admin panel. */
export async function submitLead(_: FormState, fd: FormData): Promise<FormState> {
  if (fd.get("website")) return { ok: true }; // honeypot: bots fill hidden fields

  const name = String(fd.get("name") || "").trim();
  const phone = String(fd.get("phone") || "").replace(/\D/g, "").slice(-10);
  const loanType = String(fd.get("loanType") || "");

  if (name.length < 2) return { error: "Please enter your full name" };
  if (!PHONE_RE.test(phone)) return { error: "Please enter a valid 10-digit mobile number" };
  if (!LOAN_TYPES.includes(loanType)) return { error: "Please select a loan type" };
  if (!fd.get("consent")) return { error: "Please accept the terms to continue" };

  try {
    await connectDB();
    // Avoid duplicate leads if the same number re-submits within 10 minutes
    const dup = await Lead.exists({ phone, loanType, createdAt: { $gt: new Date(Date.now() - 10 * 60_000) } });
    if (!dup) {
      const lead = await Lead.create({
        name,
        phone,
        loanType,
        email: String(fd.get("email") || "").trim(),
        city: String(fd.get("city") || "").trim(),
        amount: Number(fd.get("amount")) || 0,
        monthlyIncome: Number(fd.get("monthlyIncome")) || 0,
        employment: String(fd.get("employment") || ""),
        source: "website",
      });
      notifyNewLead(lead, "Website form");
    }
    return { ok: true };
  } catch (e) {
    console.error("[submitLead]", e);
    return { error: "Something went wrong. Please try again or call us." };
  }
}
