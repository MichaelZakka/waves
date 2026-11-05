import About from "@/components/About/About";
import ContactSection from "@/components/ContactSection/ContactSection";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";
import Navbar from "@/components/Navbar/Navbar";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import Services from "@/components/Services/Services";
import Stats from "@/components/Stats/Stats";
import WhyChoose from "@/components/WhyChoose/WhyChoose";

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Stats />
        <About />
        <Services />
        <WhyChoose />
        <ContactSection />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
