import type { CSSProperties } from "react";
import Button from "@/components/ui/Button/Button";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import SiteImage, { frameStyle } from "@/components/ui/SiteImage/SiteImage";
import { getContent } from "@/lib/content";
import styles from "./About.module.css";

export default async function About() {
  const { about } = (await getContent()).home;

  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={styles.inner}>
        <div className={styles.copy} data-reveal>
          <SectionHeading id="about-title" title={about.title} />
          <p className={styles.lead}>{about.lead}</p>
          <p className={styles.body}>{about.body}</p>
          <Button href="#contact">{about.ctaLabel}</Button>
        </div>

        <div
          className={styles.media}
          data-reveal
          style={{ "--reveal-delay": "120ms", ...frameStyle(about.image) } as CSSProperties}
        >
          <SiteImage image={about.image} sizes="(max-width: 900px) 100vw, 600px" />
        </div>
      </div>
    </section>
  );
}
