import { saveClass } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import { Field } from "@/components/admin/field";
import { ItemList } from "@/components/admin/item-list";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card } from "@/components/ui/card";
import { withDB } from "@/lib/db";
import { ClassModel } from "@/models/Class";

export default async function AdminClassesPage() {
  const classes = await withDB((db) =>
    db.model(ClassModel).find().sort({ order: 1, _id: 1 }).lean(),
  );

  return (
    <>
      <div className="mt-4">
        <Breadcrumbs
          items={[{ label: "Admin", href: "/admin" }, { label: "Classes" }]}
        />
      </div>
      <h1 className="mt-4 text-3xl font-extrabold">Classes</h1>
      <p className="mt-2">
        Open a class to manage its subjects. Use the arrows to change the order;
        hidden classes don&apos;t appear on the website.
      </p>

      <ItemList
        kind="class"
        emptyText="No classes yet. Add the first one below."
        items={classes.map((cls) => ({
          id: String(cls._id),
          label: cls.name,
          isPublished: cls.isPublished,
        }))}
      />

      <Card className="mt-8">
        <h2 className="text-xl font-bold">Add a class</h2>
        <p className="mt-1 text-sm text-muted">
          New classes start hidden, so you can fill them in before publishing.
        </p>
        <div className="mt-4">
          <AdminForm
            action={saveClass}
            submitLabel="Add class"
            successText="Class added."
            resetOnSuccess
          >
            <Field label="Name" name="name" placeholder="Class 11" required />
          </AdminForm>
        </div>
      </Card>
    </>
  );
}
