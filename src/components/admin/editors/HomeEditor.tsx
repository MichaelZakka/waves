"use client";

import { saveContent } from "@/app/admin/actions";
import AdminLink from "@/components/admin/AdminLink";
import EditorShell from "@/components/admin/EditorShell/EditorShell";
import { FieldRow, ListField, Panel, RangeField, TextField } from "@/components/admin/Fields/Fields";
import ImageField from "@/components/admin/ImageField/ImageField";
import { useDraft } from "@/components/admin/useDraft";
import type { SiteContent } from "@/lib/content/schema";

type Home = SiteContent["home"];

export default function HomeEditor({ initial }: { initial: Home }) {
  const { value, update, dirty, save, saving, result } = useDraft(initial, (home: Home) =>
    saveContent({ home }),
  );

  return (
    <EditorShell
      title="Home page"
      description="Edit the hero, highlights, sections and texts on the home page."
      viewHref="/"
      dirty={dirty}
      saving={saving}
      result={result}
      onSave={save}
    >
      <Panel title="Hero" description="The large photo and headline at the top of the page.">
        <ImageField
          label="Background image"
          value={value.hero.image}
          onChange={(image) => update((d) => void (d.hero.image = image))}
          defaultAspect="16/9"
          allowEmpty={false}
          hint="Use a wide photo, at least 1920px across. Text sits over the bottom-left, which is darkened."
        />
        <RangeField
          label="Height"
          value={value.hero.height}
          min={50}
          max={100}
          step={5}
          format={(height) => `${height}% of the screen`}
          onChange={(height) => update((d) => void (d.hero.height = height))}
        />
        <FieldRow>
          <TextField
            label="Headline, line 1"
            value={value.hero.titleLine1}
            onChange={(text) => update((d) => void (d.hero.titleLine1 = text))}
          />
          <TextField
            label="Headline, line 2"
            value={value.hero.titleLine2}
            onChange={(text) => update((d) => void (d.hero.titleLine2 = text))}
          />
        </FieldRow>
        <FieldRow>
          <TextField
            label="Subtitle, line 1"
            value={value.hero.subtitleLine1}
            onChange={(text) => update((d) => void (d.hero.subtitleLine1 = text))}
          />
          <TextField
            label="Subtitle, line 2"
            value={value.hero.subtitleLine2}
            onChange={(text) => update((d) => void (d.hero.subtitleLine2 = text))}
          />
        </FieldRow>
        <TextField
          label="Button label"
          value={value.hero.ctaLabel}
          onChange={(text) => update((d) => void (d.hero.ctaLabel = text))}
          hint="The button scrolls to the contact form."
        />
      </Panel>

      <Panel title="Highlights strip" description="Short facts in the band under the hero.">
        <ListField
          label="Highlights"
          items={value.infoItems}
          onChange={(items) => update((d) => void (d.infoItems = items))}
          create={() => ({ label: "", value: "" })}
          itemTitle={(item, index) => item.label || `Highlight ${index + 1}`}
          addLabel="Add highlight"
          max={8}
          renderItem={(item, set) => (
            <FieldRow>
              <TextField label="Label" value={item.label} onChange={(label) => set({ ...item, label })} />
              <TextField label="Text" value={item.value} onChange={(text) => set({ ...item, value: text })} />
            </FieldRow>
          )}
        />
      </Panel>

      <Panel title="Stats" description="The large gold figures below the highlights.">
        <ListField
          label="Stats"
          items={value.stats}
          onChange={(items) => update((d) => void (d.stats = items))}
          create={() => ({ value: "", label: "", caption: "" })}
          itemTitle={(item, index) => [item.value, item.label].filter(Boolean).join(" · ") || `Stat ${index + 1}`}
          addLabel="Add stat"
          max={8}
          renderItem={(item, set) => (
            <FieldRow>
              <TextField label="Figure" value={item.value} placeholder="13+" onChange={(text) => set({ ...item, value: text })} />
              <TextField label="Label" value={item.label} onChange={(label) => set({ ...item, label })} />
              <TextField label="Caption" value={item.caption} onChange={(caption) => set({ ...item, caption })} />
            </FieldRow>
          )}
        />
      </Panel>

      <Panel title="About section">
        <FieldRow>
          <TextField
            label="Heading"
            value={value.about.title}
            onChange={(text) => update((d) => void (d.about.title = text))}
          />
          <TextField
            label="Button label"
            value={value.about.ctaLabel}
            onChange={(text) => update((d) => void (d.about.ctaLabel = text))}
          />
        </FieldRow>
        <TextField
          label="Lead line"
          value={value.about.lead}
          onChange={(text) => update((d) => void (d.about.lead = text))}
        />
        <TextField
          label="Paragraph"
          multiline
          value={value.about.body}
          onChange={(text) => update((d) => void (d.about.body = text))}
        />
        <ImageField
          label="Image"
          value={value.about.image}
          onChange={(image) => update((d) => void (d.about.image = image))}
          defaultAspect="6/5"
          allowAspect
        />
      </Panel>

      <Panel
        title="Services section"
        description={
          <>
            The heading above the service cards. To add, remove or edit services, go to{" "}
            <AdminLink href="/admin/services">Services</AdminLink>.
          </>
        }
      >
        <FieldRow>
          <TextField
            label="Heading"
            value={value.services.title}
            onChange={(text) => update((d) => void (d.services.title = text))}
          />
          <TextField
            label="Subtitle"
            value={value.services.subtitle}
            onChange={(text) => update((d) => void (d.services.subtitle = text))}
          />
        </FieldRow>
      </Panel>

      <Panel title="Why choose us">
        <FieldRow>
          <TextField
            label="Small label"
            value={value.why.eyebrow}
            onChange={(text) => update((d) => void (d.why.eyebrow = text))}
          />
          <TextField
            label="Heading"
            value={value.why.title}
            onChange={(text) => update((d) => void (d.why.title = text))}
          />
        </FieldRow>
        <TextField
          label="Intro"
          multiline
          rows={3}
          value={value.why.subtitle}
          onChange={(text) => update((d) => void (d.why.subtitle = text))}
        />
        <ListField
          label="Cards"
          items={value.why.cards}
          onChange={(cards) => update((d) => void (d.why.cards = cards))}
          create={() => ({ title: "", text: "", tag: "" })}
          itemTitle={(card, index) => card.title || `Card ${index + 1}`}
          addLabel="Add card"
          max={8}
          hint="Cards are numbered automatically in this order."
          renderItem={(card, set) => (
            <>
              <FieldRow>
                <TextField label="Title" value={card.title} onChange={(title) => set({ ...card, title })} />
                <TextField label="Footer tag" value={card.tag} onChange={(tag) => set({ ...card, tag })} />
              </FieldRow>
              <TextField label="Text" multiline rows={3} value={card.text} onChange={(text) => set({ ...card, text })} />
            </>
          )}
        />
      </Panel>

      <Panel
        title="Contact section"
        description={
          <>
            The texts beside the quote form, used on both the home page and the Contact page. Names,
            phone, email and socials are under{" "}
            <AdminLink href="/admin/contact">Contact &amp; socials</AdminLink>.
          </>
        }
      >
        <FieldRow>
          <TextField
            label="Small label"
            value={value.contact.eyebrow}
            onChange={(text) => update((d) => void (d.contact.eyebrow = text))}
          />
          <TextField
            label="Heading"
            value={value.contact.titleStart}
            onChange={(text) => update((d) => void (d.contact.titleStart = text))}
          />
          <TextField
            label="Heading, gold word"
            value={value.contact.titleHighlight}
            onChange={(text) => update((d) => void (d.contact.titleHighlight = text))}
          />
        </FieldRow>
        <TextField
          label="Intro"
          multiline
          rows={3}
          value={value.contact.intro}
          onChange={(text) => update((d) => void (d.contact.intro = text))}
        />
        <FieldRow>
          <TextField
            label="Call button"
            value={value.contact.callLabel}
            onChange={(text) => update((d) => void (d.contact.callLabel = text))}
          />
          <TextField
            label="Quote button"
            value={value.contact.quoteLabel}
            onChange={(text) => update((d) => void (d.contact.quoteLabel = text))}
          />
        </FieldRow>
        <TextField
          label="Response-time note"
          value={value.contact.note}
          onChange={(text) => update((d) => void (d.contact.note = text))}
        />
        <FieldRow>
          <TextField
            label="Form title"
            value={value.contact.formTitle}
            onChange={(text) => update((d) => void (d.contact.formTitle = text))}
          />
          <TextField
            label="Form subtitle"
            value={value.contact.formSubtitle}
            onChange={(text) => update((d) => void (d.contact.formSubtitle = text))}
          />
        </FieldRow>
      </Panel>
    </EditorShell>
  );
}
