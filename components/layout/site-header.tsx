import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { AccountButton } from "./account-button";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 font-semibold text-ink transition-colors hover:bg-lavender"
            >
              {item.label}
            </Link>
          ))}
          <ButtonLink href="/classes" className="ml-2">
            Start learning
          </ButtonLink>
        </nav>
        <div className="flex items-center gap-2">
          <AccountButton />
          <MobileMenu items={siteConfig.nav} />
        </div>
      </Container>
    </header>
  );
}
