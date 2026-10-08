import { KeyRound } from "lucide-react";
import ActionForm from "@/components/ActionForm";
import { ForgotPasswordFlow } from "@/components/AdminAuth";
import { requireAdmin } from "@/lib/auth";
import { adminChangePassword } from "@/lib/actions/admin";

export default async function AccountPage() {
  const admin = await requireAdmin();
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Account</h1>
      <div className="card p-5">
        <h2 className="mb-1 font-semibold">Login email &amp; password</h2>
        <p className="mb-4 text-xs text-muted">This email is used for login and for forgot-password OTPs.</p>
        <ActionForm action={adminChangePassword} submitLabel="Update Account" buttonClassName="btn-primary" resetOnSuccess>
          <div><label className="label">Email</label><input name="email" type="email" defaultValue={admin.email} className="input" /></div>
          <div><label className="label">Current Password *</label><input name="current" type="password" className="input" required /></div>
          <div><label className="label">New Password * (min 8 characters)</label><input name="password" type="password" minLength={8} className="input" required /></div>
        </ActionForm>
      </div>

      <details className="card group p-5">
        <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-brand [&::-webkit-details-marker]:hidden">
          <KeyRound className="h-5 w-5" /> Forgot your current password? Reset with OTP
        </summary>
        <div className="mt-5">
          <ForgotPasswordFlow email={admin.email} dummyOtp={process.env.DUMMY_OTP || undefined} />
        </div>
      </details>
    </div>
  );
}
