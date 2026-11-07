"use client";

import { saveContent } from "@/app/admin/actions";
import AdminLink from "@/components/admin/AdminLink";
import EditorShell from "@/components/admin/EditorShell/EditorShell";
import { FieldRow, ListField, Panel, SelectField, TextField } from "@/components/admin/Fields/Fields";
import { useDraft } from "@/components/admin/useDraft";
import { SOCIAL_LABELS } from "@/lib/content/links";
import { SOCIAL_PLATFORMS, type SiteContent } from "@/lib/content/schema";

type ContactDraft = Pick<SiteContent, "contact" | "contactPage">;

const PLATFORM_OPTIONS = SOCIAL_PLATFORMS.map((platform) => ({
  value: platform,
  label: SOCIAL_LABELS[platform],
}));

const URL_EXAMPLES: Record<(typeof SOCIAL_PLATFORMS)[number], string> = {
  whatsapp: "https://wa.me/971551791376",
  instagram: "https://www.instagram.com/yourname",
  facebook: "https://www.facebook.com/yourpage",
  linkedin: "https://www.linkedin.com/company/yourcompany",
  youtube: "https://www.youtube.com/@yourchannel",
  tiktok: "https://www.tiktok.com/@yourname",
  x: "https://x.com/yourname",
};

export default function ContactEditor({ initial }: { initial: ContactDraft }) {
  const { value, update, dirty, save, saving, result } = useDraft(initial, (draft: ContactDraft) =>
    saveContent(draft),
  );
  const contact = value.contact;

  return (
    <EditorShell
      title="Contact & socials"
      description={
        <>
          Contact details shown on every page (contact card, footer, menu icons) and the Contact
          page heading. The texts beside the quote form are under{" "}
          <AdminLink href="/admin/home">Home page → Contact section</AdminLink>.
        </>
      }
      viewHref="/contact"
      dirty={dirty}
      saving={saving}
      result={result}
      onSave={save}
    >
      <Panel title="Contact person">
        <FieldRow>
          <TextField label="Name" value={contact.name} onChange={(name) => update((d) => void (d.contact.name = name))} />
          <TextField
            label="Initials (avatar)"
            value={contact.initials}
            maxLength={3}
            onChange={(initials) => update((d) => void (d.contact.initials = initials.toUpperCase()))}
          />
          <TextField label="Role" value={contact.role} onChange={(role) => update((d) => void (d.contact.role = role))} />
        </FieldRow>
      </Panel>

      <Panel title="Contact details">
        <FieldRow>
          <TextField
            label="Phone"
            type="tel"
            value={contact.phone}
            onChange={(phone) => update((d) => void (d.contact.phone = phone))}
            hint="Used for the Call buttons too."
          />
          <TextField
            label="Email"
            type="email"
            value={contact.email}
            onChange={(email) => update((d) => void (d.contact.email = email))}
            hint="Quote requests are addressed to this inbox."
          />
        </FieldRow>
        <FieldRow>
          <TextField
            label="Website (as shown)"
            value={contact.website}
            placeholder="www.example.com"
            onChange={(website) => update((d) => void (d.contact.website = website))}
          />
          <TextField
            label="Website link"
            type="url"
            value={contact.websiteUrl}
            placeholder="https://www.example.com"
            onChange={(url) => update((d) => void (d.contact.websiteUrl = url))}
          />
        </FieldRow>
        <TextField
          label="Location"
          value={contact.location}
          onChange={(location) => update((d) => void (d.contact.location = location))}
        />
        <TextField
          label="Map location"
          value={contact.mapQuery}
          placeholder="Office address, or a city"
          onChange={(query) => update((d) => void (d.contact.mapQuery = query))}
          hint="What the map on the Contact page shows. An exact address puts a pin on your office."
        />
      </Panel>

      <Panel title="Social media" description="Shown as icons in the menu, in this order, followed by an email icon.">
        <ListField
          label="Social links"
          items={contact.socials}
          onChange={(socials) => update((d) => void (d.contact.socials = socials))}
          create={() => ({ platform: "instagram" as const, url: "" })}
          itemTitle={(social) => SOCIAL_LABELS[social.platform]}
          addLabel="Add social link"
          max={10}
          renderItem={(social, set) => (
            <FieldRow>
              <SelectField
                label="Platform"
                value={social.platform}
                options={PLATFORM_OPTIONS}
                onChange={(platform) => set({ ...social, platform })}
              />
              <TextField
                label="Link"
                type="url"
                value={social.url}
                placeholder={URL_EXAMPLES[social.platform]}
                onChange={(url) => set({ ...social, url })}
              />
            </FieldRow>
          )}
        />
      </Panel>

      <Panel title="Contact page heading">
        <FieldRow>
          <TextField
            label="Small label"
            value={value.contactPage.eyebrow}
            onChange={(text) => update((d) => void (d.contactPage.eyebrow = text))}
          />
          <TextField
            label="Heading"
            value={value.contactPage.title}
            onChange={(text) => update((d) => void (d.contactPage.title = text))}
          />
        </FieldRow>
        <TextField
          label="Intro"
          multiline
          rows={3}
          value={value.contactPage.text}
          onChange={(text) => update((d) => void (d.contactPage.text = text))}
        />
      </Panel>
    </EditorShell>
  );
}
