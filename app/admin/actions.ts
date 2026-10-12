"use server";

import type { Model, Types } from "mongoose";
import type { ZodError } from "zod";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { adminPath, type CatalogKind } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import { withDB, type DB } from "@/lib/db";
import { slugify } from "@/lib/syllabus";
import {
  chapterInput,
  classInput,
  deleteInput,
  moveInput,
  publishInput,
  subjectInput,
  type FormState,
} from "@/lib/validators/catalog";
import { ChapterModel } from "@/models/Chapter";
import { ClassModel } from "@/models/Class";
import { SubjectModel } from "@/models/Subject";

// Server Actions for the admin panel's course structure.
// Anyone can POST to a Server Action directly, so each one checks the admin role itself.

// The fields every level shares, so reordering, publishing and deleting can be written once.
type CatalogItem = {
  _id: Types.ObjectId;
  order: number;
  classId?: Types.ObjectId;
  subjectId?: Types.ObjectId;
};
type ParentField = "classId" | "subjectId";

const levels: Record<
  CatalogKind,
  {
    model: Model<CatalogItem>;
    parent: { field: ParentField; kind: CatalogKind } | null;
    child: { model: Model<CatalogItem>; field: ParentField } | null;
  }
> = {
  class: {
    model: ClassModel as unknown as Model<CatalogItem>,
    parent: null,
    child: {
      model: SubjectModel as unknown as Model<CatalogItem>,
      field: "classId",
    },
  },
  subject: {
    model: SubjectModel as unknown as Model<CatalogItem>,
    parent: { field: "classId", kind: "class" },
    child: {
      model: ChapterModel as unknown as Model<CatalogItem>,
      field: "subjectId",
    },
  },
  chapter: {
    model: ChapterModel as unknown as Model<CatalogItem>,
    parent: { field: "subjectId", kind: "subject" },
    child: null, // Phase 3: lessons go here, so chapters with lessons can't be deleted
  },
};

function fail(error: ZodError | string): FormState {
  return {
    ok: false,
    error: typeof error === "string" ? error : error.issues[0].message,
  };
}

function isDuplicateKey(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

// Runs a change and turns a duplicate web address into a friendly message.
// `change` returns an error message, or nothing when it worked.
async function save(change: (db: DB) => Promise<string | void>) {
  try {
    const error = await withDB(change);
    if (error) return fail(error);
  } catch (error) {
    if (isDuplicateKey(error)) {
      return fail("That web address is already used here. Try another one.");
    }
    throw error;
  }
  refresh(); // reload the admin page so the change shows
  return { ok: true } as const;
}

// New items go to the end of their list.
async function nextOrder(model: Model<CatalogItem>, filter: object) {
  const last = await model.findOne(filter).sort({ order: -1 }).lean();
  return (last?.order ?? 0) + 1;
}

export async function saveClass(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = classInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(parsed.error);
  const { id, name } = parsed.data;
  const slug = parsed.data.slug || slugify(name);
  if (!slug) return fail("Please use some letters or numbers in the name.");

  return save(async (db) => {
    const Class = db.model(ClassModel);
    if (id) {
      const { matchedCount } = await Class.updateOne(
        { _id: id },
        { name, slug },
      );
      if (!matchedCount) return "This class no longer exists.";
    } else {
      const order = await nextOrder(db.model(levels.class.model), {});
      await Class.create({ name, slug, order, isPublished: false });
    }
  });
}

export async function saveSubject(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = subjectInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(parsed.error);
  const { id, classId, name, book } = parsed.data;
  const slug = parsed.data.slug || slugify(name);
  if (!slug) return fail("Please use some letters or numbers in the name.");

  return save(async (db) => {
    const Subject = db.model(SubjectModel);
    if (id) {
      const { matchedCount } = await Subject.updateOne(
        { _id: id },
        { name, slug, book },
      );
      if (!matchedCount) return "This subject no longer exists.";
    } else {
      if (!classId || !(await db.model(ClassModel).exists({ _id: classId }))) {
        return "This class no longer exists.";
      }
      const order = await nextOrder(db.model(levels.subject.model), {
        classId,
      });
      await Subject.create({
        classId,
        name,
        slug,
        book,
        order,
        isPublished: false,
      });
    }
  });
}

export async function saveChapter(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = chapterInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(parsed.error);
  const { id, subjectId, title, part, number } = parsed.data;
  const slug = parsed.data.slug || slugify(title);
  if (!slug) return fail("Please use some letters or numbers in the title.");

  return save(async (db) => {
    const Chapter = db.model(ChapterModel);
    if (id) {
      const { matchedCount } = await Chapter.updateOne(
        { _id: id },
        { title, slug, part, number },
      );
      if (!matchedCount) return "This chapter no longer exists.";
    } else {
      if (
        !subjectId ||
        !(await db.model(SubjectModel).exists({ _id: subjectId }))
      ) {
        return "This subject no longer exists.";
      }
      const order = await nextOrder(db.model(levels.chapter.model), {
        subjectId,
      });
      await Chapter.create({
        subjectId,
        title,
        slug,
        part,
        number,
        order,
        isPublished: false,
      });
    }
  });
}

// Swaps an item with its neighbour, then renumbers the whole list 1, 2, 3…
// so the order stays clean even if two items once shared a number.
export async function moveItem(formData: FormData) {
  await requireAdmin();
  const { kind, id, direction } = moveInput.parse(Object.fromEntries(formData));
  const { model, parent } = levels[kind];

  await withDB(async (db) => {
    const Item = db.model(model);
    const item = await Item.findById(id).lean();
    if (!item) return;
    const siblings = await Item.find(
      parent ? { [parent.field]: item[parent.field] } : {},
    )
      .sort({ order: 1, _id: 1 })
      .select("_id")
      .lean();
    const from = siblings.findIndex((s) => s._id.equals(item._id));
    const to = direction === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= siblings.length) return;
    [siblings[from], siblings[to]] = [siblings[to], siblings[from]];
    await Item.bulkWrite(
      siblings.map((s, index) => ({
        updateOne: { filter: { _id: s._id }, update: { order: index + 1 } },
      })),
    );
  });
  refresh();
}

// Hidden items stay in the admin panel but won't appear on the website.
export async function setPublished(formData: FormData) {
  await requireAdmin();
  const { kind, id, publish } = publishInput.parse(
    Object.fromEntries(formData),
  );
  await withDB((db) =>
    db
      .model(levels[kind].model)
      .updateOne({ _id: id }, { isPublished: publish }),
  );
  refresh();
}

// Only empty items can be deleted, so a click can't wipe out a whole subject's chapters.
export async function deleteItem(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = deleteInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(parsed.error);
  const { kind, id } = parsed.data;
  const { model, parent, child } = levels[kind];

  const result = await withDB(
    async (db): Promise<{ error: string } | { goTo: string }> => {
      const item = await db.model(model).findById(id).lean();
      if (!item) return { goTo: "/admin/classes" };
      if (
        child &&
        (await db.model(child.model).exists({ [child.field]: item._id }))
      ) {
        return {
          error: `Delete everything inside this ${kind} first. To take it off the website, use Hide instead.`,
        };
      }
      await db.model(model).deleteOne({ _id: id });
      const parentId = parent && item[parent.field];
      return {
        goTo:
          parent && parentId
            ? adminPath(parent.kind, String(parentId))
            : "/admin/classes",
      };
    },
  );

  if ("error" in result) return fail(result.error);
  redirect(result.goTo);
}
