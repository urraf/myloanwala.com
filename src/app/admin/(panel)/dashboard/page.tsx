import Link from "next/link";
import { ArrowRight, Bot, FileText, Handshake, Users } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { Blog, Lead, Partner, getSettings } from "@/lib/models";
import { formatINR } from "@/lib/site";
import { requireAdmin } from "@/lib/auth";
import { removeDemoData } from "@/lib/actions/admin";

export default async function AdminDashboard() {
  await requireAdmin();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [totalLeads, todayLeads, newLeads, pendingPartners, partners, blogs, settings, recent, demoCount] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ createdAt: { $gte: today } }),
    Lead.countDocuments({ status: "new" }),
    Partner.countDocuments({ status: "pending" }),
    Partner.countDocuments({ status: "approved" }),
    Blog.countDocuments(),
    getSettings(),
    Lead.find().sort({ createdAt: -1 }).limit(8).lean(),
    Promise.all([Lead.countDocuments({ demo: true }), Partner.countDocuments({ demo: true })]).then(([a, b]) => a + b),
  ]);

  const cards = [
    { label: "Total Leads", value: totalLeads, sub: `${todayLeads} today`, icon: Users, href: "/admin/leads" },
    { label: "New Leads", value: newLeads, sub: "Not contacted yet", icon: Users, href: "/admin/leads?status=new" },
    { label: "Active Partners", value: partners, sub: `${pendingPartners} pending approval`, icon: Handshake, href: "/admin/partners" },
    { label: "Blog Posts", value: blogs, sub: settings.autoBlogEnabled ? "AI automation ON" : "AI automation OFF", icon: FileText, href: "/admin/blogs" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card p-4 transition hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted sm:text-sm">{c.label}</p>
              <c.icon className="h-5 w-5 text-brand" />
            </div>
            <p className="mt-2 text-2xl font-bold text-navy sm:text-3xl">{c.value}</p>
            <p className="mt-1 text-xs text-body">{c.sub}</p>
          </Link>
        ))}
      </div>

      {demoCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          <span><b>{demoCount}</b> sample leads/partners are shown so the dashboard looks complete. Remove them before real use.</span>
          <form action={removeDemoData}><button className="btn-outline bg-white px-3 py-1.5 text-xs">Remove demo data</button></form>
        </div>
      )}

      {pendingPartners > 0 && (
        <Link href="/admin/partners" className="flex items-center justify-between rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          <span><b>{pendingPartners}</b> partner registration(s) waiting for your approval</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line p-4">
            <h2 className="font-semibold">Recent Leads</h2>
            <Link href="/admin/leads" className="text-sm font-medium text-brand">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <tbody className="divide-y divide-line">
                {recent.map((l) => (
                  <tr key={String(l._id)}>
                    <td className="px-4 py-3"><p className="font-medium">{l.name}</p><p className="text-xs text-muted">{l.phone}</p></td>
                    <td className="px-4 py-3">{l.loanType}<p className="text-xs text-muted">{l.amount ? formatINR(l.amount) : ""}</p></td>
                    <td className="px-4 py-3 text-xs text-muted">{new Date(l.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</td>
                    <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                  </tr>
                ))}
                {recent.length === 0 && <tr><td className="px-4 py-10 text-center text-body">No leads yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="flex items-center gap-2 font-semibold"><Bot className="h-5 w-5 text-brand" /> AI Blog Automation</h2>
          <p className="mt-3 text-sm">
            Status: <b className={settings.autoBlogEnabled ? "text-success" : "text-muted"}>{settings.autoBlogEnabled ? `ON — every ${settings.intervalHours}h` : "OFF"}</b>
          </p>
          <p className="mt-1 text-xs text-muted">Last run: {settings.lastRunAt ? new Date(settings.lastRunAt).toLocaleString("en-IN") : "never"}</p>
          {settings.lastStatus && <p className="mt-2 break-words text-xs text-body">{settings.lastStatus}</p>}
          <Link href="/admin/automation" className="btn-outline mt-4 w-full">Manage</Link>
        </div>
      </div>
    </div>
  );
}
