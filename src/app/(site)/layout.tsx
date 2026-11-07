import { Suspense, type ReactNode } from "react";
import Footer from "@/components/Footer/Footer";
import Navbar, { CurrentNavbar } from "@/components/Navbar/Navbar";
import { getContent } from "@/lib/content";
import { serviceHref, socialLinks } from "@/lib/content/links";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const content = await getContent();
  const navbar = {
    services: content.services.map((service) => ({
      label: service.title,
      href: serviceHref(service),
    })),
    socials: socialLinks(content.contact),
  };

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {/* Pages added after the build (new services) don't know their URL up front;
          they show the navbar without a highlighted link until it streams in. */}
      <Suspense fallback={<Navbar {...navbar} pathname="" />}>
        <CurrentNavbar {...navbar} />
      </Suspense>
      {children}
      <Footer />
    </>
  );
}
