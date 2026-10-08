import type { Metadata } from "next";
import Link from "next/link";
import { OfferCard } from "@/components/Cards";
import { getOffers } from "@/lib/data";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Best Loan Offers — Compare Interest Rates",
  description: "Compare the latest loan offers and interest rates from top banks and NBFCs.",
};

export default async function OffersPage({ searchParams }: { searchParams: Promise<{ type?: string; q?: string }> }) {
  const { type, q } = await searchParams;
  const product = PRODUCTS.find((p) => p.slug === type);
  const query = (q || "").trim().toLowerCase();
  const offers = (await getOffers(product?.name)).filter(
    (o) => !query || `${o.lender} ${o.loanType}`.toLowerCase().includes(query)
  );

  return (
    <>
      <section className="bg-soft py-10">
        <div className="container-x">
          <h1 className="font-serif text-3xl font-semibold">Best Loan Offers</h1>
          <p className="mt-2 text-body">
            {query ? <>Showing results for &ldquo;{q}&rdquo;</> : "Compare interest rates, loan amounts and fees from our lending partners."}
          </p>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            <Link href="/offers" className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${!product ? "bg-brand text-white" : "bg-white text-body"}`}>
              All
            </Link>
            {PRODUCTS.map((p) => (
              <Link
                key={p.slug}
                href={`/offers?type=${p.slug}`}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${product?.slug === p.slug ? "bg-brand text-white" : "bg-white text-body"}`}
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="container-x py-10">
        {offers.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((o) => <OfferCard key={o._id} o={o} />)}
          </div>
        ) : (
          <div className="rounded-2xl bg-soft p-10 text-center text-body">
            No offers listed right now.{" "}
            <Link href={`/apply${product ? `?type=${product.slug}` : ""}`} className="font-semibold text-brand">Apply here</Link> and our expert will find one for you.
          </div>
        )}
        <p className="mt-8 text-xs text-muted">*Interest rates and offers are indicative and subject to change. Final terms are decided by the lender based on your profile.</p>
      </section>
    </>
  );
}
