import Image from "next/image";
import Button from "@/components/ui/Button/Button";
import { images } from "@/data/content";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <Image
        src={images.hero.src}
        alt={images.hero.alt}
        fill
        preload
        placeholder="blur"
        sizes="100vw"
        className={styles.image}
      />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.content}>
          <h1 id="hero-title" className={styles.title}>
            <span>Creating Extraordinary</span> <span>Event Experiences</span>
          </h1>
          <p className={styles.subtitle}>
            <span>Professional Audio, Video &amp; Lighting Solutions</span>
            <span>13+ Years of Excellence in the UAE</span>
          </p>
          <div className={styles.actions}>
            <Button href="#contact" arrow="circle">
              Let&rsquo;s Plan Your Event
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
