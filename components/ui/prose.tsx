import type { ReactNode } from "react";

// Readable styling for long text pages (About, legal pages) without extra plugins.
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-3xl text-base leading-7 [&_a]:font-semibold [&_a]:text-brand-ink [&_a]:underline [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_li]:mt-1.5 [&_p]:mt-4 [&_strong]:text-ink [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
      {children}
    </div>
  );
}
