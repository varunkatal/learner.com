// Site-wide settings. Change names, contact details and links here — never inside components.

export const siteConfig = {
  name: "Learner",
  tagline: "Maths and Science video lessons for Classes 6–10",
  description:
    "Clear, syllabus-aligned video lessons in Maths and Science for Classes 6 to 10 (CBSE/NCERT), taught by an experienced teacher.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_IN",

  // TODO(Varun): replace with real contact details before launch.
  contact: {
    email: "hello@example.com",
    phone: "" as string, // e.g. "+91 98xxxxxxxx" — hidden on the Contact page while empty
    whatsapp: "" as string,
  },

  // TODO(Varun): needed on the legal pages (Razorpay checks these).
  legal: {
    businessName: "[Legal business / owner name]",
    address: "[Business address, city, state, PIN]",
    lastUpdated: "11 October 2026",
  },

  social: {
    youtube: "" as string,
    instagram: "" as string,
  },

  nav: [
    { label: "Classes", href: "/classes" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  footerLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],

  // Shown on the home page only when non-empty. Add real student/parent quotes after launch.
  testimonials: [] as { quote: string; name: string; detail: string }[],
} as const;
