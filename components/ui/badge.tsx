import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const tones = {
  brand: "bg-blush text-brand-ink",
  ink: "bg-lavender text-ink",
  success: "bg-success/10 text-[#047857]", // darker green for readable text
  muted: "bg-surface text-muted",
} as const;

export function Badge({
  tone = "brand",
  children,
}: {
  tone?: keyof typeof tones;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
