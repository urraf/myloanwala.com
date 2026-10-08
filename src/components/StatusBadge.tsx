const COLORS: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-purple-50 text-purple-700",
  "in-process": "bg-amber-50 text-amber-700",
  approved: "bg-teal-50 text-teal-700",
  disbursed: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  pending: "bg-amber-50 text-amber-700",
  blocked: "bg-red-50 text-red-700",
  published: "bg-green-50 text-green-700",
  draft: "bg-gray-100 text-gray-600",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${COLORS[status] || "bg-gray-100 text-gray-700"}`}>
      {status.replace("-", " ")}
    </span>
  );
}
