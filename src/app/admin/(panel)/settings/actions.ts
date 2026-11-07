"use server";

import { refresh } from "next/cache";
import { passwordIsCorrect, requireAdmin, startSession } from "@/lib/auth";
import { hashPassword } from "@/lib/auth/session";
import { SESSION_LENGTHS, readAuthSettings, updateAuthSettings } from "@/lib/auth/store";

export type SettingsResult = { ok: boolean; message: string } | null;

const MIN_PASSWORD_LENGTH = 10;

export async function changePassword(_previous: SettingsResult, formData: FormData): Promise<SettingsResult> {
  await requireAdmin();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const settings = await readAuthSettings();
  if (!(await passwordIsCorrect(current, settings))) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { ok: false, message: "Your current password isn't right." };
  }
  if (next.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, message: `Use at least ${MIN_PASSWORD_LENGTH} characters for the new password.` };
  }
  if (next.length > 200) return { ok: false, message: "That password is too long." };
  if (next !== confirm) return { ok: false, message: "The new passwords don't match." };
  if (next === current) return { ok: false, message: "Choose a password different from the current one." };

  const passwordHash = await hashPassword(next);
  // A new password also signs every other device out.
  const updated = await updateAuthSettings((stored) => ({
    ...stored,
    passwordHash,
    passwordChangedAt: new Date().toISOString(),
    epoch: stored.epoch + 1,
  }));
  await startSession(updated);
  refresh();
  return { ok: true, message: "Password changed. Any other devices have been signed out." };
}

export async function updateSessionLength(_previous: SettingsResult, formData: FormData): Promise<SettingsResult> {
  await requireAdmin();
  const days = Number(formData.get("days"));
  const sessionDays = SESSION_LENGTHS.find((length) => length === days);
  if (!sessionDays) return { ok: false, message: "Choose one of the listed options." };

  const updated = await updateAuthSettings((stored) => ({ ...stored, sessionDays }));
  await startSession(updated);
  refresh();
  return {
    ok: true,
    message: `Saved. Sign-ins now last ${sessionDays} day${sessionDays === 1 ? "" : "s"}.`,
  };
}

export async function signOutOtherDevices(): Promise<SettingsResult> {
  await requireAdmin();
  const updated = await updateAuthSettings((stored) => ({ ...stored, epoch: stored.epoch + 1 }));
  // Re-sign this browser with the new key so only the others are signed out.
  await startSession(updated);
  refresh();
  return { ok: true, message: "All other devices have been signed out." };
}
