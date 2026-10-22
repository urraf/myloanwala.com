// Runs once when the Next.js server starts — starts the AI blog scheduler.
// Only in production (`next start`), so `npm run dev` on a laptop never posts to the live database.
export async function register() {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.NEXT_PHASE !== "phase-production-build" &&
    process.env.NODE_ENV === "production" &&
    process.env.DISABLE_SCHEDULER !== "1" // set to 1 when testing a production build locally
  ) {
    const { startScheduler } = await import("./lib/scheduler");
    startScheduler();
  }
}
