import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { email, phone, whatsapp } = siteConfig.contact;

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        as="h1"
        eyebrow="Contact"
        title="We'd love to hear from you"
        description="Questions about lessons, payments or your account? Reach out and we'll reply within 1–2 working days."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-bold">Email</h2>
          <a
            href={`mailto:${email}`}
            className="mt-2 inline-block font-semibold text-brand-ink underline"
          >
            {email}
          </a>
        </Card>
        {phone && (
          <Card>
            <h2 className="text-lg font-bold">Phone</h2>
            <a
              href={`tel:${phone}`}
              className="mt-2 inline-block font-semibold text-brand-ink underline"
            >
              {phone}
            </a>
          </Card>
        )}
        {whatsapp && (
          <Card>
            <h2 className="text-lg font-bold">WhatsApp</h2>
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              className="mt-2 inline-block font-semibold text-brand-ink underline"
            >
              Chat with us
            </a>
          </Card>
        )}
        <Card tone="lavender">
          <h2 className="text-lg font-bold">Address</h2>
          <p className="mt-2">{siteConfig.legal.address}</p>
        </Card>
      </div>
    </Container>
  );
}
