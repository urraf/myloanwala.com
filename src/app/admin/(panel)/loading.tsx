import { DashboardSkeleton } from "@/components/Skeleton";

// Admin pages: sidebar stays, content area shows a skeleton while loading
export default function Loading() {
  return <DashboardSkeleton />;
}
