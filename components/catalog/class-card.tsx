import Link from "next/link";
import type { CatalogClass } from "@/lib/syllabus";

export function ClassCard({ cls }: { cls: CatalogClass }) {
  const chapterCount = cls.subjects.reduce(
    (sum, s) => sum + s.chapters.length,
    0,
  );

  return (
    <Link
      href={`/classes/${cls.slug}`}
      className="group flex flex-col rounded-card border border-line bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-blush text-2xl font-extrabold text-brand-ink">
        {cls.grade}
      </span>
      <h3 className="mt-5 text-xl font-bold">{cls.name}</h3>
      <p className="mt-1 text-muted">
        {cls.subjects.map((s) => s.name).join(" · ")} · {chapterCount} chapters
      </p>
      <span className="mt-5 font-bold text-brand-ink group-hover:underline">
        View subjects <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
