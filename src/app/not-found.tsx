import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PRODUCTS } from "@/lib/products";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container-x py-20 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/magnifier.png" alt="" className="mx-auto h-24 w-24" />
        <h1 className="mt-6 font-serif text-3xl font-semibold sm:text-4xl">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-body">The page you are looking for doesn&apos;t exist or has moved. Try one of these instead:</p>
        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3">
          {PRODUCTS.map((p) => (
            <Link key={p.slug} href={`/${p.slug}`} className="rounded-full border border-line px-4 py-2 text-sm hover:border-brand hover:text-brand">{p.name}</Link>
          ))}
        </div>
        <Link href="/" className="btn-primary mt-10">Go to Homepage</Link>
      </main>
      <Footer />
    </>
  );
}
