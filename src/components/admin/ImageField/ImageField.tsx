"use client";

import { useId, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { ImageOff, LoaderCircle, RotateCcw, Trash2, Upload } from "lucide-react";
import { RangeField, SelectField, TextField } from "@/components/admin/Fields/Fields";
import SiteImage from "@/components/ui/SiteImage/SiteImage";
import type { ImageAspect, SiteImage as SiteImageData } from "@/lib/content/schema";
import { cx } from "@/lib/cx";
import styles from "./ImageField.module.css";

const ASPECT_OPTIONS: { value: ImageAspect; label: string }[] = [
  { value: "auto", label: "Layout default" },
  { value: "16/9", label: "Wide (16:9)" },
  { value: "4/3", label: "Standard (4:3)" },
  { value: "1/1", label: "Square (1:1)" },
  { value: "3/4", label: "Portrait (3:4)" },
];

type ImageFieldProps = {
  label: string;
  value: SiteImageData;
  onChange: (value: SiteImageData) => void;
  /** The frame's shape on the site, used for the preview when the aspect is "auto". */
  defaultAspect: string;
  /** Show the frame-shape picker (only for frames whose shape can change). */
  allowAspect?: boolean;
  /** Whether the image can be removed, leaving an empty frame. */
  allowEmpty?: boolean;
  hint?: string;
};

type UploadResponse = { src: string; blurDataURL: string } | { error: string };

export default function ImageField({
  label,
  value,
  onChange,
  defaultAspect,
  allowAspect = false,
  allowEmpty = true,
  hint,
}: ImageFieldProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const statusId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aspect = value.aspect === "auto" ? defaultAspect : value.aspect;
  const hasImage = Boolean(value.src);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await response.json().catch(() => ({ error: "Upload failed." }))) as UploadResponse;
      if (!response.ok || "error" in data) {
        setError("error" in data ? data.error : "Upload failed.");
        return;
      }
      // A new photo starts centred and unzoomed; the old description no longer fits it.
      onChange({ ...value, src: data.src, blurDataURL: data.blurDataURL, alt: "", focalX: 50, focalY: 50, zoom: 1 });
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function setFocal(x: number, y: number) {
    const clamp = (n: number) => Math.round(Math.min(100, Math.max(0, n)));
    onChange({ ...value, focalX: clamp(x), focalY: clamp(y) });
  }

  function onPreviewClick(event: MouseEvent<HTMLDivElement>) {
    if (!hasImage) return;
    const box = event.currentTarget.getBoundingClientRect();
    setFocal(((event.clientX - box.left) / box.width) * 100, ((event.clientY - box.top) / box.height) * 100);
  }

  function onPreviewKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 10 : 2;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    setFocal(value.focalX + move[0], value.focalY + move[1]);
  }

  return (
    <div className={styles.field}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <div className={styles.actions}>
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            className={styles.fileInput}
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
            }}
          />
          <button
            type="button"
            className={styles.button}
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
          >
            {uploading ? (
              <LoaderCircle size={15} className={styles.spin} aria-hidden="true" />
            ) : (
              <Upload size={15} aria-hidden="true" />
            )}
            {uploading ? "Uploading…" : hasImage ? "Replace image" : "Upload image"}
          </button>
          {allowEmpty && hasImage && (
            <button
              type="button"
              className={cx(styles.button, styles.danger)}
              onClick={() => {
                if (window.confirm("Remove this image? The frame will show empty.")) {
                  onChange({ ...value, src: "", alt: "", blurDataURL: undefined });
                }
              }}
            >
              <Trash2 size={15} aria-hidden="true" />
              Remove
            </button>
          )}
        </div>
      </div>
      {hint && <p className={styles.hint}>{hint}</p>}
      <p id={statusId} className={styles.error} role="alert">
        {error}
      </p>

      <div className={styles.body}>
        <div
          className={cx(styles.preview, hasImage && styles.interactive)}
          // Width capped from the ratio, so tall frames stay ≤ 360px high without distorting.
          style={{ aspectRatio: aspect, maxWidth: `calc(360px * (${aspect}))` }}
          onClick={onPreviewClick}
          onKeyDown={onPreviewKeyDown}
          tabIndex={hasImage ? 0 : -1}
          role={hasImage ? "group" : undefined}
          aria-label={hasImage ? "Focal point: click or use the arrow keys to choose what stays in view" : undefined}
        >
          {hasImage ? (
            <>
              <SiteImage image={value} sizes="420px" />
              <span
                className={styles.focal}
                style={{ left: `${value.focalX}%`, top: `${value.focalY}%` }}
                aria-hidden="true"
              />
            </>
          ) : (
            <span className={styles.placeholder}>
              <ImageOff size={22} aria-hidden="true" />
              No image. The frame shows empty on the site.
            </span>
          )}
        </div>

        {hasImage && (
          <div className={styles.controls}>
            <fieldset className={styles.fit}>
              <legend className={styles.label}>Size in frame</legend>
              <div className={styles.segmented}>
                {(
                  [
                    ["cover", "Fill frame"],
                    ["contain", "Show whole image"],
                  ] as const
                ).map(([fit, text]) => (
                  <label key={fit} className={cx(styles.segment, value.fit === fit && styles.selected)}>
                    <input
                      type="radio"
                      name={`${statusId}-fit`}
                      value={fit}
                      checked={value.fit === fit}
                      onChange={() => onChange({ ...value, fit })}
                    />
                    {text}
                  </label>
                ))}
              </div>
            </fieldset>

            <RangeField
              label="Zoom"
              value={value.zoom}
              min={1}
              max={3}
              step={0.05}
              format={(zoom) => `${Math.round(zoom * 100)}%`}
              onChange={(zoom) => onChange({ ...value, zoom })}
            />

            {allowAspect && (
              <SelectField
                label="Frame shape"
                value={value.aspect}
                options={ASPECT_OPTIONS}
                onChange={(next) => onChange({ ...value, aspect: next })}
              />
            )}

            <div className={styles.focalRow}>
              <span className={styles.hint}>
                Focus: {value.focalX}% across, {value.focalY}% down. Click the preview to change it.
              </span>
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => onChange({ ...value, focalX: 50, focalY: 50, zoom: 1 })}
              >
                <RotateCcw size={13} aria-hidden="true" />
                Reset
              </button>
            </div>

            <TextField
              label="Description (for screen readers)"
              value={value.alt}
              onChange={(alt) => onChange({ ...value, alt })}
              placeholder="e.g. Stage with LED screens and lighting at night"
              hint={value.alt ? undefined : "Describe the image in a few words."}
            />
          </div>
        )}
      </div>
    </div>
  );
}
