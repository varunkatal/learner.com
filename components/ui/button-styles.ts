import { cn } from "@/lib/cn";

// Shared look for <Button> and <ButtonLink>, so links that act as buttons match real buttons.
const variants = {
  primary: "bg-brand text-white hover:bg-brand-hover shadow-sm",
  secondary:
    "bg-white text-ink border border-line hover:border-ink/30 hover:bg-surface",
  ghost: "text-ink hover:bg-lavender",
} as const;

const sizes = {
  md: "h-11 px-5 text-base",
  lg: "h-13 px-7 text-lg",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export function buttonStyles(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}
