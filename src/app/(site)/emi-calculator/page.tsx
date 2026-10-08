import type { Metadata } from "next";
import Link from "next/link";
import EmiCalculator from "@/components/EmiCalculator";
import Faq from "@/components/Faq";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Loan EMI Calculator — Personal, Home, Business Loan EMI",
  description: "Calculate your monthly loan EMI, total interest and total payment instantly with our free EMI calculator.",
};

export default async function EmiPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const product = PRODUCTS.find((p) => p.slug === type) || PRODUCTS[0];

  return (
    <>
      <section className="bg-soft py-10">
        <div className="container-x">
          <h1 className="font-serif text-3xl font-semibold">{type ? `${product.name} ` : "Loan "}EMI Calculator</h1>
          <p className="mt-2 text-body">Calculate your monthly EMI, total interest and total amount payable instantly.</p>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {PRODUCTS.map((p) => (
              <Link
                key={p.slug}
                href={`/emi-calculator?type=${p.slug}`}
                scroll={false}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${product.slug === p.slug ? "bg-brand text-white" : "bg-white text-body"}`}
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="container-x space-y-12 py-10">
        {/* key resets the sliders when switching loan type */}
        <EmiCalculator key={product.slug} {...product.emi} applyHref={`/apply?type=${product.slug}`} />

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold">How is EMI calculated?</h2>
            <p className="mt-3 text-sm leading-relaxed text-body">EMI is calculated using the formula:</p>
            <p className="mt-3 rounded-xl bg-soft p-4 text-center font-semibold text-navy">EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)</p>
            <ul className="mt-3 space-y-1 text-sm text-body">
              <li><b>P</b> = Loan amount (principal)</li>
              <li><b>r</b> = Monthly interest rate (annual rate ÷ 12 ÷ 100)</li>
              <li><b>n</b> = Tenure in months</li>
            </ul>
          </div>
          <Faq
            items={[
              { q: "How can I reduce my EMI?", a: "Choose a longer tenure, negotiate a lower interest rate with a good credit score, or make a part-prepayment to reduce the principal." },
              { q: "Is the EMI fixed for the whole tenure?", a: "For fixed-rate loans, yes. For floating-rate loans (like most home loans), the EMI or tenure may change when the lender revises its rate." },
              { q: "Does a longer tenure cost more?", a: "Yes. A longer tenure lowers your EMI but increases the total interest you pay over the loan." },
            ]}
          />
        </div>
      </section>
    </>
  );
}
