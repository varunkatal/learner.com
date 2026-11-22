import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { YouTubePlayer } from "@/components/lesson/youtube-player";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { contentTypes, type ContentType } from "@/config/content";
import { getChapter, type CatalogItem } from "@/lib/catalog";
import { cn } from "@/lib/cn";

// Read the database on every visit (admin edits show straight away, and links depend on who is signed in).
export const dynamic = "force-dynamic";

type Props = PageProps<"/classes/[classSlug]/[subjectSlug]/[chapterSlug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { classSlug, subjectSlug, chapterSlug } = await params;
  const found = await getChapter(classSlug, subjectSlug, chapterSlug);
  if (!found) return {};
  const { cls, subject, chapter } = found;
  return {
    title: `${chapter.title} — ${cls.name} ${subject.name}`,
    description: `Animated videos, recorded classes, notes, PPT slides and worksheets for ${cls.name} ${subject.name}: ${chapter.title}.`,
    alternates: {
      canonical: `/classes/${cls.slug}/${subject.slug}/${chapter.slug}`,
    },
  };
}

export default async function ChapterPage({ params, searchParams }: Props) {
  const { classSlug, subjectSlug, chapterSlug } = await params;
  const found = await getChapter(classSlug, subjectSlug, chapterSlug);
  if (!found) notFound();
  const { cls, subject, chapter, items, signedIn } = found;
  const path = `/classes/${cls.slug}/${subject.slug}/${chapter.slug}`;

  // Tabs are plain links (?tab=notes), so they work without any JavaScript. Empty tabs are hidden.
  const tabs = contentTypes.filter((t) => items.some((i) => i.type === t.id));
  const requested = (await searchParams).tab;
  const active =
    tabs.find((t) => t.id === requested) ??
    (tabs[0] as (typeof tabs)[number] | undefined);
  const shown = active ? items.filter((i) => i.type === active.id) : [];

  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "Classes", href: "/classes" },
          { label: cls.name, href: `/classes/${cls.slug}` },
          { label: subject.name, href: `/classes/${cls.slug}/${subject.slug}` },
          { label: chapter.title },
        ]}
      />
      <p className="mt-6 font-semibold text-brand-ink">
        {cls.name} {subject.name} · Chapter {chapter.number}
      </p>
      <h1 className="mt-1 text-3xl font-extrabold text-ink sm:text-4xl">
        {chapter.title}
      </h1>

      {!signedIn && items.length > 0 && (
        <Card
          tone="lavender"
          className="mt-6 flex flex-wrap items-center gap-4"
        >
          <p className="min-w-0 flex-1 text-lg font-semibold text-ink">
            Sign in with Google to watch the videos and open the notes.
            It&apos;s free.
          </p>
          <ButtonLink href={`/login?callbackUrl=${encodeURIComponent(path)}`}>
            Sign in
          </ButtonLink>
        </Card>
      )}

      {!active ? (
        <p className="mt-10 text-lg text-muted">
          Videos and notes for this chapter are coming soon.
        </p>
      ) : (
        <>
          <nav
            aria-label="Content type"
            className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
          >
            {tabs.map((t) => (
              <Link
                key={t.id}
                href={`${path}?tab=${t.id}`}
                scroll={false}
                aria-current={t.id === active.id ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 font-bold whitespace-nowrap",
                  t.id === active.id
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-ink hover:bg-surface",
                )}
              >
                {t.icon} {t.short}
              </Link>
            ))}
          </nav>

          <h2 className="sr-only">{active.label}</h2>
          {active.isVideo ? (
            <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {shown.map((item, index) => (
                <VideoCard key={item.id} item={item} number={index + 1} />
              ))}
            </ul>
          ) : (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {shown.map((item) => (
                <FileCard key={item.id} item={item} type={active.id} />
              ))}
            </ul>
          )}
        </>
      )}
    </Container>
  );
}

function VideoCard({ item, number }: { item: CatalogItem; number: number }) {
  return (
    <li className="rounded-card border border-line bg-white p-3 shadow-card">
      {item.youtubeId ? (
        <YouTubePlayer id={item.youtubeId} title={item.title} />
      ) : (
        <div className="grid aspect-video place-items-center rounded-xl bg-lavender text-center">
          <span className="font-semibold text-ink">🔒 Sign in to watch</span>
        </div>
      )}
      <div className="p-2 pt-3">
        <h3 className="font-bold text-ink">
          {number}. {item.title}
        </h3>
        {item.description && (
          <p className="mt-1 text-muted">{item.description}</p>
        )}
      </div>
    </li>
  );
}

function FileCard({ item, type }: { item: CatalogItem; type: ContentType }) {
  const info = contentTypes.find((t) => t.id === type)!;
  return (
    <li className="flex items-center gap-4 rounded-card border border-line bg-white p-4 shadow-card">
      <span
        aria-hidden
        className="grid size-12 shrink-0 place-items-center rounded-xl bg-blush text-2xl"
      >
        {info.icon}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-ink">{item.title}</h3>
        {item.description && (
          <p className="text-sm text-muted">{item.description}</p>
        )}
      </div>
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-brand px-4 py-2 font-bold text-white hover:bg-brand-hover"
        >
          Open
        </a>
      ) : (
        <span className="shrink-0 text-sm font-semibold text-muted">
          🔒 Sign in
        </span>
      )}
    </li>
  );
}
