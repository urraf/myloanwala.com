import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import ActionForm from "@/components/ActionForm";
import { requireAdmin } from "@/lib/auth";
import { Offer } from "@/lib/models";
import { deleteOffer, importSampleOffers, saveOffer } from "@/lib/actions/admin";
import { LOAN_TYPES } from "@/lib/products";

export default async function OffersAdminPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdmin();
  const { edit } = await searchParams;
  const offers = await Offer.find().sort({ loanType: 1, order: 1 }).lean();
  const editing = edit ? offers.find((o) => String(o._id) === edit) : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Loan Offers</h1>
        <p className="text-sm text-body">These offers appear on the homepage, Offers page and each loan page.</p>
      </div>

      <div className="card p-5" id="form">
        <h2 className="mb-4 font-semibold">{editing ? `Edit offer — ${editing.lender}` : "Add new offer"}</h2>
        <ActionForm
          key={edit || "new"}
          action={saveOffer}
          submitLabel={editing ? "Update Offer" : "Add Offer"}
          resetOnSuccess
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          buttonClassName="btn-primary self-end"
        >
          <input type="hidden" name="id" value={editing ? String(editing._id) : ""} />
          <div><label className="label">Lender Name *</label><input name="lender" defaultValue={editing?.lender} className="input" placeholder="e.g. HDFC Bank" required /></div>
          <div>
            <label className="label">Loan Type *</label>
            <select name="loanType" defaultValue={editing?.loanType} className="input">{LOAN_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          </div>
          <div><label className="label">Interest Rate *</label><input name="interestRate" defaultValue={editing?.interestRate} className="input" placeholder="10.49% onwards" required /></div>
          <div><label className="label">Loan Amount</label><input name="maxAmount" defaultValue={editing?.maxAmount} className="input" placeholder="Up to ₹40 Lakh" /></div>
          <div><label className="label">Tenure</label><input name="tenure" defaultValue={editing?.tenure} className="input" placeholder="Up to 5 years" /></div>
          <div><label className="label">Processing Fee</label><input name="processingFee" defaultValue={editing?.processingFee} className="input" placeholder="Up to 2%" /></div>
          <div><label className="label">Highlight Badge</label><input name="highlight" defaultValue={editing?.highlight} className="input" placeholder="Instant approval" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Sort Order</label><input name="order" type="number" defaultValue={editing?.order ?? 0} className="input" /></div>
            <label className="flex items-end gap-2 pb-3 text-sm">
              <input type="checkbox" name="active" defaultChecked={editing ? editing.active : true} className="h-4 w-4 accent-brand" /> Active
            </label>
          </div>
        </ActionForm>
        {editing && <Link href="/admin/offers" className="mt-3 inline-block text-sm text-brand">Cancel editing</Link>}
      </div>

      {offers.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-body">No offers added yet. The website is currently showing sample offers.</p>
          <form action={importSampleOffers} className="mt-4">
            <button className="btn-outline">Import sample offers to edit</button>
          </form>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-soft text-xs uppercase text-body">
                <tr>
                  <th className="px-4 py-3">Lender</th>
                  <th className="px-4 py-3">Loan Type</th>
                  <th className="px-4 py-3">Rate</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {offers.map((o) => (
                  <tr key={String(o._id)}>
                    <td className="px-4 py-3 font-medium">{o.lender}{o.highlight && <span className="ml-2 rounded bg-accent/30 px-1.5 py-0.5 text-[10px]">{o.highlight}</span>}</td>
                    <td className="px-4 py-3">{o.loanType}</td>
                    <td className="px-4 py-3">{o.interestRate}</td>
                    <td className="px-4 py-3 text-body">{o.maxAmount}</td>
                    <td className="px-4 py-3 text-xs">{o.active ? <span className="text-success">Active</span> : <span className="text-muted">Hidden</span>}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link href={`/admin/offers?edit=${o._id}#form`} className="rounded-lg p-2 text-brand hover:bg-soft" title="Edit"><Pencil className="h-4 w-4" /></Link>
                        <form action={deleteOffer}>
                          <input type="hidden" name="id" value={String(o._id)} />
                          <button className="rounded-lg p-2 text-red-500 hover:bg-red-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
