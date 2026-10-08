import Link from "next/link";
import { Download, Search, Trash2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { LEAD_STATUS, Lead, Partner } from "@/lib/models";
import { deleteLead, updateLead } from "@/lib/actions/admin";
import { LOAN_TYPES } from "@/lib/products";
import { formatINR } from "@/lib/site";
import { leadFilter, type LeadQuery } from "@/lib/lead-filter";

type SP = LeadQuery;
const PER_PAGE = 50;

export default async function LeadsPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireAdmin();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const filter = leadFilter(sp);
  const [leads, total, partners] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip((page - 1) * PER_PAGE).limit(PER_PAGE).populate("createdBy", "company").lean(),
    Lead.countDocuments(filter),
    Partner.find({ status: "approved" }).select("company type").sort({ company: 1 }).lean(),
  ]);
  const pages = Math.ceil(total / PER_PAGE);
  const qs = new URLSearchParams(Object.entries(sp).filter(([k, v]) => v && k !== "page") as [string, string][]);
  const pageHref = (p: number) => `/admin/leads?${new URLSearchParams({ ...Object.fromEntries(qs), page: String(p) })}`;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Leads</h1>
          <p className="text-sm text-body">{total} lead(s) found</p>
        </div>
        <a href={`/admin/leads/export?${qs}`} className="btn-outline"><Download className="h-4 w-4" /> Export CSV</a>
      </div>

      <form className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_180px_200px_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input name="q" defaultValue={sp.q} placeholder="Search name, phone, city…" className="input pl-9" />
        </div>
        <select name="status" defaultValue={sp.status || ""} className="input capitalize">
          <option value="">All statuses</option>
          {LEAD_STATUS.map((s) => <option key={s} value={s}>{s.replace("-", " ")}</option>)}
        </select>
        <select name="type" defaultValue={sp.type || ""} className="input">
          <option value="">All loan types</option>
          {LOAN_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <div className="flex gap-2">
          <button className="btn-primary flex-1">Filter</button>
          <Link href="/admin/leads" className="btn-outline">Reset</Link>
        </div>
      </form>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-soft text-xs uppercase text-body">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Loan</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 w-[360px]">Status / Assign / Notes</th>
                <th className="px-2 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {leads.map((l) => {
                const by = l.createdBy as unknown as { company?: string } | null;
                return (
                  <tr key={String(l._id)} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium">{l.name}</p>
                      <a href={`tel:${l.phone}`} className="text-xs text-brand">{l.phone}</a>
                      {l.email && <p className="text-xs text-muted">{l.email}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p>{l.loanType}</p>
                      <p className="text-xs font-medium text-navy">{l.amount ? formatINR(l.amount) : "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-body">
                      <p>{l.city || "—"}</p>
                      <p>{l.employment}</p>
                      {l.monthlyIncome ? <p>Income: {formatINR(l.monthlyIncome)}/mo</p> : null}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {l.source === "partner" ? <span>Partner<br /><span className="text-muted">{by?.company}</span></span> : "Website"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {new Date(l.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      <div className="mt-1.5"><StatusBadge status={l.status} /></div>
                    </td>
                    <td className="px-4 py-3">
                      <form action={updateLead} className="grid grid-cols-2 gap-2">
                        <input type="hidden" name="id" value={String(l._id)} />
                        <select name="status" defaultValue={l.status} className="input py-1.5 text-xs capitalize">
                          {LEAD_STATUS.map((s) => <option key={s} value={s}>{s.replace("-", " ")}</option>)}
                        </select>
                        <select name="assignedTo" defaultValue={l.assignedTo ? String(l.assignedTo) : ""} className="input py-1.5 text-xs">
                          <option value="">— Not assigned —</option>
                          {partners.map((p) => <option key={String(p._id)} value={String(p._id)}>{p.company} ({p.type})</option>)}
                        </select>
                        <input name="notes" defaultValue={l.notes} placeholder="Notes" className="input col-span-2 py-1.5 text-xs" />
                        <button className="btn-primary col-span-2 py-1.5 text-xs">Save</button>
                      </form>
                    </td>
                    <td className="px-2 py-3">
                      <form action={deleteLead}>
                        <input type="hidden" name="id" value={String(l._id)} />
                        <button className="rounded-lg p-2 text-red-500 hover:bg-red-50" title="Delete lead"><Trash2 className="h-4 w-4" /></button>
                      </form>
                    </td>
                  </tr>
                );
              })}
              {leads.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-body">No leads found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2">
          {page > 1 && <Link href={pageHref(page - 1)} className="btn-outline">← Prev</Link>}
          <span className="btn text-body">Page {page} / {pages}</span>
          {page < pages && <Link href={pageHref(page + 1)} className="btn-outline">Next →</Link>}
        </div>
      )}
    </div>
  );
}
