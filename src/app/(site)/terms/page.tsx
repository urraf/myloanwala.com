import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Terms of Use" />
      <section className="container-x prose-blog max-w-4xl py-10">
        <p>By using {SITE.domain} you agree to the following terms.</p>
        <h2>Our service</h2>
        <p>{SITE.name} is a loan facilitation platform. We are not a bank or lender. Loans are approved and disbursed solely by our partner banks and NBFCs as per their own policies.</p>
        <h2>Information shown</h2>
        <p>Interest rates, fees and offers on this website are indicative and may change without notice. Final terms are shared by the lender before you accept a loan.</p>
        <h2>Your consent</h2>
        <p>By submitting a form, you authorise {SITE.name} and its partners to contact you by call, SMS, email or WhatsApp regarding your request, even if your number is registered under DND.</p>
        <h2>User responsibilities</h2>
        <p>You agree to provide true and accurate information. Submitting false information may lead to rejection of your application.</p>
        <h2>Limitation of liability</h2>
        <p>{SITE.name} is not responsible for decisions made by lenders, including approval, rejection, interest rate or loan amount.</p>
        <h2>Contact</h2>
        <p>For questions about these terms, email {SITE.email}.</p>
      </section>
    </>
  );
}
