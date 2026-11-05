import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/ui/Logo/Logo";
import { capabilities, contact, footerExplore, legalLinks } from "@/data/content";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <a href="#top" className={styles.logoLink} aria-label="Professional Waves home">
              <Logo size={72} />
            </a>
            <p className={styles.description}>
              United Arab Emirates&rsquo; premier hub for audio, video, and lighting production,
              delivering turnkey technical solutions for concerts, conferences and exhibitions.
            </p>
            <p className={styles.live}>
              <span className={styles.pulse} aria-hidden="true" />
              Live Operations Active · 24/7 Production Support
            </p>
          </div>

          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className={styles.heading}>
              Explore
            </h2>
            <ul className={styles.list}>
              {footerExplore.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className={styles.link}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={styles.heading}>AVL Capabilities</h2>
            <ul className={styles.list}>
              {capabilities.map((item) => (
                <li key={item} className={styles.capability}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={styles.heading}>Direct Inquiries</h2>
            <address className={styles.contactCard}>
              <div>
                <p className={styles.contactName}>{contact.name}</p>
                <p className={styles.contactRole}>{contact.role}</p>
              </div>
              <a href={contact.phoneHref} className={styles.contactRow}>
                <Phone size={15} aria-hidden="true" />
                {contact.phone}
              </a>
              <a href={contact.emailHref} className={styles.contactRow}>
                <Mail size={15} aria-hidden="true" />
                {contact.email}
              </a>
              <p className={styles.contactRow}>
                <MapPin size={15} aria-hidden="true" />
                {contact.location}
              </p>
            </address>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 Professional Waves. All rights reserved.</p>
          <ul className={styles.legal}>
            {legalLinks.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className={styles.link}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
