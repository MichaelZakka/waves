import Button from "@/components/ui/Button/Button";
import SiteImage from "@/components/ui/SiteImage/SiteImage";
import { serviceHref } from "@/lib/content/links";
import type { Service } from "@/lib/content/schema";
import styles from "./ServiceCard.module.css";

export default function ServiceCard({ service }: { service: Service }) {
  const { slug, title, description, image } = service;

  return (
    <article id={slug} className={styles.card}>
      <SiteImage
        image={image}
        sizes="(max-width: 640px) 100vw, (max-width: 1248px) 50vw, 600px"
        className={styles.image}
      />
      <div className={styles.shade} aria-hidden="true" />

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <Button
          href={serviceHref(service)}
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
