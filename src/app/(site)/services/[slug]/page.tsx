import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import ServiceDetail from "@/components/ServiceDetail/ServiceDetail";
import { getContent } from "@/lib/content";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

async function findService(slug: string) {
  const { services } = await getContent();
  return services.find((item) => item.slug === slug);
}

export async function generateStaticParams() {
  const { services } = await getContent();
  // Cache Components needs at least one entry; an unknown slug just 404s.
  if (services.length === 0) return [{ slug: "none" }];
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = await findService((await params).slug);
  if (!service) return {};
  return {
    title: `${service.title} | Professional Waves`,
    description: service.subtitle,
  };
}

async function ServiceContent({ params }: ServicePageProps) {
  const service = await findService((await params).slug);
  if (!service) notFound();
  return <ServiceDetail service={service} />;
}

export default function ServicePage({ params }: ServicePageProps) {
  return (
    <>
      <main id="main" tabIndex={-1}>
        {/* Services added from the admin after the build aren't prerendered; their
            content streams in behind this placeholder. Built ones render in full. */}
        <Suspense fallback={<div style={{ minHeight: "100vh" }} aria-busy="true" />}>
          <ServiceContent params={params} />
        </Suspense>
      </main>
      <ScrollReveal />
    </>
  );
}
