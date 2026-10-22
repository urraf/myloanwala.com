export type LeadQuery = { status?: string; type?: string; q?: string; page?: string; site?: string };

export function leadFilter({ status, type, q, site }: LeadQuery) {
  const f: Record<string, unknown> = {};
  if (site) f.site = site;
  if (status) f.status = status;
  if (type) f.loanType = type;
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    f.$or = [{ name: rx }, { phone: rx }, { city: rx }, { email: rx }];
  }
  return f;
}
