"use client";

import { useEffect, useState, useTransition, type MouseEvent } from "react";
import type { SaveResult } from "@/app/admin/actions";

// How many editors on screen have unsaved changes; in-app links ask before leaving.
let unsavedEditors = 0;

/** onClick for links inside the admin: cancels the navigation if edits would be lost. */
export function confirmLeave(event: MouseEvent) {
  if (unsavedEditors > 0 && !window.confirm("You have unsaved changes. Leave without saving?")) {
    event.preventDefault();
  }
}

/**
 * Local working copy of a piece of content. `update` takes a function that
 * edits a copy in place, so nested fields can be changed without spreading
 * every level by hand.
 */
export function useDraft<T>(
  initial: T,
  persist: (value: T) => Promise<SaveResult>,
  /** Outcome to show on arrival, e.g. after a save moved the editor to a new address. */
  initialResult: SaveResult | null = null,
) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [result, setResult] = useState<SaveResult | null>(initialResult);
  const [saving, startSaving] = useTransition();
  const dirty = value !== saved;

  function update(change: (draft: T) => void) {
    setValue((previous) => {
      const next = structuredClone(previous);
      change(next);
      return next;
    });
  }

  function save() {
    const snapshot = value;
    startSaving(async () => {
      const outcome = await persist(snapshot);
      setResult(outcome);
      if (outcome.ok) setSaved(snapshot);
    });
  }

  // Warn before closing the tab or leaving through the sidebar with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    unsavedEditors += 1;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      unsavedEditors -= 1;
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [dirty]);

  return { value, update, dirty, save, saving, result };
}
