import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, BriefcaseBusiness, House, Info, KeyRound, Phone, Wrench } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { readContent } from "@/lib/content";
import { getHealthReport, summarise } from "@/lib/health";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  await requireAdmin();
  const content = await readContent();
  const { problems, warnings } = summarise(await getHealthReport());
  const healthText =
    problems || warnings
      ? [
          problems && `${problems} problem${problems === 1 ? "" : "s"}`,
          warnings && `${warnings} warning${warnings === 1 ? "" : "s"}`,
        ]
          .filter(Boolean)
          .join(", ") + " to review."
      : "No problems found in content, storage or security.";

  const cards = [
    {
      href: "/admin/home",
      icon: House,
      title: "Home page",
      text: "Hero image and headline, highlights, stats and section texts.",
    },
    {
      href: "/admin/about",
      icon: Info,
      title: "About page",
      text: `Images, texts and ${content.about.experience.items.length} experience cards.`,
    },
    {
      href: "/admin/services",
      icon: Wrench,
      title: "Services",
      text: `${content.services.length} services: cards, pages and photos.`,
    },
    {
      href: "/admin/works",
      icon: BriefcaseBusiness,
      title: "Works",
      text: `${content.works.projects.length} projects on the Works page.`,
    },
    {
      href: "/admin/contact",
      icon: Phone,
      title: "Contact & socials",
      text: `${content.contact.name}, phone, email and ${content.contact.socials.length} social links.`,
    },
    {
      href: "/admin/health",
      icon: Activity,
      title: "Website health",
      text: healthText,
    },
    {
      href: "/admin/settings",
      icon: KeyRound,
      title: "Login settings",
      text: "Password, session length and recent sign-ins.",
    },
  ];

  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.intro}>
          Choose what to edit. Saved changes go live on the website straight away.
        </p>
      </header>

      <ul className={styles.grid}>
        {cards.map(({ href, icon: Icon, title, text }) => (
          <li key={href}>
            <Link href={href} className={styles.card}>
              <span className={styles.icon} aria-hidden="true">
                <Icon size={20} />
              </span>
              <span className={styles.cardTitle}>{title}</span>
              <span className={styles.cardText}>{text}</span>
              <span className={styles.cardLink}>
                Edit
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
