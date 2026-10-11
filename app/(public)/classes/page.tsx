import type { Metadata } from "next";
import { ClassCard } from "@/components/catalog/class-card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getClasses } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Classes",
  description:
    "Maths and Science video lessons for Classes 6, 7, 8, 9 and 10, following the NCERT syllabus.",
  alternates: { canonical: "/classes" },
};

export default async function ClassesPage() {
  const classes = await getClasses();

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        as="h1"
        title="Classes"
        description="Pick your class to see its subjects and chapters."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <ClassCard key={cls.slug} cls={cls} />
        ))}
      </div>
    </Container>
  );
}
