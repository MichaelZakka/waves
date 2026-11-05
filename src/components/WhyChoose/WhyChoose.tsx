import type { CSSProperties } from "react";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import { whyCards } from "@/data/content";
import styles from "./WhyChoose.module.css";

export default function WhyChoose() {
  return (
    <section id="why" className={styles.section} aria-labelledby="why-title">
      <div className={styles.inner}>
        <div className={styles.panel}>
          <div className={styles.header} data-reveal>
            <SectionHeading
              id="why-title"
              eyebrow="The Professional Advantage"
              title="Why Choose Professional Waves?"
              subtitle="We combine professional audio, video, and lighting equipment with experienced technical support to help deliver seamless and memorable event experiences across the UAE."
            />
          </div>

          <ol className={styles.grid}>
            {whyCards.map(({ number, title, text, tag, icon: Icon }, index) => (
              <li
                key={number}
                className={styles.card}
                data-reveal
                style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
              >
                <span className={styles.number} aria-hidden="true">
                  {number}
                </span>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.text}>{text}</p>
                <p className={styles.tag}>
                  {tag}
                  <Icon size={14} aria-hidden="true" />
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
