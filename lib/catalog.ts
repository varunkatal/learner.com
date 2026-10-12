import { cache } from "react";
import { withDB, type DB } from "@/lib/db";
import { ChapterModel } from "@/models/Chapter";
import { ClassModel } from "@/models/Class";
import { SubjectModel } from "@/models/Subject";

// The functions public pages use to read classes, subjects and chapters from MongoDB.
// Only published items are returned: hidden ones stay visible in the admin panel only.
// Pages that call these must be dynamic (`export const dynamic = "force-dynamic"`),
// so edits in the admin panel show up straight away.

export type CatalogChapter = {
  title: string;
  slug: string;
  part: number; // textbook part (1 or 2)
  number: number; // chapter number within its part, as printed in the book
};

export type CatalogSubject = {
  name: string;
  slug: string;
  book?: string;
  chapters: CatalogChapter[];
};

export type CatalogClass = {
  name: string;
  slug: string;
  badge: string; // short label for the class card, e.g. "9" for "Class 9"
  subjects: CatalogSubject[];
};

const byOrder = { order: 1, _id: 1 } as const;

// Three queries on one connection: classes, then their subjects, then those subjects' chapters.
async function loadClasses(
  db: DB,
  classFilter: { slug?: string },
): Promise<CatalogClass[]> {
  const classes = await db
    .model(ClassModel)
    .find({ ...classFilter, isPublished: true })
    .sort(byOrder)
    .lean();
  const subjects = await db
    .model(SubjectModel)
    .find({ classId: { $in: classes.map((c) => c._id) }, isPublished: true })
    .sort(byOrder)
    .lean();
  const chapters = await db
    .model(ChapterModel)
    .find({ subjectId: { $in: subjects.map((s) => s._id) }, isPublished: true })
    .sort(byOrder)
    .lean();

  return classes.map((cls) => ({
    name: cls.name,
    slug: cls.slug,
    badge: cls.name.match(/\d+/)?.[0] ?? cls.name.charAt(0),
    subjects: subjects
      .filter((s) => s.classId.equals(cls._id))
      .map((subject) => ({
        name: subject.name,
        slug: subject.slug,
        book: subject.book || undefined,
        chapters: chapters
          .filter((c) => c.subjectId.equals(subject._id))
          .map(({ title, slug, part, number }) => ({
            title,
            slug,
            part,
            number,
          })),
      })),
  }));
}

// `cache` makes repeat calls in the same request (e.g. generateMetadata and the page)
// share one result, so a page opens only one database connection.
export const getClasses = cache(() => withDB((db) => loadClasses(db, {})));

export const getClass = cache(async (classSlug: string) => {
  const [cls] = await withDB((db) => loadClasses(db, { slug: classSlug }));
  return cls ?? null;
});

export const getSubject = cache(
  async (classSlug: string, subjectSlug: string) => {
    const cls = await getClass(classSlug);
    const subject = cls?.subjects.find((s) => s.slug === subjectSlug);
    if (!cls || !subject) return null;
    return { cls, subject };
  },
);
