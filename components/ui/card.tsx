import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type CardProps = ComponentProps<"div"> & { tone?: "white" | "lavender" };

export function Card({ tone = "white", className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-line p-6",
        tone === "white" ? "bg-white shadow-card" : "bg-lavender",
        className,
      )}
      {...props}
    />
  );
}
