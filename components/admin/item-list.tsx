import Link from "next/link";
import { moveItem, setPublished } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { adminPath, type CatalogKind } from "@/lib/admin";
import { PendingButton } from "./pending-button";

export type ListItem = {
  id: string;
  label: string;
  detail?: string;
  isPublished: boolean;
};

const iconButton =
  "grid size-10 place-items-center rounded-full border border-line bg-white text-lg font-bold text-ink hover:bg-surface disabled:opacity-30";

// An ordered list of classes, subjects or chapters with move, publish/hide and edit controls.
// Each control is a tiny form, so it works even before the page's JavaScript loads.
export function ItemList({
  kind,
  items,
  emptyText,
}: {
  kind: CatalogKind;
  items: ListItem[];
  emptyText: string;
}) {
  if (items.length === 0) {
    return <p className="mt-4 text-muted">{emptyText}</p>;
  }

  return (
    <ol className="mt-4 divide-y divide-line rounded-card border border-line bg-white shadow-card">
      {items.map((item, index) => (
        <li key={item.id} className="flex flex-wrap items-center gap-3 p-4">
          <span className="w-6 text-sm font-bold text-muted">{index + 1}</span>
          <Link
            href={adminPath(kind, item.id)}
            className="min-w-0 flex-1 font-semibold text-ink hover:underline"
          >
            {item.label}
            {item.detail && (
              <span className="block text-sm font-normal text-muted">
                {item.detail}
              </span>
            )}
          </Link>
          <Badge tone={item.isPublished ? "success" : "muted"}>
            {item.isPublished ? "Published" : "Hidden"}
          </Badge>
          <div className="flex items-center gap-2">
            {(["up", "down"] as const).map((direction) => (
              <form key={direction} action={moveItem}>
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="direction" value={direction} />
                <PendingButton
                  className={iconButton}
                  disabled={
                    direction === "up"
                      ? index === 0
                      : index === items.length - 1
                  }
                  aria-label={`Move ${item.label} ${direction}`}
                >
                  {direction === "up" ? "↑" : "↓"}
                </PendingButton>
              </form>
            ))}
            <form action={setPublished}>
              <input type="hidden" name="kind" value={kind} />
              <input type="hidden" name="id" value={item.id} />
              <input
                type="hidden"
                name="publish"
                value={String(!item.isPublished)}
              />
              <PendingButton
                className="h-10 w-22 rounded-full border border-line bg-white text-sm font-bold text-ink hover:bg-surface disabled:opacity-50"
                aria-label={`${item.isPublished ? "Hide" : "Publish"} ${item.label}`}
              >
                {item.isPublished ? "Hide" : "Publish"}
              </PendingButton>
            </form>
          </div>
        </li>
      ))}
    </ol>
  );
}
