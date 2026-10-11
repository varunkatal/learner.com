import { Badge } from "@/components/ui/badge";
import type { CatalogChapter } from "@/lib/syllabus";

// Chapters grouped by textbook part. Lessons arrive in Phase 2, so each row says "coming soon" for now.
export function ChapterList({ chapters }: { chapters: CatalogChapter[] }) {
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
                <li
                  key={chapter.slug}
                  className="flex items-center gap-4 p-4 sm:p-5"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lavender font-bold text-ink">
                    {chapter.number}
                  </span>
                  <span className="min-w-0 flex-1 font-semibold text-ink">
                    {chapter.title}
                  </span>
                  <span className="hidden shrink-0 sm:block">
                    <Badge tone="muted">Lessons coming soon</Badge>
                  </span>
                </li>
              ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
