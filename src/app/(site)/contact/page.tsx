import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection/ContactSection";
import PageIntro from "@/components/PageIntro/PageIntro";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getContent } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact Us | Professional Waves",
  description:
    "Talk to Professional Waves about sound, lighting, and video equipment for your next event in Dubai, Abu Dhabi, and across the UAE.",
};

export default async function ContactPage() {
  const { contactPage } = await getContent();

  return (
    <>
      <main id="main" tabIndex={-1}>
        <PageIntro
          id="contact-page-title"
          eyebrow={contactPage.eyebrow}
          title={contactPage.title}
          text={contactPage.text}
        />
        <div className={styles.body}>
          <ContactSection variant="page" />
        </div>
      </main>
      <ScrollReveal />
    </>
  );
}
