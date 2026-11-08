import type { CSSProperties } from "react";
import { CircleCheck } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import { getContent } from "@/lib/content";
import styles from "./WhyChoose.module.css";

export default async function WhyChoose() {
  const { why } = (await getContent()).home;

  return (
    <section id="why" className={styles.section} aria-labelledby="why-title">
      <div className={styles.inner}>
        <div className={styles.panel}>
          <div className={styles.header} data-reveal>
            <SectionHeading
              id="why-title"
              eyebrow={why.eyebrow}
              title={why.title}
              subtitle={why.subtitle}
            />
          </div>

          <ol className={styles.grid}>
            {why.cards.map(({ title, text, tag }, index) => (
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
                  <h3 className={styles.title}>{title}</h3>
                  <p className={styles.text}>{text}</p>
                  <p className={styles.tag}>
                    {tag}
                    <CircleCheck size={14} aria-hidden="true" />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
