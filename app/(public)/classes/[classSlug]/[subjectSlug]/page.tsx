import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChapterList } from "@/components/catalog/chapter-list";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getClasses, getSubject } from "@/lib/catalog";

// Build every class + subject page ahead of time.
export async function generateStaticParams() {
  const classes = await getClasses();
  return classes.flatMap((cls) =>
    cls.subjects.map((subject) => ({
      classSlug: cls.slug,
      subjectSlug: subject.slug,
    })),
  );
}

type Props = PageProps<"/classes/[classSlug]/[subjectSlug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { classSlug, subjectSlug } = await params;
  const found = await getSubject(classSlug, subjectSlug);
  if (!found) return {};
  const { cls, subject } = found;
  return {
    title: `${cls.name} ${subject.name} — All Chapters`,
    description: `${cls.name} ${subject.name} video lessons for all ${subject.chapters.length} chapters of the NCERT ${subject.book} textbook.`,
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
              {subject.chapters.length} chapters · NCERT <em>{subject.book}</em>
            </>
          }
        />
      </div>
      <div className="mt-10">
        <ChapterList chapters={subject.chapters} />
      </div>
    </Container>
  );
}
