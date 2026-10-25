import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronRight, FileText, UserCheck } from "lucide-react";
import LeadForm from "@/components/LeadForm";
import EmiCalculator from "@/components/EmiCalculator";
import Faq from "@/components/Faq";
import ProductIcon from "@/components/ProductIcon";
import { HOW_IT_WORKS, PRODUCTS, getProduct } from "@/lib/products";
import { getOffers } from "@/lib/data";
import { getBrand } from "@/lib/brand";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { findBankLogo } from "@/lib/banks";

type Props = { params: Promise<{ product: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ product: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const p = getProduct((await params).product);
  if (!p) return {};
  const short = p.slug === "loan-against-property" ? "LAP" : p.name;
  return pageMetadata({
    title: `${p.name} at ${p.rate}* — Compare & Apply Online`,
    description: `Get ${p.name} up to ${p.maxAmount} at interest rates from ${p.rate} p.a. Compare ${short} offers from 30+ banks & NBFCs, check eligibility, documents & EMI, and apply online.`,
    path: `/${p.slug}`,
    keywords: [p.name, `${p.name} interest rate`, `${p.name} eligibility`, `${p.name} documents`, `${short} EMI calculator`, `best ${p.name}`, `${p.name} in Delhi`],
  });
}

function Table({ head, rows }: { head: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-soft text-ink">
          <tr>{head.map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r, i) => (
            <tr key={i} className="bg-white">
              {r.map((c, j) => <td key={j} className={`px-4 py-3 ${j === 0 ? "font-medium text-ink" : "text-body"}`}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function ProductPage({ params }: Props) {
  const SITE = await getBrand();
  const p = getProduct((await params).product);
  if (!p) notFound();
  const offers = await getOffers(p.name);

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(SITE, [{ name: p.name, path: `/${p.slug}` }]), faqJsonLd(p.faqs)]} />
      {/* HERO */}
      <section className="bg-linear-to-b from-soft to-white">
        <div className="container-x py-4 text-xs text-muted">
          <Link href="/" className="hover:text-brand">Home</Link>
          <ChevronRight className="mx-1 inline h-3 w-3" />
          <span className="text-ink">{p.name}</span>
        </div>
        <div className="container-x grid gap-10 pb-12 pt-2 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand shadow-sm">
              <ProductIcon name={p.icon} className="h-4 w-4" /> {p.name}
            </span>
            <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">{p.heroTitle}</h1>
            <ul className="mt-6 space-y-3">
              {p.heroPoints.map((pt) => (
                <li key={pt} className="flex items-start gap-2.5 text-body">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" /> {pt}
                </li>
              ))}
            </ul>
            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              {[
                ["Interest from", `${p.rate} p.a.`],
                ["Loan up to", p.maxAmount],
                ["Tenure", p.tenure],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-line bg-white p-3 sm:p-4">
                  <p className="text-[11px] text-muted sm:text-xs">{k}</p>
                  <p className="mt-0.5 text-sm font-semibold text-navy sm:text-base">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <LeadForm loanType={p.name} title={`Apply for ${p.name}`} />
          </div>
        </div>
      </section>

      {/* In-page navigation */}
      <nav className="sticky top-16 z-30 border-y border-line bg-white lg:top-[114px]">
        <div className="container-x flex gap-6 overflow-x-auto py-3 text-sm font-medium text-body [scrollbar-width:none]">
          {[
            ["#rates", "Interest Rates"],
            ["#features", "Features"],
            ["#emi", "EMI Calculator"],
            ["#eligibility", "Eligibility & Documents"],
            ["#fees", "Fees & Charges"],
            ["#faqs", "FAQs"],
          ].map(([h, l]) => (
            <a key={h} href={h} className="shrink-0 hover:text-brand">{l}</a>
          ))}
        </div>
      </nav>

      <div className="container-x space-y-14 py-12">
        <section>
          <h2 className="section-title">{p.name} at a Glance</h2>
          <div className="mt-6">
            <Table head={["Feature", "Details"]} rows={p.quickFacts} />
          </div>
        </section>

        <section id="rates" className="scroll-mt-40">
          <h2 className="section-title">{p.name} Interest Rates</h2>
          <p className="mt-2 text-body">Compare offers from our lending partners. Rates are indicative and depend on your profile.</p>
          <div className="mt-6">
            {offers.length ? (
              <Table
                head={["Lender", "Interest Rate", "Loan Amount", "Tenure", "Processing Fee", ""]}
                rows={offers.map((o) => [
                  <span key="l" className="flex min-w-[110px] flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
                    {findBankLogo(o.lender) && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={findBankLogo(o.lender)} alt={o.lender} className="h-8 w-20 shrink-0 object-contain object-left" />
                    )}
                    <span className="text-xs sm:text-sm">{o.lender}</span>
                  </span>,
                  <b key="r" className="whitespace-nowrap text-navy">{o.interestRate}</b>,
                  o.maxAmount || "—",
                  o.tenure || "—",
                  o.processingFee || "—",
                  <Link key="a" href={`/apply?type=${p.slug}`} className="btn-primary px-4 py-2 text-xs">Apply</Link>,
                ])}
              />
            ) : (
              <p className="rounded-2xl bg-soft p-6 text-body">
                Offers are updated regularly. <Link href={`/apply?type=${p.slug}`} className="font-semibold text-brand">Apply now</Link> and our expert will share the best offers for you.
              </p>
            )}
          </div>
        </section>

        <section id="features" className="scroll-mt-40">
          <h2 className="section-title">Key Features &amp; Benefits</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {p.features.map((f) => (
              <div key={f.title} className="card p-5">
                <CheckCircle2 className="h-6 w-6 text-brand" />
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-body">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="emi" className="scroll-mt-40">
          <h2 className="section-title">{p.name} EMI Calculator</h2>
          <p className="mt-2 text-body">Use the sliders to see your monthly EMI and total interest.</p>
          <div className="mt-6">
            <EmiCalculator {...p.emi} applyHref={`/apply?type=${p.slug}`} />
          </div>
        </section>

        <section id="eligibility" className="scroll-mt-40 grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold"><UserCheck className="h-6 w-6 text-brand" /> Eligibility Criteria</h2>
            <ul className="mt-5 space-y-3">
              {p.eligibility.map((e) => (
                <li key={e} className="flex gap-2.5 text-sm text-body"><CheckCircle2 className="h-5 w-5 shrink-0 text-success" />{e}</li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold"><FileText className="h-6 w-6 text-brand" /> Documents Required</h2>
            <ul className="mt-5 space-y-3">
              {p.documents.map((d) => (
                <li key={d} className="flex gap-2.5 text-sm text-body"><CheckCircle2 className="h-5 w-5 shrink-0 text-success" />{d}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="fees" className="scroll-mt-40">
          <h2 className="section-title">Fees &amp; Charges</h2>
          <div className="mt-6">
            <Table head={["Particulars", "Charges"]} rows={p.fees} />
          </div>
        </section>

        <section>
          <h2 className="section-title">How to Apply for {p.name} via {SITE.name}</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((s, i) => (
              <li key={s} className="rounded-2xl bg-soft p-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-semibold text-white">{i + 1}</span>
                <p className="mt-3 text-sm leading-relaxed text-body">{s}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="faqs" className="scroll-mt-40">
          <h2 className="section-title">{p.name} — FAQs</h2>
          <div className="mt-6"><Faq items={p.faqs} /></div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Explore Other Loans</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {PRODUCTS.filter((o) => o.slug !== p.slug).map((o) => (
              <Link key={o.slug} href={`/${o.slug}`} className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm hover:border-brand hover:text-brand">
                <ProductIcon name={o.icon} className="h-4 w-4" /> {o.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
