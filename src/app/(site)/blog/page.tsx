import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/Cards";
import { getBlogs } from "@/lib/data";
import { BLOG_CATEGORIES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog — Loan Guides, Credit Score Tips & Personal Finance",
  description: "Read the latest guides on personal loans, home loans, business loans, credit score and money management.",
};

const PER_PAGE = 12;

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string; page?: string }> }) {
  const { category, page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const { blogs, total } = await getBlogs({ category, limit: PER_PAGE, skip: (current - 1) * PER_PAGE });
  const pages = Math.ceil(total / PER_PAGE);
  const qs = (p: number) => `/blog?${new URLSearchParams({ ...(category ? { category } : {}), page: String(p) })}`;

  return (
    <>
      <section className="bg-soft py-10">
        <div className="container-x">
          <h1 className="font-serif text-3xl font-semibold">Learn &amp; Resources</h1>
          <p className="mt-2 text-body">Simple guides on loans, credit score and smart money decisions.</p>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            <Link href="/blog" className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${!category ? "bg-brand text-white" : "bg-white text-body"}`}>All</Link>
            {BLOG_CATEGORIES.map((c) => (
              <Link key={c} href={`/blog?category=${encodeURIComponent(c)}`} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${category === c ? "bg-brand text-white" : "bg-white text-body"}`}>
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="container-x py-10">
        {blogs.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((b) => <BlogCard key={b.slug} b={b} />)}
          </div>
        ) : (
          <p className="rounded-2xl bg-soft p-10 text-center text-body">No articles yet. Check back soon!</p>
        )}
        {pages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {current > 1 && <Link href={qs(current - 1)} className="btn-outline">← Previous</Link>}
            <span className="btn text-body">Page {current} of {pages}</span>
            {current < pages && <Link href={qs(current + 1)} className="btn-outline">Next →</Link>}
          </div>
        )}
      </section>
    </>
  );
}
