import type { Contact, Service, SocialPlatform } from "./schema";

/* Links derived from the editable contact details and services. */

export const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const emailHref = (email: string) => `mailto:${email}`;

export const serviceHref = (service: Pick<Service, "slug">) => `/services/${service.slug}`;

/** Keyless Google Maps embed for the contact page. */
export const mapEmbedSrc = (query: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=11&output=embed`;

export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  tiktok: "TikTok",
  x: "X (Twitter)",
};

export type SocialLink = { id: SocialPlatform; label: string; href: string };

/** Social icons for the navbar: the platforms configured under Contact in the admin. */
export function socialLinks(contact: Contact): SocialLink[] {
  return contact.socials.map(({ platform, url }) => ({
    id: platform,
    label: platform === "whatsapp" ? "Chat with us on WhatsApp" : `Follow us on ${SOCIAL_LABELS[platform]}`,
    href: url,
  }));
}
