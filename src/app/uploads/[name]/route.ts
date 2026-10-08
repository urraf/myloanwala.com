import fs from "node:fs/promises";
import path from "node:path";

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" };

// Serves blog images uploaded from the admin panel (stored in ./uploads)
export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const name = path.basename((await params).name);
  const type = TYPES[name.split(".").pop() || ""];
  if (!type) return new Response("Not found", { status: 404 });
  try {
    const file = await fs.readFile(path.join(process.cwd(), "uploads", name));
    return new Response(new Uint8Array(file), {
      headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
