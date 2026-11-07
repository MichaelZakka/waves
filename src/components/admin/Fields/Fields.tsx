"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, X } from "lucide-react";
import { cx } from "@/lib/cx";
import styles from "./Fields.module.css";

/* Small form controls shared by the admin editors. */

/* ---------- Panel ---------- */

type PanelProps = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
};

/** A titled card grouping the fields for one section of a page. */
export function Panel({ title, description, children }: PanelProps) {
  const id = useId();
  return (
    <section className={styles.panel} aria-labelledby={id}>
      <header className={styles.panelHeader}>
        <h2 id={id} className={styles.panelTitle}>
          {title}
        </h2>
        {description && <p className={styles.panelDescription}>{description}</p>}
      </header>
      <div className={styles.panelBody}>{children}</div>
    </section>
  );
}

/** Lays fields out side by side on wide screens. */
export function FieldRow({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}

/* ---------- Text ---------- */

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: ReactNode;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  maxLength?: number;
  type?: "text" | "email" | "url" | "tel";
};

export function TextField({
  label,
  value,
  onChange,
  hint,
  multiline = false,
  rows = 4,
  placeholder,
  maxLength = multiline ? 2000 : 200,
  type = "text",
}: TextFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const shared = {
    id,
    value,
    placeholder,
    maxLength,
    className: styles.input,
    "aria-describedby": hint ? hintId : undefined,
  };

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          rows={rows}
          className={cx(styles.input, styles.textarea)}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input {...shared} type={type} onChange={(event) => onChange(event.target.value)} />
      )}
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
    </div>
  );
}

/* ---------- Select ---------- */

type SelectFieldProps<T extends string> = {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
};

export function SelectField<T extends string>({ label, value, options, onChange }: SelectFieldProps<T>) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        className={cx(styles.input, styles.select)}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ---------- Range ---------- */

type RangeFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (value: number) => string;
  onChange: (value: number) => void;
  hint?: ReactNode;
};

export function RangeField({ label, value, min, max, step = 1, format, onChange, hint }: RangeFieldProps) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        <output htmlFor={id} className={styles.output}>
          {format ? format(value) : value}
        </output>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        className={styles.range}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}

/* ---------- Tags ---------- */

type TagsFieldProps = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  max?: number;
};

/** A short list of words (e.g. a project's services), added with Enter. */
export function TagsField({ label, values, onChange, placeholder, max = 10 }: TagsFieldProps) {
  const id = useId();
  const [entry, setEntry] = useState("");

  function add() {
    const tag = entry.trim();
    if (!tag || values.includes(tag) || values.length >= max) return;
    onChange([...values, tag]);
    setEntry("");
  }

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.tags}>
        {values.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
            <button
              type="button"
              className={styles.tagRemove}
              aria-label={`Remove ${tag}`}
              onClick={() => onChange(values.filter((value) => value !== tag))}
            >
              <X size={12} aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={entry}
          placeholder={placeholder}
          maxLength={60}
          className={cx(styles.input, styles.tagInput)}
          onChange={(event) => setEntry(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          onBlur={add}
        />
      </div>
      <p className={styles.hint}>Press Enter after each one.</p>
    </div>
  );
}

/* ---------- Lists ---------- */

type ListFieldProps<T> = {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  /** A fresh item for the Add button. */
  create: () => T;
  /** Fields for one item; `set` replaces it. */
  renderItem: (item: T, set: (item: T) => void, index: number) => ReactNode;
  itemTitle: (item: T, index: number) => string;
  addLabel?: string;
  max?: number;
  min?: number;
  hint?: ReactNode;
};

/** An editable list: add, remove, reorder and collapse items. */
export function ListField<T>({
  label,
  items,
  onChange,
  create,
  renderItem,
  itemTitle,
  addLabel = "Add item",
  max = 20,
  min = 0,
  hint,
}: ListFieldProps<T>) {
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

  function move(index: number, direction: -1 | 1) {
    const next = [...items];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    onChange(next);
  }

  function remove(index: number) {
    if (!window.confirm(`Remove "${itemTitle(items[index], index)}"?`)) return;
    onChange(items.filter((_, i) => i !== index));
    setCollapsed(new Set());
  }

  function toggle(index: number) {
    const next = new Set(collapsed);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setCollapsed(next);
  }

  return (
    <div className={styles.list}>
      <div className={styles.listHeader}>
        <span className={styles.label}>{label}</span>
        <span className={styles.count}>
          {items.length} / {max}
        </span>
      </div>
      {hint && <p className={styles.hint}>{hint}</p>}

      {items.length === 0 && <p className={styles.empty}>Nothing here yet.</p>}

      <ol className={styles.items}>
        {items.map((item, index) => {
          const title = itemTitle(item, index);
          const isCollapsed = collapsed.has(index);
          return (
            <li key={index} className={styles.item}>
              <div className={styles.itemHeader}>
                <button
                  type="button"
                  className={styles.itemToggle}
                  aria-expanded={!isCollapsed}
                  onClick={() => toggle(index)}
                >
                  <span className={styles.itemIndex}>{index + 1}</span>
                  <span className={styles.itemTitle}>{title}</span>
                </button>
                <div className={styles.itemActions}>
                  <button
                    type="button"
                    className={styles.iconButton}
                    aria-label={`Move "${title}" up`}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ChevronUp size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className={styles.iconButton}
                    aria-label={`Move "${title}" down`}
                    disabled={index === items.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ChevronDown size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className={cx(styles.iconButton, styles.danger)}
                    aria-label={`Remove "${title}"`}
                    disabled={items.length <= min}
                    onClick={() => remove(index)}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
              {!isCollapsed && (
                <div className={styles.itemBody}>
                  {renderItem(
                    item,
                    (next) => onChange(items.map((current, i) => (i === index ? next : current))),
                    index,
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        className={styles.addButton}
        disabled={items.length >= max}
        onClick={() => onChange([...items, create()])}
      >
        <Plus size={16} aria-hidden="true" />
        {addLabel}
      </button>
    </div>
  );
}
