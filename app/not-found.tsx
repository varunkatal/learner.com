import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Container className="py-20 text-center sm:py-28">
          <p className="text-6xl font-extrabold text-brand-ink">404</p>
          <h1 className="mt-4 text-3xl font-extrabold">
            We couldn&apos;t find that page
          </h1>
          <p className="mt-3 text-lg">
            The link may be old, or the page may have moved.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <ButtonLink href="/">Go home</ButtonLink>
            <ButtonLink href="/classes" variant="secondary">
              Browse classes
            </ButtonLink>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
