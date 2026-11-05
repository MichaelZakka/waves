"use client";

import { useEffect } from "react";

/**
 * Fades `[data-reveal]` elements up as they scroll into view.
 * Content stays visible without JS: elements are only hidden once
 * `reveal-ready` is on <html> (see globals.css).
 */
export default function ScrollReveal() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (targets.length === 0 || !("IntersectionObserver" in window)) return;

    // Anything already on screen shows straight away instead of blinking out and back in.
    const viewportHeight = window.innerHeight;
    for (const el of targets) {
      const { top, bottom } = el.getBoundingClientRect();
      if (top < viewportHeight && bottom > 0) el.classList.add("is-visible");
    }

    const root = document.documentElement;
    root.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    for (const el of targets) {
      if (!el.classList.contains("is-visible")) observer.observe(el);
    }

    return () => {
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
