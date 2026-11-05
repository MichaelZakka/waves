import Image from "next/image";
import type { CSSProperties } from "react";
import Button from "@/components/ui/Button/Button";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import { images } from "@/data/content";
import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={styles.inner}>
        <div className={styles.copy} data-reveal>
          <SectionHeading id="about-title" title="Professional Waves" />
          <p className={styles.lead}>
            is your trusted partner for Audio Visual &amp; Lighting Solutions
          </p>
          <p className={styles.body}>
            Professional Waves is a UAE-based company specializing in professional audio, video,
            and lighting equipment rental, backed by experienced technicians and dedicated
            technical support to deliver seamless event experiences.
          </p>
          <Button href="#contact">
            Get in Touch
          </Button>
        </div>

        <div
          className={styles.media}
          data-reveal
          style={{ "--reveal-delay": "120ms" } as CSSProperties}
        >
          <Image
            src={images.about.src}
            alt={images.about.alt}
            fill
            placeholder="blur"
            sizes="(max-width: 900px) 100vw, 600px"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
