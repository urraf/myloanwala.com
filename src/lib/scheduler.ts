import { connectDB } from "./db";
import { Settings, getSettings } from "./models";
import { generateBlogPost } from "./ai-blog";

/**
 * Built-in blog automation — runs inside the Next.js server process,
 * so no external cron job is needed. Every 5 minutes it checks whether
 * "intervalHours" have passed since the last post, and if so writes a new one.
 */
const CHECK_EVERY_MS = 5 * 60 * 1000;
const g = globalThis as unknown as { _blogScheduler?: NodeJS.Timeout };

async function tick() {
  try {
    await connectDB();
    const settings = await getSettings();
    if (!settings.autoBlogEnabled) return;

    const hours = Math.max(1, settings.intervalHours || 1);
    // Small slack so a 1-hour schedule doesn't drift to 1h05m
    const due = new Date(Date.now() - hours * 3600_000 + CHECK_EVERY_MS / 2);

    // Atomically claim this run — prevents duplicate posts if 2 processes run
    const claimed = await Settings.findOneAndUpdate(
      { key: "main", $or: [{ lastRunAt: null }, { lastRunAt: { $lte: due } }] },
      { lastRunAt: new Date(), lastStatus: "Running…" }
    );
    if (!claimed) return;

    const blog = await generateBlogPost({ publish: settings.autoPublish !== false });
    await Settings.updateOne({ key: "main" }, { lastStatus: `✅ ${blog.published ? "Published" : "Saved as draft"}: "${blog.title}"` });
    console.log(`[blog-scheduler] published: ${blog.title}`);
  } catch (e) {
    const msg = (e as Error).message;
    console.error("[blog-scheduler]", msg);
    await Settings.updateOne({ key: "main" }, { lastStatus: `❌ ${msg.slice(0, 300)}` }).catch(() => {});
  }
}

export function startScheduler() {
  if (g._blogScheduler || !process.env.MONGODB_URI) return;
  g._blogScheduler = setInterval(tick, CHECK_EVERY_MS);
  setTimeout(tick, 30_000); // first check shortly after boot
  console.log("[blog-scheduler] started");
}
