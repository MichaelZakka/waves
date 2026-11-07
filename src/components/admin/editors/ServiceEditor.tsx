"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2, WandSparkles } from "lucide-react";
import { deleteService, saveService } from "@/app/admin/actions";
import AdminLink from "@/components/admin/AdminLink";
import EditorShell from "@/components/admin/EditorShell/EditorShell";
import { FieldRow, ListField, Panel, TextField } from "@/components/admin/Fields/Fields";
import ImageField from "@/components/admin/ImageField/ImageField";
import { useDraft } from "@/components/admin/useDraft";
import { emptyImage, type Service } from "@/lib/content/schema";
import styles from "./ServiceEditor.module.css";

/** "Video & LED Solutions" → "video-led-solutions" */
function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type ServiceEditorProps = {
  initial: Service;
  /** Slugs used by the other services, to warn about clashes before saving. */
  otherSlugs: string[];
  /** Set when a save just moved this editor to a new address, to keep showing "Saved". */
  savedAt?: string;
};

export default function ServiceEditor({ initial, otherSlugs, savedAt }: ServiceEditorProps) {
  const router = useRouter();
  const [deleting, startDelete] = useTransition();
  const { value, update, dirty, save, saving, result } = useDraft(
    initial,
    async (service: Service) => {
      const outcome = await saveService(initial.slug, service);
      // A new slug means a new address for this editor too.
      if (outcome.ok && outcome.slug && outcome.slug !== initial.slug) {
        router.replace(`/admin/services/${outcome.slug}?saved=${encodeURIComponent(outcome.savedAt)}`);
      }
      return outcome;
    },
    savedAt ? { ok: true, savedAt } : null,
  );

  const slugTaken = otherSlugs.includes(value.slug);

  return (
    <EditorShell
      title={value.title || "Untitled service"}
      description={
        <>
          Edit this service&rsquo;s card and its own page.{" "}
          <AdminLink href="/admin/services">Back to all services</AdminLink>
        </>
      }
      viewHref={`/services/${initial.slug}`}
      dirty={dirty}
      saving={saving}
      result={result}
      onSave={save}
      actions={
        <button
          type="button"
          className={styles.deleteButton}
          disabled={deleting}
          onClick={() => {
            if (!window.confirm(`Delete "${value.title}"? Its page will be removed from the site.`)) return;
            startDelete(async () => {
              const outcome = await deleteService(initial.slug);
              if (outcome.ok) router.push("/admin/services");
              else window.alert(outcome.message);
            });
          }}
        >
          <Trash2 size={15} aria-hidden="true" />
          Delete service
        </button>
      }
    >
      <Panel title="Card" description="How the service appears on the home page and the Services page.">
        <TextField label="Name" value={value.title} onChange={(title) => update((d) => void (d.title = title))} />
        <div className={styles.slugRow}>
          <TextField
            label="Page address"
            value={value.slug}
            onChange={(slug) => update((d) => void (d.slug = slug.toLowerCase()))}
            hint={
              slugTaken ? (
                <span className={styles.warning}>Another service already uses this address.</span>
              ) : (
                <>
                  The page lives at <strong>/services/{value.slug || "…"}</strong>. Changing it changes
                  the link, so update anywhere you&rsquo;ve shared it.
                </>
              )
            }
          />
          <button
            type="button"
            className={styles.slugButton}
            onClick={() => update((d) => void (d.slug = slugify(d.title)))}
          >
            <WandSparkles size={14} aria-hidden="true" />
            Make from name
          </button>
        </div>
        <TextField
          label="Card text"
          multiline
          rows={2}
          value={value.description}
          onChange={(description) => update((d) => void (d.description = description))}
        />
        <ImageField
          label="Card image"
          value={value.image}
          onChange={(image) => update((d) => void (d.image = image))}
          defaultAspect="6/7"
          hint="Text sits over the bottom of the photo, which is darkened."
        />
      </Panel>

      <Panel title="Page header">
        <FieldRow>
          <TextField label="Small label" value={value.badge} onChange={(badge) => update((d) => void (d.badge = badge))} />
        </FieldRow>
        <TextField
          label="Subtitle"
          multiline
          rows={2}
          value={value.subtitle}
          onChange={(subtitle) => update((d) => void (d.subtitle = subtitle))}
        />
      </Panel>

      <Panel title="Photos" description="Shown two per row under the page header. Leave a photo empty to keep its frame as a placeholder.">
        <ListField
          label="Photos"
          items={value.gallery}
          onChange={(gallery) => update((d) => void (d.gallery = gallery))}
          create={emptyImage}
          itemTitle={(image, index) => image.alt || (image.src ? `Photo ${index + 1}` : `Empty frame ${index + 1}`)}
          addLabel="Add photo"
          max={12}
          renderItem={(image, set) => (
            <ImageField label="Photo" value={image} onChange={set} defaultAspect="16/11" allowAspect />
          )}
        />
      </Panel>

      <Panel title="Overview">
        <TextField
          label="Overview paragraph"
          multiline
          rows={5}
          value={value.overview}
          onChange={(overview) => update((d) => void (d.overview = overview))}
        />
      </Panel>

      <Panel title="Key capabilities">
        <TextField
          label="Small label above the heading"
          value={value.capabilitiesEyebrow}
          onChange={(text) => update((d) => void (d.capabilitiesEyebrow = text))}
        />
        <ListField
          label="Capabilities"
          items={value.capabilities}
          onChange={(capabilities) => update((d) => void (d.capabilities = capabilities))}
          create={() => ({ title: "", text: "" })}
          itemTitle={(item, index) => item.title || `Capability ${index + 1}`}
          addLabel="Add capability"
          max={12}
          hint="Numbered automatically in this order."
          renderItem={(item, set) => (
            <>
              <TextField label="Title" value={item.title} onChange={(title) => set({ ...item, title })} />
              <TextField label="Text" multiline rows={3} value={item.text} onChange={(text) => set({ ...item, text })} />
            </>
          )}
        />
      </Panel>
    </EditorShell>
  );
}
