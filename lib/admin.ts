// The levels of the course structure that the admin panel manages.
// "item" is a video or file inside a chapter.
export type CatalogKind = "class" | "subject" | "chapter" | "item";

const adminRoots: Record<CatalogKind, string> = {
  class: "/admin/classes",
  subject: "/admin/subjects",
  chapter: "/admin/chapters",
  item: "/admin/items",
};

// The admin page for one item, e.g. /admin/subjects/66f…
export function adminPath(kind: CatalogKind, id: string) {
  return `${adminRoots[kind]}/${id}`;
}
