import Link from "next/link";
import { Bot, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { Blog } from "@/lib/models";
import { deleteBlog, toggleBlog } from "@/lib/actions/admin";
import { ensureStarterBlogs } from "@/lib/data";

export default async function BlogsAdminPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireAdmin();
  await ensureStarterBlogs();
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const PER = 30;
  const [blogs, total] = await Promise.all([
    Blog.find().sort({ createdAt: -1 }).skip((page - 1) * PER).limit(PER).select("title slug category published aiGenerated createdAt coverImage").lean(),
    Blog.countDocuments(),
  ]);
  const pages = Math.ceil(total / PER);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Blogs</h1>
          <p className="text-sm text-body">{total} post(s)</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/automation" className="btn-outline"><Bot className="h-4 w-4" /> Write with AI</Link>
          <Link href="/admin/blogs/new" className="btn-primary"><Plus className="h-4 w-4" /> New Post</Link>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-soft text-xs uppercase text-body">
              <tr>
                <th className="px-4 py-3">Post</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {blogs.map((b) => (
                <tr key={String(b._id)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {b.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.coverImage} alt="" className="h-10 w-16 shrink-0 rounded object-cover" />
                      ) : (
                        <span className="h-10 w-16 shrink-0 rounded bg-soft" />
                      )}
                      <div className="min-w-0">
                        <p className="line-clamp-1 font-medium">{b.title}</p>
                        {b.aiGenerated && <span className="text-[11px] font-medium text-brand">AI generated</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-body">{b.category}</td>
                  <td className="px-4 py-3 text-xs text-muted">{new Date(b.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.published ? "published" : "draft"} /></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {b.published && (
                        <Link href={`/blog/${b.slug}`} target="_blank" className="rounded-lg px-2 py-2 text-xs text-body hover:bg-soft">View</Link>
                      )}
                      <form action={toggleBlog}>
                        <input type="hidden" name="id" value={String(b._id)} />
                        <button className="rounded-lg p-2 text-body hover:bg-soft" title={b.published ? "Unpublish" : "Publish"}>
                          {b.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </form>
                      <Link href={`/admin/blogs/${b._id}`} className="rounded-lg p-2 text-brand hover:bg-soft" title="Edit"><Pencil className="h-4 w-4" /></Link>
                      <form action={deleteBlog}>
                        <input type="hidden" name="id" value={String(b._id)} />
                        <button className="rounded-lg p-2 text-red-500 hover:bg-red-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-body">No posts yet. Create one or turn on AI automation.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {pages > 1 && (
        <div className="flex justify-center gap-2">
          {page > 1 && <Link href={`/admin/blogs?page=${page - 1}`} className="btn-outline">← Prev</Link>}
          <span className="btn text-body">Page {page} / {pages}</span>
          {page < pages && <Link href={`/admin/blogs?page=${page + 1}`} className="btn-outline">Next →</Link>}
        </div>
      )}
    </div>
  );
}
