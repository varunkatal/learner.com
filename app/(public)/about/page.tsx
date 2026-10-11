import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "About",
  description: `Why ${siteConfig.name} exists and who teaches the lessons.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        as="h1"
        eyebrow="About us"
        title={`Why ${siteConfig.name}?`}
      />
      <Prose>
        <p>
          {siteConfig.name} is a video learning platform for students in Classes
          6 to 10. Every lesson follows the NCERT textbook chapter by chapter,
          so students can learn at school pace, catch up on a topic they missed,
          or revise before an exam.
        </p>

        <h2>Who teaches the lessons</h2>
        <p>
          The lessons are taught by Varun, a teacher of Maths and Science. I’m
          an engineer by education and a teacher by choice, with more than three
          years of teaching experience. I love making difficult concepts simple
          and helping students learn with confidence.
        </p>

        <h2>What makes it different</h2>
        <ul>
          <li>
            Lessons follow the latest NCERT books, in the same order as the
            textbook.
          </li>
          <li>
            Short, focused videos that work well on a phone, even on slow mobile
            data.
          </li>
          <li>Notes for every lesson, so revision is quick.</li>
          <li>Live classes where you can ask questions in the chat.</li>
          <li>
            Free lessons for everyone, and an affordable membership for the full
            course.
          </li>
        </ul>
      </Prose>
      <div className="mt-10">
        <ButtonLink href="/classes" size="lg">
          Browse classes
        </ButtonLink>
      </div>
    </Container>
  );
}
