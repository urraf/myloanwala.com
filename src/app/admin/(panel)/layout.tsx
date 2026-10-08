import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import Logo from "@/components/Logo";
import AdminNav from "@/components/AdminNav";
import { requireAdmin } from "@/lib/auth";
import { adminLogout } from "@/lib/actions/admin";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-screen bg-[#f7f8fa] lg:flex">
      <aside className="bg-navy text-white lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col">
        <div className="flex items-center justify-between px-4 py-4 lg:px-5 lg:py-6">
          <Logo light href="/admin/dashboard" />
          <form action={adminLogout} className="lg:hidden">
            <button className="rounded-lg p-2 text-white/80 hover:bg-white/10" aria-label="Logout"><LogOut className="h-5 w-5" /></button>
          </form>
        </div>
        <div className="px-3 pb-3 lg:flex-1">
          <AdminNav />
        </div>
        <div className="hidden space-y-1 border-t border-white/10 p-3 lg:block">
          <Link href="/" target="_blank" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/10">
            <ExternalLink className="h-4 w-4" /> View Website
          </Link>
          <form action={adminLogout}>
            <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/10">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </form>
          <p className="truncate px-3 pt-2 text-xs text-white/50">{admin.email}</p>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:ml-60 lg:p-8">{children}</main>
    </div>
  );
}
