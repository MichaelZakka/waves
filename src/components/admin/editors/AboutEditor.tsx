"use client";

import { saveContent } from "@/app/admin/actions";
import EditorShell from "@/components/admin/EditorShell/EditorShell";
import { FieldRow, ListField, Panel, RangeField, TextField } from "@/components/admin/Fields/Fields";
import ImageField from "@/components/admin/ImageField/ImageField";
import { useDraft } from "@/components/admin/useDraft";
import { emptyImage, type SiteContent, type TitleText } from "@/lib/content/schema";

type About = SiteContent["about"];

/** Heading + numbered cards; the same editor serves Our Expertise and Why Professional Waves. */
function NumberedSection({
  section,
  onChange,
  itemNoun,
}: {
  section: { eyebrow: string; title: string; items: TitleText[] };
  onChange: (section: { eyebrow: string; title: string; items: TitleText[] }) => void;
  itemNoun: string;
}) {
  return (
    <>
      <FieldRow>
        <TextField label="Small label" value={section.eyebrow} onChange={(eyebrow) => onChange({ ...section, eyebrow })} />
        <TextField label="Heading" value={section.title} onChange={(title) => onChange({ ...section, title })} />
      </FieldRow>
      <ListField
        label="Cards"
        items={section.items}
        onChange={(items) => onChange({ ...section, items })}
        create={() => ({ title: "", text: "" })}
        itemTitle={(item, index) => item.title || `${itemNoun} ${index + 1}`}
        addLabel={`Add ${itemNoun.toLowerCase()}`}
        max={9}
        hint="Cards are numbered automatically in this order."
        renderItem={(item, set) => (
          <>
            <TextField label="Title" value={item.title} onChange={(title) => set({ ...item, title })} />
            <TextField label="Text" multiline rows={3} value={item.text} onChange={(text) => set({ ...item, text })} />
          </>
        )}
      />
    </>
  );
}

export default function AboutEditor({ initial }: { initial: About }) {
  const { value, update, dirty, save, saving, result } = useDraft(initial, (about: About) =>
    saveContent({ about }),
  );

  return (
    <EditorShell
      title="About page"
      description="Edit the About Us page: images, texts and the Experience cards."
      viewHref="/about"
      dirty={dirty}
      saving={saving}
      result={result}
      onSave={save}
    >
      <Panel title="Hero">
        <ImageField
          label="Background image"
          value={value.hero.image}
          onChange={(image) => update((d) => void (d.hero.image = image))}
          defaultAspect="16/9"
          allowEmpty={false}
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
        <TextField label="Headline" value={value.hero.title} onChange={(text) => update((d) => void (d.hero.title = text))} />
        <FieldRow>
          <TextField
            label="Tagline, start"
            value={value.hero.taglineBefore}
            onChange={(text) => update((d) => void (d.hero.taglineBefore = text))}
          />
          <TextField
            label="Tagline, gold word"
            value={value.hero.taglineHighlight}
            onChange={(text) => update((d) => void (d.hero.taglineHighlight = text))}
          />
          <TextField
            label="Tagline, end"
            value={value.hero.taglineAfter}
            onChange={(text) => update((d) => void (d.hero.taglineAfter = text))}
          />
        </FieldRow>
        <TextField
          label="Paragraph"
          multiline
          rows={3}
          value={value.hero.paragraph}
          onChange={(text) => update((d) => void (d.hero.paragraph = text))}
        />
      </Panel>

      <Panel title="Who we are">
        <FieldRow>
          <TextField
            label="Small label"
            value={value.whoWeAre.eyebrow}
            onChange={(text) => update((d) => void (d.whoWeAre.eyebrow = text))}
          />
          <TextField
            label="Heading"
            value={value.whoWeAre.title}
            onChange={(text) => update((d) => void (d.whoWeAre.title = text))}
          />
        </FieldRow>
        <ListField
          label="Paragraphs"
          items={value.whoWeAre.paragraphs}
          onChange={(paragraphs) => update((d) => void (d.whoWeAre.paragraphs = paragraphs))}
          create={() => ""}
          itemTitle={(text, index) => text.slice(0, 60) || `Paragraph ${index + 1}`}
          addLabel="Add paragraph"
          max={6}
          renderItem={(text, set) => (
            <TextField label="Text" multiline rows={4} value={text} onChange={set} />
          )}
        />
        <ImageField
          label="Image"
          value={value.whoWeAre.image}
          onChange={(image) => update((d) => void (d.whoWeAre.image = image))}
          defaultAspect="4/3"
          allowAspect
        />
      </Panel>

      <Panel title="Our experience" description="Photo cards for the kinds of events you cover.">
        <FieldRow>
          <TextField
            label="Small label, underlined word"
            value={value.experience.eyebrowHighlight}
            onChange={(text) => update((d) => void (d.experience.eyebrowHighlight = text))}
          />
          <TextField
            label="Small label, rest"
            value={value.experience.eyebrowRest}
            onChange={(text) => update((d) => void (d.experience.eyebrowRest = text))}
          />
        </FieldRow>
        <TextField
          label="Heading"
          value={value.experience.title}
          onChange={(text) => update((d) => void (d.experience.title = text))}
        />
        <TextField
          label="Intro"
          multiline
          rows={3}
          value={value.experience.intro}
          onChange={(text) => update((d) => void (d.experience.intro = text))}
        />
        <ListField
          label="Experience cards"
          items={value.experience.items}
          onChange={(items) => update((d) => void (d.experience.items = items))}
          create={() => ({ tag: "", title: "", text: "", image: emptyImage() })}
          itemTitle={(item, index) => item.title || `Experience ${index + 1}`}
          addLabel="Add experience"
          max={12}
          renderItem={(item, set) => (
            <>
              <FieldRow>
                <TextField label="Title" value={item.title} onChange={(title) => set({ ...item, title })} />
                <TextField label="Tag on photo" value={item.tag} onChange={(tag) => set({ ...item, tag })} />
              </FieldRow>
              <TextField label="Text" multiline rows={3} value={item.text} onChange={(text) => set({ ...item, text })} />
              <ImageField
                label="Photo"
                value={item.image}
                onChange={(image) => set({ ...item, image })}
                defaultAspect="16/10"
                allowAspect
              />
            </>
          )}
        />
      </Panel>

      <Panel title="Our expertise">
        <NumberedSection
          section={value.expertise}
          onChange={(expertise) => update((d) => void (d.expertise = expertise))}
          itemNoun="Expertise"
        />
      </Panel>

      <Panel title="Why Professional Waves">
        <NumberedSection
          section={value.advantages}
          onChange={(advantages) => update((d) => void (d.advantages = advantages))}
          itemNoun="Reason"
        />
      </Panel>

      <Panel title="Closing banner" description="The &ldquo;Planning your next event?&rdquo; band at the bottom.">
        <FieldRow>
          <TextField label="Heading" value={value.cta.title} onChange={(text) => update((d) => void (d.cta.title = text))} />
          <TextField
            label="Button label"
            value={value.cta.buttonLabel}
            onChange={(text) => update((d) => void (d.cta.buttonLabel = text))}
          />
        </FieldRow>
        <TextField
          label="Text"
          multiline
          rows={3}
          value={value.cta.text}
          onChange={(text) => update((d) => void (d.cta.text = text))}
        />
      </Panel>
    </EditorShell>
  );
}
