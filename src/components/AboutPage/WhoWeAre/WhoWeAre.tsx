import type { CSSProperties } from "react";
import SiteImage, { frameStyle } from "@/components/ui/SiteImage/SiteImage";
import { getContent } from "@/lib/content";
import styles from "./WhoWeAre.module.css";

export default async function WhoWeAre() {
  const { eyebrow, title, paragraphs, image } = (await getContent()).about.whoWeAre;

  return (
    <section className={styles.section} aria-labelledby="who-title">
      <div className={styles.inner}>
        <div className={styles.card} data-reveal>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id="who-title" className={styles.title}>
            {title}
          </h2>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={styles.text}>
              {paragraph}
            </p>
          ))}
        </div>

        <div
          className={styles.media}
          data-reveal
          style={{ "--reveal-delay": "120ms", ...frameStyle(image) } as CSSProperties}
        >
          <SiteImage image={image} sizes="(max-width: 900px) 100vw, 580px" />
        </div>
      </div>
    </section>
  );
}
