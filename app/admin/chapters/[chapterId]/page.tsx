import { notFound } from "next/navigation";
import { saveChapter, saveItem } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { Field } from "@/components/admin/field";
import { ItemFields } from "@/components/admin/item-fields";
import { ItemList } from "@/components/admin/item-list";
import { contentTypes } from "@/config/content";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card } from "@/components/ui/card";
import { adminPath } from "@/lib/admin";
import { withDB } from "@/lib/db";
import { isObjectId } from "@/lib/validators/catalog";
import { ChapterModel } from "@/models/Chapter";
import { ChapterItemModel } from "@/models/ChapterItem";
import { ClassModel } from "@/models/Class";
import { SubjectModel } from "@/models/Subject";

export default async function AdminChapterPage({
  params,
}: PageProps<"/admin/chapters/[chapterId]">) {
  const { chapterId } = await params;
  if (!isObjectId(chapterId)) notFound();

  const data = await withDB(async (db) => {
    const chapter = await db.model(ChapterModel).findById(chapterId).lean();
    if (!chapter) return null;
    const subject = await db
      .model(SubjectModel)
      .findById(chapter.subjectId)
      .lean();
    const [cls, items] = await Promise.all([
      subject ? db.model(ClassModel).findById(subject.classId).lean() : null,
      db
        .model(ChapterItemModel)
        .find({ chapterId })
        .sort({ order: 1, _id: 1 })
        .lean(),
    ]);
    return { chapter, subject, cls, items };
  });
  if (!data) notFound();
  const { chapter, subject, cls, items } = data;

  return (
    <>
      <div className="mt-4">
        <Breadcrumbs
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Classes", href: "/admin/classes" },
            ...(cls
              ? [{ label: cls.name, href: adminPath("class", String(cls._id)) }]
              : []),
            ...(subject
              ? [
                  {
                    label: subject.name,
                    href: adminPath("subject", String(subject._id)),
                  },
                ]
              : []),
            { label: chapter.title },
          ]}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-extrabold">{chapter.title}</h1>
        <Badge tone={chapter.isPublished ? "success" : "muted"}>
          {chapter.isPublished ? "Published" : "Hidden"}
        </Badge>
      </div>
      <p className="mt-1 text-muted">
        Part {chapter.part} · Chapter {chapter.number}
      </p>

      <h2 className="mt-8 text-2xl font-bold">Content</h2>
      <p className="mt-1 text-muted">
        Students see these as tabs on the chapter page. New items are published
        straight away; use Hide to take one off the website.
      </p>
      {contentTypes.map((t) => (
        <section key={t.id} className="mt-6">
          <h3 className="text-lg font-bold">
            {t.icon} {t.label}
          </h3>
          <ItemList
            kind="item"
            emptyText="Nothing yet."
            items={items
              .filter((item) => item.type === t.id)
              .map((item) => ({
                id: String(item._id),
                label: item.title,
                detail: item.description || undefined,
                isPublished: item.isPublished,
              }))}
          />
        </section>
      ))}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-bold">Add content</h2>
          <div className="mt-4">
            <AdminForm
              action={saveItem}
              submitLabel="Add"
              successText="Added."
              resetOnSuccess
            >
              <input type="hidden" name="chapterId" value={chapterId} />
              <ItemFields />
            </AdminForm>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold">Edit chapter</h2>
          <div className="mt-4">
            <AdminForm
              action={saveChapter}
              submitLabel="Save changes"
              successText="Saved."
            >
              <input type="hidden" name="id" value={chapterId} />
              <Field
                label="Title"
                name="title"
                defaultValue={chapter.title}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Book part"
                  name="part"
                  type="number"
                  min={1}
                  max={99}
                  defaultValue={chapter.part}
                  required
                />
                <Field
                  label="Chapter number"
                  name="number"
                  type="number"
                  min={1}
                  max={99}
                  defaultValue={chapter.number}
                  required
                />
              </div>
              <Field
                label="Web address"
                hint={`Used in the link: …/${chapter.slug}. Changing it breaks old links.`}
                name="slug"
                defaultValue={chapter.slug}
              />
            </AdminForm>
          </div>
          <div className="mt-6 border-t border-line pt-6">
            <DeleteButton kind="chapter" id={chapterId} label={chapter.title} />
          </div>
        </Card>
      </div>
    </>
  );
}
