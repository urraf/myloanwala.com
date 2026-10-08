import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <>
      <PageHeader title={`About ${SITE.name}`} subtitle="Making loans simple, transparent and accessible for every Indian." />
      <section className="container-x grid gap-10 py-12 lg:grid-cols-2">
        <div className="space-y-4 leading-relaxed text-body">
          <p>
            {SITE.name} is a loan facilitation platform that helps individuals and businesses find the right loan from
            leading banks and NBFCs. Instead of visiting multiple lenders, you can compare offers, check eligibility and
            apply in one place.
          </p>
          <p>
            Our trained loan experts understand your requirement, suggest the best-suited offers and help you with
            documentation until the money reaches your account — at no cost to you.
          </p>
          <p>
            We also work closely with NBFCs and DSA partners, giving them a simple dashboard to receive and track
            loan applications.
          </p>
          <Link href="/apply" className="btn-primary mt-2">Apply for a Loan</Link>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-semibold">Our Promise</h2>
          <ul className="mt-4 space-y-3">
            {[
              "Unbiased advice — we suggest what suits you, not just one lender",
              "Complete transparency on interest rates and charges",
              "Your data stays private and secure",
              "Dedicated support from application to disbursal",
              "Zero fees for customers",
            ].map((t) => (
              <li key={t} className="flex gap-2.5 text-sm text-body"><CheckCircle2 className="h-5 w-5 shrink-0 text-success" />{t}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
