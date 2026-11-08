import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import TitleMask from "@/components/ui/TitleMask/TitleMask";
import styles from "./SectionHeading.module.css";

type SectionHeadingProps = {
  /** Put on the `<h2>` so the section can reference it with `aria-labelledby`. */
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  /** "light" renders a white title; wrap words in `<em>` to pick them out in gold. */
  tone?: "accent" | "light";
  uppercase?: boolean;
  className?: string;
};

export default function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "accent",
  uppercase = true,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cx(styles.heading, align === "center" && styles.center, className)}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h2
        id={id}
        className={cx(styles.title, tone === "light" && styles.light, uppercase && styles.uppercase)}
      >
        <TitleMask>{title}</TitleMask>
      </h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
