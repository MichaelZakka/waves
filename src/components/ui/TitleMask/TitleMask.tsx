import type { CSSProperties, ReactNode } from "react";
import styles from "./TitleMask.module.css";

type TitleMaskProps = {
  children: ReactNode;
  /** Extra delay in seconds before the text slides up. */
  delay?: number;
};

/**
 * Slides heading text up from behind a mask. Plays on page load, or — when it
 * sits inside a `[data-reveal]` block — as that block scrolls into view.
 * Put it inside the heading element so the heading keeps its own styles.
 */
export default function TitleMask({ children, delay = 0 }: TitleMaskProps) {
  const style = delay ? ({ "--title-delay": `${delay}s` } as CSSProperties) : undefined;

  return (
    <span className={styles.mask}>
      <span className={styles.inner} style={style}>
        {children}
      </span>
    </span>
  );
}
