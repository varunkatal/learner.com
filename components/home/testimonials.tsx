import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

// Hidden until real quotes are added to config/site.ts — no made-up reviews.
export function Testimonials() {
  const items = siteConfig.testimonials;
  if (items.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Students say"
          title="Loved by learners"
          align="center"
        />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <li
              key={t.name}
              className="rounded-card border border-line bg-white p-6 shadow-card"
            >
              <blockquote className="text-ink">“{t.quote}”</blockquote>
              <p className="mt-4 font-bold text-ink">{t.name}</p>
              <p className="text-sm text-muted">{t.detail}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
