"use client";

import { useId, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { ChevronDown, ChevronsRight, CircleCheck } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import { eventTypes, serviceOptions } from "@/data/content";
import { emailHref } from "@/lib/content/links";
import { cx } from "@/lib/cx";
import styles from "./QuoteForm.module.css";

type QuoteFormData = {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  services: string[];
  details: string;
};

type TextField = Exclude<keyof QuoteFormData, "services">;
type FieldErrors = Partial<Record<TextField, string>>;

/** Turns the inquiry into a mailto: link addressed to the team, with every field filled in. */
function inquiryMailto(to: string, data: QuoteFormData) {
  const subject = `Quote request: ${data.eventType} – ${data.fullName}`;
  const body = [
    `Full name: ${data.fullName}`,
    `Company: ${data.company || "—"}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Event type: ${data.eventType}`,
    `Estimated event date: ${data.eventDate || "—"}`,
    `Required services: ${data.services.join(", ") || "—"}`,
    "",
    "Event details & venue specs:",
    data.details || "—",
  ].join("\n");
  return `${emailHref(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const initialData: QuoteFormData = {
  fullName: "",
  company: "",
  email: "",
  phone: "",
  eventType: eventTypes[0],
  eventDate: "",
  services: [],
  details: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s()-]+$/;

/** Today as YYYY-MM-DD in the visitor's timezone, for comparing with a date input's value. */
function today() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

// Checks run in on-screen order, so the first key in the result is the first invalid field.
function validate(data: QuoteFormData): FieldErrors {
  const errors: FieldErrors = {};

  if (!data.fullName.trim()) errors.fullName = "Please enter your full name.";

  const email = data.email.trim();
  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email address.";

  const phone = data.phone.trim();
  const digits = phone.replace(/\D/g, "").length;
  if (!phone) errors.phone = "Please enter your phone number.";
  else if (!PHONE_PATTERN.test(phone) || digits < 7 || digits > 15) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (data.eventDate && data.eventDate < today()) {
    errors.eventDate = "Please choose a date that hasn't passed.";
  }

  return errors;
}

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
};

function Field({ id, label, required, optional, error, className, children }: FieldProps) {
  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {" "}
            *
          </span>
        )}
        {optional && <span className={styles.optional}> (optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

/** `email` is the inbox inquiries are addressed to. */
export default function QuoteForm({ email }: { email: string }) {
  const uid = useId();
  const [data, setData] = useState<QuoteFormData>(initialData);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fieldId = (name: keyof QuoteFormData) => `${uid}-${name}`;

  const errorProps = (name: keyof FieldErrors) =>
    errors[name]
      ? { "aria-invalid": true, "aria-describedby": `${fieldId(name)}-error` }
      : {};

  function update(next: QuoteFormData) {
    setData(next);
    // Once someone has tried to submit, keep the messages in step with what they type.
    if (attempted) setErrors(validate(next));
    if (submitted) setSubmitted(false);
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    update({ ...data, [name as TextField]: value });
  }

  function toggleService(service: string) {
    const services = data.services.includes(service)
      ? data.services.filter((item) => item !== service)
      : [...data.services, service];
    update({ ...data, services });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(data);
    setErrors(nextErrors);
    setAttempted(true);

    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      (event.currentTarget.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }

    // No backend yet, so hand the inquiry to the visitor's email app, addressed to the team.
    // TODO: post to an API route or email service instead once one is set up.
    window.location.href = inquiryMailto(email, {
      ...data,
      fullName: data.fullName.trim(),
      company: data.company.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      details: data.details.trim(),
    });

    setData(initialData);
    setAttempted(false);
    setSubmitted(true);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.grid}>
        <Field id={fieldId("fullName")} label="Full Name" required error={errors.fullName}>
          <input
            id={fieldId("fullName")}
            name="fullName"
            type="text"
            autoComplete="name"
            required
            placeholder="e.g. Masoud Al Qaq"
            className={styles.input}
            value={data.fullName}
            onChange={handleChange}
            {...errorProps("fullName")}
          />
        </Field>

        <Field id={fieldId("company")} label="Company Name" optional>
          <input
            id={fieldId("company")}
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="e.g. Agency / Enterprise"
            className={styles.input}
            value={data.company}
            onChange={handleChange}
          />
        </Field>

        <Field id={fieldId("email")} label="Email Address" required error={errors.email}>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="name@domain.com"
            className={styles.input}
            value={data.email}
            onChange={handleChange}
            {...errorProps("email")}
          />
        </Field>

        <Field id={fieldId("phone")} label="Phone Number" required error={errors.phone}>
          <input
            id={fieldId("phone")}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            placeholder="+971 55 179 1376"
            className={styles.input}
            value={data.phone}
            onChange={handleChange}
            {...errorProps("phone")}
          />
        </Field>

        {/* Own row so the select can take the wider share; the default option is long. */}
        <div className={styles.split}>
          <Field id={fieldId("eventType")} label="Event Type">
            <div className={styles.selectWrap}>
              <select
                id={fieldId("eventType")}
                name="eventType"
                className={cx(styles.input, styles.select)}
                value={data.eventType}
                onChange={handleChange}
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className={styles.selectIcon} aria-hidden="true" />
            </div>
          </Field>

          <Field id={fieldId("eventDate")} label="Estimated Event Date" error={errors.eventDate}>
            <input
              id={fieldId("eventDate")}
              name="eventDate"
              type="date"
              className={styles.input}
              value={data.eventDate}
              onChange={handleChange}
              {...errorProps("eventDate")}
            />
          </Field>
        </div>
      </div>

      <fieldset className={styles.fieldset}>
        <legend className={cx(styles.label, styles.legend)}>Required AVL Services</legend>
        <div className={styles.pills}>
          {serviceOptions.map((option) => {
            const checked = data.services.includes(option);
            return (
              <label key={option} className={styles.pill} data-checked={checked}>
                <input
                  type="checkbox"
                  name="services"
                  value={option}
                  checked={checked}
                  onChange={() => toggleService(option)}
                  className={styles.pillInput}
                />
                <span className={styles.pillDot} aria-hidden="true" />
                {option}
              </label>
            );
          })}
        </div>
      </fieldset>

      <Field id={fieldId("details")} label="Event Details & Venue Specs">
        <textarea
          id={fieldId("details")}
          name="details"
          rows={5}
          placeholder="Mention venue (e.g., Coca-Cola Arena, Madinat Jumeirah), expected guest capacity, and any custom technical rider details..."
          className={cx(styles.input, styles.textarea)}
          value={data.details}
          onChange={handleChange}
        />
      </Field>

      <Button type="submit" fullWidth className={styles.submit}>
        Send Inquiry
        <ChevronsRight size={14} aria-hidden="true" />
      </Button>

      <p className={styles.success} role="status">
        {submitted && (
          <>
            <CircleCheck size={18} aria-hidden="true" />
            <span>
              Your email app should now open with your inquiry filled in. Press send there to
              reach our team. If nothing opened, email us at{" "}
              <a href={emailHref(email)}>{email}</a>.
            </span>
          </>
        )}
      </p>
    </form>
  );
}
