import { CheckCircle2 } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import LeadForm from "@/components/LeadForm";
import { getProduct } from "@/lib/products";

export function generateMetadata() {
  return pageMetadata({ title: "Apply Online for Home Loan & LAP in 2 Minutes", description: "Apply online for a home loan, loan against property, personal or business loan. Share a few details and get the best offers from 30+ banks & NBFCs — free.", path: "/apply", keywords: ["apply home loan online", "apply loan online", "instant loan application"] });
}

export default async function ApplyPage({ searchParams }: { searchParams: Promise<{ type?: string; phone?: string }> }) {
  const { type, phone } = await searchParams;
  const product = type ? getProduct(type) : undefined;

  return (
    <section className="bg-linear-to-b from-soft to-white">
      <div className="container-x grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-16">
        <div>
          <h1 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">
            Apply for {product ? <span className="text-brand">{product.name}</span> : <>a <span className="text-brand">Loan</span></>} in 2 minutes
          </h1>
          <p className="mt-3 text-body">Share a few details and our loan expert will get you the best offers from 30+ banks &amp; NBFCs.</p>
          <ul className="mt-6 space-y-3">
            {["100% free service — no hidden charges", "Compare multiple offers in one place", "Dedicated loan expert for documentation", "No impact on your credit score"].map((t) => (
              <li key={t} className="flex items-center gap-2.5 text-body">
                <CheckCircle2 className="h-5 w-5 text-success" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto w-full max-w-md">
          <LeadForm loanType={product?.name} defaultPhone={(phone || "").replace(/\D/g, "").slice(0, 10)} />
        </div>
      </div>
    </section>
  );
}
