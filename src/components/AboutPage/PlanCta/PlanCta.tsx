import Button from "@/components/ui/Button/Button";
import { getContent } from "@/lib/content";
import styles from "./PlanCta.module.css";

export default async function PlanCta() {
  const { cta } = (await getContent()).about;

  return (
    <section className={styles.section} aria-labelledby="plan-title">
      <div className={styles.inner}>
        <div className={styles.band} data-reveal>
          <h2 id="plan-title" className={styles.title}>
            {cta.title}
          </h2>
          <p className={styles.text}>{cta.text}</p>
          <Button href="/contact" arrow="circle">
            {cta.buttonLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
