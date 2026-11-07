/*
 * Fixed site settings that aren't edited from the admin dashboard.
 * Editable content lives in src/lib/content (seed + saved file).
 */

export type LinkItem = { label: string; href: string };

/** Main navigation. The Services entry gets one child per service at render time. */
export const navLinks: LinkItem[] = [
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Works", href: "/works" },
  { label: "Contact Us", href: "/contact" },
];

/* -------------------------------------------------------------------------- */
/* Quote form                                                                 */
/* -------------------------------------------------------------------------- */

export const eventTypes = [
  "Corporate Conference / Summit",
  "Concert / Live Music",
  "Exhibition / Trade Show",
  "Product Launch / Brand Activation",
  "Festival / Outdoor Event",
  "Wedding / Private Event",
  "Other",
];

export const serviceOptions = ["Audio", "Video / LED", "Lighting", "Operators"];

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

export const footerExplore: LinkItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "AVL Services", href: "/services" },
  { label: "Case Studies & Work", href: "/works" },
  { label: "Why Choose Us", href: "/#why" },
  { label: "Contact & Bookings", href: "/contact" },
];

export const capabilities = [
  "Concert Line Arrays & Acoustic Engineering",
  "Ultra-High Definition LED Video Panels",
  "Kinetic Architectural & Stage Lighting",
  "Certified Truss & Automated Rigging",
  "Global Exhibition Turnkey Production",
];

// TODO: add an `href` to each once the policy pages exist; until then they render as plain text.
export const legalLinks: { label: string; href?: string }[] = [
  { label: "Privacy Policy" },
  { label: "Terms of Rental" },
  { label: "UAE Compliance" },
];
