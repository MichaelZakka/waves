import type { Metadata } from "next";
import { CircleCheck, CircleX } from "lucide-react";
import { Panel } from "@/components/admin/Fields/Fields";
import LocalTime from "@/components/admin/LocalTime";
import {
  PasswordForm,
  SessionLengthForm,
  SignOutOthersButton,
} from "@/components/admin/settings/SettingsForms";
import { requireAdmin } from "@/lib/auth";
import { describeDevice } from "@/lib/auth/device";
import { LOCKOUT, readAuthSettings } from "@/lib/auth/store";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Login settings" };

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await readAuthSettings();
  const events = settings.events.slice(0, 15);

  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Login settings</h1>
        <p className={styles.intro}>Manage the admin password and how long you stay signed in.</p>
      </header>

      <Panel
        title="Password"
        description={
          settings.passwordHash && settings.passwordChangedAt ? (
            <>
              Set here in the dashboard on <LocalTime iso={settings.passwordChangedAt} dateOnly />.
            </>
          ) : (
            <>
              Currently the password from the server&rsquo;s <code>ADMIN_PASSWORD</code> setting.
              Once you change it here, that setting is no longer used.
            </>
          )
        }
      >
        <PasswordForm />
        <p className={styles.note}>
          Forgot the password? Whoever manages the server can delete{" "}
          <code>settings/admin-auth.json</code> in the site&rsquo;s storage folder; the{" "}
          <code>ADMIN_PASSWORD</code> setting then works again.
        </p>
      </Panel>

      <Panel title="Sessions">
        <SessionLengthForm current={settings.sessionDays} />
        <SignOutOthersButton />
      </Panel>

      <Panel
        title="Recent sign-ins"
        description={`After ${LOCKOUT.attempts} wrong passwords within ${LOCKOUT.windowMinutes} minutes, that network address is blocked from trying again for ${LOCKOUT.windowMinutes} minutes.`}
      >
        {events.length === 0 ? (
          <p className={styles.empty}>No sign-ins recorded yet.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">When</th>
                  <th scope="col">Result</th>
                  <th scope="col">Network address</th>
                  <th scope="col">Device</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={`${event.at}-${event.ip}`}>
                    <td>
                      <LocalTime iso={event.at} />
                    </td>
                    <td>
                      {event.ok ? (
                        <span className={styles.ok}>
                          <CircleCheck size={14} aria-hidden="true" />
                          Signed in
                        </span>
                      ) : (
                        <span className={styles.failed}>
                          <CircleX size={14} aria-hidden="true" />
                          Wrong password
                        </span>
                      )}
                    </td>
                    <td className={styles.mono}>{event.ip}</td>
                    <td>{describeDevice(event.agent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
