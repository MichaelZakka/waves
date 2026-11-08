import type { CSSProperties } from "react";
import { AlarmClock, Globe, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import { getContent } from "@/lib/content";
import { emailHref, mapEmbedSrc, phoneHref } from "@/lib/content/links";
import QuoteForm from "./QuoteForm";
import styles from "./ContactSection.module.css";

type ContactSectionProps = {
  /** "page" (the Contact page) swaps the call/quote buttons for a location map. */
  variant?: "section" | "page";
};

/** Lets an email address wrap after the "@" on narrow screens instead of mid-word. */
function breakAfterAt(text: string) {
  const at = text.indexOf("@");
  if (at === -1) return text;
  return (
    <>
      {text.slice(0, at + 1)}
      <wbr />
      {text.slice(at + 1)}
    </>
  );
}

export default async function ContactSection({ variant = "section" }: ContactSectionProps) {
  const { contact, home } = await getContent();
  const copy = home.contact;
  const details = [
    { icon: Phone, label: contact.phone, href: phoneHref(contact.phone) },
    { icon: Mail, label: contact.email, href: emailHref(contact.email) },
    { icon: Globe, label: contact.website, href: contact.websiteUrl || undefined },
    { icon: MapPin, label: contact.location },
  ].filter((detail) => detail.label);

  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className={styles.inner}>
        <div className={styles.panel}>
          <div className={styles.info} data-reveal>
            <SectionHeading
              id="contact-title"
              eyebrow={copy.eyebrow}
              title={
                <>
                  {copy.titleStart} <em>{copy.titleHighlight}</em>
                </>
              }
              tone="light"
              uppercase={false}
            />
            <p className={styles.intro}>{copy.intro}</p>

            <div className={styles.card}>
              <div className={styles.person}>
                <span className={styles.avatar} aria-hidden="true">
                  {contact.initials}
                </span>
                <div>
                  <p className={styles.name}>{contact.name}</p>
                  <p className={styles.role}>{contact.role}</p>
                </div>
              </div>

              <ul className={styles.details}>
                {details.map(({ icon: Icon, label, href }) => (
                  <li key={label} className={styles.detail}>
                    <Icon size={16} className={styles.detailIcon} aria-hidden="true" />
                    {href ? (
                      <a
                        href={href}
                        className={styles.detailLink}
                        {...(href.startsWith("http") && {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        })}
                      >
                        {breakAfterAt(label)}
                      </a>
                    ) : (
                      <span>{label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {variant === "section" && (
              <div className={styles.actions}>
                <Button
                  href={phoneHref(contact.phone)}
                  variant="secondary"
                  size="sm"
                  className={styles.action}
                >
                  <Phone size={12} aria-hidden="true" />
                  {copy.callLabel}
                </Button>
                <Button href="#quote" size="sm" className={styles.action}>
                  <MessageSquare size={12} aria-hidden="true" />
                  {copy.quoteLabel}
                </Button>
              </div>
            )}

            <p className={styles.note}>
              <AlarmClock size={14} className={styles.noteIcon} aria-hidden="true" />
              {copy.note}
            </p>

            {variant === "page" && (
              <div className={styles.map}>
                <iframe
                  title={`Map of ${contact.mapQuery}`}
                  src={mapEmbedSrc(contact.mapQuery)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className={styles.mapFrame}
                />
                <span className={styles.mapLabel}>
                  <MapPin size={12} aria-hidden="true" />
                  {contact.location}
                </span>
              </div>
            )}
          </div>

          <div
            id="quote"
            className={styles.formCard}
            data-reveal
            style={{ "--reveal-delay": "120ms" } as CSSProperties}
          >
            <h3 className={styles.formTitle}>{copy.formTitle}</h3>
            <p className={styles.formSubtitle}>{copy.formSubtitle}</p>
            <QuoteForm email={contact.email} />
          </div>
        </div>
      </div>
    </section>
  );
}
