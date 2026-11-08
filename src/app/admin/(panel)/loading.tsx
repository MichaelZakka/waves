import styles from "./layout.module.css";

/** Suspense boundary for every panel page, so the session check can stream in. */
export default function Loading() {
  return <p className={styles.loading}>Loading…</p>;
}
