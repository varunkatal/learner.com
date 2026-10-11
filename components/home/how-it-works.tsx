import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    title: "Sign in with Google",
    text: "Use your Gmail account — no new password to remember. Free lessons are open to everyone.",
  },
  {
    title: "Pay by UPI",
    text: "Choose a membership plan and pay with any UPI app. Then enter the transaction ID (UTR) on the site.",
  },
  {
    title: "Unlock every lesson",
    text: "Once your payment is checked, all members' lessons, notes and live classes open until your plan ends.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Membership"
          title="How membership works"
          description="Start with the free lessons. Become a member when you're ready for the full course."
          align="center"
        />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="rounded-card bg-lavender p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-brand font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
              <p className="mt-2">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
