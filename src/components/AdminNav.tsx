"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, FileText, Handshake, LayoutDashboard, Tag, UserCog, Users } from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/automation", label: "AI Automation", icon: Bot },
  { href: "/admin/offers", label: "Offers", icon: Tag },
  { href: "/admin/account", label: "Account", icon: UserCog },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible [scrollbar-width:none]">
      {NAV.map((n) => {
        const active = pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              active ? "bg-brand text-white" : "text-white/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            <n.icon className="h-4 w-4" /> {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
