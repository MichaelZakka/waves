"use client";

import { useEffect } from "react";

/**
 * Fades `[data-reveal]` elements up as they scroll into view.
 * Content stays visible without JS: elements are only hidden once
 * `reveal-ready` is on <html> (see globals.css).
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

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

    function track(targets: HTMLElement[]) {
      // Anything already on screen shows straight away instead of blinking out and back in.
      const viewportHeight = window.innerHeight;
      for (const el of targets) {
        if (el.classList.contains("is-visible")) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top < viewportHeight && bottom > 0) el.classList.add("is-visible");
        else observer.observe(el);
      }
    }

    track(Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")));

    // Content that streams in after hydration (e.g. pages rendered on demand).
    const mutations = new MutationObserver((records) => {
      const added: HTMLElement[] = [];
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.matches("[data-reveal]")) added.push(node);
          added.push(...node.querySelectorAll<HTMLElement>("[data-reveal]"));
        }
      }
      if (added.length) track(added);
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    const root = document.documentElement;
    root.classList.add("reveal-ready");

    return () => {
      observer.disconnect();
      mutations.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
