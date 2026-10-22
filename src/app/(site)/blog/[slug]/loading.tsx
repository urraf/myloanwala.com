import { Sk } from "@/components/Skeleton";

// Blog article: title, cover image and paragraphs
export default function Loading() {
  return (
    <div className="container-x grid gap-10 py-8 lg:grid-cols-[1fr_320px]" aria-busy="true" aria-label="Loading">
      <div className="space-y-4">
        <Sk className="h-4 w-24" />
        <Sk className="h-9 w-5/6" />
        <Sk className="h-4 w-32" />
        <Sk className="aspect-[16/9] w-full rounded-2xl" />
        {Array.from({ length: 6 }).map((_, i) => <Sk key={i} className={`h-4 ${i % 3 === 2 ? "w-2/3" : "w-full"}`} />)}
      </div>
      <div className="space-y-4">
        <Sk className="h-40 w-full rounded-2xl" />
        <Sk className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}
