import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getClasses } from "@/lib/catalog";

// Placeholder until real lessons exist (Phase 3): previews the first Maths chapter of each class.
export async function FreeLessons() {
  const classes = await getClasses();
  const previews = classes.flatMap((cls) => {
    const maths = cls.subjects.find((s) => s.slug === "maths");
    const chapter = maths?.chapters[0];
    return chapter
      ? [{ cls: cls.name, subject: maths.name, chapter: chapter.title }]
      : [];
  });

  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Free lessons"
          title="Start learning for free"
          description="Free lessons are on their way. Here's a peek at where they'll begin."
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {previews.map((p) => (
            <li
              key={p.cls}
              className="rounded-card border border-line bg-white p-5 shadow-card"
            >
              <div
                className="flex aspect-video items-center justify-center rounded-xl bg-lavender"
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" className="size-10 fill-ink/30">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="mt-4 text-sm font-semibold text-muted">
                {p.cls} · {p.subject}
              </p>
              <h3 className="mt-1 font-bold">{p.chapter}</h3>
              <div className="mt-3">
                <Badge tone="muted">Coming soon</Badge>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
