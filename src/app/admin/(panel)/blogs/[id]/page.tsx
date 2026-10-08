import { isValidObjectId } from "mongoose";
import { notFound } from "next/navigation";
import BlogEditor from "@/components/BlogEditor";
import { requireAdmin } from "@/lib/auth";
import { Blog } from "@/lib/models";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const b = isValidObjectId(id) ? await Blog.findById(id).lean() : null;
  if (!b) notFound();
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Edit Post</h1>
      <BlogEditor
        blog={{
          id: String(b._id), title: b.title, slug: b.slug, excerpt: b.excerpt, content: b.content, coverImage: b.coverImage,
          imageCredit: b.imageCredit, imageAlt: b.imageAlt, metaTitle: b.metaTitle, metaDescription: b.metaDescription,
          category: b.category, tags: b.tags, published: b.published,
        }}
      />
    </div>
  );
}
