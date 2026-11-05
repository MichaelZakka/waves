import type { CSSProperties } from "react";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import { services } from "@/data/content";
import ServiceCard from "./ServiceCard";
import styles from "./Services.module.css";

export default function Services() {
  return (
    <section id="services" className={styles.section} aria-labelledby="services-title">
      <div className={styles.inner}>
        <div className={styles.header} data-reveal>
          <SectionHeading
            id="services-title"
            title="Our Services"
            subtitle="Professional Solutions. Exceptional Experiences"
          />
        </div>

        <ul className={styles.grid}>
          {services.map((service, index) => (
            <li
              key={service.id}
              className={styles.item}
              data-reveal
              style={{ "--reveal-delay": `${(index % 2) * 120}ms` } as CSSProperties}
            >
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
