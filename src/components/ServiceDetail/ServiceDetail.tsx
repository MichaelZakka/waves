import Link from "next/link";
import type { CSSProperties } from "react";
import Button from "@/components/ui/Button/Button";
import SiteImage, { frameStyle } from "@/components/ui/SiteImage/SiteImage";
import type { Service } from "@/lib/content/schema";
import TitleMask from "@/components/ui/TitleMask/TitleMask";
import styles from "./ServiceDetail.module.css";

export default function ServiceDetail({ service }: { service: Service }) {
  const { title, badge, subtitle, overview, capabilitiesEyebrow, capabilities, gallery } = service;

  return (
    <section className={styles.section} aria-labelledby="service-title">
      <div className={styles.inner}>
        <nav aria-label="Breadcrumb">
          <ol className={styles.breadcrumb}>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/services">Services</Link>
            </li>
            <li aria-current="page">{title}</li>
          </ol>
        </nav>

        <header className={styles.header}>
          {badge && <span className={styles.badge}>{badge}</span>}
          <h1 id="service-title" className={styles.title}>
            <TitleMask>{title}</TitleMask>
          </h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>

        {gallery.length > 0 && (
          <ul className={styles.gallery}>
            {gallery.map((image, index) => (
              // Empty frames hold the layout until the photo is added.
              <li key={index} className={styles.frame} style={frameStyle(image)}>
                <SiteImage
                  image={image}
                  preload={index === 0}
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </li>
            ))}
          </ul>
        )}

        <p className={styles.overview} data-reveal>
          {overview}
        </p>

        <div className={styles.capabilities}>
          <p className={styles.eyebrow}>{capabilitiesEyebrow}</p>
          <h2 className={styles.capabilitiesTitle} data-reveal>
            <TitleMask>Key Capabilities</TitleMask>
          </h2>
          <ol className={styles.grid}>
            {capabilities.map(({ title: cardTitle, text }, index) => (
              <li
                key={index}
                className={styles.card}
                data-reveal
                style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
              >
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.cardTitle}>{cardTitle}</h3>
                <p className={styles.cardText}>{text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.actions}>
          <Button href="/contact#quote" size="sm" arrow="inline">
            Request a Quote
          </Button>
        </div>
      </div>
    </section>
  );
}
