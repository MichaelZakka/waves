import type { Metadata } from "next";
import HomeEditor from "@/components/admin/editors/HomeEditor";
import { requireAdmin } from "@/lib/auth";
import { readContent } from "@/lib/content";

export const metadata: Metadata = { title: "Home page" };

export default async function HomeAdminPage() {
  await requireAdmin();
  const { home } = await readContent();
  return <HomeEditor initial={home} />;
}
