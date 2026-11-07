"use client";

import { useActionState, useId } from "react";
import { LoaderCircle, LogIn } from "lucide-react";
import { login, type LoginState } from "@/app/admin/actions";
import styles from "./LoginForm.module.css";

/** `next` is where to go after signing in. */
export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const id = useId();

  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="next" value={next} />
      <label htmlFor={id} className={styles.label}>
        Password
      </label>
      <input
        id={id}
        name="password"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
        className={styles.input}
        aria-invalid={state.error ? true : undefined}
        aria-describedby={state.error ? `${id}-error` : undefined}
      />
      {state.error && (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className={styles.button} disabled={pending}>
        {pending ? (
          <LoaderCircle size={16} className={styles.spin} aria-hidden="true" />
        ) : (
          <LogIn size={16} aria-hidden="true" />
        )}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
