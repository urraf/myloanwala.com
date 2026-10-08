import type { Metadata } from "next";
import Link from "next/link";
import { LogOut, Plus } from "lucide-react";
import Logo from "@/components/Logo";
import ActionForm from "@/components/ActionForm";
import StatusBadge from "@/components/StatusBadge";
import { requirePartner } from "@/lib/auth";
import { LEAD_STATUS, Lead } from "@/lib/models";
import { partnerAddLead, partnerLogout, partnerUpdateLead } from "@/lib/actions/partner";
import { LOAN_TYPES } from "@/lib/products";
import { formatINR } from "@/lib/site";

export const metadata: Metadata = { title: "Partner Dashboard", robots: { index: false } };

export default async function PartnerDashboard({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const partner = await requirePartner();
  const { status } = await searchParams;

  const mine = { $or: [{ assignedTo: partner._id }, { createdBy: partner._id }] };
  const [leads, counts] = await Promise.all([
    Lead.find({ ...mine, ...(status ? { status } : {}) }).sort({ createdAt: -1 }).limit(200).lean(),
    Lead.aggregate<{ _id: string; n: number }>([{ $match: mine }, { $group: { _id: "$status", n: { $sum: 1 } } }]),
  ]);
  const count = (s?: string) => counts.filter((c) => !s || c._id === s).reduce((a, c) => a + c.n, 0);

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <header className="border-b border-line bg-white">
        <div className="container-x flex h-16 items-center justify-between gap-3">
          <Logo href="/partner/dashboard" />
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{partner.company}</p>
              <p className="text-xs text-muted">{partner.name} · {partner.type} Partner</p>
            </div>
            <form action={partnerLogout}>
              <button className="btn-outline px-3 py-2"><LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span></button>
            </form>
          </div>
        </div>
      </header>

      <main className="container-x space-y-6 py-6">
        <div>
          <h1 className="text-2xl font-semibold">Welcome, {partner.name.split(" ")[0]} 👋</h1>
          <p className="text-sm text-body">Track your leads and submit new customer applications.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ["Total Leads", count()],
            ["New", count("new")],
            ["In Process", count("in-process") + count("contacted") + count("approved")],
            ["Disbursed", count("disbursed")],
          ].map(([label, n]) => (
            <div key={label} className="card p-4 sm:p-5">
              <p className="text-xs text-muted sm:text-sm">{label}</p>
              <p className="mt-1 text-2xl font-bold text-navy">{n}</p>
            </div>
          ))}
        </div>

        <details className="card group p-5" open={leads.length === 0}>
          <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-brand [&::-webkit-details-marker]:hidden">
            <Plus className="h-5 w-5 transition group-open:rotate-45" /> Submit a new lead
          </summary>
          <div className="mt-5">
            <ActionForm action={partnerAddLead} submitLabel="Submit Lead" resetOnSuccess className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" buttonClassName="btn-primary self-end">
              <div><label className="label">Customer Name *</label><input name="name" className="input" required /></div>
              <div><label className="label">Mobile *</label><input name="phone" className="input" inputMode="numeric" maxLength={10} required /></div>
              <div>
                <label className="label">Loan Type *</label>
                <select name="loanType" className="input">{LOAN_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
              </div>
              <div><label className="label">Loan Amount (₹)</label><input name="amount" type="number" className="input" /></div>
              <div><label className="label">City</label><input name="city" className="input" /></div>
              <div><label className="label">Monthly Income (₹)</label><input name="monthlyIncome" type="number" className="input" /></div>
              <div>
                <label className="label">Employment</label>
                <select name="employment" className="input"><option>Salaried</option><option>Self Employed</option><option>Business Owner</option></select>
              </div>
              <div><label className="label">Notes</label><input name="notes" className="input" /></div>
            </ActionForm>
          </div>
        </details>

        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
            <h2 className="font-semibold">My Leads</h2>
            <div className="flex gap-1.5 overflow-x-auto text-xs [scrollbar-width:none]">
              <Link href="/partner/dashboard" className={`shrink-0 rounded-full px-3 py-1.5 ${!status ? "bg-brand text-white" : "bg-soft text-body"}`}>All</Link>
              {LEAD_STATUS.map((s) => (
                <Link key={s} href={`/partner/dashboard?status=${s}`} className={`shrink-0 rounded-full px-3 py-1.5 capitalize ${status === s ? "bg-brand text-white" : "bg-soft text-body"}`}>
                  {s.replace("-", " ")}
                </Link>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-soft text-xs uppercase text-body">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Loan</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {leads.map((l) => {
                  const assigned = String(l.assignedTo) === String(partner._id);
                  return (
                    <tr key={String(l._id)} className="align-top">
                      <td className="px-4 py-3">
                        <p className="font-medium">{l.name}</p>
                        <a href={`tel:${l.phone}`} className="text-xs text-brand">{l.phone}</a>
                      </td>
                      <td className="px-4 py-3">
                        <p>{l.loanType}</p>
                        <p className="text-xs text-muted">{l.amount ? formatINR(l.amount) : "—"}</p>
                      </td>
                      <td className="px-4 py-3">{l.city || "—"}</td>
                      <td className="px-4 py-3 text-xs">{assigned ? "Assigned to you" : "Submitted by you"}</td>
                      <td className="px-4 py-3 text-xs text-muted">{new Date(l.createdAt).toLocaleDateString("en-IN")}</td>
                      <td className="px-4 py-3">
                        {assigned ? (
                          <form action={partnerUpdateLead} className="flex flex-col gap-2">
                            <input type="hidden" name="id" value={String(l._id)} />
                            <select name="status" defaultValue={l.status} className="input py-1.5 text-xs capitalize">
                              {LEAD_STATUS.map((s) => <option key={s} value={s}>{s.replace("-", " ")}</option>)}
                            </select>
                            <input name="notes" defaultValue={l.notes} placeholder="Notes" className="input py-1.5 text-xs" />
                            <button className="btn-primary py-1.5 text-xs">Save</button>
                          </form>
                        ) : (
                          <>
                            <StatusBadge status={l.status} />
                            {l.notes && <p className="mt-1 max-w-[200px] text-xs text-muted">{l.notes}</p>}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {leads.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-body">No leads yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
