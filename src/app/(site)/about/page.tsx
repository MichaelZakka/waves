import type { Metadata } from "next";
import AboutHero from "@/components/AboutPage/AboutHero/AboutHero";
import Experience from "@/components/AboutPage/Experience/Experience";
import NumberedCards from "@/components/AboutPage/NumberedCards/NumberedCards";
import PlanCta from "@/components/AboutPage/PlanCta/PlanCta";
import WhoWeAre from "@/components/AboutPage/WhoWeAre/WhoWeAre";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us | Professional Waves",
  description:
    "Meet Professional Waves: 13+ years of audio, video and lighting production for corporate, entertainment and sporting events across the UAE.",
};

export default async function AboutPage() {
  const { expertise, advantages } = (await getContent()).about;

  return (
    <>
      <main id="main" tabIndex={-1}>
        <AboutHero />
        <WhoWeAre />
        <Experience />
        <NumberedCards
          id="expertise"
          eyebrow={expertise.eyebrow}
          title={expertise.title}
          items={expertise.items}
        />
        <NumberedCards
          id="advantages"
          eyebrow={advantages.eyebrow}
          title={advantages.title}
          items={advantages.items}
        />
        <PlanCta />
      </main>
      <ScrollReveal />
    </>
  );
}
