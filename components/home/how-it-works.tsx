import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    title: "Pick your class and subject",
    text: "Choose your class, then Maths or Science. Chapters follow your NCERT textbook in the same order.",
  },
  {
    title: "Watch short, clear lessons",
    text: "Each chapter is broken into focused video lessons that work well on a phone, even on slow data.",
  },
  {
    title: "Revise with notes",
    text: "Download the notes for each lesson and come back to any chapter before your tests and exams.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="Learning made simple"
          align="center"
        />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="rounded-card bg-lavender p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-brand font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
              <p className="mt-2">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
