import fs from "node:fs/promises";
import path from "node:path";
import { connectDB } from "@/lib/db";
import { Upload } from "@/lib/models";

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" };
const CACHE = { "Cache-Control": "public, max-age=31536000, immutable" };

// Serves blog images uploaded from the admin panel (stored in MongoDB; older files may be in ./uploads)
export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const name = path.basename((await params).name);
  const type = TYPES[name.split(".").pop() || ""];
  if (!type) return new Response("Not found", { status: 404 });
  try {
    await connectDB();
    const img = await Upload.findOne({ name }); // full document → data is a Node Buffer
    if (img) return new Response(new Uint8Array(img.data), { headers: { "Content-Type": img.contentType, ...CACHE } });
  } catch {}
  try {
    const file = await fs.readFile(path.join(process.cwd(), "uploads", name));
    return new Response(new Uint8Array(file), { headers: { "Content-Type": type, ...CACHE } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
