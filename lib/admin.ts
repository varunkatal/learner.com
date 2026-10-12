// The three levels of the course structure that the admin panel manages.
export type CatalogKind = "class" | "subject" | "chapter";

const adminRoots: Record<CatalogKind, string> = {
  class: "/admin/classes",
  subject: "/admin/subjects",
  chapter: "/admin/chapters",
};

// The admin page for one item, e.g. /admin/subjects/66f…
export function adminPath(kind: CatalogKind, id: string) {
  return `${adminRoots[kind]}/${id}`;
}
