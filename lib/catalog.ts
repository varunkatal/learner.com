import { getSyllabus } from "@/lib/syllabus";

// The functions pages use to read classes, subjects and chapters.
// Phase 1: read from the static syllabus in lib/syllabus.ts.
// Phase 2: swap these bodies for MongoDB queries — pages won't need to change.
// Pages call these at build time (via generateStaticParams), so they ship as static HTML.

export async function getClasses() {
  return getSyllabus();
}

export async function getClass(classSlug: string) {
  return getSyllabus().find((cls) => cls.slug === classSlug) ?? null;
}

export async function getSubject(classSlug: string, subjectSlug: string) {
  const cls = getSyllabus().find((c) => c.slug === classSlug);
  const subject = cls?.subjects.find((s) => s.slug === subjectSlug);
  if (!cls || !subject) return null;
  return { cls, subject };
}
