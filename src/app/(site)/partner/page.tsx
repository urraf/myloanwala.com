import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, CheckCircle2, ClipboardList, Users } from "lucide-react";
import ActionForm from "@/components/ActionForm";
import { getPartner } from "@/lib/auth";
import { partnerLogin, partnerRegister } from "@/lib/actions/partner";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partner With Us — NBFC & DSA Partner Program",
  description: `Join ${SITE.name} as an NBFC or DSA partner. Get loan leads and track applications in your own dashboard.`,
};

export default async function PartnerPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  if (await getPartner().catch(() => null)) redirect("/partner/dashboard");
  const register = (await searchParams).tab === "register";

  return (
    <section className="bg-linear-to-b from-soft to-white">
      <div className="container-x grid gap-10 py-12 lg:grid-cols-2 lg:py-16">
        <div>
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand shadow-sm">NBFC &amp; DSA Partner Program</span>
          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
            Grow your loan business with <span className="text-brand">{SITE.name}</span>
          </h1>
          <p className="mt-3 text-body">Whether you are an NBFC looking for quality borrowers or a DSA with customers to refer, our partner dashboard makes it simple.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { icon: Users, t: "Quality Leads", d: "Verified loan leads assigned directly to you." },
              { icon: ClipboardList, t: "Submit Leads", d: "DSAs can add customer applications in seconds." },
              { icon: BarChart3, t: "Track Status", d: "See every lead's status in real time." },
              { icon: CheckCircle2, t: "Simple & Free", d: "No setup cost, easy-to-use dashboard." },
            ].map((f) => (
              <div key={f.t} className="card p-4">
                <f.icon className="h-6 w-6 text-brand" />
                <h3 className="mt-2 font-semibold">{f.t}</h3>
                <p className="mt-1 text-sm text-body">{f.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="card p-6 shadow-lg sm:p-8">
            <div className="mb-6 grid grid-cols-2 rounded-xl bg-soft p-1 text-sm font-semibold">
              <Link href="/partner" className={`rounded-lg py-2 text-center ${!register ? "bg-white text-brand shadow-sm" : "text-body"}`}>Login</Link>
              <Link href="/partner?tab=register" className={`rounded-lg py-2 text-center ${register ? "bg-white text-brand shadow-sm" : "text-body"}`}>Register</Link>
            </div>

            {register ? (
              <ActionForm action={partnerRegister} submitLabel="Register as Partner" hideOnSuccess captcha>
                <div>
                  <label className="label">I am a</label>
                  <select name="type" className="input" defaultValue="DSA">
                    <option value="DSA">DSA (Direct Selling Agent)</option>
                    <option value="NBFC">NBFC / Lender</option>
                  </select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="label">Your Name</label><input name="name" className="input" required /></div>
                  <div><label className="label">Company Name</label><input name="company" className="input" required /></div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="label">Mobile</label><input name="phone" className="input" inputMode="numeric" maxLength={10} required /></div>
                  <div><label className="label">City</label><input name="city" className="input" /></div>
                </div>
                <div><label className="label">Email</label><input name="email" type="email" className="input" required /></div>
                <div><label className="label">Password</label><input name="password" type="password" minLength={6} className="input" required /></div>
              </ActionForm>
            ) : (
              <ActionForm action={partnerLogin} submitLabel="Login to Dashboard" captcha>
                <div><label className="label">Email</label><input name="email" type="email" className="input" required autoComplete="email" /></div>
                <div><label className="label">Password</label><input name="password" type="password" className="input" required autoComplete="current-password" /></div>
                <p className="text-xs text-muted">Forgot password? Contact us at {SITE.email}</p>
              </ActionForm>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
