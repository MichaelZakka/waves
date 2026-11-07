import SiteImage, { frameStyle } from "@/components/ui/SiteImage/SiteImage";
import type { Project } from "@/lib/content/schema";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project }: { project: Project }) {
  const { label, title, location, date, services, description, shots } = project;

  return (
    <article className={styles.card} data-reveal>
      <div className={styles.meta}>
        <span className={styles.badge}>{label}</span>
        <span>
          <span className={styles.metaKey}>Location:</span> {location}
        </span>
        <span>
          <span className={styles.metaKey}>Date:</span> {date}
        </span>
      </div>
      <p className={styles.services}>
        <span className={styles.metaKey}>Services:</span> {services.join(" • ")}
      </p>

      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>

      <ul className={styles.shots}>
        {shots.map(({ caption, note, image }, index) => (
          <li key={index} className={styles.shot} style={frameStyle(image)}>
            <SiteImage image={image} sizes="(max-width: 768px) 100vw, 560px" />
            <div className={styles.caption}>
              <span className={styles.captionTitle}>{caption}</span>
              <span className={styles.captionNote}>{note}</span>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
