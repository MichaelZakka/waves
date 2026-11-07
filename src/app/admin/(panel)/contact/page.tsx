import type { Metadata } from "next";
import ContactEditor from "@/components/admin/editors/ContactEditor";
import { requireAdmin } from "@/lib/auth";
import { readContent } from "@/lib/content";

export const metadata: Metadata = { title: "Contact & socials" };

export default async function ContactAdminPage() {
  await requireAdmin();
  const { contact, contactPage } = await readContent();
  return <ContactEditor initial={{ contact, contactPage }} />;
}
