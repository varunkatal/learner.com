import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Refund Policy",
  alternates: { canonical: "/refund-policy" },
};

// DRAFT — the numbers in [brackets] are placeholders. Decide them in Phase 4 before taking payments.
export default function RefundPolicyPage() {
  const { name, contact, legal } = siteConfig;

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        as="h1"
        title="Refund and Cancellation Policy"
        description={`Last updated: ${legal.lastUpdated}`}
      />
      <Prose>
        <p>
          {name} sells digital learning content (online video lessons and
          notes). Access is given instantly after payment, so there is nothing
          physically shipped.
        </p>

        <h2>Refunds</h2>
        <ul>
          <li>
            You can request a full refund within <strong>[7] days</strong> of
            purchase if you have watched less than <strong>[20%]</strong> of the
            paid lessons in that course.
          </li>
          <li>
            If you were charged twice, or paid but did not get access, we will
            fix it or refund you in full.
          </li>
          <li>After the refund window, payments are non-refundable.</li>
        </ul>

        <h2>How to request a refund</h2>
        <p>
          Email <a href={`mailto:${contact.email}`}>{contact.email}</a> from
          your registered email address with your payment ID (from your
          receipt). We reply within <strong>[2] working days</strong>.
        </p>

        <h2>When you&apos;ll receive it</h2>
        <p>
          Approved refunds go back to your original payment method within{" "}
          <strong>[5–7] working days</strong>, depending on your bank.
        </p>

        <h2>Cancellations</h2>
        <p>
          Subscriptions can be cancelled at any time. You keep access until the
          end of the period you have already paid for, and you won&apos;t be
          charged again.
        </p>

        <h2>Contact</h2>
        <p>
          {legal.businessName}, {legal.address}. Email:{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>.
        </p>
      </Prose>
    </Container>
  );
}
