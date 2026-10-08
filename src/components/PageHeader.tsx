export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="bg-soft py-10">
      <div className="container-x">
        <h1 className="font-serif text-3xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-2 text-body">{subtitle}</p>}
      </div>
    </section>
  );
}
