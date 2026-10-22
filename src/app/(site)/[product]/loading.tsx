import { Sk } from "@/components/Skeleton";

// Loan product page: hero text + application form card
export default function Loading() {
  return (
    <div className="bg-linear-to-b from-soft to-white" aria-busy="true" aria-label="Loading">
      <div className="container-x grid gap-10 py-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <Sk className="h-7 w-32 rounded-full" />
          <Sk className="h-10 w-5/6" />
          <Sk className="h-10 w-2/3" />
          <div className="space-y-3 pt-4">
            <Sk className="h-4 w-3/4" />
            <Sk className="h-4 w-2/3" />
            <Sk className="h-4 w-1/2" />
          </div>
          <div className="grid max-w-lg grid-cols-3 gap-3 pt-4">
            <Sk className="h-16" /><Sk className="h-16" /><Sk className="h-16" />
          </div>
        </div>
        <div className="card space-y-4 p-6">
          <Sk className="h-6 w-1/2" />
          <Sk className="h-11 w-full" />
          <Sk className="h-11 w-full" />
          <Sk className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
