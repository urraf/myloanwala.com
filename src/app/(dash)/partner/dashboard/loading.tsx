import { DashboardSkeleton, Sk } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="border-b border-line bg-white">
        <div className="container-x flex h-16 items-center justify-between">
          <Sk className="h-9 w-40" />
          <Sk className="h-9 w-24" />
        </div>
      </div>
      <div className="container-x py-6"><DashboardSkeleton /></div>
    </div>
  );
}
