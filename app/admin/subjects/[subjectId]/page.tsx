import { notFound } from "next/navigation";
import { saveChapter, saveSubject } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { Field } from "@/components/admin/field";
import { ItemList } from "@/components/admin/item-list";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card } from "@/components/ui/card";
import { adminPath } from "@/lib/admin";
import { withDB } from "@/lib/db";
import { isObjectId } from "@/lib/validators/catalog";
import { ChapterModel } from "@/models/Chapter";
import { ClassModel } from "@/models/Class";
import { SubjectModel } from "@/models/Subject";

export default async function AdminSubjectPage({
  params,
}: PageProps<"/admin/subjects/[subjectId]">) {
  const { subjectId } = await params;
  if (!isObjectId(subjectId)) notFound();

  const data = await withDB(async (db) => {
    const subject = await db.model(SubjectModel).findById(subjectId).lean();
    if (!subject) return null;
    const [cls, chapters] = await Promise.all([
      db.model(ClassModel).findById(subject.classId).lean(),
      db
        .model(ChapterModel)
        .find({ subjectId })
        .sort({ order: 1, _id: 1 })
        .lean(),
    ]);
    return { subject, cls, chapters };
  });
  if (!data) notFound();
  const { subject, cls, chapters } = data;

  // Suggest the next chapter: same part as the last one, next number.
  const last = chapters.at(-1);
  const nextPart = last?.part ?? 1;
  const nextNumber = last ? last.number + 1 : 1;

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
            { label: subject.name },
          ]}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-extrabold">
          {cls ? `${cls.name} ${subject.name}` : subject.name}
        </h1>
        <Badge tone={subject.isPublished ? "success" : "muted"}>
          {subject.isPublished ? "Published" : "Hidden"}
        </Badge>
      </div>
      {subject.book && <p className="mt-1 text-muted">{subject.book}</p>}

      <h2 className="mt-8 text-xl font-bold">Chapters</h2>
      <ItemList
        kind="chapter"
        emptyText="No chapters yet. Add one below."
        items={chapters.map((chapter) => ({
          id: String(chapter._id),
          label: chapter.title,
          detail: `Part ${chapter.part} · Chapter ${chapter.number}`,
          isPublished: chapter.isPublished,
        }))}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-bold">Add a chapter</h2>
          <p className="mt-1 text-sm text-muted">
            New chapters start hidden and go to the end of the list.
          </p>
          <div className="mt-4">
            <AdminForm
              action={saveChapter}
              submitLabel="Add chapter"
              successText="Chapter added."
              resetOnSuccess
            >
              <input type="hidden" name="subjectId" value={subjectId} />
              <Field label="Title" name="title" required />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Book part"
                  name="part"
                  type="number"
                  min={1}
                  max={99}
                  defaultValue={nextPart}
                  required
                />
                <Field
                  label="Chapter number"
                  name="number"
                  type="number"
                  min={1}
                  max={99}
                  defaultValue={nextNumber}
                  required
                />
              </div>
            </AdminForm>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold">Edit subject</h2>
          <div className="mt-4">
            <AdminForm
              action={saveSubject}
              submitLabel="Save changes"
              successText="Saved."
            >
              <input type="hidden" name="id" value={subjectId} />
              <Field
                label="Name"
                name="name"
                defaultValue={subject.name}
                required
              />
              <Field
                label="Textbook (optional)"
                name="book"
                defaultValue={subject.book ?? ""}
              />
              <Field
                label="Web address"
                hint={`Used in the link: …/${subject.slug}. Changing it breaks old links.`}
                name="slug"
                defaultValue={subject.slug}
              />
            </AdminForm>
          </div>
          <div className="mt-6 border-t border-line pt-6">
            <DeleteButton kind="subject" id={subjectId} label={subject.name} />
          </div>
        </Card>
      </div>
    </>
  );
}
