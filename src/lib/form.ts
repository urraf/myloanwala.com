import { startTransition, type FormEvent } from "react";

/**
 * React 19 clears a <form action={...}> after every submit — even on errors,
 * which wipes what the user typed. Submitting via onSubmit keeps the values.
 */
export function keepValuesOnSubmit(dispatch: (fd: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
}
