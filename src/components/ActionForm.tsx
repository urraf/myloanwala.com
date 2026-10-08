"use client";

import { keepValuesOnSubmit } from "@/lib/form";
import { useActionState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import type { FormState } from "@/lib/actions/public";
import Captcha from "./Captcha";

/**
 * Small wrapper around a server action form: shows a loading state,
 * error / success messages, and optionally resets on success.
 */
export default function ActionForm({
  action,
  children,
  submitLabel,
  className = "space-y-4",
  buttonClassName = "btn-primary w-full py-3",
  resetOnSuccess = false,
  hideOnSuccess = false,
  captcha = false,
}: {
  action: (state: FormState, fd: FormData) => Promise<FormState>;
  children: React.ReactNode;
  submitLabel: string;
  className?: string;
  buttonClassName?: string;
  resetOnSuccess?: boolean;
  hideOnSuccess?: boolean;
  captcha?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);

  if (state.ok && hideOnSuccess) {
    return <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">{state.message || "Done!"}</div>;
  }

  return (
    <form ref={ref} onSubmit={keepValuesOnSubmit(formAction)} className={className}>
      {children}
      {captcha && <Captcha refreshKey={state} />}
      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>}
      {state.ok && state.message && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.message}</p>}
      <button disabled={pending} className={buttonClassName}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />} {submitLabel}
      </button>
    </form>
  );
}
