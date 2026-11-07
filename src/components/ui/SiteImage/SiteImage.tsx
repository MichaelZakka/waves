import Image from "next/image";
import type { CSSProperties } from "react";
import type { SiteImage as SiteImageData } from "@/lib/content/schema";
import { cx } from "@/lib/cx";
import styles from "./SiteImage.module.css";

type SiteImageProps = {
  image: SiteImageData;
  sizes: string;
  preload?: boolean;
  className?: string;
};

/**
 * An editable image filling its (position: relative) frame, framed the way it
 * was set in the admin: fill or fit, focal point and zoom. Renders nothing for
 * an empty slot, leaving the frame's own background showing.
 */
export default function SiteImage({ image, sizes, preload, className }: SiteImageProps) {
  if (!image.src) return null;

  const focal = `${image.focalX}% ${image.focalY}%`;
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      preload={preload}
      {...(image.blurDataURL
        ? { placeholder: "blur" as const, blurDataURL: image.blurDataURL }
        : {})}
      className={cx(styles.image, className)}
      style={
        {
          objectFit: image.fit,
          objectPosition: focal,
          transformOrigin: focal,
          "--zoom": image.zoom,
        } as CSSProperties
      }
    />
  );
}

/** Inline style giving a frame the image's chosen shape (when it isn't "auto"). */
export function frameStyle(image: SiteImageData): CSSProperties | undefined {
  return image.aspect === "auto" ? undefined : { aspectRatio: image.aspect };
}
