import { ClassCard } from "@/components/catalog/class-card";
import { FreeLessons } from "@/components/home/free-lessons";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getClasses } from "@/lib/catalog";

export default async function HomePage() {
  const classes = await getClasses();

  return (
    <>
      <Hero />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Classes"
              title="Choose your class"
              description="Maths and Science for Classes 6 to 10."
            />
            <ButtonLink
              href="/classes"
              variant="secondary"
              className="self-start sm:self-auto"
            >
              All classes
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <ClassCard key={cls.slug} cls={cls} />
            ))}
          </div>
        </Container>
      </section>

      <FreeLessons />
      <HowItWorks />
      <Testimonials />
    </>
  );
}
