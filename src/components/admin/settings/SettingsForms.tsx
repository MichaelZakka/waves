"use client";

import { useActionState, useId, useState, useTransition } from "react";
import { Eye, EyeOff, KeyRound, LoaderCircle, LogOut, Save } from "lucide-react";
import {
  changePassword,
  signOutOtherDevices,
  updateSessionLength,
  type SettingsResult,
} from "@/app/admin/(panel)/settings/actions";
import { cx } from "@/lib/cx";
import styles from "./SettingsForms.module.css";

function Result({ result }: { result: SettingsResult }) {
  return (
    <p
      className={cx(styles.result, result && (result.ok ? styles.success : styles.failure))}
      role="status"
    >
      {result?.message}
    </p>
  );
}

/** Rough strength guide: length plus the kinds of characters used. */
function strength(password: string) {
  if (!password) return null;
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((kind) => kind.test(password)).length;
  if (password.length < 10) return { label: "Too short", level: 0 };
  if (password.length >= 16 || (password.length >= 12 && kinds >= 3)) return { label: "Strong", level: 3 };
  if (kinds >= 2) return { label: "Good", level: 2 };
  return { label: "Weak", level: 1 };
}

export function PasswordForm() {
  const [result, action, pending] = useActionState(changePassword, null);
  const [visible, setVisible] = useState(false);
  const [next, setNext] = useState("");
  const id = useId();
  const rating = strength(next);
  const type = visible ? "text" : "password";

  return (
    <form
      action={action}
      className={styles.form}
      // Clear the fields after a successful change.
      key={result?.ok ? "done" : "editing"}
    >
      <div className={styles.field}>
        <label htmlFor={`${id}-current`} className={styles.label}>
          Current password
        </label>
        <input id={`${id}-current`} name="current" type={type} autoComplete="current-password" required className={styles.input} />
      </div>
      <div className={styles.field}>
        <label htmlFor={`${id}-next`} className={styles.label}>
          New password
        </label>
        <input
          id={`${id}-next`}
          name="next"
          type={type}
          autoComplete="new-password"
          minLength={10}
          required
          className={styles.input}
          aria-describedby={`${id}-strength`}
          onChange={(event) => setNext(event.target.value)}
        />
        <p id={`${id}-strength`} className={styles.hint}>
          {rating ? (
            <span className={styles.strength} data-level={rating.level}>
              <span className={styles.meter} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              {rating.label}
            </span>
          ) : (
            "At least 10 characters. A few unrelated words make a strong, memorable password."
          )}
        </p>
      </div>
      <div className={styles.field}>
        <label htmlFor={`${id}-confirm`} className={styles.label}>
          Repeat new password
        </label>
        <input id={`${id}-confirm`} name="confirm" type={type} autoComplete="new-password" required className={styles.input} />
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.secondary} onClick={() => setVisible(!visible)}>
          {visible ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
          {visible ? "Hide passwords" : "Show passwords"}
        </button>
        <button type="submit" className={styles.primary} disabled={pending}>
          {pending ? (
            <LoaderCircle size={15} className={styles.spin} aria-hidden="true" />
          ) : (
            <KeyRound size={15} aria-hidden="true" />
          )}
          Change password
        </button>
      </div>
      <Result result={result} />
    </form>
  );
}

const SESSION_OPTIONS = [
  { days: 1, label: "1 day" },
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
];

export function SessionLengthForm({ current }: { current: number }) {
  const [result, action, pending] = useActionState(updateSessionLength, null);
  const id = useId();

  return (
    <form action={action} className={styles.form}>
      <div className={styles.inline}>
        <div className={styles.field}>
          <label htmlFor={id} className={styles.label}>
            Stay signed in for
          </label>
          <select id={id} name="days" defaultValue={current} className={styles.input}>
            {SESSION_OPTIONS.map(({ days, label }) => (
              <option key={days} value={days}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={styles.primary} disabled={pending}>
          {pending ? (
            <LoaderCircle size={15} className={styles.spin} aria-hidden="true" />
          ) : (
            <Save size={15} aria-hidden="true" />
          )}
          Save
        </button>
      </div>
      <p className={styles.hint}>After this long, you&rsquo;ll be asked for the password again.</p>
      <Result result={result} />
    </form>
  );
}

export function SignOutOthersButton() {
  const [result, setResult] = useState<SettingsResult>(null);
  const [pending, start] = useTransition();

  return (
    <div className={styles.form}>
      <div>
        <button
          type="button"
          className={styles.secondary}
          disabled={pending}
          onClick={() => {
            if (!window.confirm("Sign out every other device? This browser stays signed in.")) return;
            start(async () => setResult(await signOutOtherDevices()));
          }}
        >
          {pending ? (
            <LoaderCircle size={15} className={styles.spin} aria-hidden="true" />
          ) : (
            <LogOut size={15} aria-hidden="true" />
          )}
          Sign out all other devices
        </button>
      </div>
      <p className={styles.hint}>
        Use this if you signed in on a shared or lost device, or think someone else knows the password.
      </p>
      <Result result={result} />
    </div>
  );
}
