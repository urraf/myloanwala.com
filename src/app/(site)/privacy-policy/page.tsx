import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" />
      <section className="container-x prose-blog max-w-4xl py-10">
        <p>This Privacy Policy explains how {SITE.name} (&quot;we&quot;, &quot;us&quot;) collects, uses and protects your information when you use {SITE.domain}.</p>
        <h2>Information we collect</h2>
        <ul>
          <li>Details you submit in our forms — name, mobile number, email, city, income, employment and loan requirement.</li>
          <li>Basic technical data such as browser type and pages visited, to improve our website.</li>
        </ul>
        <h2>How we use your information</h2>
        <ul>
          <li>To contact you about your loan requirement and share suitable offers.</li>
          <li>To share your application with our partner banks, NBFCs and DSAs, only for processing your loan request.</li>
          <li>To send service updates by call, SMS, email or WhatsApp.</li>
        </ul>
        <h2>Data security</h2>
        <p>We use reasonable security measures to protect your data. We do not sell your personal information to anyone.</p>
        <h2>Your choices</h2>
        <p>You can ask us to update or delete your information at any time by writing to {SITE.email}.</p>
        <h2>Contact</h2>
        <p>For any privacy questions, email us at {SITE.email}.</p>
      </section>
    </>
  );
}
