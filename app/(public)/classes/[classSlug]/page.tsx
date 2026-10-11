import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SubjectCard } from "@/components/catalog/subject-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getClass, getClasses } from "@/lib/catalog";

// Build every class page ahead of time.
export async function generateStaticParams() {
  const classes = await getClasses();
  return classes.map((cls) => ({ classSlug: cls.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/classes/[classSlug]">): Promise<Metadata> {
  const { classSlug } = await params;
  const cls = await getClass(classSlug);
  if (!cls) return {};
  return {
    title: `${cls.name} Maths and Science`,
    description: `${cls.name} video lessons for ${cls.subjects.map((s) => s.name).join(" and ")}, chapter by chapter, following the NCERT textbook.`,
    alternates: { canonical: `/classes/${cls.slug}` },
  };
}

export default async function ClassPage({
  params,
}: PageProps<"/classes/[classSlug]">) {
  const { classSlug } = await params;
  const cls = await getClass(classSlug);
  if (!cls) notFound();

  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs
        items={[{ label: "Classes", href: "/classes" }, { label: cls.name }]}
      />
      <div className="mt-6">
        <SectionHeading
          as="h1"
          title={cls.name}
          description="Choose a subject to see its chapters."
        />
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {cls.subjects.map((subject) => (
          <SubjectCard
            key={subject.slug}
            classSlug={cls.slug}
            subject={subject}
          />
        ))}
      </div>
    </Container>
  );
}
