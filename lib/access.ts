// The single place that decides who may open a video or file.
// Right now: any signed-in student can open everything.
// Phase 4 (membership) adds: items with access "members" need an active membership.

type Viewer = { id: string; role: "student" | "admin" } | null;
type Item = { access?: "free" | "members" | null };

export function canOpen(user: Viewer, item: Item): boolean {
  void item; // used from Phase 4, when members-only items arrive
  return Boolean(user);
}
