import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceEditor from "@/components/admin/editors/ServiceEditor";
import { requireAdmin } from "@/lib/auth";
import { readContent } from "@/lib/content";

export const metadata: Metadata = { title: "Edit service" };

type ServiceAdminPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function ServiceAdminPage({ params, searchParams }: ServiceAdminPageProps) {
  await requireAdmin();
  const { slug } = await params;
  const { saved } = await searchParams;
  const { services } = await readContent();
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <ServiceEditor
      // Remount on a slug change so the editor starts from the saved service.
      key={service.slug}
      initial={service}
      otherSlugs={services.filter((item) => item.slug !== slug).map((item) => item.slug)}
      savedAt={typeof saved === "string" && !Number.isNaN(Date.parse(saved)) ? saved : undefined}
    />
  );
}
