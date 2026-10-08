import Logo from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-linear-to-br from-soft via-white to-soft-2 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="card p-6 shadow-xl sm:p-8">{children}</div>
      </div>
    </div>
  );
}
