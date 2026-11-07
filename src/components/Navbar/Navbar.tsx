"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Menu, Plus, X } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  WhatsAppIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/ui/BrandIcons/BrandIcons";
import Logo from "@/components/ui/Logo/Logo";
import { navLinks, type LinkItem } from "@/data/content";
import type { SocialLink } from "@/lib/content/links";
import { cx } from "@/lib/cx";
import styles from "./Navbar.module.css";

const socialIcons = {
  whatsapp: WhatsAppIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
  tiktok: TikTokIcon,
  x: XIcon,
  email: Mail,
} satisfies Record<SocialLink["id"], unknown>;

function SocialLinks({ links, className }: { links: SocialLink[]; className?: string }) {
  return (
    <ul className={cx(styles.socials, className)}>
      {links.map(({ id, label, href }) => {
        const Icon = socialIcons[id];
        const external = href.startsWith("http");
        return (
          <li key={id}>
            <a
              href={href}
              className={styles.iconButton}
              aria-label={label}
              {...(external && { target: "_blank", rel: "noopener noreferrer" })}
            >
              <Icon size={16} aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

type NavbarProps = {
  /** One entry per service, shown under Services. */
  services: LinkItem[];
  socials: SocialLink[];
};

/** The navbar for the current page. Reads the URL, so render it inside <Suspense>. */
export function CurrentNavbar(props: NavbarProps) {
  return <Navbar {...props} pathname={usePathname()} />;
}

/** `pathname` highlights the current page's link; "" highlights nothing. */
export default function Navbar({ services, socials, pathname }: NavbarProps & { pathname: string }) {
  // The Services entry carries the service list as its dropdown.
  const links = navLinks.map((link) =>
    link.href === "/services" ? { ...link, children: services } : { ...link, children: undefined },
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const dropdownId = useId();
  const dropdownRef = useRef<HTMLLIElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // True while a mouse hover (rather than a click or key press) is holding the dropdown open.
  const openedByHover = useRef(false);

  // Close the services dropdown on any click outside it.
  useEffect(() => {
    if (!servicesOpen) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) setServicesOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [servicesOpen]);

  // While the mobile menu is open: lock page scroll, move focus in, and close if we grow to desktop.
  useEffect(() => {
    if (!menuOpen) return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const desktop = window.matchMedia("(min-width: 901px)");
    const onBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", onBreakpoint);

    return () => {
      body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [menuOpen]);

  function handleDropdownPointerEnter(event: PointerEvent) {
    if (event.pointerType !== "mouse") return;
    openedByHover.current = true;
    setServicesOpen(true);
  }

  function handleDropdownPointerLeave(event: PointerEvent) {
    if (event.pointerType !== "mouse") return;
    openedByHover.current = false;
    setServicesOpen(false);
  }

  function handleDropdownToggle() {
    // A click on a hover-opened menu shouldn't snap it shut under the cursor.
    if (openedByHover.current) return;
    setServicesOpen((open) => !open);
  }

  function handleDropdownKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && servicesOpen) {
      setServicesOpen(false);
      dropdownButtonRef.current?.focus();
    }
  }

  function handleDropdownBlur(event: FocusEvent<HTMLLIElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setServicesOpen(false);
    }
  }

  function closeMenu(restoreFocus = false) {
    setMenuOpen(false);
    if (restoreFocus) menuButtonRef.current?.focus();
  }

  function handleOverlayKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      closeMenu(true);
      return;
    }
    if (event.key !== "Tab") return;

    // Keep keyboard focus inside the open menu.
    const focusable = event.currentTarget.querySelectorAll<HTMLElement>("a[href], button");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.bar}>
          <Link href="/" className={styles.logoLink} aria-label="Professional Waves home">
            <Logo size={40} />
          </Link>

          <nav aria-label="Primary" className={styles.nav}>
            <ul className={styles.links}>
              {links.map((link) =>
                link.children ? (
                  <li
                    key={link.label}
                    ref={dropdownRef}
                    className={styles.dropdownWrap}
                    onPointerEnter={handleDropdownPointerEnter}
                    onPointerLeave={handleDropdownPointerLeave}
                    onKeyDown={handleDropdownKeyDown}
                    onBlur={handleDropdownBlur}
                  >
                    <button
                      ref={dropdownButtonRef}
                      type="button"
                      className={styles.link}
                      data-active={pathname.startsWith(link.href)}
                      aria-expanded={servicesOpen}
                      aria-controls={dropdownId}
                      onClick={handleDropdownToggle}
                    >
                      {link.label}
                      <Plus size={14} className={styles.chevron} aria-hidden="true" />
                    </button>
                    <ul id={dropdownId} className={styles.dropdown} data-open={servicesOpen}>
                      <li>
                        <Link
                          href={link.href}
                          className={cx(styles.dropdownLink, styles.dropdownAll)}
                          onClick={() => setServicesOpen(false)}
                        >
                          All services
                        </Link>
                      </li>
                      {link.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={styles.dropdownLink}
                            onClick={() => setServicesOpen(false)}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={styles.link}
                      aria-current={pathname === link.href ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className={styles.end}>
            <SocialLinks links={socials} className={styles.barSocials} />
            <button
              ref={menuButtonRef}
              type="button"
              className={cx(styles.iconButton, styles.menuButton)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Kept outside the bar so it covers the whole viewport, not just the floating bar. */}
      <div
        id="mobile-menu"
        className={styles.overlay}
        data-open={menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        onKeyDown={handleOverlayKeyDown}
      >
        <div className={styles.overlayTop}>
          <Link
            href="/"
            className={styles.logoLink}
            aria-label="Professional Waves home"
            onClick={() => closeMenu()}
          >
            <Logo size={40} />
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.iconButton}
            aria-label="Close menu"
            onClick={() => closeMenu(true)}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile">
          <ul className={styles.mobileLinks}>
            {links.map((link, index) => (
              <li
                key={link.label}
                className={styles.mobileItem}
                style={{ "--i": index } as CSSProperties}
              >
                <Link
                  href={link.href}
                  className={styles.mobileLink}
                  aria-current={pathname === link.href ? "page" : undefined}
                  onClick={() => closeMenu()}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <ul className={styles.mobileSub}>
                    {link.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={styles.mobileSubLink}
                          onClick={() => closeMenu()}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.overlayFooter}>
          <Button href="/contact" arrow="circle" onClick={() => closeMenu()}>
            Let&rsquo;s Plan Your Event
          </Button>
          <SocialLinks links={socials} />
        </div>
      </div>
    </>
  );
}
