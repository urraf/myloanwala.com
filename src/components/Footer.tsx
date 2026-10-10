import Link from "next/link";
import { Mail, MapPin, Phone, Plus } from "lucide-react";
import Logo from "./Logo";
import { PRODUCTS } from "@/lib/products";
import { NAV_MENUS } from "@/lib/nav";
import { getBlogs } from "@/lib/data";
import { SITE } from "@/lib/site";

export default async function Footer() {
  const { blogs } = await getBlogs({ limit: 6 });
  const learn = blogs.length
    ? blogs.map((b) => ({ label: b.title, href: `/blog/${b.slug}` }))
    : NAV_MENUS.find((m) => m.label === "Learn")!.links;

  const columns = [
    {
      title: SITE.name,
      links: [
        { label: "Free CIBIL Score Check", href: "/credit-score" },
        { label: "About Us", href: "/about" },
        { label: "Contact Us", href: "/contact" },
        { label: "Become a Partner", href: "/partner?tab=register" },
        { label: "NBFC / DSA Login", href: "/partner" },
        { label: "Loan Offers", href: "/offers" },
        { label: "Blog", href: "/blog" },
      ],
    },
    { title: "Loans", links: PRODUCTS.map((p) => ({ label: p.name, href: `/${p.slug}` })) },
    { title: "Learn & Resources", links: learn },
  ];

  return (
    <footer className="bg-footer text-[#c5c7d0]">
      {/* Most searched links */}
      <details className="group border-b border-white/10">
        <summary className="flex cursor-pointer list-none items-center justify-center gap-2 py-6 text-sm font-semibold uppercase tracking-wide text-white [&::-webkit-details-marker]:hidden">
          Most Searched Links <Plus className="h-4 w-4 transition group-open:rotate-45" />
        </summary>
        <div className="container-x grid gap-8 pb-8 sm:grid-cols-2 lg:grid-cols-5">
          {NAV_MENUS.map((m) => (
            <div key={m.label}>
              <h4 className="mb-3 text-sm font-semibold text-white">{m.label}</h4>
              <ul className="space-y-2 text-[13px]">
                {m.links.map((l) => (
                  <li key={l.label}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>

      <div className="container-x grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[200px_1fr_1fr_1.3fr_1.2fr] lg:py-12">
        <div><Logo light /></div>
        {columns.map((c) => (
          <div key={c.title}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">{c.title}</h3>
            <ul className="space-y-3 text-sm">
              {c.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="line-clamp-1 hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /><a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-white">{SITE.phone}</a></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /><a href={`mailto:${SITE.email}`} className="break-all hover:text-white">{SITE.email}</a></li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{SITE.address}</li>
            <li className="pt-1 text-xs text-[#8d90a0]">{SITE.hours}</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#292b3c]">
        <div className="container-x flex flex-wrap gap-x-6 gap-y-2 py-3 text-[13px] lg:pl-[calc(200px+2.5rem+2rem)]">
          <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms of Use</Link>
          <Link href="/terms" className="hover:text-white">Disclaimer</Link>
          <Link href="/contact" className="hover:text-white">Grievance Redressal</Link>
          <Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link>
        </div>
      </div>

      <div className="container-x py-6 text-xs leading-relaxed text-[#8d90a0] lg:pl-[calc(200px+2.5rem+2rem)]">
        <p>
          <span className="text-[#c5c7d0]">Disclaimer:</span> {SITE.name} is a loan facilitation platform and does not lend
          money directly. Loans are sanctioned at the sole discretion of our partner banks / NBFCs. Interest rates shown are
          indicative and may vary based on your profile.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p>© 2024-{new Date().getFullYear()} {SITE.domain}. All Rights Reserved.</p>
          <p className="flex items-center gap-2">
            <span className="flex h-[18px] w-7 flex-col overflow-hidden rounded-sm">
              <span className="flex-1 bg-[#ff9933]" />
              <span className="grid flex-1 place-items-center bg-white"><span className="h-1.5 w-1.5 rounded-full border border-[#000080]" /></span>
              <span className="flex-1 bg-[#138808]" />
            </span>
            <span className="leading-tight">Built with Love<br />Made in India</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
