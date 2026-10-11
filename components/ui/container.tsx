import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// Centres content and sets the page's side padding (16px on phones).
export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}
