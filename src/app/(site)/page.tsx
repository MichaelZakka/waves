import About from "@/components/About/About";
import ContactSection from "@/components/ContactSection/ContactSection";
import Hero from "@/components/Hero/Hero";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import Services from "@/components/Services/Services";
import Stats from "@/components/Stats/Stats";
import WhyChoose from "@/components/WhyChoose/WhyChoose";

export default function Home() {
  return (
    <>
      <main id="main" tabIndex={-1}>
        <Hero />
        <Stats />
        <About />
        <Services />
        <WhyChoose />
        <ContactSection />
      </main>
      <ScrollReveal />
    </>
  );
}
