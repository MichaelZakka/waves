import { Suspense, type ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar/AdminSidebar";
import { requireAdmin } from "@/lib/auth";
import styles from "./layout.module.css";

/** Checks the session before anything inside the panel renders. */
async function SignedIn({ children }: { children: ReactNode }) {
  await requireAdmin();
  return children;
}

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <AdminSidebar />
      <main id="main" className={styles.main}>
        <Suspense fallback={<p className={styles.loading}>Loading…</p>}>
          <SignedIn>{children}</SignedIn>
        </Suspense>
      </main>
    </div>
  );
}
