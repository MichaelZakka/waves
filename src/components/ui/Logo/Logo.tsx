import Image from "next/image";
import logo from "@/assets/logo.jpg";
import { cx } from "@/lib/cx";
import styles from "./Logo.module.css";

type LogoProps = {
  /** Rendered height in px; width follows the cropped artwork's ratio. */
  size?: number;
  className?: string;
  alt?: string;
};

// The box matches logo.jpg's own 1280×782 ratio, so the full image shows uncropped.
const CROP_RATIO = 1280 / 782;

export default function Logo({ size = 40, className, alt = "" }: LogoProps) {
  return (
    <span
      className={cx(styles.mark, className)}
      style={{ width: Math.round(size * CROP_RATIO), height: size }}
    >
      <Image
        src={logo}
        alt={alt}
        sizes={`${Math.ceil(size * CROP_RATIO)}px`}
        className={styles.image}
      />
    </span>
  );
}
