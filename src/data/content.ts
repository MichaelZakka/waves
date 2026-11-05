import {
  CircleCheck,
  type LucideIcon,
} from "lucide-react";
import type { StaticImageData } from "next/image";
import aboutImage from "@/assets/about.jpg";
import heroImage from "@/assets/hero.jpg";
import audioImage from "@/assets/Professional Audio Solutions.jpg";
import lightingImage from "@/assets/Professional Lighting.jpg";
import supportImage from "@/assets/Technical Support & Operators.jpg";
import videoImage from "@/assets/Video & LED Solutions.jpg";

export type ImageAsset = { src: string | StaticImageData; alt: string };
export type LinkItem = { label: string; href: string };
export type NavLink = LinkItem & { children?: LinkItem[] };
export type SocialLink = LinkItem & { id: "whatsapp" | "instagram" | "email" };
export type InfoItem = { label: string; value: string };
export type Stat = { value: string; label: string; caption: string };
export type Service = {
  id: string;
  title: string;
  description: string;
  image: ImageAsset;
  href: string;
};
export type WhyCard = {
  number: string;
  title: string;
  text: string;
  tag: string;
  icon: LucideIcon;
};

/* -------------------------------------------------------------------------- */
/* Images                                                                     */
/* -------------------------------------------------------------------------- */

export const images = {
  hero: {
    src: heroImage,
    alt: "Outdoor concert at night with LED screens, stage lighting and a mixing console in the foreground",
  },
  about: {
    src: aboutImage,
    alt: "Outdoor festival stage with green laser beams, truss lighting and LED screens at night",
  },
} satisfies Record<string, ImageAsset>;

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

// TODO: the Instagram link is still a placeholder.
export const contact = {
  name: "Masoud Al Qaq",
  initials: "MA",
  role: "Managing Director",
  phone: "+971 55 179 1376",
  phoneHref: "tel:+971551791376",
  email: "Masoud@professionalwaves.com",
  emailHref: "mailto:Masoud@professionalwaves.com",
  website: "www.professionalwaves.com",
  websiteHref: "https://www.professionalwaves.com",
  location: "Dubai & Abu Dhabi, United Arab Emirates",
  whatsappHref: "https://wa.me/971551791376",
  instagramHref: "https://www.instagram.com/",
};

/* -------------------------------------------------------------------------- */
/* Services                                                                   */
/* -------------------------------------------------------------------------- */

export const services: Service[] = [
  {
    id: "service-audio",
    title: "Professional Audio Solutions",
    description:
      "High-quality sound systems and professional audio equipment for events of every scale.",
    image: {
      src: audioImage,
      alt: "DiGiCo Quantum mixing console at front of house facing an outdoor stage with LED screens",
    },
    href: "#contact",
  },
  {
    id: "service-video",
    title: "Video & LED Solutions",
    description:
      "LED screens, projection, and professional video equipment for impactful visuals.",
    image: {
      src: videoImage,
      alt: "Conference hall with a large LED screen showing the speaker above a lit stage and audience",
    },
    href: "#contact",
  },
  {
    id: "service-lighting",
    title: "Professional Lighting",
    description:
      "Dynamic stage lighting and creative lighting setups that transform every event atmosphere.",
    image: {
      src: lightingImage,
      alt: "Outdoor concert stage lit with yellow and purple beams over a large crowd",
    },
    href: "#contact",
  },
  {
    id: "service-support",
    title: "Technical Support & Operators",
    description:
      "Experienced technicians and skilled operators ensuring smooth, reliable event production.",
    image: {
      src: supportImage,
      alt: "Technician at a Yamaha CL5 console and control laptops in an arena before a show",
    },
    href: "#contact",
  },
];

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export const navLinks: NavLink[] = [
  { label: "About Us", href: "#about" },
  {
    label: "Services",
    href: "#services",
    children: services.map(({ id, title }) => ({ label: title, href: `#${id}` })),
  },
  // There is no Works section yet, so this points at Services for now.
  { label: "Works", href: "#services" },
  { label: "Contact Us", href: "#contact" },
];

export const socialLinks: SocialLink[] = [
  { id: "whatsapp", label: "Chat with us on WhatsApp", href: contact.whatsappHref },
  { id: "instagram", label: "Follow us on Instagram", href: contact.instagramHref },
  { id: "email", label: "Email us", href: contact.emailHref },
];

/* -------------------------------------------------------------------------- */
/* Highlights                                                                 */
/* -------------------------------------------------------------------------- */

export const infoItems: InfoItem[] = [
  { label: "Locations", value: "Dubai & Abu Dhabi" },
  { label: "Capability", value: "Arena, Stadium & Ballroom" },
  { label: "Deployment", value: "Turnkey AVL & Rigging" },
  { label: "Support", value: "24/7 Redundant Systems" },
];

export const stats: Stat[] = [
  {
    value: "13+",
    label: "Years of Experience",
    caption: "Proven track record in GCC events",
  },
  {
    value: "UAE",
    label: "Based in the Emirates",
    caption: "Rapid deployment across all 7 Emirates",
  },
  {
    value: "AVL",
    label: "Audio, Video & Lighting",
    caption: "Comprehensive inventory from top brands",
  },
  {
    value: "360°",
    label: "Technical Event Support",
    caption: "From engineering design to live operation",
  },
];

/* -------------------------------------------------------------------------- */
/* Why choose us                                                              */
/* -------------------------------------------------------------------------- */

export const whyCards: WhyCard[] = [
  {
    number: "01",
    title: "Professional Equipment",
    text: "Professional audio, video, and lighting equipment to meet the technical requirements of different events.",
    tag: "Quality Equipment",
    icon: CircleCheck,
  },
  {
    number: "02",
    title: "Experienced Team",
    text: "Skilled technicians and operators providing on-site technical assistance and equipment operation.",
    tag: "Technical Expertise",
    icon: CircleCheck,
  },
  {
    number: "03",
    title: "Tailored Solutions",
    text: "Flexible AVL rental solutions tailored to the needs, scale and technical requirements of each event.",
    tag: "Flexible Solutions",
    icon: CircleCheck,
  },
  {
    number: "04",
    title: "Reliable Support",
    text: "Dedicated technical support to help ensure smooth equipment setup and reliable event operations.",
    tag: "On-Site Support",
    icon: CircleCheck,
  },
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
  { label: "Home", href: "#top" },
  { label: "About Us", href: "#about" },
  { label: "AVL Services", href: "#services" },
  { label: "Case Studies & Work", href: "#services" },
  { label: "Why Choose Us", href: "#why" },
  { label: "Contact & Bookings", href: "#contact" },
];

export const capabilities = [
  "Concert Line Arrays & Acoustic Engineering",
  "Ultra-High Definition LED Video Panels",
  "Kinetic Architectural & Stage Lighting",
  "Certified Truss & Automated Rigging",
  "Global Exhibition Turnkey Production",
];

// TODO: point these at the real policy pages once they exist.
export const legalLinks: LinkItem[] = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Rental", href: "#" },
  { label: "UAE Compliance", href: "#" },
];
