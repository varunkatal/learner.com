// Site-wide settings. Change names, contact details and links here — never inside components.

export const siteConfig = {
  name: "LearnerHub",
  tagline: "Maths and Science video lessons for Classes 6–10",
  description:
    "Clear, syllabus-aligned video lessons in Maths and Science for Classes 6 to 10 (CBSE/NCERT), taught by an experienced teacher.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_IN",

  contact: {
    email: "varun03katal@gmail.com",
    whatsapp: "+91 8427820056" as string, // include +91: WhatsApp links need the country code
  },

  // Shown on the Privacy and Terms pages.
  legal: {
    ownerName: "Varun Katal",
    city: "Delhi", // for the "governing law" line in the Terms
    lastUpdated: "12 October 2026",
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
  ],

  // Shown on the home page only when non-empty. Add real student/parent quotes after launch.
  testimonials: [] as { quote: string; name: string; detail: string }[],
} as const;
