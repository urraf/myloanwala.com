import { sendMail } from "./mail";
import { SITE, formatINR } from "./site";

/** Email address that receives new-lead alerts (LEAD_NOTIFY_EMAIL, else ADMIN_EMAIL). */
const to = () => process.env.LEAD_NOTIFY_EMAIL || process.env.ADMIN_EMAIL || "";
const row = (k: string, v: unknown) =>
  v ? `<tr><td style="padding:6px 12px;color:#6b7280">${k}</td><td style="padding:6px 12px;font-weight:600">${String(v).replace(/</g, "&lt;")}</td></tr>` : "";

/** Fire-and-forget email to the business owner when a new lead arrives. Never throws. */
export function notifyNewLead(lead: { name: string; phone: string; loanType: string; city?: string; amount?: number; monthlyIncome?: number; employment?: string; email?: string }, source: string) {
  if (!to() || !process.env.SMTP_HOST) return;
  const html = `<div style="font-family:Arial,sans-serif;max-width:520px">
    <h2 style="color:#0066ff;margin:0 0 4px">New ${lead.loanType} lead</h2>
    <p style="margin:0 0 12px;color:#6b7280">Source: ${source}</p>
    <table style="border-collapse:collapse;background:#f2f7ff;border-radius:8px;width:100%">
      ${row("Name", lead.name)}${row("Mobile", lead.phone)}${row("Email", lead.email)}${row("City", lead.city)}
      ${row("Loan amount", lead.amount ? formatINR(lead.amount) : "")}${row("Monthly income", lead.monthlyIncome ? formatINR(lead.monthlyIncome) : "")}${row("Employment", lead.employment)}
    </table>
    <p><a href="${SITE.url}/admin/leads" style="background:#0066ff;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;display:inline-block">Open Leads Dashboard</a></p>
  </div>`;
  sendMail(to(), `New lead: ${lead.name} — ${lead.loanType}`, html).catch((e) => console.error("[notify] lead email failed:", e.message));
}

export function notifyNewPartner(p: { name: string; company: string; type: string; phone: string; email: string; city?: string }) {
  if (!to() || !process.env.SMTP_HOST) return;
  const html = `<div style="font-family:Arial,sans-serif"><h2 style="color:#0066ff">New ${p.type} partner registration</h2>
    <table>${row("Company", p.company)}${row("Contact", p.name)}${row("Mobile", p.phone)}${row("Email", p.email)}${row("City", p.city)}</table>
    <p><a href="${SITE.url}/admin/partners">Approve in admin panel</a></p></div>`;
  sendMail(to(), `New partner awaiting approval: ${p.company}`, html).catch((e) => console.error("[notify] partner email failed:", e.message));
}
