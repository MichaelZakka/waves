import { z } from "zod";

/*
 * Shape of everything the admin dashboard can edit. Every save is validated
 * against this before it's written, so the site never renders broken data.
 */

const line = z.string().trim().max(200);
const paragraph = z.string().trim().max(2000);

/* -------------------------------------------------------------------------- */
/* Images                                                                     */
/* -------------------------------------------------------------------------- */

export const IMAGE_ASPECTS = ["auto", "16/9", "4/3", "1/1", "3/4"] as const;

export const imageSchema = z.object({
  /** "" leaves the frame empty. Only site images and uploads are allowed. */
  src: z
    .string()
    .max(300)
    .regex(/^$|^\/(images|uploads)\/[A-Za-z0-9._\-/]+$/, "must be an uploaded image"),
  alt: line,
  /** "cover" fills the frame (cropping), "contain" shows the whole image. */
  fit: z.enum(["cover", "contain"]),
  /** Point that stays in view when cropping, in % from the left / top. */
  focalX: z.number().min(0).max(100),
  focalY: z.number().min(0).max(100),
  /** 1 = as is; higher zooms in around the focal point. */
  zoom: z.number().min(1).max(3),
  /** Frame shape, for frames that allow it; "auto" keeps the layout's default. */
  aspect: z.enum(IMAGE_ASPECTS),
  blurDataURL: z.string().max(4000).optional(),
});

/* -------------------------------------------------------------------------- */
/* Shared building blocks                                                     */
/* -------------------------------------------------------------------------- */

const titleText = z.object({ title: line, text: paragraph });

export const SOCIAL_PLATFORMS = [
  "whatsapp",
  "instagram",
  "facebook",
  "linkedin",
  "youtube",
  "tiktok",
  "x",
] as const;

const httpUrl = z
  .string()
  .trim()
  .max(300)
  .regex(/^https?:\/\/\S+$/, "must start with https://");

/* -------------------------------------------------------------------------- */
/* Sections                                                                   */
/* -------------------------------------------------------------------------- */

export const contactSchema = z.object({
  name: line,
  initials: z.string().trim().max(3),
  role: line,
  phone: line,
  email: z.union([z.literal(""), z.email("must be a valid email address")]),
  website: line,
  websiteUrl: z.union([z.literal(""), httpUrl]),
  location: line,
  /** What the contact-page map searches for, e.g. an office address. */
  mapQuery: line,
  socials: z
    .array(z.object({ platform: z.enum(SOCIAL_PLATFORMS), url: httpUrl }))
    .max(10),
});

export const serviceSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "is required")
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "use lowercase letters, numbers and dashes only"),
  title: line.min(1, "is required"),
  /** Short text on the service card. */
  description: paragraph,
  image: imageSchema,
  badge: line,
  subtitle: paragraph,
  overview: paragraph,
  capabilitiesEyebrow: line,
  capabilities: z.array(titleText).max(12),
  gallery: z.array(imageSchema).max(12),
});

const homeSchema = z.object({
  hero: z.object({
    image: imageSchema,
    /** Hero height as % of the screen height. */
    height: z.number().int().min(50).max(100),
    titleLine1: line,
    titleLine2: line,
    subtitleLine1: line,
    subtitleLine2: line,
    ctaLabel: line,
  }),
  infoItems: z.array(z.object({ label: line, value: line })).max(8),
  stats: z.array(z.object({ value: line, label: line, caption: line })).max(8),
  about: z.object({
    title: line,
    lead: line,
    body: paragraph,
    ctaLabel: line,
    image: imageSchema,
  }),
  services: z.object({ title: line, subtitle: line }),
  why: z.object({
    eyebrow: line,
    title: line,
    subtitle: paragraph,
    cards: z.array(z.object({ title: line, text: paragraph, tag: line })).max(8),
  }),
  contact: z.object({
    eyebrow: line,
    titleStart: line,
    titleHighlight: line,
    intro: paragraph,
    formTitle: line,
    formSubtitle: line,
    note: line,
    callLabel: line,
    quoteLabel: line,
  }),
});

const aboutSchema = z.object({
  hero: z.object({
    image: imageSchema,
    height: z.number().int().min(50).max(100),
    title: line,
    taglineBefore: line,
    taglineHighlight: line,
    taglineAfter: line,
    paragraph,
  }),
  whoWeAre: z.object({
    eyebrow: line,
    title: line,
    paragraphs: z.array(paragraph).max(6),
    image: imageSchema,
  }),
  experience: z.object({
    eyebrowHighlight: line,
    eyebrowRest: line,
    title: line,
    intro: paragraph,
    items: z
      .array(z.object({ tag: line, title: line, text: paragraph, image: imageSchema }))
      .max(12),
  }),
  expertise: z.object({ eyebrow: line, title: line, items: z.array(titleText).max(9) }),
  advantages: z.object({ eyebrow: line, title: line, items: z.array(titleText).max(9) }),
  cta: z.object({ title: line, text: paragraph, buttonLabel: line }),
});

const pageIntroSchema = z.object({ eyebrow: line, title: line, text: paragraph });

const worksSchema = z.object({
  intro: pageIntroSchema,
  projects: z
    .array(
      z.object({
        label: line,
        title: line,
        location: line,
        date: line,
        services: z.array(line).max(10),
        description: paragraph,
        shots: z.array(z.object({ caption: line, note: line, image: imageSchema })).max(8),
      }),
    )
    .max(50),
  cta: z.object({ title: line, text: paragraph, buttonLabel: line }),
});

export const siteContentSchema = z
  .object({
    contact: contactSchema,
    home: homeSchema,
    about: aboutSchema,
    servicesPage: z.object({ title: line, subtitle: line, aside: paragraph }),
    services: z.array(serviceSchema).max(24),
    works: worksSchema,
    contactPage: pageIntroSchema,
  })
  .superRefine((content, ctx) => {
    const seen = new Set<string>();
    content.services.forEach((service, index) => {
      if (seen.has(service.slug)) {
        ctx.addIssue({
          code: "custom",
          path: ["services", index, "slug"],
          message: `"${service.slug}" is already used by another service`,
        });
      }
      seen.add(service.slug);
    });
  });

export type SiteContent = z.infer<typeof siteContentSchema>;
export type SiteImage = z.infer<typeof imageSchema>;
export type ImageAspect = SiteImage["aspect"];
export type Contact = SiteContent["contact"];
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];
export type Service = z.infer<typeof serviceSchema>;
export type Project = SiteContent["works"]["projects"][number];
export type TitleText = z.infer<typeof titleText>;

/** Top-level parts of the content that an editor can save. */
export type ContentSection = keyof SiteContent;
export const CONTENT_SECTIONS = Object.keys(siteContentSchema.shape) as ContentSection[];

/** A blank image slot: an empty frame with neutral framing. */
export function emptyImage(): SiteImage {
  return { src: "", alt: "", fit: "cover", focalX: 50, focalY: 50, zoom: 1, aspect: "auto" };
}
