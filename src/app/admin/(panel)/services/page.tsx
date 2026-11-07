import type { Metadata } from "next";
import ServicesManager from "@/components/admin/editors/ServicesManager";
import { requireAdmin } from "@/lib/auth";
import { readContent } from "@/lib/content";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesAdminPage() {
  await requireAdmin();
  const { services, servicesPage } = await readContent();
  return (
    <ServicesManager
      initialPage={servicesPage}
      services={services.map(({ slug, title, description, image }) => ({ slug, title, description, image }))}
    />
  );
}
