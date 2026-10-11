import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getClasses } from "@/lib/catalog";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";

export async function SiteFooter() {
  const classes = await getClasses();

  return (
    <footer className="mt-auto bg-ink text-white/80">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo tone="light" />
          <p className="mt-4 max-w-sm">{siteConfig.description}</p>
        </div>

        <FooterColumn title="Classes">
          {classes.map((cls) => (
            <FooterLink key={cls.slug} href={`/classes/${cls.slug}`}>
              {cls.name}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Learner">
          {[...siteConfig.nav, ...siteConfig.footerLinks].map((item) => (
            <FooterLink key={item.href} href={item.href}>
              {item.label}
            </FooterLink>
          ))}
        </FooterColumn>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-6 text-sm text-white/70">
          © 2026 {siteConfig.name}. All rights reserved.
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-sm font-bold tracking-wide text-white uppercase">
        {title}
      </h2>
      <ul className="mt-4 space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link href={href} className="hover:text-white hover:underline">
        {children}
      </Link>
    </li>
  );
}
