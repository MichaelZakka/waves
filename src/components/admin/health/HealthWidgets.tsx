"use client";

import { useEffect, useState, useTransition } from "react";
import { CircleCheck, CircleX, LoaderCircle, RefreshCw, Trash2, TriangleAlert } from "lucide-react";
import { checkPages, removeUnusedUploads, type PageCheck } from "@/app/admin/(panel)/health/actions";
import type { Severity } from "@/lib/health";
import styles from "./HealthWidgets.module.css";

const LABELS: Record<Severity, string> = { ok: "OK", warning: "Warning", problem: "Problem" };

export function StatusIcon({ severity }: { severity: Severity }) {
  const Icon = severity === "ok" ? CircleCheck : severity === "warning" ? TriangleAlert : CircleX;
  return (
    <span className={styles.icon} data-severity={severity} title={LABELS[severity]}>
      <Icon size={16} aria-hidden="true" />
      <span className={styles.srOnly}>{LABELS[severity]}</span>
    </span>
  );
}

type CheckOutcome = { results: PageCheck[]; checkedAt: Date; error: null } | { error: string };

async function runPageChecks(): Promise<CheckOutcome> {
  try {
    return { results: await checkPages(), checkedAt: new Date(), error: null };
  } catch {
    return { error: "The check couldn't run. Please try again." };
  }
}

/** Requests every public page from the server and lists how each answered. */
export function PageChecks() {
  const [results, setResults] = useState<PageCheck[] | null>(null);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, start] = useTransition();

  function apply(outcome: CheckOutcome) {
    setError(outcome.error);
    if (outcome.error === null) {
      setResults(outcome.results);
      setCheckedAt(outcome.checkedAt);
    }
  }

  function run() {
    start(async () => apply(await runPageChecks()));
  }

  // Check once when the page opens.
  useEffect(() => {
    let current = true;
    start(async () => {
      const outcome = await runPageChecks();
      if (current) apply(outcome);
    });
    return () => {
      current = false;
    };
  }, []);

  const failing = results?.filter((result) => result.severity !== "ok").length ?? 0;

  return (
    <div className={styles.stack}>
      <div className={styles.toolbar}>
        <p className={styles.summary} role="status">
          {running
            ? "Checking every page…"
            : error
              ? error
              : results &&
                (failing === 0
                  ? `All ${results.length} pages answered normally.`
                  : `${failing} of ${results.length} need attention.`)}
          {checkedAt && !running && (
            <span className={styles.muted}> Checked at {checkedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.</span>
          )}
        </p>
        <button type="button" className={styles.button} onClick={run} disabled={running}>
          {running ? (
            <LoaderCircle size={15} className={styles.spin} aria-hidden="true" />
          ) : (
            <RefreshCw size={15} aria-hidden="true" />
          )}
          Check again
        </button>
      </div>

      {results && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Page</th>
                <th scope="col">Status</th>
                <th scope="col">Response time</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.path}>
                  <td>
                    <span className={styles.page}>{result.label}</span>
                    <span className={styles.path}>{result.path.startsWith("/_next") ? "Hero image, resized" : result.path}</span>
                  </td>
                  <td>
                    <span className={styles.cell}>
                      <StatusIcon severity={result.severity} />
                      {result.note ?? "Working"}
                    </span>
                  </td>
                  <td className={styles.number}>{(result.ms / 1000).toFixed(2)} s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/** Deletes uploaded images that no current or kept version of the content uses. */
export function CleanupUnused({ count, size }: { count: number; size: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [running, start] = useTransition();

  if (count === 0 && !message) {
    return <p className={styles.muted}>No unused images. Every uploaded image is in use or kept for restoring.</p>;
  }

  return (
    <div className={styles.toolbar}>
      <p className={styles.summary} role="status">
        {message ??
          `${count} uploaded image${count === 1 ? " isn't" : "s aren't"} used anywhere, including the kept earlier versions (${size}).`}
      </p>
      {count > 0 && (
        <button
          type="button"
          className={styles.button}
          disabled={running}
          onClick={() => {
            if (!window.confirm(`Delete ${count} unused image${count === 1 ? "" : "s"}? This can't be undone.`)) return;
            start(async () => {
              const result = await removeUnusedUploads();
              setMessage(`Removed ${result.count} image${result.count === 1 ? "" : "s"}, freeing ${result.freed}.`);
            });
          }}
        >
          {running ? (
            <LoaderCircle size={15} className={styles.spin} aria-hidden="true" />
          ) : (
            <Trash2 size={15} aria-hidden="true" />
          )}
          Remove unused images
        </button>
      )}
    </div>
  );
}
