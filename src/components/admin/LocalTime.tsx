"use client";

/** A date in the viewer's own timezone (the server's may differ). */
export default function LocalTime({ iso, dateOnly = false }: { iso: string; dateOnly?: boolean }) {
  const date = new Date(iso);
  const text = dateOnly
    ? date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
    : date.toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
  return (
    <time dateTime={iso} suppressHydrationWarning>
      {text}
    </time>
  );
}
