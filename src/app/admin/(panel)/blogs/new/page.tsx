import BlogEditor from "@/components/BlogEditor";
import { requireAdmin } from "@/lib/auth";

export default async function NewBlogPage() {
  await requireAdmin();
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">New Blog Post</h1>
      <BlogEditor />
    </div>
  );
}
