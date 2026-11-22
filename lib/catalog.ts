import { cache } from "react";
import type { ContentType } from "@/config/content";
import { canOpen } from "@/lib/access";
import { getCurrentUser } from "@/lib/auth";
import { withDB, type DB } from "@/lib/db";
import { ChapterModel } from "@/models/Chapter";
import { ChapterItemModel } from "@/models/ChapterItem";
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
  itemCount: number; // published videos + files
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
  // How many published videos/files each chapter has (only needed on a single class's pages).
  const counts = new Map<string, number>();
  if (classFilter.slug) {
    const rows = await db
      .model(ChapterItemModel)
      .aggregate<{ _id: unknown; n: number }>([
        {
          $match: {
            chapterId: { $in: chapters.map((c) => c._id) },
            isPublished: true,
          },
        },
        { $group: { _id: "$chapterId", n: { $sum: 1 } } },
      ]);
    for (const row of rows) counts.set(String(row._id), row.n);
  }

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
          .map(({ _id, title, slug, part, number }) => ({
            title,
            slug,
            part,
            number,
            itemCount: counts.get(String(_id)) ?? 0,
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

// What the chapter page shows for one video or file.
// `youtubeId` / `url` are only filled in when the viewer may open it, so links
// never reach the browser of someone who isn't allowed (e.g. not signed in).
export type CatalogItem = {
  id: string;
  type: ContentType;
  title: string;
  description?: string;
  youtubeId?: string;
  url?: string;
};

export const getChapter = cache(
  async (classSlug: string, subjectSlug: string, chapterSlug: string) => {
    const user = await getCurrentUser();
    return withDB(async (db) => {
      const cls = await db
        .model(ClassModel)
        .findOne({ slug: classSlug, isPublished: true })
        .lean();
      if (!cls) return null;
      const subject = await db
        .model(SubjectModel)
        .findOne({ classId: cls._id, slug: subjectSlug, isPublished: true })
        .lean();
      if (!subject) return null;
      const chapter = await db
        .model(ChapterModel)
        .findOne({
          subjectId: subject._id,
          slug: chapterSlug,
          isPublished: true,
        })
        .lean();
      if (!chapter) return null;
      const items = await db
        .model(ChapterItemModel)
        .find({ chapterId: chapter._id, isPublished: true })
        .sort(byOrder)
        .lean();

      return {
        cls: { name: cls.name, slug: cls.slug },
        subject: { name: subject.name, slug: subject.slug },
        chapter: {
          title: chapter.title,
          slug: chapter.slug,
          part: chapter.part,
          number: chapter.number,
        },
        signedIn: Boolean(user),
        items: items.map((item): CatalogItem => {
          const open = canOpen(user, item);
          return {
            id: String(item._id),
            type: item.type,
            title: item.title,
            description: item.description || undefined,
            ...(open && item.youtubeId ? { youtubeId: item.youtubeId } : {}),
            ...(open && item.url ? { url: item.url } : {}),
          };
        }),
      };
    });
  },
);
