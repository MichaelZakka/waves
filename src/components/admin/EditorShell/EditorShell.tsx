"use client";

import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, ExternalLink, LoaderCircle, Save } from "lucide-react";
import type { SaveResult } from "@/app/admin/actions";
import { cx } from "@/lib/cx";
import styles from "./EditorShell.module.css";

type EditorShellProps = {
  title: string;
  description?: ReactNode;
  /** Public page to open from the header, e.g. "/about". */
  viewHref?: string;
  dirty: boolean;
  saving: boolean;
  result: SaveResult | null;
  onSave: () => void;
  /** Extra buttons next to the page title. */
  actions?: ReactNode;
  children: ReactNode;
};

/** Page frame for an admin editor: heading, sections, and a sticky save bar. */
export default function EditorShell({
  title,
  description,
  viewHref,
  dirty,
  saving,
  result,
  onSave,
  actions,
  children,
}: EditorShellProps) {
  const failed = result && !result.ok ? result : null;

  let status: ReactNode = "All changes saved";
  if (saving) status = "Saving…";
  else if (dirty) status = "You have unsaved changes";
  else if (result?.ok) {
    status = (
      <>
        <CircleCheck size={15} aria-hidden="true" />
        Saved at {new Date(result.savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}. The live site is updated.
      </>
    );
  }

  return (
    <form
      className={styles.editor}
      // The server validates everything and lists every problem; the browser's
      // bubbles would only show one at a time.
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
    >
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <div className={styles.headerActions}>
          {actions}
          {viewHref && (
            <a href={viewHref} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>
              View on site
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </header>

      <div className={styles.sections}>{children}</div>

      {failed && (
        <div className={styles.errors} role="alert">
          <p className={styles.errorTitle}>
            <CircleAlert size={16} aria-hidden="true" />
            {failed.message}
          </p>
          {failed.issues.length > 0 && (
            <ul className={styles.issueList}>
              {failed.issues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className={styles.saveBar}>
        <p className={cx(styles.status, dirty && styles.statusDirty)} role="status">
          {status}
        </p>
        <button type="submit" className={styles.saveButton} disabled={!dirty || saving}>
          {saving ? (
            <LoaderCircle size={16} className={styles.spin} aria-hidden="true" />
          ) : (
            <Save size={16} aria-hidden="true" />
          )}
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
