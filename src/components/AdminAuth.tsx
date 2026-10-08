"use client";

import { useActionState, useState } from "react";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, LockKeyhole } from "lucide-react";
import Captcha from "./Captcha";
import { keepValuesOnSubmit } from "@/lib/form";
import { adminLogin, adminResetWithOtp, adminSendOtp } from "@/lib/actions/admin";
import type { FormState } from "@/lib/actions/public";

function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button disabled={pending} className="btn-primary w-full py-3">
      {pending && <Loader2 className="h-4 w-4 animate-spin" />} {children}
    </button>
  );
}

function ErrorBox({ state }: { state: FormState }) {
  return state.error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p> : null;
}

function PasswordInput({ name, autoComplete, minLength }: { name: string; autoComplete?: string; minLength?: number }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input name={name} type={show ? "text" : "password"} className="input pr-10" autoComplete={autoComplete} required minLength={minLength} />
      <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted" aria-label={show ? "Hide password" : "Show password"}>
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

/** Forgot password: email + captcha → OTP → new password. Used on the login screen and in Account settings. */
export function ForgotPasswordFlow({
  email: fixedEmail,
  dummyOtp,
  onBack,
}: {
  email?: string;
  dummyOtp?: string;
  onBack?: () => void;
}) {
  const [sendState, sendAction, sending] = useActionState(adminSendOtp, {});
  const [resetState, resetAction, resetting] = useActionState(adminResetWithOtp, {});
  const [email, setEmail] = useState(fixedEmail || "");

  if (resetState.ok) {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <p className="mt-3 text-sm text-body">{resetState.message}</p>
        {onBack && <button onClick={onBack} className="btn-primary mt-5 w-full">Back to Login</button>}
      </div>
    );
  }

  if (!sendState.ok) {
    return (
      <form onSubmit={keepValuesOnSubmit(sendAction)} className="space-y-4">
        <div>
          <label className="label">Admin Email</label>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={!!fixedEmail}
            className="input read-only:bg-tile"
            required
          />
        </div>
        <Captcha refreshKey={sendState} />
        <ErrorBox state={sendState} />
        <Submit pending={sending}>Send OTP</Submit>
        {onBack && (
          <button type="button" onClick={onBack} className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-brand">
            <ArrowLeft className="h-4 w-4" /> Back to login
          </button>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={keepValuesOnSubmit(resetAction)} className="space-y-4">
      <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{sendState.message}</p>
      {dummyOtp && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Test mode: you can use OTP <b className="tracking-widest">{dummyOtp}</b>
        </p>
      )}
      <input type="hidden" name="email" value={email} />
      <div>
        <label className="label">Enter 6-digit OTP</label>
        <input name="otp" inputMode="numeric" maxLength={6} className="input text-center text-lg tracking-[0.5em]" placeholder="••••••" required autoComplete="one-time-code" />
      </div>
      <div>
        <label className="label">New Password (min 8 characters)</label>
        <PasswordInput name="password" autoComplete="new-password" minLength={8} />
      </div>
      <div>
        <label className="label">Confirm New Password</label>
        <PasswordInput name="confirm" autoComplete="new-password" minLength={8} />
      </div>
      <ErrorBox state={resetState} />
      <Submit pending={resetting}>Reset Password</Submit>
      <p className="text-center text-xs text-muted">
        Didn&apos;t get it? Check spam, or{" "}
        <button type="button" onClick={() => window.location.reload()} className="font-medium text-brand">start again</button>
      </p>
    </form>
  );
}

/** Admin login card with an in-place "Forgot password" mode. */
export default function AdminAuth({ dummyOtp }: { dummyOtp?: string }) {
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [state, action, pending] = useActionState(adminLogin, {});

  if (mode === "forgot") {
    return (
      <>
        <h1 className="flex items-center gap-2 text-xl font-semibold"><KeyRound className="h-5 w-5 text-brand" /> Forgot Password</h1>
        <p className="mb-6 mt-1 text-sm text-body">We&apos;ll send a one-time password (OTP) to your admin email.</p>
        <ForgotPasswordFlow dummyOtp={dummyOtp} onBack={() => setMode("login")} />
      </>
    );
  }

  return (
    <>
      <h1 className="flex items-center gap-2 text-xl font-semibold"><LockKeyhole className="h-5 w-5 text-brand" /> Admin Login</h1>
      <p className="mb-6 mt-1 text-sm text-body">Sign in to manage your website.</p>
      <form onSubmit={keepValuesOnSubmit(action)} className="space-y-4">
        <div><label className="label">Email</label><input name="email" type="email" className="input" required autoComplete="email" /></div>
        <div><label className="label">Password</label><PasswordInput name="password" autoComplete="current-password" /></div>
        <Captcha refreshKey={state} />
        <ErrorBox state={state} />
        <Submit pending={pending}>Login</Submit>
      </form>
      <div className="mt-5 border-t border-line pt-4 text-center">
        <button onClick={() => setMode("forgot")} className="btn-outline w-full">
          <KeyRound className="h-4 w-4" /> Forgot Password? Reset with OTP
        </button>
      </div>
    </>
  );
}
