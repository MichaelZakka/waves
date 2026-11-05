import Image from "next/image";
import Button from "@/components/ui/Button/Button";
import type { Service } from "@/data/content";
import styles from "./ServiceCard.module.css";

export default function ServiceCard({ service }: { service: Service }) {
  const { id, title, description, image, href } = service;

  return (
    <article id={id} className={styles.card}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        placeholder="blur"
        sizes="(max-width: 640px) 100vw, (max-width: 1248px) 50vw, 600px"
        className={styles.image}
      />
      <div className={styles.shade} aria-hidden="true" />

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <Button
          href={href}
          size="sm"
          arrow="inline"
          className={styles.cta}
          aria-label={`Explore more about ${title}`}
        >
          Explore More
        </Button>
      </div>
    </article>
  );
}
