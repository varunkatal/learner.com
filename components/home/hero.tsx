import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section className="overflow-hidden bg-blush">
      <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-2">
        <div>
          <p className="inline-flex rounded-full bg-white px-4 py-1.5 text-sm font-bold text-brand-ink shadow-sm">
            Classes 6–10 · CBSE / NCERT
          </p>
          <h1 className="mt-5 text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
            Maths and Science, explained{" "}
            <span className="text-brand-ink">one clear lesson</span> at a time.
          </h1>
          <p className="mt-5 max-w-xl text-lg">
            {siteConfig.name} has chapter-by-chapter video lessons and live
            classes that follow your NCERT textbook, so you always know what to
            watch next.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/classes" size="lg">
              Browse classes
            </ButtonLink>
            <ButtonLink href="#how-it-works" variant="secondary" size="lg">
              How it works
            </ButtonLink>
          </div>
        </div>
        <HeroArt />
      </Container>
    </section>
  );
}

// A lightweight drawing of a lesson player — no image download, so the page loads fast on mobile data.
function HeroArt() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-md lg:max-w-none"
    >
      <div className="absolute -top-6 -right-6 size-40 rounded-full bg-brand/15 blur-2xl" />
      <div className="relative rounded-card border border-line bg-white p-4 shadow-card-hover">
        <div className="flex aspect-video items-center justify-center rounded-xl bg-ink">
          <span className="flex size-16 items-center justify-center rounded-full bg-brand shadow-lg">
            <svg viewBox="0 0 24 24" className="ml-1 size-7 fill-white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
          <div className="h-full w-2/5 rounded-full bg-brand" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 w-3/4 rounded-full bg-ink/80" />
          <div className="h-3 w-1/2 rounded-full bg-line" />
        </div>
      </div>
      <div className="absolute -bottom-5 -left-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-card sm:-left-6">
        <p className="text-sm font-bold text-ink">Chapter 3 complete</p>
        <p className="text-xs text-muted">6 of 10 lessons done</p>
      </div>
    </div>
  );
}
