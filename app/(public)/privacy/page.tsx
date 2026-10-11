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

// DRAFT — Varun to review before launch.
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
          &quot;us&quot;), run by {legal.ownerName}, collects when you use this
          website, and how we use it.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Your Google account details</strong> when you sign in with
            Google: your name, email address and profile picture. We never see
            your Google password.
          </li>
          <li>
            <strong>Details you add</strong>, such as your class and, if you
            choose, a WhatsApp number.
          </li>
          <li>
            <strong>Membership payments</strong>: the plan you chose, the amount
            and the UPI transaction ID (UTR) you enter, so we can match it to
            the payment we received. Your payment itself is made in your own UPI
            app; we never see your bank details or UPI PIN.
          </li>
          <li>
            <strong>Learning activity</strong>, such as which lessons you watch
            and how far you get, so we can resume videos and show your progress.
          </li>
        </ul>

        <h2>How we use your information</h2>
        <ul>
          <li>
            To sign you in and give you access to the lessons you can watch.
          </li>
          <li>To check membership payments and show your membership status.</li>
          <li>To contact you about your membership or live classes.</li>
          <li>To improve our lessons and the website.</li>
        </ul>
        <p>
          We do not sell or share your personal information for advertising.
        </p>

        <h2>Services we use</h2>
        <ul>
          <li>Google, for signing in.</li>
          <li>
            YouTube, which plays our videos. YouTube&apos;s own privacy policy
            applies to the video player; we use its privacy-enhanced mode.
          </li>
          <li>Cloudflare, which hosts this website.</li>
          <li>MongoDB Atlas, which stores our database.</li>
        </ul>

        <h2>Children&apos;s privacy</h2>
        <p>
          Most of our students are under 18. A parent or guardian should agree
          to the student using the site and should make any membership payment.
        </p>

        <h2>Your choices</h2>
        <p>
          You can ask us to correct or delete your information at any time by
          contacting us on WhatsApp or at{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>.
        </p>

        <h2>Contact</h2>
        <p>
          {legal.ownerName}. Email:{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>. See also our{" "}
          <Link href="/terms">Terms of Use</Link>.
        </p>
      </Prose>
    </Container>
  );
}
