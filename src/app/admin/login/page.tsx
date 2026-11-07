import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm/LoginForm";
import Logo from "@/components/ui/Logo/Logo";
import { isAdmin, isAdminConfigured } from "@/lib/auth";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Sign in" };

type LoginPageProps = { searchParams: Promise<{ next?: string }> };

/** Needs request-time data (env, cookies), so it renders per request. */
async function LoginCard({ searchParams }: LoginPageProps) {
  await connection();
  if (await isAdmin()) redirect("/admin");
  const { next } = await searchParams;

  return (await isAdminConfigured()) ? (
    <LoginForm next={typeof next === "string" ? next : "/admin"} />
  ) : (
    <div className={styles.notice}>
      <p>The admin dashboard isn&rsquo;t set up yet.</p>
      <p>
        Set <code>ADMIN_PASSWORD</code> (and ideally <code>ADMIN_SESSION_SECRET</code>) in the
        server&rsquo;s environment, then restart the site.
      </p>
    </div>
  );
}

export default function LoginPage(props: LoginPageProps) {
  return (
    <main id="main" className={styles.page}>
      <div className={styles.card}>
        <Logo size={64} />
        <h1 className={styles.title}>Site admin</h1>
        <p className={styles.subtitle}>Sign in to edit the Professional Waves website.</p>
        <Suspense fallback={<p className={styles.subtitle}>Loading…</p>}>
          <LoginCard {...props} />
        </Suspense>
      </div>
    </main>
  );
}
