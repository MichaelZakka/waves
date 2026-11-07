import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cx } from "@/lib/cx";
import styles from "./Button.module.css";

type BaseProps = {
  children: ReactNode;
  variant?: "primary" | "outline" | "secondary";
  size?: "md" | "sm";
  /** "circle" puts the arrow in a dark circle on the right; "inline" is a plain trailing arrow. */
  arrow?: "circle" | "inline";
  fullWidth?: boolean;
  className?: string;
};

type LinkButtonProps = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & { href: string };

type NativeButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & { href?: never };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

/** Gold pill button. Renders an `<a>` when given an `href`, otherwise a `<button>`. */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  arrow,
  fullWidth = false,
  className,
  ...rest
}: ButtonProps) {
  const classes = cx(
    styles.button,
    styles[variant],
    styles[size],
    arrow === "circle" && styles.withCircle,
    fullWidth && styles.fullWidth,
    className,
  );

  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {arrow === "circle" && (
        <span className={styles.circle} aria-hidden="true">
          <ArrowUpRight size={size === "sm" ? 14 : 16} strokeWidth={2.25} />
        </span>
      )}
      {arrow === "inline" && (
        <ArrowRight
          className={styles.inlineArrow}
          size={size === "sm" ? 14 : 16}
          strokeWidth={2.25}
          aria-hidden="true"
        />
      )}
    </>
  );

  if (typeof rest.href === "string") {
    const { href, ...anchorProps } = rest as LinkButtonProps;
    // Routes inside the site go through next/link; tel:, mailto: and #hash stay plain anchors.
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={classes} {...anchorProps}>
          {content}
        </Link>
      );
    }
    return (
      <a href={href} className={classes} {...anchorProps}>
        {content}
      </a>
    );
  }

  const { type = "button", ...buttonProps } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
