import { getAdmin } from "@/lib/auth";
import { Lead } from "@/lib/models";
import { leadFilter } from "@/lib/lead-filter";

const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

// Download leads as CSV (opens in Excel / Google Sheets)
export async function GET(req: Request) {
  if (!(await getAdmin())) return new Response("Unauthorized", { status: 401 });
  const sp = Object.fromEntries(new URL(req.url).searchParams);
  const leads = await Lead.find(leadFilter(sp)).sort({ createdAt: -1 }).populate("assignedTo", "company").lean();
  const head = ["Date", "Name", "Phone", "Email", "City", "Loan Type", "Amount", "Monthly Income", "Employment", "Status", "Source", "Assigned To", "Notes"];
  const rows = leads.map((l) => [
    new Date(l.createdAt).toLocaleString("en-IN"), l.name, l.phone, l.email, l.city, l.loanType, l.amount, l.monthlyIncome,
    l.employment, l.status, l.source, (l.assignedTo as unknown as { company?: string } | null)?.company, l.notes,
  ]);
  const csv = [head, ...rows].map((r) => r.map(esc).join(",")).join("\n");
  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
