import { notFound } from "next/navigation";
import { saveClass, saveSubject } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { Field } from "@/components/admin/field";
import { ItemList } from "@/components/admin/item-list";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card } from "@/components/ui/card";
import { withDB } from "@/lib/db";
import { isObjectId } from "@/lib/validators/catalog";
import { ClassModel } from "@/models/Class";
import { SubjectModel } from "@/models/Subject";

export default async function AdminClassPage({
  params,
}: PageProps<"/admin/classes/[classId]">) {
  const { classId } = await params;
  if (!isObjectId(classId)) notFound();

  // Both queries share one connection (each connection costs about a second).
  const data = await withDB(async (db) => {
    const cls = await db.model(ClassModel).findById(classId).lean();
    if (!cls) return null;
    const subjects = await db
      .model(SubjectModel)
      .find({ classId })
      .sort({ order: 1, _id: 1 })
      .lean();
    return { cls, subjects };
  });
  if (!data) notFound();
  const { cls, subjects } = data;

  return (
    <>
      <div className="mt-4">
        <Breadcrumbs
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Classes", href: "/admin/classes" },
            { label: cls.name },
          ]}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-extrabold">{cls.name}</h1>
        <Badge tone={cls.isPublished ? "success" : "muted"}>
          {cls.isPublished ? "Published" : "Hidden"}
        </Badge>
      </div>

      <h2 className="mt-8 text-xl font-bold">Subjects</h2>
      <ItemList
        kind="subject"
        emptyText="No subjects yet. Add one below."
        items={subjects.map((subject) => ({
          id: String(subject._id),
          label: subject.name,
          detail: subject.book ?? undefined,
          isPublished: subject.isPublished,
        }))}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-bold">Add a subject</h2>
          <p className="mt-1 text-sm text-muted">New subjects start hidden.</p>
          <div className="mt-4">
            <AdminForm
              action={saveSubject}
              submitLabel="Add subject"
              successText="Subject added."
              resetOnSuccess
            >
              <input type="hidden" name="classId" value={classId} />
              <Field label="Name" name="name" placeholder="Maths" required />
              <Field
                label="Textbook (optional)"
                name="book"
                placeholder="Ganita Prakash"
              />
            </AdminForm>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold">Edit class</h2>
          <div className="mt-4">
            <AdminForm
              action={saveClass}
              submitLabel="Save changes"
              successText="Saved."
            >
              <input type="hidden" name="id" value={classId} />
              <Field
                label="Name"
                name="name"
                defaultValue={cls.name}
                required
              />
              <Field
                label="Web address"
                hint={`Used in the link: /classes/${cls.slug}. Changing it breaks old links.`}
                name="slug"
                defaultValue={cls.slug}
              />
            </AdminForm>
          </div>
          <div className="mt-6 border-t border-line pt-6">
            <DeleteButton kind="class" id={classId} label={cls.name} />
          </div>
        </Card>
      </div>
    </>
  );
}
