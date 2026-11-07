"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import {
  Activity,
  BriefcaseBusiness,
  ExternalLink,
  House,
  Info,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Phone,
  Wrench,
} from "lucide-react";
import { logout } from "@/app/admin/actions";
import { confirmLeave } from "@/components/admin/useDraft";
import Logo from "@/components/ui/Logo/Logo";
import styles from "./AdminSidebar.module.css";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/home", label: "Home page", icon: House },
  { href: "/admin/about", label: "About page", icon: Info },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/works", label: "Works", icon: BriefcaseBusiness },
  { href: "/admin/contact", label: "Contact & socials", icon: Phone },
  { href: "/admin/health", label: "Website health", icon: Activity },
  { href: "/admin/settings", label: "Login settings", icon: KeyRound },
];

/** The page links, highlighting the current one. */
function NavLinks({ pathname }: { pathname: string }) {
  return (
    <ul className={styles.links}>
      {LINKS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              className={styles.link}
              aria-current={active ? "page" : undefined}
              onClick={confirmLeave}
            >
              <Icon size={17} aria-hidden="true" />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function CurrentNavLinks() {
  return <NavLinks pathname={usePathname()} />;
}

export default function AdminSidebar() {
  return (
    <aside className={styles.sidebar}>
      <Link href="/admin" className={styles.brand} onClick={confirmLeave}>
        <Logo size={36} />
        <span>
          Professional Waves
          <small>Site admin</small>
        </span>
      </Link>

      <nav aria-label="Admin">
        {/* The address is only known per request; the links render first, then highlight. */}
        <Suspense fallback={<NavLinks pathname="" />}>
          <CurrentNavLinks />
        </Suspense>
      </nav>

      <div className={styles.footer}>
        <a href="/" target="_blank" rel="noopener noreferrer" className={styles.link}>
          <ExternalLink size={17} aria-hidden="true" />
          View site
        </a>
        <form action={logout}>
          <button type="submit" className={styles.link} onClick={confirmLeave}>
            <LogOut size={17} aria-hidden="true" />
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
