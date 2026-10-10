"use client";

import { keepValuesOnSubmit } from "@/lib/form";
import { useActionState, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { submitLead, type FormState } from "@/lib/actions/public";
import { LOAN_TYPES } from "@/lib/products";
import { SITE } from "@/lib/site";

/**
 * Two-step loan application (like Paisabazaar):
 * step 1 asks name + mobile, step 2 asks a few details, then submits once.
 */
export default function LeadForm({
  loanType,
  defaultPhone = "",
  title = "Check your loan offers",
  kind = "loan",
}: {
  loanType?: string;
  defaultPhone?: string;
  title?: string;
  /** "credit" = free CIBIL score check (no loan amount / income questions) */
  kind?: "loan" | "credit";
}) {
  const credit = kind === "credit";
  const [state, action, pending] = useActionState<FormState, FormData>(submitLead, {});
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(defaultPhone);
  const [stepError, setStepError] = useState("");

  if (state.ok) {
    return (
      <div className="card p-6 text-center shadow-lg sm:p-8">
        <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
        <h3 className="mt-4 text-xl font-semibold">Thank you, {name.split(" ")[0] || "there"}!</h3>
        <p className="mt-2 text-sm text-body">
          {credit ? (
            <>Our credit expert will call you shortly on <b>{phone}</b> with your CIBIL score and the loan offers you qualify for.</>
          ) : (
            <>Your application has been received. Our loan expert will call you shortly on <b>{phone}</b> with the best offers.</>
          )}
        </p>
        <p className="mt-4 text-xs text-muted">Need help now? Call {SITE.phone}</p>
        <Link href="/" className="btn-outline mt-5">Back to Home</Link>
      </div>
    );
  }

  const next = () => {
    if (name.trim().length < 2) return setStepError("Please enter your full name");
    if (!/^[6-9]\d{9}$/.test(phone)) return setStepError("Please enter a valid 10-digit mobile number");
    setStepError("");
    setStep(2);
  };

  const error = stepError || state.error;

  return (
    <form onSubmit={keepValuesOnSubmit(action)} className="card p-5 shadow-lg sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-xs font-medium text-muted">Step {step} of 2</span>
      </div>
      <div className="mb-5 h-1 overflow-hidden rounded-full bg-soft-2">
        <div className={`h-full bg-brand transition-all ${step === 1 ? "w-1/2" : "w-full"}`} />
      </div>

      {/* hidden honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      <input type="hidden" name="name" value={name} />
      <input type="hidden" name="phone" value={phone} />

      {step === 1 ? (
        <div key="step1" className="space-y-4">
          <div>
            <label className="label">Full Name (as on PAN)</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" autoComplete="name" />
          </div>
          <div>
            <label className="label">Mobile Number</label>
            <div className="flex">
              <span className="flex items-center rounded-l-lg border border-r-0 border-line bg-soft px-3 text-sm text-body">+91</span>
              <input
                className="input rounded-l-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit mobile number"
                inputMode="numeric"
                autoComplete="tel-national"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="button" onClick={next} className="btn-primary w-full py-3">
            {credit ? "Check My Score" : "Apply Now"}
          </button>
        </div>
      ) : (
        <div key="step2" className="space-y-4">
          {credit ? (
            <input type="hidden" name="loanType" value="Credit Score Check" />
          ) : loanType ? (
            <input type="hidden" name="loanType" value={loanType} />
          ) : (
            <div>
              <label className="label">Loan Type</label>
              <select name="loanType" className="input" defaultValue={LOAN_TYPES[0]}>
                {LOAN_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          )}
          {!credit && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Loan Amount (₹)</label>
              <input name="amount" type="number" min={10000} className="input" placeholder="e.g. 500000" />
            </div>
            <div>
              <label className="label">Monthly Income (₹)</label>
              <input name="monthlyIncome" type="number" min={0} className="input" placeholder="e.g. 40000" />
            </div>
          </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">City</label>
              <input name="city" className="input" placeholder="Your city" required />
            </div>
            <div>
              <label className="label">Employment</label>
              <select name="employment" className="input" defaultValue="Salaried">
                <option>Salaried</option>
                <option>Self Employed</option>
                <option>Business Owner</option>
                <option>Professional</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Email (optional)</label>
            <input name="email" type="email" className="input" placeholder="you@example.com" />
          </div>
          <label className="flex items-start gap-2 text-xs text-body">
            <input type="checkbox" name="consent" defaultChecked className="mt-0.5 accent-brand" />
            I agree to the <Link href="/terms" className="text-brand underline">Terms</Link> and authorise {SITE.name} & its
            partners to contact me via call / SMS / WhatsApp{credit ? " and to check my credit report for loan purposes" : ""}.
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(1)} className="btn-outline">Back</button>
            <button disabled={pending} className="btn-primary flex-1 py-3">
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : credit ? "Get My Free Score" : "Get Offers"}
            </button>
          </div>
        </div>
      )}

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
        <ShieldCheck className="h-4 w-4 text-success" /> Your data is 100% safe & secure. No impact on credit score.
      </p>
    </form>
  );
}
