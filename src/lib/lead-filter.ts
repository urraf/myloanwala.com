export type LeadQuery = { status?: string; type?: string; q?: string; page?: string };

export function leadFilter({ status, type, q }: LeadQuery) {
  const f: Record<string, unknown> = {};
  if (status) f.status = status;
  if (type) f.loanType = type;
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    f.$or = [{ name: rx }, { phone: rx }, { city: rx }, { email: rx }];
  }
  return f;
}
