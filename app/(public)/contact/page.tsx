import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name} on WhatsApp or email.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { email, whatsapp } = siteConfig.contact;

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        as="h1"
        eyebrow="Contact"
        title="We'd love to hear from you"
        description="Questions about lessons, membership or a UPI payment? WhatsApp is the quickest way to reach us."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Card tone="lavender">
          <h2 className="text-lg font-bold">WhatsApp</h2>
          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              className="mt-2 inline-block font-semibold text-brand-ink underline"
            >
              Chat on WhatsApp ({whatsapp})
            </a>
          ) : (
            <p className="mt-2 text-muted">WhatsApp number coming soon.</p>
          )}
        </Card>
        <Card>
          <h2 className="text-lg font-bold">Email</h2>
          <a
            href={`mailto:${email}`}
            className="mt-2 inline-block font-semibold text-brand-ink underline"
          >
            {email}
          </a>
        </Card>
      </div>
    </Container>
  );
}
