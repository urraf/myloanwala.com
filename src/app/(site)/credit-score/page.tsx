import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ChevronRight, CreditCard, FileSearch, Gauge, History, Layers, ShieldCheck } from "lucide-react";
import LeadForm from "@/components/LeadForm";
import Faq from "@/components/Faq";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Check CIBIL Score for FREE — Know Your Home Loan Eligibility",
  description: `Check your CIBIL / credit score for free with ${SITE.name}. Understand your score, what affects it and how it impacts your home loan and loan against property eligibility.`,
};

const RANGES = [
  { range: "750 – 900", label: "Excellent", color: "#12a150", text: "Best chance of approval and the lowest home loan rates." },
  { range: "700 – 749", label: "Good", color: "#7cc242", text: "Loan approval is likely; rates may be slightly higher." },
  { range: "650 – 699", label: "Fair", color: "#f5b400", text: "Limited options — some lenders may approve with conditions." },
  { range: "300 – 649", label: "Needs work", color: "#e5484d", text: "Approval is difficult. Improve your score before applying." },
];

const FACTORS = [
  { icon: History, title: "Repayment history", text: "Paying every EMI and credit card bill on time has the biggest impact on your score." },
  { icon: CreditCard, title: "Credit utilisation", text: "Using less than 30% of your credit card limit keeps your score healthy." },
  { icon: Layers, title: "Credit mix & age", text: "A healthy mix of secured and unsecured loans and a long credit history help." },
  { icon: FileSearch, title: "Loan enquiries", text: "Applying with many lenders in a short time can pull your score down." },
];

const FAQS = [
  { q: "Does checking my credit score reduce it?", a: "No. Checking your own score is a 'soft enquiry' and has no impact on your credit score." },
  { q: "What CIBIL score is needed for a home loan?", a: "Most banks prefer 750 or above for the best home loan rates. Some lenders approve home loans and loans against property for scores between 650 and 750, usually at a slightly higher rate." },
  { q: "Is the credit score check really free?", a: `Yes. ${SITE.name} does not charge anything. You are also entitled to one free full credit report every year from each credit bureau, as per RBI rules.` },
  { q: "How can I improve a low CIBIL score?", a: "Pay all dues on time, keep credit card usage below 30%, avoid multiple loan applications and check your report for errors. Most people see improvement within 3–6 months." },
];

/** Semi-circle credit score meter */
function ScoreGauge() {
  return (
    <svg viewBox="0 0 220 130" className="h-auto w-full max-w-[280px]" aria-hidden>
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stopColor="#e5484d" />
          <stop offset="0.4" stopColor="#f5b400" />
          <stop offset="0.7" stopColor="#7cc242" />
          <stop offset="1" stopColor="#12a150" />
        </linearGradient>
      </defs>
      <path d="M20 115 A90 90 0 0 1 200 115" fill="none" stroke="#e8edf5" strokeWidth="18" strokeLinecap="round" />
      <path d="M20 115 A90 90 0 0 1 200 115" fill="none" stroke="url(#g)" strokeWidth="18" strokeLinecap="round" />
      {/* needle at ~780 */}
      <line x1="110" y1="115" x2="168" y2="62" stroke="#1c1d1f" strokeWidth="4" strokeLinecap="round" />
      <circle cx="110" cy="115" r="8" fill="#1c1d1f" />
      <text x="110" y="92" textAnchor="middle" fontSize="26" fontWeight="700" fill="#052f5f">780</text>
      <text x="20" y="128" fontSize="10" fill="#8a8d93">300</text>
      <text x="186" y="128" fontSize="10" fill="#8a8d93">900</text>
    </svg>
  );
}

export default function CreditScorePage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-linear-to-b from-soft to-white">
        <div className="container-x py-4 text-xs text-muted">
          <Link href="/" className="hover:text-brand">Home</Link>
          <ChevronRight className="mx-1 inline h-3 w-3" />
          <span className="text-ink">Credit Score</span>
        </div>
        <div className="container-x grid gap-10 pb-12 pt-2 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-success shadow-sm">
              <Gauge className="h-4 w-4" /> 100% FREE · No impact on score
            </span>
            <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              Check your <span className="text-brand">CIBIL Score</span> for FREE
            </h1>
            <p className="mt-3 max-w-xl text-body">
              Know where you stand before you apply. Our credit experts check your score and tell you exactly which
              <b className="text-ink"> home loan</b> and <b className="text-ink">loan against property</b> offers you qualify for.
            </p>
            <ul className="mt-6 space-y-3">
              {["Free credit score & report review by experts", "Personalised tips to improve your score", "See your home loan & LAP eligibility instantly", "No impact on your credit score"].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-body">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 hidden items-center gap-6 sm:flex">
              <ScoreGauge />
              <p className="max-w-[220px] text-sm text-body">A score of <b className="text-ink">750+</b> gets you the lowest home loan interest rates.</p>
            </div>
          </div>
          <div>
            <LeadForm kind="credit" title="Get your Free Credit Score" />
          </div>
        </div>
      </section>

      <div className="container-x space-y-14 py-12">
        {/* RANGES */}
        <section>
          <h2 className="section-title">What does your CIBIL score mean?</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RANGES.map((r) => (
              <div key={r.range} className="card overflow-hidden">
                <div className="h-2" style={{ background: r.color }} />
                <div className="p-5">
                  <p className="text-2xl font-bold" style={{ color: r.color }}>{r.range}</p>
                  <p className="mt-1 font-semibold text-ink">{r.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-body">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOME LOAN */}
        <section id="home-loan" className="scroll-mt-32">
          <h2 className="section-title">CIBIL score for Home Loan &amp; Loan Against Property</h2>
          <p className="mt-2 max-w-3xl text-body">
            Your credit score decides whether your home loan or LAP is approved and at what interest rate. Even a small
            difference in rate saves lakhs over a long tenure.
          </p>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-soft text-ink">
                <tr><th className="px-4 py-3 font-semibold">CIBIL Score</th><th className="px-4 py-3 font-semibold">Home Loan / LAP approval</th><th className="px-4 py-3 font-semibold">Interest rate</th></tr>
              </thead>
              <tbody className="divide-y divide-line bg-white">
                <tr><td className="px-4 py-3 font-medium">750 and above</td><td className="px-4 py-3 text-body">Very high</td><td className="px-4 py-3 text-body">Lowest rates offered by lenders</td></tr>
                <tr><td className="px-4 py-3 font-medium">700 – 749</td><td className="px-4 py-3 text-body">High</td><td className="px-4 py-3 text-body">Slightly higher than the lowest rates</td></tr>
                <tr><td className="px-4 py-3 font-medium">650 – 699</td><td className="px-4 py-3 text-body">Moderate — select lenders</td><td className="px-4 py-3 text-body">Higher rates, may need a co-applicant</td></tr>
                <tr><td className="px-4 py-3 font-medium">Below 650</td><td className="px-4 py-3 text-body">Low</td><td className="px-4 py-3 text-body">Improve score first, or apply with a co-applicant</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/home-loan" className="btn-primary">Check Home Loan Offers</Link>
            <Link href="/loan-against-property" className="btn-outline">Check LAP Offers</Link>
          </div>
        </section>

        {/* FACTORS */}
        <section>
          <h2 className="section-title">What affects your credit score?</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FACTORS.map((f) => (
              <div key={f.title} className="card p-5">
                <f.icon className="h-8 w-8 text-pink" strokeWidth={1.5} />
                <h3 className="mt-3 font-serif text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-body">{f.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm">
            <Link href="/blog/how-to-improve-cibil-score-fast" className="font-semibold text-brand">Read: How to improve your CIBIL score fast — 10 proven tips →</Link>
          </p>
        </section>

        <section>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="mt-6"><Faq items={FAQS} /></div>
          <p className="mt-6 flex items-center gap-2 text-xs text-muted">
            <ShieldCheck className="h-4 w-4 text-success" /> Your details are shared only with your consent and used only to help you with loans.
          </p>
        </section>
      </div>
    </>
  );
}
