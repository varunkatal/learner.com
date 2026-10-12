import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type FieldProps = ComponentProps<"input"> & { label: string; hint?: string };

// A labelled text input. The label wraps the input, so no id is needed
// (several forms on one page can share field names).
export function Field({ label, hint, className, ...props }: FieldProps) {
  return (
    <label className={cn("block", className)}>
      <span className="font-semibold text-ink">{label}</span>
      {hint && <span className="block text-sm text-muted">{hint}</span>}
      <input
        className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3 text-base text-ink focus:border-brand-ink"
        {...props}
      />
    </label>
  );
}
