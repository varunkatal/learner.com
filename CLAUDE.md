# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Read this file and `ROADMAP.md` before starting any task.

## Project

**LearnHub**: an educational video website for Indian school students (CBSE/ICSE), run by Varun, a teacher. Up to **50 students**. Students log in with Google, watch YouTube-hosted lessons organised by Class → Subject → Chapter → Lesson, download notes, and join live classes. Some lessons are free; the rest are for members who pay Varun by UPI.

**Hard rule: running cost must stay ₹0.** Use only free plans. Never add a paid service, paid API or paid plan without Varun's explicit approval. Paid options (custom domain, Razorpay, Cloudflare Stream, Expo store apps) are listed under "Future upgrades" in `ROADMAP.md` — don't build them early.

**Current phase:** Phase 0 — Setup (left: MongoDB Atlas + Workers test, first deploy). Phase 1 pages are built. Update this line when a phase is completed.

## Repository state

GitHub: https://github.com/varunkatal/learner.com (branch `main`). The project was re-planned in October 2026 from a paid stack (Vercel, Razorpay, Cloudflare/Bunny Stream, Resend) to the zero-cost plan described here; Phase 1 pages from the old plan were kept and reworded.

**How data flows now:** `lib/syllabus.ts` holds the NCERT 2026–27 syllabus (Classes 6–10, Maths + Science) and is the only data source so far. Pages never read it directly — they call `lib/catalog.ts` (`getClasses`, `getClass`, `getSubject`). In Phase 2, swap those function bodies for MongoDB queries; pages stay unchanged. `npm run seed` copies the syllabus into MongoDB (idempotent upserts via `models/`).

**Next.js on Cloudflare — constraints found while setting up:**

- Next.js is pinned to **16.3.8** (with `eslint-config-next` to match). Next 16.4 crashes every request on `@opennextjs/cloudflare` 1.20.x (`Unexpected loadManifest(/.next/server/preview-props.json)`, opennextjs-cloudflare issue #1355). Upgrade only after an adapter release fixes it, and test with `npm run preview`.
- **Cache Components (`cacheComponents`, `"use cache"`) are off**: on Workers they made requests hang. Pages are plain SSG: dynamic routes export `generateStaticParams`, and unknown slugs call `notFound()`. `params` is still a Promise (`await params`); type props with the generated `PageProps<"/route">` helpers.
- `open-next.config.ts` uses the read-only **static-assets incremental cache** (no R2, which needs a card on file). Prerendered pages are served from it; "Failed to set to read-only cache" lines in `wrangler dev` logs are expected noise. ISR/revalidation won't work with this cache.
- Free-plan Worker limit is 3 MiB compressed; the Phase 1 build is about 2.0 MiB (Mongoose isn't bundled into pages yet). Check with `npx wrangler deploy --dry-run --outdir /tmp/w`.
- Next.js 16 APIs differ from older versions: read `node_modules/next/dist/docs/` before using an unfamiliar API (see `AGENTS.md`).

## How to work with Varun

- Varun is a beginner developer. **Explain what you are building and why** before and after each step, in simple language.
- Work **one phase at a time**, following `ROADMAP.md`. Don't build later-phase features unless asked.
- Deliver small steps that can be run and tested immediately. Give exact terminal commands.
- Prefer the **simplest working solution**. Avoid extra libraries unless they clearly save effort.
- Tick the matching checkbox in `ROADMAP.md` when a task is finished.
- Varun works on a Mac in VS Code. Watch for wrong-directory, wrong Node version and port-conflict issues.

## Tech stack (all free)

- **Framework:** Next.js (App Router), TypeScript, Server Components by default
- **Styling:** Tailwind CSS; reusable components in `components/ui/`
- **Hosting:** Cloudflare Workers free plan, deployed with the OpenNext adapter (`@opennextjs/cloudflare`). Keep the bundle small: the free plan's Worker size limit is 3 MiB compressed
- **Database:** MongoDB Atlas free cluster (M0) with Mongoose. Cache the connection. Whether Mongoose works on Workers must be proven in Phase 0; if it doesn't after reasonable effort, stop and agree a fallback with Varun
- **Auth:** Auth.js (NextAuth), **Google provider only**, JWT sessions with `role: "student" | "admin"`. No passwords, no email sending
- **Videos and live:** YouTube unlisted videos and YouTube Live, embedded via `https://www.youtube-nocookie.com/embed/VIDEO_ID`; progress via the YouTube IFrame Player API
- **Notes:** Google Drive share links stored as URLs
- **Payments:** manual UPI. The student pays to Varun's UPI ID / QR and submits the UTR; admin approves
- **Validation:** Zod for every form and API input

Don't add video upload systems, payment gateways, email services, file storage services or paid analytics.

## Folder structure (planned)

```
app/
  (public)/            # home, classes, subjects, chapters, lesson pages, about, legal
  (student)/dashboard/ # student area (login required)
  membership/          # plans, UPI payment page, status
  live/                # live class pages
  admin/               # admin panel (role = admin)
  api/v1/              # API routes, versioned so a future mobile app can reuse them
components/
  ui/                  # buttons, cards, badges, inputs, modals
  lesson/              # YouTube player, lesson list, locked card
  layout/              # header, footer, mobile nav
lib/
  db.ts                # cached Mongoose connection
  auth.ts              # Auth.js config
  access.ts            # canWatch(user, lesson): the single place for access rules
  video.ts             # YouTube helpers (extract ID from any YouTube URL, embed URL)
  validators/          # Zod schemas
models/                # Mongoose models
config/
  site.ts              # site name, WhatsApp number, social links, admin emails
  plans.ts             # membership plans: id, name, priceRupees, days
  payment.ts           # UPI ID, payee name, QR image path
```

Keep configuration in `config/`. Never hard-code the site name, prices, UPI ID or admin emails inside components.

## Data models

- **User**: name, email, image, role (`student` | `admin`), grade, whatsapp, membership { status (`none` | `active` | `expired`), planId, validUntil }, createdAt
- **Class**: name, slug, order, isPublished
- **Subject**: classId, name, slug, order, isPublished
- **Chapter**: subjectId, title, slug, order, isPublished
- **Lesson**: chapterId, title, slug, description, order, access (`free` | `members`), provider (`youtube`), youtubeId, notesUrl, durationSec (optional), isPublished, createdAt
- **PaymentRequest**: userId, planId, amountRupees, utr, status (`pending` | `approved` | `rejected`), adminNote, createdAt, reviewedAt
- **Progress**: userId, lessonId, positionSec, completed, updatedAt (unique on userId + lessonId)
- **LiveClass**: title, classId, subjectId, scheduledAt, access, youtubeId, status (`scheduled` | `live` | `ended`), lessonId (set after converting to a lesson)

Store times in **UTC** and display them in IST (Asia/Kolkata). A membership is active only if `status === "active"` and `validUntil > now`. Check expiry on every access, not with a background job.

## Access rules (important)

- All access decisions go through `lib/access.ts`.
- **Members-only YouTube IDs must never reach a non-member's browser.** Fetch lessons on the server; for locked lessons send only the title, description and lock state, never `youtubeId`. The same applies to members-only live classes.
- Admin pages and admin API routes check `role === "admin"` on the server every time.
- UTR must be unique across PaymentRequests, so one payment can't be submitted twice.
- Never trust the client for role, membership or prices; read prices from `config/plans.ts` on the server.
- Accepted limitation: a member can copy an unlisted YouTube link. Don't attempt complex workarounds; the planned fix is moving members' videos to Cloudflare Stream later.
- Secrets go only in `.env.local` (and Cloudflare secrets in production). Keep `.env.example` updated with variable names only.

## Environment variables

```
MONGODB_URI=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
NEXT_PUBLIC_SITE_URL=
```

## Commands

```
npm run dev           # local dev server (http://localhost:3000), Node runtime
npm run build         # plain Next.js build
npm run preview       # Cloudflare build + run in the real Workers runtime (http://localhost:8787): use before every deploy
npm run deploy        # Cloudflare build + deploy to workers.dev (needs `npx wrangler login` once)
npm run lint          # ESLint
npm run format        # Prettier (also sorts Tailwind classes); format:check to verify
npm run seed          # copy lib/syllabus.ts into MongoDB (needs MONGODB_URI in .env.local)
npx tsc --noEmit      # type-check
```

No test runner is set up.

## Code style

- TypeScript strict; avoid `any`.
- `"use client"` only for interactive parts (player, forms, menus).
- One component per file; short comments explaining _why_.
- API responses: `{ ok: true, data }` or `{ ok: false, error }`.

## Design

- Clean, friendly, student-focused; large readable text; high contrast; mobile-first (check every page at phone width).
- Colours are Tailwind v4 tokens in the `@theme` block of `app/globals.css` (there is no `tailwind.config`). Use token classes (`bg-brand`, `text-ink`, `bg-blush`, `bg-lavender`, `text-body`, `text-muted`, `border-line`, `bg-surface`, `rounded-card`, `shadow-card`), never raw hex values in components.
- Pink (`brand`, #FF2D68) for primary CTAs and highlights; indigo (`ink`) for headings, nav, footer; white dominant, blush/lavender used sparingly; 16px rounded cards, subtle shadows. Keep the same colours across every area (home, lessons, live, dashboard, admin).
- For pink **text** use `text-brand-ink` (#D81B55): #FF2D68 is only 3.6:1 on white. `text-muted` is #6B7091 (not the palette's #74799A) to pass 4.5:1.
- Font: Plus Jakarta Sans via `next/font` (`--font-jakarta`). Base element styles go inside `@layer base` in `globals.css`; unlayered CSS overrides Tailwind utilities.
- Fast on slow mobile data: lazy-load YouTube players (show a thumbnail first, load the player on tap).

## Before marking any task done

1. `npm run build` passes with no errors.
2. Page works at phone width and desktop width.
3. Logged-out, student, member and admin views checked where relevant.
4. No members-only YouTube ID visible to a non-member (check the page source).
5. `ROADMAP.md` checkbox ticked; "Current phase" line updated if a phase finished.
