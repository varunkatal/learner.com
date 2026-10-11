import Link from "next/link";
import type { CatalogSubject } from "@/lib/syllabus";

export function SubjectCard({
  classSlug,
  subject,
}: {
  classSlug: string;
  subject: CatalogSubject;
}) {
  return (
    <Link
      href={`/classes/${classSlug}/${subject.slug}`}
      className="group flex items-center gap-5 rounded-card border border-line bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <span
        className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-lavender text-ink"
        aria-hidden="true"
      >
        <SubjectIcon slug={subject.slug} />
      </span>
      <div className="min-w-0">
        <h2 className="text-xl font-bold">{subject.name}</h2>
        <p className="mt-1 text-muted">
          NCERT <em>{subject.book}</em> · {subject.chapters.length} chapters
        </p>
      </div>
      <span
        className="ml-auto text-2xl text-brand-ink transition group-hover:translate-x-1"
        aria-hidden="true"
      >
        →
      </span>
    </Link>
  );
}

function SubjectIcon({ slug }: { slug: string }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "size-8",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (slug === "science") {
    // flask
    return (
      <svg {...common}>
        <path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3" />
        <path d="M7.5 15h9" />
      </svg>
    );
  }
  // maths: plus, minus, times, equals
  return (
    <svg {...common}>
      <path d="M7 4v6M4 7h6M14 7h6M5 15l4 4M9 15l-4 4M14 16h6M14 19h6" />
    </svg>
  );
}
