import TitleMask from "@/components/ui/TitleMask/TitleMask";
import styles from "./PageIntro.module.css";

type PageIntroProps = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
};

/** Centred page heading for pages without a photo hero (Works, Contact). */
export default function PageIntro({ id, eyebrow, title, text }: PageIntroProps) {
  return (
    <section className={styles.section} aria-labelledby={id}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>
          <span className={styles.dot} aria-hidden="true" />
          {eyebrow}
        </p>
        <h1 id={id} className={styles.title}>
          <TitleMask>{title}</TitleMask>
        </h1>
        <p className={styles.text}>{text}</p>
      </div>
    </section>
  );
}
