import type { CSSProperties } from "react";
import SiteImage, { frameStyle } from "@/components/ui/SiteImage/SiteImage";
import { getContent } from "@/lib/content";
import styles from "./Experience.module.css";

export default async function Experience() {
  const { eyebrowHighlight, eyebrowRest, title, intro, items } = (await getContent()).about
    .experience;

  return (
    <section className={styles.section} aria-labelledby="experience-title">
      <div className={styles.inner}>
        <div className={styles.header} data-reveal>
          <p className={styles.eyebrow}>
            <span className={styles.underline}>{eyebrowHighlight}</span> {eyebrowRest}
          </p>
          <h2 id="experience-title" className={styles.heading}>
            {title}
          </h2>
          <p className={styles.intro}>{intro}</p>
        </div>

        <ul className={styles.grid}>
          {items.map((item, index) => (
            <li
              key={index}
              className={styles.item}
              data-reveal
              style={{ "--reveal-delay": `${(index % 2) * 120}ms` } as CSSProperties}
            >
              <article className={styles.card}>
                <div className={styles.media} style={frameStyle(item.image)}>
                  <SiteImage
                    image={item.image}
                    sizes="(max-width: 640px) 100vw, (max-width: 1248px) 50vw, 600px"
                    className={styles.image}
                  />
                  <span className={styles.tag}>{item.tag}</span>
                </div>
                <div className={styles.body}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.text}>{item.text}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
