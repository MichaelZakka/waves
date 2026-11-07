import SiteImage from "@/components/ui/SiteImage/SiteImage";
import { getContent } from "@/lib/content";
import styles from "./AboutHero.module.css";

export default async function AboutHero() {
  const { hero } = (await getContent()).about;

  return (
    <section
      className={styles.hero}
      aria-labelledby="about-hero-title"
      style={{ minHeight: `${hero.height}svh` }}
    >
      <SiteImage image={hero.image} sizes="100vw" preload className={styles.image} />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.content}>
          <h1 id="about-hero-title" className={styles.title}>
            {hero.title}
          </h1>
          <p className={styles.tagline}>
            {hero.taglineBefore} <em>{hero.taglineHighlight}</em>
            {hero.taglineAfter}
          </p>
          <p className={styles.text}>{hero.paragraph}</p>
        </div>
      </div>
    </section>
  );
}
