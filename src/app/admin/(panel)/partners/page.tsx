import { Trash2 } from "lucide-react";
import ActionForm from "@/components/ActionForm";
import StatusBadge from "@/components/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { Lead, Partner } from "@/lib/models";
import { adminSavePartner, deletePartner, setPartnerStatus } from "@/lib/actions/admin";

export default async function PartnersPage() {
  await requireAdmin();
  const [partners, leadCounts] = await Promise.all([
    Partner.find().sort({ status: -1, createdAt: -1 }).lean(), // "pending" sorts before "approved"/"blocked"
    Lead.aggregate<{ _id: unknown; n: number }>([
      { $match: { assignedTo: { $ne: null } } },
      { $group: { _id: "$assignedTo", n: { $sum: 1 } } },
    ]),
  ]);
  const leadsOf = (id: unknown) => leadCounts.find((c) => String(c._id) === String(id))?.n || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">NBFC &amp; DSA Partners</h1>
        <p className="text-sm text-body">Approve registrations, manage partner accounts and assign leads from the Leads page.</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-soft text-xs uppercase text-body">
              <tr>
                <th className="px-4 py-3">Partner</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Assigned Leads</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {partners.map((p) => (
                <tr key={String(p._id)}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.company}</p>
                    <p className="text-xs text-muted">{p.name}{p.city ? ` · ${p.city}` : ""}</p>
                  </td>
                  <td className="px-4 py-3"><span className="rounded-md bg-soft px-2 py-1 text-xs font-semibold text-brand">{p.type}</span></td>
                  <td className="px-4 py-3 text-xs">
                    <p>{p.email}</p>
                    <a href={`tel:${p.phone}`} className="text-brand">{p.phone}</a>
                  </td>
                  <td className="px-4 py-3">{leadsOf(p._id)}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {p.status !== "approved" && (
                        <form action={setPartnerStatus}>
                          <input type="hidden" name="id" value={String(p._id)} />
                          <input type="hidden" name="status" value="approved" />
                          <button className="btn-primary px-3 py-1.5 text-xs">Approve</button>
                        </form>
                      )}
                      {p.status !== "blocked" && (
                        <form action={setPartnerStatus}>
                          <input type="hidden" name="id" value={String(p._id)} />
                          <input type="hidden" name="status" value="blocked" />
                          <button className="btn border border-line px-3 py-1.5 text-xs text-body hover:bg-soft">Block</button>
                        </form>
                      )}
                      <form action={deletePartner}>
                        <input type="hidden" name="id" value={String(p._id)} />
                        <button className="rounded-lg p-2 text-red-500 hover:bg-red-50" title="Delete partner"><Trash2 className="h-4 w-4" /></button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {partners.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-body">No partners yet. Partners can register at /partner, or add one below.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold">Add partner / reset partner password</h2>
        <p className="mb-4 mt-1 text-xs text-muted">If the email already exists, only the password is reset. New partners are created as approved.</p>
        <ActionForm action={adminSavePartner} submitLabel="Save Partner" resetOnSuccess className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" buttonClassName="btn-primary self-end">
          <div><label className="label">Email *</label><input name="email" type="email" className="input" required /></div>
          <div><label className="label">Password *</label><input name="password" className="input" minLength={6} required /></div>
          <div>
            <label className="label">Type</label>
            <select name="type" className="input"><option>NBFC</option><option>DSA</option></select>
          </div>
          <div><label className="label">Company</label><input name="company" className="input" /></div>
          <div><label className="label">Contact Name</label><input name="name" className="input" /></div>
          <div><label className="label">Phone</label><input name="phone" className="input" /></div>
          <div><label className="label">City</label><input name="city" className="input" /></div>
        </ActionForm>
      </div>
    </div>
  );
}
