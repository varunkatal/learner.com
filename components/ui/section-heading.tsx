import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}
    >
      {eyebrow && (
        <p className="text-sm font-bold tracking-wide text-brand-ink uppercase">
          {eyebrow}
        </p>
      )}
      <Heading
        className={cn(
          "font-extrabold tracking-tight",
          eyebrow && "mt-2",
          Heading === "h1" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
        )}
      >
        {title}
      </Heading>
      {description && <p className="mt-3 text-lg text-body">{description}</p>}
    </div>
  );
}
