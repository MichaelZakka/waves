import { CalendarDays } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import { getContent } from "@/lib/content";
import TitleMask from "@/components/ui/TitleMask/TitleMask";
import styles from "./ContactCta.module.css";

export default async function ContactCta() {
  const { cta } = (await getContent()).works;

  return (
    <section className={styles.section} aria-labelledby="works-cta-title">
      <div className={styles.inner}>
        <div className={styles.panel} data-reveal>
          <span className={styles.icon} aria-hidden="true">
            <CalendarDays size={18} />
          </span>
          <h2 id="works-cta-title" className={styles.title}>
            <TitleMask>{cta.title}</TitleMask>
          </h2>
          <p className={styles.text}>{cta.text}</p>
          <Button href="/contact" size="sm" arrow="inline">
            {cta.buttonLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
