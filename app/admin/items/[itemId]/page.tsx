import { notFound } from "next/navigation";
import { saveItem } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { ItemFields } from "@/components/admin/item-fields";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card } from "@/components/ui/card";
import { contentTypeInfo } from "@/config/content";
import { adminPath } from "@/lib/admin";
import { withDB } from "@/lib/db";
import { isObjectId } from "@/lib/validators/catalog";
import { ChapterModel } from "@/models/Chapter";
import { ChapterItemModel } from "@/models/ChapterItem";

// Edit or delete one video / file inside a chapter.
export default async function AdminItemPage({
  params,
}: PageProps<"/admin/items/[itemId]">) {
  const { itemId } = await params;
  if (!isObjectId(itemId)) notFound();

  const data = await withDB(async (db) => {
    const item = await db.model(ChapterItemModel).findById(itemId).lean();
    if (!item) return null;
    const chapter = await db
      .model(ChapterModel)
      .findById(item.chapterId)
      .lean();
    return { item, chapter };
  });
  if (!data) notFound();
  const { item, chapter } = data;
  const info = contentTypeInfo(item.type);
  const link = item.youtubeId
    ? `https://youtu.be/${item.youtubeId}`
    : (item.url ?? "");

  return (
    <>
      <div className="mt-4">
        <Breadcrumbs
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Classes", href: "/admin/classes" },
            ...(chapter
              ? [
                  {
                    label: chapter.title,
                    href: adminPath("chapter", String(chapter._id)),
                  },
                ]
              : []),
            { label: item.title },
          ]}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-extrabold">{item.title}</h1>
        <Badge tone="ink">
          {info.icon} {info.label}
        </Badge>
        <Badge tone={item.isPublished ? "success" : "muted"}>
          {item.isPublished ? "Published" : "Hidden"}
        </Badge>
      </div>
      <p className="mt-2">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold break-all text-brand-ink underline"
        >
          Open the link ↗
        </a>
      </p>

      <Card className="mt-8 max-w-xl">
        <h2 className="text-xl font-bold">Edit</h2>
        <div className="mt-4">
          <AdminForm
            action={saveItem}
            submitLabel="Save changes"
            successText="Saved."
          >
            <input type="hidden" name="id" value={itemId} />
            <ItemFields
              defaults={{
                type: item.type,
                title: item.title,
                link,
                description: item.description,
              }}
            />
          </AdminForm>
        </div>
        <div className="mt-6 border-t border-line pt-6">
          <DeleteButton kind="item" id={itemId} label={item.title} />
        </div>
      </Card>
    </>
  );
}
