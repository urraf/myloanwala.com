import Link from "next/link";
import QRCode from "qrcode";
import {
  BadgeCheck, ChevronRight, CircleCheck, Headset, LockKeyhole, MessageCircle, Scale, Search, ShieldCheck, Star, User,
} from "lucide-react";
import HeroCarousel from "@/components/home/HeroCarousel";
import Carousel from "@/components/home/Carousel";
import PartnerGrid from "@/components/home/PartnerGrid";
import { BANKS, BANK_FILTERS, findBankLogo } from "@/lib/banks";
import { getBlogs, getOffers } from "@/lib/data";
import { BlogCard } from "@/components/Cards";
import { TILE_SECTIONS, type Tile } from "@/lib/nav";
import { PRODUCTS } from "@/lib/products";
import { SITE, whatsappLink } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* Content — edit freely                                               */
/* ------------------------------------------------------------------ */

const STORIES = [
  { quote: `${SITE.name} helped me when I needed funds for my shop the most.`, name: "Harish Saini", city: "New Delhi", icon: "man-office", from: "#1d1f4f", to: "#4b3f8f" },
  { quote: "The right loan at the right time made all the difference for my family.", name: "Varsha Gupta", city: "Jaipur", icon: "woman-office", from: "#2b1d4f", to: "#6a3f8f" },
  { quote: "Some dreams are special long before they are realised. Got my home loan!", name: "Dr. Brahmanand", city: "Gurgaon", icon: "man-office", from: "#1d3a4f", to: "#3f6f8f" },
  { quote: "Turned my small business into a growing brand with a quick business loan.", name: "Pawan Agarwal", city: "Lucknow", icon: "man-office", from: "#3a1d4f", to: "#7a3f8f" },
];

const REVIEWS = [
  { title: "Got my personal loan in 2 days!", text: `I needed money urgently for my sister's wedding. The ${SITE.name} advisor compared offers from multiple banks and got me a lower rate than my own bank. Documents were collected online and the amount was credited within two days. Very smooth experience.`, name: "Rahul Sharma", date: "28-Sep-2026" },
  { title: "Hassle-free business loan", text: "I run a small boutique and needed working capital before the festive season. The team guided me on documents, suggested the right NBFC and the loan was disbursed quickly without any collateral. Highly recommended for small business owners.", name: "Priya Verma", date: "19-Sep-2026" },
  { title: "Saved a lot on my home loan", text: `I transferred my home loan balance through ${SITE.name} and my EMI reduced noticeably. The advisor explained every charge clearly and there were no hidden surprises. Very transparent and professional team.`, name: "Amit Patel", date: "07-Sep-2026" },
  { title: "Best place for comparing loans", text: "Instead of visiting five banks, I got all offers in one place. The EMI calculator helped me plan, and the expert call helped me choose the best option for my profile. Loved the quick service.", name: "Sneha Iyer", date: "30-Aug-2026" },
  { title: "Gold loan within an hour", text: "Needed cash for a medical emergency. Got a gold loan arranged at a good rate within an hour. The staff was polite and the process was very simple.", name: "Mohd. Imran", date: "21-Aug-2026" },
];

const FEATURES = [
  { icon: Scale, title: "Wide Choice", text: "We have tie-ups with leading banks, NBFCs and fintech lenders who offer a wide choice of loans on our platform." },
  { icon: ShieldCheck, title: "Easy Access to Credit", text: "Get access to multiple loan offers, easy comparison and unbiased advice from our experts — all in one place." },
  { icon: LockKeyhole, title: "Safe & Secure", text: "Your data is completely safe with us. We follow strict security controls and share it only with lenders you choose." },
  { icon: Headset, title: "Customer First", text: "Our dedicated and highly trained team of experts works every day to help you take the best financial decisions." },
];

/* ------------------------------------------------------------------ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* desktop: serif heading — mobile: small caps label with line (like Paisabazaar app view) */}
      <h2 className="hidden font-serif text-xl font-semibold text-ink sm:block">{children}</h2>
      <h2 className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-wide text-ink sm:hidden">
        {children}
        <span className="h-px flex-1 bg-line" />
      </h2>
    </>
  );
}

function TileGrid({ tiles }: { tiles: Tile[] }) {
  return (
    <div className="mt-4 grid grid-cols-4 gap-x-2 gap-y-5 sm:mt-6 sm:grid-cols-8 sm:gap-x-4">
      {tiles.map((t) => (
        <Link key={t.label} href={t.href} className="group flex flex-col items-center text-center">
          <span className="relative grid h-[68px] w-[68px] place-items-center rounded-lg border border-line bg-white transition group-hover:-translate-y-0.5 group-hover:shadow-md sm:h-[82px] sm:w-[88px] sm:border-0 sm:bg-tile">
            {t.tag && (
              <span className="absolute -top-3 left-1/2 w-max -translate-x-1/2 rounded-sm bg-[#c8f1d5] px-1.5 py-[2px] text-[9px] font-semibold text-[#0d5c2e] sm:px-2.5 sm:text-[10px]">
                {t.tag}
              </span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/icons/${t.icon}.png`} alt="" loading="lazy" className="h-10 w-10 sm:h-12 sm:w-12" />
          </span>
          <span className="mt-2 text-[11px] leading-tight text-body group-hover:text-brand sm:text-[15px] sm:leading-snug">{t.label}</span>
          {t.sub && <span className="mt-0.5 hidden text-xs text-body sm:block">{t.sub}</span>}
        </Link>
      ))}
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto h-[300px] w-[230px] sm:h-[400px] sm:w-[300px]">
      {/* back phone */}
      <div className="absolute left-0 top-16 h-[320px] w-[150px] -rotate-6 rounded-[28px] border-[7px] border-[#1c1d1f] bg-white p-3 shadow-xl sm:w-[180px]">
        <p className="font-serif text-xs text-[#1b3a8c]">{SITE.logoText1}<span className="text-brand">{SITE.logoText2}</span></p>
        <div className="mt-3 rounded-lg bg-tile p-2">
          <p className="text-[8px] text-muted">Pre-approved offer</p>
          <p className="text-sm font-bold text-navy">₹5,00,000</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {["money-bag", "house", "briefcase", "coin"].map((i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={`/icons/${i}.png`} alt="" className="rounded-md bg-tile p-1.5" />
          ))}
        </div>
      </div>
      {/* front phone */}
      <div className="absolute left-14 top-2 h-[360px] w-[170px] rounded-[30px] border-[8px] border-[#1c1d1f] bg-[#0b3b2c] shadow-2xl sm:left-24 sm:h-[420px] sm:w-[200px]">
        <div className="mx-auto mt-1.5 h-4 w-16 rounded-full bg-[#1c1d1f]" />
        <div className="px-3 pt-3 text-center text-white">
          <p className="font-serif text-lg font-semibold italic">Instant Cash</p>
          <p className="text-[9px] text-white/70">in your account</p>
          <p className="mt-2 rounded-full border border-[#ffd84d]/70 py-1 text-lg font-bold text-[#ffd84d]">₹10,00,000</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/money-wings.png" alt="" className="mx-auto mt-2 h-16 w-16" />
          <p className="mt-2 rounded-md bg-white py-1.5 text-[10px] font-semibold text-ink">Get Money Now ›</p>
        </div>
        <div className="mx-2 mt-3 rounded-lg bg-white p-2">
          <p className="text-[8px] font-semibold text-muted">LOANS</p>
          <div className="mt-1 grid grid-cols-4 gap-1">
            {["money-bag", "briefcase", "house", "car"].map((i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={`/icons/${i}.png`} alt="" className="rounded bg-tile p-1" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const CARD_COLORS = [
  ["#13235f", "#2c47b5"],
  ["#1c1d1f", "#4a4a55"],
  ["#0b3b2c", "#11724f"],
  ["#4a1d5c", "#8a3aa8"],
  ["#5a3a06", "#a86f0c"],
  ["#0c3a5a", "#1c78b0"],
];

export default async function HomePage() {
  const [offers, { blogs }] = await Promise.all([getOffers(), getBlogs({ limit: 3 })]);
  const qrSvg = await QRCode.toString(`${SITE.url}/apply`, { type: "svg", margin: 0, color: { dark: "#1c1d1f", light: "#ffffff" } });


  return (
    <>
      {/* ================= HERO ================= */}
      <section className="container-x pt-4 sm:pt-10">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_457px]">
          <div className="hidden pt-4 lg:block">
            <h1 className="font-serif text-[42px] leading-[1.35] text-[#333]">
              <span className="font-light">India&apos;s best platform for</span>
              <br />
              <span className="font-bold text-ink">Personal &amp; Business Loans</span>
            </h1>
            <div className="mt-10 flex gap-16">
              {[
                ["hundred", "One Stop for all", "Loan Solutions"],
                ["stopwatch", "Quick, easy &", "hassle free"],
              ].map(([icon, a, b]) => (
                <div key={a} className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/icons/${icon}.png`} alt="" className="h-11 w-11" />
                  <p className="text-[17px] font-medium leading-snug text-ink">{a}<br />{b}</p>
                </div>
              ))}
            </div>
          </div>
          <HeroCarousel />
        </div>

        {/* ================= PRODUCT TILES ================= */}
        <div className="mt-6 space-y-8 pb-6 sm:mt-10 sm:space-y-10 lg:mt-4">
          {TILE_SECTIONS.map((s) => (
            <div key={s.title}>
              <SectionLabel>{s.title}</SectionLabel>
              <TileGrid tiles={s.tiles} />
            </div>
          ))}
        </div>
      </section>

      {/* ================= APP-STYLE PROMO ================= */}
      <section className="container-x py-10 sm:py-14">
        <div className="grid overflow-hidden rounded-2xl border border-[#bcd3ff] bg-tile lg:grid-cols-2">
          <div className="order-2 h-[280px] overflow-hidden pt-8 sm:h-[380px] lg:order-1 lg:h-auto lg:min-h-[420px]">
            <PhoneMockup />
          </div>
          <div className="order-1 p-6 sm:p-10 lg:order-2 lg:py-12 lg:pl-4">
            <h2 className="font-serif text-2xl font-semibold text-ink sm:text-[28px]">Get Instant Loan Offers</h2>
            <ul className="mt-6 space-y-4 text-[15px] text-body">
              {[
                ["label", <>Compare offers from <b className="text-ink">30+ Banks &amp; NBFCs</b></>],
                ["memo", <>Access to <b className="text-ink">Exclusive Pre-Approved</b> offers based on your profile</>],
                ["check", <>Highest chances of approval every time you apply for a <b className="text-ink">Loan</b></>],
                ["headphone", <>Get <b className="text-ink">FREE expert advice</b> from application to disbursal</>],
              ].map(([icon, text]) => (
                <li key={icon as string} className="flex items-start gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/icons/${icon}.png`} alt="" className="mt-0.5 h-5 w-5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center gap-5 sm:gap-8">
              <div className="hidden rounded-lg border-2 border-dashed border-[#c5c7cc] bg-white p-3 sm:block">
                <div className="h-[130px] w-[130px]" dangerouslySetInnerHTML={{ __html: qrSvg }} />
                <p className="mt-1.5 text-center text-[11px] text-muted">Scan to apply</p>
              </div>
              <span className="hidden text-sm text-body sm:block">OR</span>
              <div className="flex flex-1 flex-col gap-3 sm:flex-none">
                <Link href="/apply" className="flex items-center gap-3 rounded-lg bg-black px-4 py-2.5 text-white hover:bg-[#222]">
                  <BadgeCheck className="h-7 w-7" />
                  <span className="leading-tight"><span className="block text-[10px] uppercase text-white/80">Apply online</span><span className="text-lg font-semibold">Check Offers</span></span>
                </Link>
                <a href={whatsappLink()} target="_blank" rel="noopener" className="flex items-center gap-3 rounded-lg bg-black px-4 py-2.5 text-white hover:bg-[#222]">
                  <MessageCircle className="h-7 w-7 text-[#25d366]" />
                  <span className="leading-tight"><span className="block text-[10px] uppercase text-white/80">Chat with us on</span><span className="text-lg font-semibold">WhatsApp</span></span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <form action="/offers" className="mx-auto mt-12 flex max-w-3xl items-center rounded-lg border border-[#d0d1d2] bg-white pl-4 pr-3 focus-within:border-brand">
          <input name="q" placeholder="Search loan offers by Bank or Loan Type" className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-body" />
          <button aria-label="Search" className="p-2 text-muted hover:text-brand"><Search className="h-5 w-5" /></button>
        </form>
      </section>

      {/* ================= EXCLUSIVE OFFERS ================= */}
      {offers.length > 0 && (
        <section className="container-x pb-12 sm:pb-16">
          <h2 className="mx-auto max-w-xl text-center font-serif text-2xl font-semibold leading-snug text-ink sm:text-[28px]">
            Tailor Made Offers Exclusively for {SITE.name} Customers
          </h2>
          <Carousel className="mt-8">
            {offers.slice(0, 8).map((o, i) => {
              const [from, to] = CARD_COLORS[i % CARD_COLORS.length];
              const product = PRODUCTS.find((p) => p.name === o.loanType);
              return (
                <div
                  key={o._id}
                  className="grid w-[88%] shrink-0 snap-start items-center gap-6 rounded-2xl border border-line bg-linear-to-b from-[#e7e9fc] to-white p-6 sm:w-[640px] sm:grid-cols-[220px_1fr] sm:p-10 lg:w-[795px] lg:grid-cols-[300px_1fr]"
                >
                  {/* "card" visual */}
                  <div className="mx-auto h-[200px] w-[130px] rotate-[-6deg] rounded-xl p-4 text-white shadow-[0_18px_30px_rgba(0,0,0,0.25)] sm:h-[270px] sm:w-[175px]" style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}>
                    {findBankLogo(o.lender) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={findBankLogo(o.lender)} alt={o.lender} className="h-7 w-full rounded bg-white object-contain px-1.5 py-1" />
                    ) : (
                      <p className="text-[10px] font-semibold uppercase tracking-wide opacity-90">{o.lender}</p>
                    )}
                    <p className="mt-1 font-serif text-[10px] lowercase opacity-80">{SITE.name}</p>
                    <div className="mt-8 h-7 w-9 rounded-md bg-linear-to-br from-[#f7d774] to-[#c9971c]" />
                    <p className="mt-8 font-serif text-lg font-semibold leading-tight sm:mt-16 sm:text-xl">{o.loanType}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold leading-snug text-ink sm:text-[26px]">{o.lender} {o.loanType}</h3>
                    <ul className="mt-5 space-y-3.5 text-[15px] font-medium text-body sm:text-base">
                      {[`Interest rate ${o.interestRate}`, o.maxAmount && `Loan amount ${o.maxAmount}`, o.tenure && `Tenure ${o.tenure}`, o.highlight]
                        .filter(Boolean)
                        .slice(0, 3)
                        .map((b) => (
                          <li key={b as string} className="flex items-center gap-3">
                            <CircleCheck className="h-5 w-5 shrink-0 fill-brand text-white" /> {b}
                          </li>
                        ))}
                    </ul>
                    <Link href={`/apply?type=${product?.slug || ""}`} className="mt-7 inline-block rounded-full bg-[#1c1d1f] px-6 py-3 text-[15px] font-semibold text-white hover:bg-black">
                      Apply Now
                    </Link>
                  </div>
                </div>
              );
            })}
          </Carousel>
        </section>
      )}

      {/* ================= WHY US ================= */}
      <section className="container-x pb-14 pt-4 sm:pb-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <h2 className="font-serif text-2xl font-semibold leading-snug text-ink sm:text-[26px]">
              Compare, Choose and Apply for loans on {SITE.name}
            </h2>
            <Link href="/about" className="mt-6 inline-block rounded border border-brand px-6 py-2.5 text-xs font-semibold uppercase text-brand hover:bg-tile">
              Read More
            </Link>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-14 sm:gap-y-14">
            {FEATURES.map((f) => (
              <div key={f.title}>
                <f.icon className="h-11 w-11 text-pink" strokeWidth={1.4} />
                <h3 className="mt-4 font-serif text-[22px] font-semibold text-ink sm:text-2xl">{f.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-body">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CUSTOMER STORIES ================= */}
      <section className="container-x pb-14 sm:pb-20">
        <div className="grid gap-6 rounded-2xl border border-[#e3dcff] bg-linear-to-r from-[#f3f6ff] via-[#f4f1ff] to-[#efe2ff] p-4 pt-8 sm:p-8 lg:grid-cols-[330px_1fr] lg:p-4 lg:pl-0">
          <div className="lg:pt-3">
            <span className="relative -ml-4 inline-block bg-brand py-2 pl-8 pr-10 font-serif text-lg font-semibold text-white [clip-path:polygon(0_0,100%_0,92%_50%,100%_100%,0_100%)] sm:-ml-8 lg:-ml-3">
              Customer Stories
            </span>
            <div className="lg:pl-7">
              <h2 className="mt-5 font-serif text-xl font-semibold text-ink">Why Customers Choose Us</h2>
              <ul className="mt-5 space-y-4 text-[15px] text-body">
                <li className="flex items-center gap-2.5"><CircleCheck className="h-5 w-5 shrink-0 fill-success text-white" /><span>Hand picked offers from <b className="text-ink">30+ lenders</b></span></li>
                <li className="flex items-center gap-2.5"><CircleCheck className="h-5 w-5 shrink-0 fill-success text-white" /><span>Money in days via <b className="text-ink">Pre-Approved Loans</b></span></li>
                <li className="flex items-center gap-2.5"><CircleCheck className="h-5 w-5 shrink-0 fill-success text-white" /><span><b className="text-ink">Instant Sanction</b> &amp; Disbursal</span></li>
              </ul>
            </div>
          </div>
          <div className="min-w-0 rounded-xl bg-white p-3 sm:p-4">
            <Carousel>
              {STORIES.map((s) => (
                <figure key={s.name} className="w-[240px] shrink-0 snap-start overflow-hidden rounded-lg border border-line sm:w-[268px]">
                  <div className="relative h-[150px] overflow-hidden p-3" style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/icons/${s.icon}.png`} alt="" className="absolute -bottom-3 -right-3 h-28 w-28 opacity-90" />
                    <blockquote className="relative z-10 max-w-[78%] text-[12.5px] font-semibold leading-snug text-white">
                      “{s.quote}”
                    </blockquote>
                    <span className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-ink">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" /> 5.0 Rated
                    </span>
                  </div>
                  <figcaption className="flex items-center gap-2 px-3 py-2.5 text-xs text-body">
                    <span className="font-medium text-ink">{s.name}</span>
                    <span className="h-3 w-px bg-line" /> {s.city}
                  </figcaption>
                </figure>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* ================= REVIEWS ================= */}
      <section className="container-x pb-14 sm:pb-16">
        <h2 className="font-serif text-2xl font-semibold text-ink sm:text-[28px]">What our customers say</h2>
        <Carousel className="mt-6">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="relative flex w-[86%] shrink-0 snap-start flex-col overflow-hidden rounded-lg border border-[#cfe0ff] bg-white p-6 sm:w-[380px]">
              <span className="pointer-events-none absolute -top-6 right-4 font-serif text-[120px] leading-none text-[#d9e6ff]">”</span>
              <h3 className="relative text-[17px] font-semibold text-ink">{r.title}</h3>
              <blockquote className="relative mt-3 line-clamp-6 flex-1 text-[15px] leading-relaxed text-body">{r.text}</blockquote>
              <figcaption className="mt-6 flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#d0d1d2] text-white"><User className="h-5 w-5" /></span>
                  <span>
                    <span className="block text-[15px] font-medium text-ink">{r.name}</span>
                    <span className="block text-[11px] italic text-muted">{r.date}</span>
                  </span>
                </span>
                <span className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-[18px] w-[18px] fill-accent text-accent" />)}
                </span>
              </figcaption>
            </figure>
          ))}
        </Carousel>
      </section>

      {/* ================= CALCULATORS ================= */}
      <section className="bg-tile py-12 sm:py-14">
        <div className="container-x">
          <h2 className="font-serif text-2xl font-semibold text-ink sm:text-[28px]">Plan Smart with Calculators</h2>
          <p className="mt-4 text-[15px] leading-7 text-body sm:text-[17px]">
            Explore our easy-to-use Loan EMI calculators and interest rate guides. Check your EMI, compare rates and plan
            your loan before you apply. Choose a calculator to get started:
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
            {[
              { title: "Loan EMI\nCalculators", bg: "#f6efff", icon: "abacus", links: PRODUCTS.map((p) => ({ label: `${p.name} EMI Calculator`, href: `/emi-calculator?type=${p.slug}` })) },
              { title: "Loan Interest\nRates", bg: "#eefaf3", icon: "chart-up", links: PRODUCTS.map((p) => ({ label: `${p.name} Interest Rates`, href: `/${p.slug}#rates` })) },
              {
                title: "Loan Guides\n& Tools", bg: "#edf3ff", icon: "bulb",
                links: [
                  { label: "Check Loan Eligibility", href: "/apply" },
                  { label: "Compare Loan Offers", href: "/offers" },
                  { label: "Credit Score Tips", href: "/blog?category=Credit%20Score" },
                  { label: "Personal Loan Guides", href: "/blog?category=Personal%20Loan" },
                  { label: "Home Loan Guides", href: "/blog?category=Home%20Loan" },
                  { label: "Personal Finance Blog", href: "/blog" },
                ],
              },
            ].map((c) => (
              <div key={c.title} className="overflow-hidden rounded-lg border border-line bg-white">
                <div className="m-2 flex items-center justify-between rounded-lg px-4 py-5" style={{ background: c.bg }}>
                  <h3 className="whitespace-pre-line text-xl font-semibold leading-snug text-ink">{c.title}</h3>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/icons/${c.icon}.png`} alt="" className="h-16 w-16" />
                </div>
                <ul className="mt-2">
                  {c.links.map((l) => (
                    <li key={l.label} className="border-b border-line last:border-0">
                      <Link href={l.href} className="flex items-center justify-between px-5 py-4 text-[15px] font-medium text-ink hover:text-brand sm:text-base">
                        {l.label} <ChevronRight className="h-5 w-5 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BLOG ================= */}
      {blogs.length > 0 && (
        <section className="container-x pt-14 sm:pt-20">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-serif text-2xl font-semibold text-ink sm:text-[28px]">Learn &amp; Resources</h2>
            <Link href="/blog" className="flex items-center gap-1 text-sm font-semibold text-brand">
              View all articles <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((b) => <BlogCard key={b.slug} b={b} />)}
          </div>
        </section>
      )}

      {/* ================= ABOUT / PARTNER ================= */}
      <section className="container-x py-14 sm:py-20">
        <div className="mx-auto grid max-w-[970px] gap-10 md:grid-cols-2 md:gap-8">
          {[
            { title: "About Us", sub: `How we are building a trusted ${SITE.name} brand`, cta: "Know More", href: "/about", from: "#b8e4ff", to: "#47bcff", icons: ["man-office", "woman-office", "classical"] },
            { title: "Partner with Us", sub: "NBFC or DSA? Grow your loan business with us", cta: "Join Us", href: "/partner?tab=register", from: "#a3ffdc", to: "#0eea80", icons: ["handshake", "bank", "chart-up"] },
          ].map((c) => (
            <div key={c.title} className="relative rounded-md px-6 pb-16 pt-10 text-center" style={{ background: `linear-gradient(160deg, ${c.from}, ${c.to})` }}>
              <div className="flex items-end justify-center gap-2">
                {c.icons.map((i, n) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={`/icons/${i}.png`} alt="" className={n === 1 ? "h-32 w-32 sm:h-40 sm:w-40" : "h-20 w-20 sm:h-24 sm:w-24"} />
                ))}
              </div>
              <h3 className="mt-6 text-[28px] font-bold text-[#333] sm:text-[32px]">{c.title}</h3>
              <p className="mt-3 text-[15px] text-[#333] sm:text-base">{c.sub}</p>
              <Link
                href={c.href}
                className="absolute -bottom-6 right-6 flex w-[180px] items-center justify-between bg-white px-6 py-5 text-[15px] font-semibold uppercase text-brand shadow-[0_6px_18px_rgba(0,0,0,0.12)] hover:text-brand-dark"
              >
                {c.cta} <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ================= LENDING PARTNERS ================= */}
      {BANKS.length > 0 && (
        <section className="bg-tile py-12 sm:py-16">
          <div className="container-x">
            <h2 className="max-w-xs font-serif text-2xl font-semibold leading-snug text-ink sm:text-[26px]">
              Our partners from across the industry
            </h2>
            <div className="mt-8">
              <PartnerGrid banks={BANKS} filters={BANK_FILTERS} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
