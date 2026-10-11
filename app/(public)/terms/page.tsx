import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Terms of Use",
  alternates: { canonical: "/terms" },
};

// DRAFT — have this reviewed before taking payments.
export default function TermsPage() {
  const { name, contact, legal } = siteConfig;

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        as="h1"
        title="Terms of Use"
        description={`Last updated: ${legal.lastUpdated}`}
      />
      <Prose>
        <p>
          These terms apply to your use of {name}, operated by{" "}
          {legal.businessName}. By using the website you agree to them.
        </p>

        <h2>Your account</h2>
        <ul>
          <li>
            Keep your login details private. Each account is for one student
            only.
          </li>
          <li>
            Students under 18 should use the site with the permission of a
            parent or guardian.
          </li>
          <li>We may suspend accounts that are shared or misused.</li>
        </ul>

        <h2>Lessons and content</h2>
        <ul>
          <li>
            Some lessons are free; others need a paid course or subscription.
          </li>
          <li>
            All videos, notes and other materials belong to {name}. They are for
            your personal study only. Do not download, record, copy, share or
            resell them.
          </li>
          <li>We may update, reorder or improve lessons over time.</li>
        </ul>

        <h2>Payments</h2>
        <ul>
          <li>
            Prices are shown in Indian Rupees (₹) and include applicable taxes
            unless stated otherwise.
          </li>
          <li>Payments are processed securely by Razorpay.</li>
          <li>
            Paid access lasts for the period shown at the time of purchase.
          </li>
          <li>
            Refunds are covered by our{" "}
            <Link href="/refund-policy">Refund Policy</Link>.
          </li>
        </ul>

        <h2>Fair use</h2>
        <p>
          Don&apos;t try to break, overload or get around the security of the
          website, or access content you haven&apos;t paid for.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          We work hard to make our lessons accurate and helpful, but they are a
          study aid and not a guarantee of exam results.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of India. Courts in [city, state]
          have jurisdiction.
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
