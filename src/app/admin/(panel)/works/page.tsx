import type { Metadata } from "next";
import WorksEditor from "@/components/admin/editors/WorksEditor";
import { requireAdmin } from "@/lib/auth";
import { readContent } from "@/lib/content";

export const metadata: Metadata = { title: "Works" };

export default async function WorksAdminPage() {
  await requireAdmin();
  const { works } = await readContent();
  return <WorksEditor initial={works} />;
}
