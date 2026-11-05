import type { CSSProperties } from "react";
import { AlarmClock, Globe, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import { contact } from "@/data/content";
import QuoteForm from "./QuoteForm";
import styles from "./ContactSection.module.css";

const details = [
  { icon: Phone, label: contact.phone, href: contact.phoneHref },
  { icon: Mail, label: contact.email, href: contact.emailHref },
  { icon: Globe, label: contact.website, href: contact.websiteHref },
  { icon: MapPin, label: contact.location },
];

export default function ContactSection() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className={styles.inner}>
        <div className={styles.panel}>
          <div className={styles.info} data-reveal>
            <SectionHeading
              id="contact-title"
              eyebrow="Direct Production Inquiry"
              title={
                <>
                  Let&rsquo;s Create Something <em>Extraordinary</em>
                </>
              }
              tone="light"
              uppercase={false}
            />
            <p className={styles.intro}>
              Tell us about your upcoming event and the audio, video, lighting, or technical
              support you need. Our team will be happy to discuss your requirements.
            </p>

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
                        {label}
                      </a>
                    ) : (
                      <span>{label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.actions}>
              <Button href={contact.phoneHref} variant="secondary" size="sm" className={styles.action}>
                <Phone size={12} aria-hidden="true" />
                Call Us
              </Button>
              <Button href="#quote" size="sm" className={styles.action}>
                <MessageSquare size={12} aria-hidden="true" />
                Get in Touch
              </Button>
            </div>

            <p className={styles.note}>
              <AlarmClock size={14} className={styles.noteIcon} aria-hidden="true" />
              Typical RFP &amp; technical quote turnaround: within 4 hours
            </p>
          </div>

          <div
            id="quote"
            className={styles.formCard}
            data-reveal
            style={{ "--reveal-delay": "120ms" } as CSSProperties}
          >
            <h3 className={styles.formTitle}>Request a Quote</h3>
            <p className={styles.formSubtitle}>
              Fill in your production details below for immediate technical feasibility review.
            </p>
            <QuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
}
