"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp, ExternalLink, ImageOff, Pencil, Plus, Trash2 } from "lucide-react";
import {
  createService,
  deleteService,
  moveService,
  saveContent,
  type SaveResult,
} from "@/app/admin/actions";
import AdminLink from "@/components/admin/AdminLink";
import EditorShell from "@/components/admin/EditorShell/EditorShell";
import { FieldRow, Panel, TextField } from "@/components/admin/Fields/Fields";
import { useDraft } from "@/components/admin/useDraft";
import SiteImage from "@/components/ui/SiteImage/SiteImage";
import { serviceHref } from "@/lib/content/links";
import type { Service, SiteContent } from "@/lib/content/schema";
import styles from "./ServicesManager.module.css";

type ServicesPage = SiteContent["servicesPage"];

type ServicesManagerProps = {
  initialPage: ServicesPage;
  services: Pick<Service, "slug" | "title" | "description" | "image">[];
};

export default function ServicesManager({ initialPage, services }: ServicesManagerProps) {
  const router = useRouter();
  const [busy, startAction] = useTransition();
  const [listError, setListError] = useState<string | null>(null);
  const { value, update, dirty, save, saving, result } = useDraft(
    initialPage,
    (servicesPage: ServicesPage) => saveContent({ servicesPage }),
  );

  // List changes save straight away; refresh to show the stored order.
  function run(action: () => Promise<SaveResult | void>) {
    setListError(null);
    startAction(async () => {
      const outcome = await action();
      if (outcome && !outcome.ok) setListError(outcome.message);
      router.refresh();
    });
  }

  return (
    <EditorShell
      title="Services"
      description="Add, remove and reorder services, and edit the Services page heading. Services appear on the home page, the Services page, the menu and their own pages."
      viewHref="/services"
      dirty={dirty}
      saving={saving}
      result={result}
      onSave={save}
    >
      <Panel
        title="Services"
        description="Changes to this list are saved immediately. Open a service to edit its card and its own page."
      >
        {listError && (
          <p className={styles.error} role="alert">
            {listError}
          </p>
        )}
        <ol className={styles.list} aria-busy={busy}>
          {services.map((service, index) => (
            <li key={service.slug} className={styles.row}>
              <div className={styles.thumb}>
                {service.image.src ? (
                  <SiteImage image={service.image} sizes="96px" />
                ) : (
                  <ImageOff size={18} aria-hidden="true" />
                )}
              </div>
              <div className={styles.info}>
                <AdminLink href={`/admin/services/${service.slug}`} className={styles.title}>
                  {service.title}
                </AdminLink>
                <span className={styles.url}>{serviceHref(service)}</span>
              </div>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label={`Move ${service.title} up`}
                  disabled={busy || index === 0}
                  onClick={() => run(() => moveService(service.slug, -1))}
                >
                  <ChevronUp size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label={`Move ${service.title} down`}
                  disabled={busy || index === services.length - 1}
                  onClick={() => run(() => moveService(service.slug, 1))}
                >
                  <ChevronDown size={16} aria-hidden="true" />
                </button>
                <a
                  href={serviceHref(service)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.iconButton}
                  aria-label={`View ${service.title} on the site`}
                >
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
                <AdminLink
                  href={`/admin/services/${service.slug}`}
                  className={styles.iconButton}
                  aria-label={`Edit ${service.title}`}
                >
                  <Pencil size={16} aria-hidden="true" />
                </AdminLink>
                <button
                  type="button"
                  className={`${styles.iconButton} ${styles.danger}`}
                  aria-label={`Delete ${service.title}`}
                  disabled={busy}
                  onClick={() => {
                    if (window.confirm(`Delete "${service.title}"? Its page will be removed from the site.`)) {
                      run(() => deleteService(service.slug));
                    }
                  }}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ol>
        {services.length === 0 && <p className={styles.empty}>No services yet.</p>}
        <button
          type="button"
          className={styles.addButton}
          disabled={busy || services.length >= 24}
          onClick={() => run(() => createService())}
        >
          <Plus size={16} aria-hidden="true" />
          Add service
        </button>
      </Panel>

      <Panel title="Services page heading" description="The heading at the top of the Services page.">
        <FieldRow>
          <TextField label="Heading" value={value.title} onChange={(title) => update((d) => void (d.title = title))} />
          <TextField
            label="Subtitle"
            value={value.subtitle}
            onChange={(subtitle) => update((d) => void (d.subtitle = subtitle))}
          />
        </FieldRow>
        <TextField
          label="Side note"
          multiline
          rows={2}
          value={value.aside}
          onChange={(aside) => update((d) => void (d.aside = aside))}
        />
      </Panel>
    </EditorShell>
  );
}
