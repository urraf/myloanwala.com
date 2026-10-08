import { Bot, CheckCircle2, Sparkles, XCircle } from "lucide-react";
import ActionForm from "@/components/ActionForm";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/models";
import { generateBlogNow, saveAutomation } from "@/lib/actions/admin";

function Check({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      {ok ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-red-500" />} {label}
    </li>
  );
}

export default async function AutomationPage() {
  await requireAdmin();
  const s = await getSettings();
  const hasGroq = !!process.env.GROQ_API_KEY;
  const hasPexels = !!process.env.PEXELS_API_KEY;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold"><Bot className="h-7 w-7 text-brand" /> AI Blog Automation</h1>
        <p className="text-sm text-body">AI writes finance blog posts with a matching image and publishes them automatically.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="card p-5">
          <h2 className="mb-4 font-semibold">Auto-publish settings</h2>
          <ActionForm action={saveAutomation} submitLabel="Save Settings" buttonClassName="btn-primary">
            <label className="flex items-center gap-3 rounded-xl bg-soft p-4">
              <input type="checkbox" name="autoBlogEnabled" defaultChecked={s.autoBlogEnabled} className="h-5 w-5 accent-brand" />
              <span>
                <span className="block font-medium">Enable automatic blog posting</span>
                <span className="block text-xs text-body">A new post is written and published on the schedule below.</span>
              </span>
            </label>
            <div className="max-w-xs">
              <label className="label">Publish a new post every</label>
              <div className="flex items-center gap-2">
                <input name="intervalHours" type="number" min={1} max={168} defaultValue={s.intervalHours} className="input" />
                <span className="text-sm text-body">hour(s)</span>
              </div>
            </div>
            <div>
              <label className="label">Topics (one per line — AI picks one at random each time)</label>
              <textarea name="topics" rows={10} defaultValue={s.topics.join("\n")} className="input font-mono text-xs" />
            </div>
          </ActionForm>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="font-semibold">Status</h2>
            <ul className="mt-3 space-y-2">
              <Check ok={hasGroq} label="Groq API key configured" />
              <Check ok={hasPexels} label="Pexels API key (images)" />
              <Check ok={s.autoBlogEnabled} label={s.autoBlogEnabled ? `Running every ${s.intervalHours}h` : "Automation is off"} />
            </ul>
            <p className="mt-4 text-xs text-muted">Last run: {s.lastRunAt ? new Date(s.lastRunAt).toLocaleString("en-IN") : "never"}</p>
            {s.lastStatus && <p className="mt-1 break-words text-xs text-body">{s.lastStatus}</p>}
            {!hasPexels && <p className="mt-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">Without a Pexels key, posts get a branded gradient cover instead of a photo.</p>}
          </div>

          <div className="card p-5">
            <h2 className="flex items-center gap-2 font-semibold"><Sparkles className="h-5 w-5 text-brand" /> Write a post now</h2>
            <p className="mb-4 mt-1 text-xs text-muted">Takes about 10–30 seconds.</p>
            <ActionForm action={generateBlogNow} submitLabel="Generate with AI">
              <div><label className="label">Topic (optional)</label><input name="topic" className="input" placeholder="e.g. How to improve CIBIL score fast" /></div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="publish" defaultChecked className="h-4 w-4 accent-brand" /> Publish immediately
              </label>
            </ActionForm>
          </div>
        </div>
      </div>
    </div>
  );
}
