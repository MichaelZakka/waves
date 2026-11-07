import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro/PageIntro";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import ContactCta from "@/components/WorksPage/ContactCta/ContactCta";
import ProjectCard from "@/components/WorksPage/ProjectCard/ProjectCard";
import { getContent } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Our Work | Professional Waves",
  description:
    "Events Professional Waves has helped bring to life with professional sound, lighting, and screen solutions across the UAE.",
};

export default async function WorksPage() {
  const { intro, projects } = (await getContent()).works;

  return (
    <>
      <main id="main" tabIndex={-1}>
        <PageIntro
          id="works-title"
          eyebrow={intro.eyebrow}
          title={intro.title}
          text={intro.text}
        />
        <div className={styles.projects}>
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
        <ContactCta />
      </main>
      <ScrollReveal />
    </>
  );
}
