"use client";

import { saveContent } from "@/app/admin/actions";
import EditorShell from "@/components/admin/EditorShell/EditorShell";
import { FieldRow, ListField, Panel, TagsField, TextField } from "@/components/admin/Fields/Fields";
import ImageField from "@/components/admin/ImageField/ImageField";
import { useDraft } from "@/components/admin/useDraft";
import { emptyImage, type Project, type SiteContent } from "@/lib/content/schema";

type Works = SiteContent["works"];

function newProject(): Project {
  return {
    label: "",
    title: "",
    location: "",
    date: "",
    services: [],
    description: "",
    shots: [
      { caption: "", note: "", image: emptyImage() },
      { caption: "", note: "", image: emptyImage() },
    ],
  };
}

export default function WorksEditor({ initial }: { initial: Works }) {
  const { value, update, dirty, save, saving, result } = useDraft(initial, (works: Works) =>
    saveContent({ works }),
  );

  return (
    <EditorShell
      title="Works"
      description="Add or remove projects on the Works page, and edit their details and photos."
      viewHref="/works"
      dirty={dirty}
      saving={saving}
      result={result}
      onSave={save}
    >
      <Panel title="Page heading">
        <FieldRow>
          <TextField
            label="Small label"
            value={value.intro.eyebrow}
            onChange={(text) => update((d) => void (d.intro.eyebrow = text))}
          />
          <TextField
            label="Heading"
            value={value.intro.title}
            onChange={(text) => update((d) => void (d.intro.title = text))}
          />
        </FieldRow>
        <TextField
          label="Intro"
          multiline
          rows={2}
          value={value.intro.text}
          onChange={(text) => update((d) => void (d.intro.text = text))}
        />
      </Panel>

      <Panel title="Projects" description="Shown in this order, newest first is usually best.">
        <ListField
          label="Projects"
          items={value.projects}
          onChange={(projects) => update((d) => void (d.projects = projects))}
          create={newProject}
          itemTitle={(project, index) => project.title || `Project ${index + 1}`}
          addLabel="Add project"
          max={50}
          renderItem={(project, set) => (
            <>
              <FieldRow>
                <TextField label="Project name" value={project.title} onChange={(title) => set({ ...project, title })} />
                <TextField
                  label="Badge"
                  value={project.label}
                  placeholder="Featured Production"
                  onChange={(label) => set({ ...project, label })}
                />
              </FieldRow>
              <FieldRow>
                <TextField
                  label="Location"
                  value={project.location}
                  onChange={(location) => set({ ...project, location })}
                />
                <TextField
                  label="Date"
                  value={project.date}
                  placeholder="December 2025"
                  onChange={(date) => set({ ...project, date })}
                />
              </FieldRow>
              <TagsField
                label="Services provided"
                values={project.services}
                placeholder="e.g. Sound"
                onChange={(services) => set({ ...project, services })}
              />
              <TextField
                label="Description"
                multiline
                rows={3}
                value={project.description}
                onChange={(description) => set({ ...project, description })}
              />
              <ListField
                label="Photos"
                items={project.shots}
                onChange={(shots) => set({ ...project, shots })}
                create={() => ({ caption: "", note: "", image: emptyImage() })}
                itemTitle={(shot, index) => shot.caption || `Photo ${index + 1}`}
                addLabel="Add photo"
                max={8}
                renderItem={(shot, setShot) => (
                  <>
                    <FieldRow>
                      <TextField label="Caption" value={shot.caption} onChange={(caption) => setShot({ ...shot, caption })} />
                      <TextField label="Small note" value={shot.note} onChange={(note) => setShot({ ...shot, note })} />
                    </FieldRow>
                    <ImageField
                      label="Photo"
                      value={shot.image}
                      onChange={(image) => setShot({ ...shot, image })}
                      defaultAspect="16/10"
                      allowAspect
                    />
                  </>
                )}
              />
            </>
          )}
        />
      </Panel>

      <Panel title="Closing panel" description="The &ldquo;Planning your next event?&rdquo; panel under the projects.">
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
