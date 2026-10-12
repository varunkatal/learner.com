"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

// A submit button that disables itself while its form is being saved,
// so a slow connection doesn't lead to double clicks.
export function PendingButton({
  disabled,
  ...props
}: ComponentProps<"button">) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
      {...props}
    />
  );
}
