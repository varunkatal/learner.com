import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
};

// DRAFT — have this reviewed before taking payments.
export default function PrivacyPage() {
  const { name, contact, legal } = siteConfig;

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        as="h1"
        title="Privacy Policy"
        description={`Last updated: ${legal.lastUpdated}`}
      />
      <Prose>
        <p>
          This policy explains what information {name} (&quot;we&quot;,
          &quot;us&quot;), operated by {legal.businessName}, collects when you
          use this website, and how we use it.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Account details</strong> you give us when you sign up: name,
            email address, class, and optionally a phone number.
          </li>
          <li>
            <strong>Learning activity</strong>, such as which lessons you watch
            and how far you get, so we can resume videos and show your progress.
          </li>
          <li>
            <strong>Payment details</strong> are handled by our payment partner,
            Razorpay. We receive a confirmation of payment but never see or
            store your card, UPI or bank details.
          </li>
          <li>
            <strong>Technical data</strong> such as browser type and device,
            used to keep the site working and secure.
          </li>
        </ul>

        <h2>How we use your information</h2>
        <ul>
          <li>
            To create and manage your account and give you access to lessons you
            have unlocked.
          </li>
          <li>
            To send important emails such as password resets, payment receipts
            and class reminders.
          </li>
          <li>To improve our lessons and the website.</li>
        </ul>
        <p>We do not sell your personal information.</p>

        <h2>Services we use</h2>
        <p>
          We use trusted providers to run the site, including hosting, video
          streaming, email delivery and payment processing. They only receive
          the information needed to provide their service.
        </p>

        <h2>Children&apos;s privacy</h2>
        <p>
          Many of our students are under 18. We ask that a parent or guardian
          creates or approves accounts for students under 18 and makes any
          payments.
        </p>

        <h2>Your choices</h2>
        <p>
          You can ask us to correct or delete your account information at any
          time by emailing{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>.
        </p>

        <h2>Contact</h2>
        <p>
          {legal.businessName}, {legal.address}. Email:{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>. See also our{" "}
          <Link href="/terms">Terms of Use</Link>.
        </p>
      </Prose>
    </Container>
  );
}
