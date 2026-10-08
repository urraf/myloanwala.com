import { chat, type ChatMessage } from "@/lib/chatbot";
import { SITE } from "@/lib/site";

// Simple in-memory rate limit: 25 messages per 10 minutes per visitor IP
const WINDOW_MS = 10 * 60_000;
const LIMIT = 25;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > LIMIT;
}

export async function POST(req: Request) {
  const fallback = `Sorry, I'm unavailable right now. Please call us at ${SITE.phone} or apply at ${SITE.url}/apply.`;
  if (!process.env.GROQ_API_KEY) return Response.json({ reply: fallback });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) return Response.json({ reply: "You're sending messages too fast. Please wait a few minutes and try again." });

  let messages: ChatMessage[] = [];
  try {
    const body = await req.json();
    messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m: ChatMessage) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .slice(-12);
  } catch {}
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return Response.json({ reply: "Please type your question." }, { status: 400 });
  }

  try {
    return Response.json(await chat(messages));
  } catch (e) {
    console.error("[chat]", (e as Error).message);
    return Response.json({ reply: fallback });
  }
}
