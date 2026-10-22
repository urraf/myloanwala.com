/** Grey shimmering placeholder block used by loading screens. */
export function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[#e9eef6] ${className}`} />;
}

/** Generic page skeleton: hero text + side card, then a grid of cards. */
export function PageSkeleton() {
  return (
    <div className="container-x py-8 sm:py-10" aria-busy="true" aria-label="Loading">
      <div className="grid gap-8 lg:grid-cols-[1fr_460px]">
        <div className="space-y-4 pt-2">
          <Sk className="h-9 w-3/4" />
          <Sk className="h-9 w-1/2" />
          <Sk className="h-4 w-2/3" />
          <div className="grid grid-cols-4 gap-3 pt-6 sm:grid-cols-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Sk className="h-[68px] w-[68px] sm:h-[82px] sm:w-[88px]" />
                <Sk className="h-3 w-14" />
              </div>
            ))}
          </div>
        </div>
        <Sk className="h-[200px] w-full rounded-2xl sm:h-[240px]" />
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card space-y-3 p-5">
            <Sk className="h-5 w-1/2" />
            <Sk className="h-4 w-full" />
            <Sk className="h-4 w-5/6" />
            <Sk className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Table-style skeleton for dashboards. */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <Sk className="h-8 w-48" />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card space-y-3 p-5">
            <Sk className="h-4 w-24" />
            <Sk className="h-8 w-16" />
          </div>
        ))}
      </div>
      <div className="card divide-y divide-line">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Sk className="h-4 w-32" />
            <Sk className="h-4 w-28" />
            <Sk className="hidden h-4 w-40 sm:block" />
            <Sk className="ml-auto h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
