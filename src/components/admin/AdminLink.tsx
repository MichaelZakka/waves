"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { confirmLeave } from "./useDraft";

/** A link inside the admin that asks before discarding unsaved edits. */
export default function AdminLink(props: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        confirmLeave(event);
        props.onClick?.(event);
      }}
    />
  );
}
