import { BellRing, KeyRound, LockKeyhole, Mail } from "lucide-react";
import ActionForm from "@/components/ActionForm";
import { ForgotPasswordFlow } from "@/components/AdminAuth";
import { requireAdmin } from "@/lib/auth";
import { adminChangeEmail, adminChangePassword, sendTestEmail } from "@/lib/actions/admin";
import { leadAlertEmail } from "@/lib/notify";
import { smtpConfigured } from "@/lib/mail";

export default async function AccountPage() {
  const admin = await requireAdmin();
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Account Settings</h1>
        <p className="text-sm text-body">Logged in as <b>{admin.email}</b></p>
      </div>

      <div className="card p-5">
        <h2 className="mb-1 flex items-center gap-2 font-semibold"><Mail className="h-5 w-5 text-brand" /> Change Login Email</h2>
        <p className="mb-4 text-xs text-muted">Used to log in and to receive forgot-password OTPs.</p>
        <ActionForm action={adminChangeEmail} submitLabel="Update Email" buttonClassName="btn-primary">
          <div><label className="label">New Email</label><input name="email" type="email" defaultValue={admin.email} className="input" required /></div>
          <div><label className="label">Current Password (to confirm)</label><input name="current" type="password" className="input" required autoComplete="current-password" /></div>
        </ActionForm>
      </div>

      <div className="card p-5">
        <h2 className="mb-4 flex items-center gap-2 font-semibold"><LockKeyhole className="h-5 w-5 text-brand" /> Change Password</h2>
        <ActionForm action={adminChangePassword} submitLabel="Update Password" buttonClassName="btn-primary" resetOnSuccess>
          <div><label className="label">Current Password</label><input name="current" type="password" className="input" required autoComplete="current-password" /></div>
          <div><label className="label">New Password (min 8 characters)</label><input name="password" type="password" minLength={8} className="input" required autoComplete="new-password" /></div>
          <div><label className="label">Confirm New Password</label><input name="confirm" type="password" minLength={8} className="input" required autoComplete="new-password" /></div>
        </ActionForm>
      </div>

      <div className="card p-5">
        <h2 className="mb-1 flex items-center gap-2 font-semibold"><BellRing className="h-5 w-5 text-brand" /> New Lead Email Alerts</h2>
        <p className="mb-4 text-xs text-muted">
          {smtpConfigured() ? <>Every new enquiry is emailed to <b className="text-ink">{leadAlertEmail()}</b>.</> : <>Email is not set up on the server yet — alerts are not being sent.</>}
          {" "}To change it, set <code>LEAD_NOTIFY_EMAIL</code> in the server settings.
        </p>
        <ActionForm action={sendTestEmail} submitLabel="Send Test Email" buttonClassName="btn-outline">
          <span />
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
