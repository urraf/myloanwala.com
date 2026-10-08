import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { Calendar, ChevronRight } from "lucide-react";
import { BlogCard, BlogCover } from "@/components/Cards";
import ProductIcon from "@/components/ProductIcon";
import { connectDB } from "@/lib/db";
import { Blog } from "@/lib/models";
import { getBlogs } from "@/lib/data";
import { renderMarkdown } from "@/lib/markdown";
import { PRODUCTS } from "@/lib/products";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

const getPost = cache(async (slug: string) => {
  await connection();
  try {
    await connectDB();
    return await Blog.findOne({ slug, published: true }).lean();
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;
  return {
    title: { absolute: title },
    description,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: new Date(post.createdAt).toISOString(),
      images: post.coverImage ? [{ url: post.coverImage, alt: post.imageAlt || post.title }] : [],
    },
    twitter: { card: "summary_large_image", title, description, images: post.coverImage ? [post.coverImage] : [] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const { blogs: related } = await getBlogs({ category: post.category, limit: 4 });

  return (
    <>
      <div className="container-x py-4 text-xs text-muted">
        <Link href="/" className="hover:text-brand">Home</Link>
        <ChevronRight className="mx-1 inline h-3 w-3" />
        <Link href="/blog" className="hover:text-brand">Blog</Link>
        <ChevronRight className="mx-1 inline h-3 w-3" />
        <span className="text-ink">{post.category}</span>
      </div>

      <div className="container-x grid gap-10 pb-14 lg:grid-cols-[1fr_320px]">
        <article className="min-w-0">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: post.title,
                description: post.metaDescription || post.excerpt,
                image: post.coverImage ? [post.coverImage.startsWith("http") ? post.coverImage : `${SITE.url}${post.coverImage}`] : undefined,
                datePublished: new Date(post.createdAt).toISOString(),
                dateModified: new Date(post.updatedAt).toISOString(),
                keywords: post.tags?.join(", "),
                author: { "@type": "Organization", name: SITE.name },
                publisher: { "@type": "Organization", name: SITE.name },
                mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
              }).replace(/</g, "\\u003c"),
            }}
          />
          <Link href={`/blog?category=${encodeURIComponent(post.category)}`} className="text-xs font-semibold uppercase tracking-wide text-brand">
            {post.category}
          </Link>
          <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight sm:text-4xl">{post.title}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
            <Calendar className="h-4 w-4" />
            {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl">
            <BlogCover src={post.coverImage} title={post.imageAlt || post.title} className="aspect-[16/9]" />
          </div>
          {post.imageCredit && <p className="mt-2 text-right text-[11px] text-muted">{post.imageCredit}</p>}
          <div className="prose-blog mt-8" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
          {post.tags?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((t: string) => (
                <span key={t} className="rounded-full bg-soft px-3 py-1 text-xs text-body">#{t}</span>
              ))}
            </div>
          )}
        </article>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl bg-linear-to-br from-brand to-brand-dark p-6 text-white">
            <h3 className="text-lg font-semibold">Looking for a loan?</h3>
            <p className="mt-1 text-sm text-white/85">Compare offers from 30+ lenders and get the lowest rate.</p>
            <Link href="/apply" className="btn-accent mt-4 w-full">Check Offers</Link>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold">Popular Loans</h3>
            <ul className="mt-3 space-y-1">
              {PRODUCTS.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`} className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm hover:bg-soft hover:text-brand">
                    <ProductIcon name={p.icon} className="h-4 w-4 text-brand" /> {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {related.filter((r) => r.slug !== post.slug).length > 0 && (
        <section className="bg-soft py-12">
          <div className="container-x">
            <h2 className="section-title">Related Articles</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.filter((r) => r.slug !== post.slug).slice(0, 3).map((b) => <BlogCard key={b.slug} b={b} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
