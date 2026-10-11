import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Terms of Use",
  alternates: { canonical: "/terms" },
};

// DRAFT — Varun to review before launch. Square-bracket values are placeholders to decide.
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
          These terms apply to your use of {name}, run by {legal.ownerName}. By
          using the website you agree to them.
        </p>

        <h2>Your account</h2>
        <ul>
          <li>You sign in with your own Google account.</li>
          <li>
            Each account and membership is for one student only. Please
            don&apos;t share your account.
          </li>
          <li>
            Students under 18 should use the site with the permission of a
            parent or guardian.
          </li>
          <li>We may suspend accounts that are shared or misused.</li>
        </ul>

        <h2>Lessons and content</h2>
        <ul>
          <li>Some lessons are free for everyone; the rest are for members.</li>
          <li>
            All videos, notes and other materials belong to {name}. They are for
            your personal study only. Do not download, record, copy, share or
            resell them, and do not share video links with anyone else.
          </li>
          <li>We may update, reorder or improve lessons over time.</li>
        </ul>

        <h2>Membership and payments</h2>
        <ul>
          <li>Prices are shown in Indian Rupees (₹) on the membership page.</li>
          <li>
            You pay by UPI to the UPI ID or QR code shown on the site, then
            enter your UPI transaction ID (UTR). Membership starts once we have
            checked the payment, usually within 24 hours.
          </li>
          <li>
            Membership lasts for the number of days in the plan you chose. You
            can renew at any time.
          </li>
          <li>
            Only pay to the UPI ID shown on this website. We will never ask for
            your UPI PIN.
          </li>
        </ul>

        <h2>Refunds</h2>
        <ul>
          <li>
            If you paid but your membership wasn&apos;t started, or you paid
            twice by mistake, contact us and we will fix it or refund you in
            full.
          </li>
          <li>
            You can ask for a full refund within <strong>15 days</strong> of
            your membership starting. After that, payments are non-refundable.
          </li>
          <li>Refunds are sent back by UPI to the account you paid from.</li>
        </ul>

        <h2>Fair use</h2>
        <p>
          Don&apos;t try to break, overload or get around the security of the
          website, or access members&apos; content without a membership.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          We work hard to make our lessons accurate and helpful, but they are a
          study aid and not a guarantee of exam results.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of India. Courts in {legal.city}{" "}
          have jurisdiction.
        </p>

        <h2>Contact</h2>
        <p>
          {legal.ownerName}. Email:{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>, or message us
          on WhatsApp (see the Contact page).
        </p>
      </Prose>
    </Container>
  );
}
