import type { CSSProperties } from "react";
import ServiceCard from "@/components/Services/ServiceCard";
import { getContent } from "@/lib/content";
import styles from "./ServicesPage.module.css";

export default async function ServicesPage() {
  const { servicesPage, services } = await getContent();

  return (
    <section className={styles.section} aria-labelledby="services-page-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <h1 id="services-page-title" className={styles.title}>
              {servicesPage.title}
            </h1>
            <p className={styles.subtitle}>{servicesPage.subtitle}</p>
          </div>
          <p className={styles.aside}>{servicesPage.aside}</p>
        </header>

        <ul className={styles.grid}>
          {services.map((service, index) => (
            <li
              key={service.slug}
              className={styles.item}
              data-reveal
              style={{ "--reveal-delay": `${(index % 2) * 120}ms` } as CSSProperties}
            >
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
