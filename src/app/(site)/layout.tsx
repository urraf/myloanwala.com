import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import JsonLd from "@/components/JsonLd";
import { getBrand } from "@/lib/brand";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const brand = await getBrand();
  return (
    <>
      <JsonLd data={[organizationJsonLd(brand), websiteJsonLd(brand)]} />
      <Header />
      <main>{children}</main>
      <Footer />
      <ChatWidget />
    </>
  );
}
