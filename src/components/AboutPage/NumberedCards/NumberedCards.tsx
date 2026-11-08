import type { CSSProperties } from "react";
import type { TitleText } from "@/lib/content/schema";
import TitleMask from "@/components/ui/TitleMask/TitleMask";
import styles from "./NumberedCards.module.css";

type NumberedCardsProps = {
  id: string;
  eyebrow: string;
  title: string;
  items: TitleText[];
};

/** Section heading over a row of numbered cards; used for Our Expertise and Why Professional Waves. */
export default function NumberedCards({ id, eyebrow, title, items }: NumberedCardsProps) {
  const titleId = `${id}-title`;

  return (
    <section id={id} className={styles.section} aria-labelledby={titleId}>
      <div className={styles.inner}>
        <div className={styles.header} data-reveal>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id={titleId} className={styles.heading}>
            <TitleMask>{title}</TitleMask>
          </h2>
        </div>

        <ol className={styles.grid}>
          {items.map(({ title: cardTitle, text }, index) => (
            <li
              key={index}
              className={styles.item}
              data-reveal
              style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
            >
              <div className={styles.card}>
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.title}>{cardTitle}</h3>
                <p className={styles.text}>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
