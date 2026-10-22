import { tick } from "@/lib/scheduler";

/**
 * Hourly trigger for the AI blog automation — for hosts that sleep when idle (e.g. Render free plan).
 * Point a free scheduler (cron-job.org) at:  https://your-domain/api/cron?key=YOUR_CRON_SECRET  every hour.
 * Safe to call any time: it only writes a post when one is due (same lock as the built-in scheduler).
 */
export const maxDuration = 120;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const key = new URL(req.url).searchParams.get("key");
  if (!secret || key !== secret) return new Response("Not found", { status: 404 });
  const result = await tick();
  return Response.json({ ok: !result.startsWith("error"), result, at: new Date().toISOString() });
}
