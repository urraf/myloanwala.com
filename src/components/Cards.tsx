import Link from "next/link";
import { ArrowRight, BadgePercent, Calendar } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { findBankLogo } from "@/lib/banks";

export type OfferItem = {
  _id: string;
  lender: string;
  loanType: string;
  interestRate: string;
  maxAmount?: string;
  tenure?: string;
  processingFee?: string;
  highlight?: string;
};

export type BlogItem = {
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  createdAt: Date | string;
};

const initials = (s: string) =>
  s.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export function OfferCard({ o }: { o: OfferItem }) {
  const product = PRODUCTS.find((p) => p.name === o.loanType);
  return (
    <div className="card flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {findBankLogo(o.lender) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={findBankLogo(o.lender)} alt={o.lender} className="h-11 w-24 rounded-lg border border-line bg-white object-contain p-1" />
          ) : (
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-soft text-sm font-bold text-brand">
              {initials(o.lender)}
            </span>
          )}
          <div>
            <p className="font-semibold leading-tight text-ink">{o.lender}</p>
            <p className="text-xs text-muted">{o.loanType}</p>
          </div>
        </div>
        {o.highlight && (
          <span className="rounded-full bg-accent/25 px-2.5 py-1 text-[11px] font-semibold text-[#8a5a00]">{o.highlight}</span>
        )}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-soft p-3 text-sm">
        <div>
          <p className="text-[11px] text-muted">Interest Rate</p>
          <p className="font-semibold text-navy">{o.interestRate}</p>
        </div>
        <div>
          <p className="text-[11px] text-muted">Loan Amount</p>
          <p className="font-semibold text-navy">{o.maxAmount || "—"}</p>
        </div>
        <div>
          <p className="text-[11px] text-muted">Tenure</p>
          <p className="font-medium text-ink">{o.tenure || "—"}</p>
        </div>
        <div>
          <p className="text-[11px] text-muted">Processing Fee</p>
          <p className="font-medium text-ink">{o.processingFee || "—"}</p>
        </div>
      </div>
      <Link href={`/apply?type=${product?.slug || ""}`} className="btn-primary mt-5 w-full">
        Apply Now
      </Link>
    </div>
  );
}

export function BlogCover({ src, title, className = "" }: { src?: string; title: string; className?: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={title} loading="lazy" className={`w-full object-cover ${className}`} />;
  }
  return (
    <div className={`grid w-full place-items-center bg-linear-to-br from-brand to-navy p-6 ${className}`}>
      <BadgePercent className="h-12 w-12 text-white/70" />
    </div>
  );
}

export function BlogCard({ b }: { b: BlogItem }) {
  return (
    <Link href={`/blog/${b.slug}`} className="card group flex h-full flex-col overflow-hidden transition hover:shadow-lg">
      <div className="overflow-hidden">
        <BlogCover src={b.coverImage} title={b.title} className="aspect-[16/9] transition duration-300 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand">{b.category}</span>
        <h3 className="mt-2 line-clamp-2 font-semibold leading-snug text-ink group-hover:text-brand">{b.title}</h3>
        {b.excerpt && <p className="mt-2 line-clamp-2 text-sm text-body">{b.excerpt}</p>}
        <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1 font-medium text-brand">
            Read <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
