import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChapterList } from "@/components/catalog/chapter-list";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getSubject } from "@/lib/catalog";

// Read the database on every visit, so admin panel edits show straight away.
export const dynamic = "force-dynamic";

type Props = PageProps<"/classes/[classSlug]/[subjectSlug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { classSlug, subjectSlug } = await params;
  const found = await getSubject(classSlug, subjectSlug);
  if (!found) return {};
  const { cls, subject } = found;
  return {
    title: `${cls.name} ${subject.name} — All Chapters`,
    description: `${cls.name} ${subject.name} video lessons for all ${subject.chapters.length} chapters${subject.book ? ` of the NCERT ${subject.book} textbook` : ""}.`,
    alternates: { canonical: `/classes/${cls.slug}/${subject.slug}` },
  };
}

export default async function SubjectPage({ params }: Props) {
  const { classSlug, subjectSlug } = await params;
  const found = await getSubject(classSlug, subjectSlug);
  if (!found) notFound();
  const { cls, subject } = found;

  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "Classes", href: "/classes" },
          { label: cls.name, href: `/classes/${cls.slug}` },
          { label: subject.name },
        ]}
      />
      <div className="mt-6">
        <SectionHeading
          as="h1"
          title={`${cls.name} ${subject.name}`}
          description={
            <>
              {subject.chapters.length} chapters
              {subject.book && (
                <>
                  {" "}
                  · NCERT <em>{subject.book}</em>
                </>
              )}
            </>
          }
        />
      </div>
      <div className="mt-10">
        {subject.chapters.length > 0 ? (
          <ChapterList
            chapters={subject.chapters}
            basePath={`/classes/${cls.slug}/${subject.slug}`}
          />
        ) : (
          <p className="text-lg text-muted">Chapters are coming soon.</p>
        )}
      </div>
    </Container>
  );
}
