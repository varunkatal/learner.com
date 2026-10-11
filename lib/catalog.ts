import { getSyllabus } from "@/lib/syllabus";

// The functions pages use to read classes, subjects and chapters.
// Phase 1: read from the static syllabus in lib/syllabus.ts.
// Phase 2: swap these bodies for MongoDB queries — pages won't need to change.
// "use cache" lets Next.js build these pages as static HTML (fast on slow mobile data).

export async function getClasses() {
  "use cache";
  return getSyllabus();
}

export async function getClass(classSlug: string) {
  "use cache";
  return getSyllabus().find((cls) => cls.slug === classSlug) ?? null;
}

export async function getSubject(classSlug: string, subjectSlug: string) {
  "use cache";
  const cls = getSyllabus().find((c) => c.slug === classSlug);
  const subject = cls?.subjects.find((s) => s.slug === subjectSlug);
  if (!cls || !subject) return null;
  return { cls, subject };
}
