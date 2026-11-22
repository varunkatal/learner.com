import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { CatalogChapter } from "@/lib/catalog";

// Chapters grouped by textbook part. Each row opens the chapter page (videos, notes, PPT, worksheets).
export function ChapterList({
  chapters,
  basePath,
}: {
  chapters: CatalogChapter[];
  basePath: string; // e.g. /classes/class-8/maths
}) {
  const parts = [...new Set(chapters.map((c) => c.part))];
  const showPartHeadings = parts.length > 1;

  return (
    <div className="space-y-10">
      {parts.map((part) => (
        <section
          key={part}
          aria-labelledby={showPartHeadings ? `part-${part}` : undefined}
        >
          {showPartHeadings && (
            <h2 id={`part-${part}`} className="mb-4 text-lg font-bold">
              Part {part === 1 ? "I" : "II"}
            </h2>
          )}
          <ol className="divide-y divide-line overflow-hidden rounded-card border border-line bg-white shadow-card">
            {chapters
              .filter((c) => c.part === part)
              .map((chapter) => (
                <li key={chapter.slug}>
                  <Link
                    href={`${basePath}/${chapter.slug}`}
                    className="flex items-center gap-4 p-4 hover:bg-surface sm:p-5"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lavender font-bold text-ink">
                      {chapter.number}
                    </span>
                    <span className="min-w-0 flex-1 font-semibold text-ink">
                      {chapter.title}
                    </span>
                    <span className="hidden shrink-0 sm:block">
                      {chapter.itemCount > 0 ? (
                        <Badge tone="ink">
                          {chapter.itemCount}{" "}
                          {chapter.itemCount === 1 ? "item" : "items"}
                        </Badge>
                      ) : (
                        <Badge tone="muted">Coming soon</Badge>
                      )}
                    </span>
                    <span aria-hidden className="shrink-0 text-xl text-muted">
                      ›
                    </span>
                  </Link>
                </li>
              ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
