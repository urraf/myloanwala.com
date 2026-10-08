import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminAuth from "@/components/AdminAuth";
import { getAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false } };

export default async function AdminLoginPage() {
  if (await getAdmin().catch(() => null)) redirect("/admin/dashboard");
  return <AdminAuth dummyOtp={process.env.DUMMY_OTP || undefined} />;
}
