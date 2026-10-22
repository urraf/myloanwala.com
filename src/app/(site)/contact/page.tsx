import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import LeadForm from "@/components/LeadForm";
import { getBrand } from "@/lib/brand";

export function generateMetadata() {
  return pageMetadata({ title: "Contact Us — Call or Visit Our Loan Experts", description: "Talk to our loan experts for home loan, loan against property and personal loan help. Call, WhatsApp, email or visit our office in New Delhi.", path: "/contact", keywords: ["loan agent near me", "home loan consultant Delhi", "loan advisor New Delhi"] });
}

export default async function ContactPage() {
  const SITE = await getBrand();
  const items = [
    { icon: Phone, label: "Call us", value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, "")}` },
    { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: MapPin, label: "Office", value: SITE.address },
    { icon: Clock, label: "Working hours", value: SITE.hours },
  ];
  return (
    <>
      <PageHeader title="Contact Us" subtitle="We're here to help you find the right loan." />
      <section className="container-x grid gap-10 py-12 lg:grid-cols-2">
        <div className="grid content-start gap-4 sm:grid-cols-2">
          {items.map((i) => (
            <div key={i.label} className="card p-5">
              <i.icon className="h-6 w-6 text-brand" />
              <p className="mt-3 text-xs text-muted">{i.label}</p>
              {i.href ? (
                <a href={i.href} className="mt-0.5 block break-words font-semibold hover:text-brand">{i.value}</a>
              ) : (
                <p className="mt-0.5 font-semibold">{i.value}</p>
              )}
            </div>
          ))}
        </div>
        <LeadForm title="Request a call back" />
      </section>
    </>
  );
}
