import type { CSSProperties } from "react";
import { getContent } from "@/lib/content";
import styles from "./Stats.module.css";

export default async function Stats() {
  const { infoItems, stats } = (await getContent()).home;

  return (
    <section className={styles.section} aria-label="Company highlights">
      <div className={styles.strip}>
        <dl className={styles.info}>
          {infoItems.map(({ label, value }, index) => (
            <div key={index} className={styles.infoItem}>
              <dt className={styles.infoLabel}>{label}</dt>
              <dd className={styles.infoValue}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={styles.inner}>
        <ul className={styles.stats}>
          {stats.map(({ value, label, caption }, index) => (
            <li key={index} className={styles.stat}>
              {/* Reveal the content, not the cell, so the divider grid never flashes through. */}
              <div
                className={styles.statBody}
                data-reveal
                style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
              >
                <p className={styles.value}>{value}</p>
                <p className={styles.label}>{label}</p>
                <p className={styles.caption}>{caption}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
