import type { Metadata } from "next";
import AboutEditor from "@/components/admin/editors/AboutEditor";
import { requireAdmin } from "@/lib/auth";
import { readContent } from "@/lib/content";

export const metadata: Metadata = { title: "About page" };

export default async function AboutAdminPage() {
  await requireAdmin();
  const { about } = await readContent();
  return <AboutEditor initial={about} />;
}
