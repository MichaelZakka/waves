import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import ServicesPage from "@/components/ServicesPage/ServicesPage";

export const metadata: Metadata = {
  title: "Services | Professional Waves",
  description:
    "Professional audio, video & LED, lighting and technical support services for events across the UAE.",
};

export default function Page() {
  return (
    <>
      <main id="main" tabIndex={-1}>
        <ServicesPage />
      </main>
      <ScrollReveal />
    </>
  );
}
