import Button from "@/components/ui/Button/Button";
import SiteImage from "@/components/ui/SiteImage/SiteImage";
import { getContent } from "@/lib/content";
import styles from "./Hero.module.css";

export default async function Hero() {
  const { hero } = (await getContent()).home;

  return (
    <section
      id="top"
      className={styles.hero}
      aria-labelledby="hero-title"
      style={{ minHeight: `${hero.height}svh` }}
    >
      <SiteImage image={hero.image} sizes="100vw" preload className={styles.image} />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.content}>
          <h1 id="hero-title" className={styles.title}>
            <span>{hero.titleLine1}</span> <span>{hero.titleLine2}</span>
          </h1>
          <p className={styles.subtitle}>
            <span>{hero.subtitleLine1}</span>
            <span>{hero.subtitleLine2}</span>
          </p>
          <div className={styles.actions}>
            <Button href="#contact" arrow="circle">
              {hero.ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
