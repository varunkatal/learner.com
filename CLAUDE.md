# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Read this file and `ROADMAP.md` before starting any task.

## Repository state

GitHub: https://github.com/varunkatal/learner.com (branch `main`). Phase 0's code setup and most of Phase 1 are built (see `ROADMAP.md` checkboxes). Folders marked "later" below don't exist yet.

**Next.js 16.4 with Cache Components** (`cacheComponents` + `partialPrefetching` in `next.config.ts`). APIs differ from older Next.js — read the bundled docs in `node_modules/next/dist/docs/` before using an unfamiliar API (see `AGENTS.md`). Key rules here:

- Data functions are marked `"use cache"` so pages prerender as static HTML. Uncached data or runtime APIs (`cookies()`, `headers()`, `new Date()`) in a page must sit inside `<Suspense>` or the build fails.
- Dynamic routes export `generateStaticParams`; `params` is a Promise (`await params`). Type props with the generated `PageProps<"/route">` / `LayoutProps<"/route">` helpers (`npx next typegen` regenerates them).
- `dynamicParams` is unavailable; unknown slugs call `notFound()` (served with `noindex`).

## How data flows (Phase 1)

`lib/syllabus.ts` holds the NCERT 2026–27 syllabus (Classes 6–10, Maths + Science) and is the single source for now. Pages never read it directly — they call `lib/catalog.ts` (`getClasses`, `getClass`, `getSubject`). In Phase 2, swap those function bodies for MongoDB queries; pages stay unchanged. `npm run seed` copies the syllabus into MongoDB (idempotent upserts).

## Project

**[mathslearner]** — an educational video platform for Indian school students (CBSE/ICSE). The owner, Varun, is a teacher who uploads recorded lessons, sells some content, and will run live classes. Later the same backend will power Android and iPhone apps.

- Content: Class → Subject → Chapter → Video (+ notes PDFs)
- Access: mix of **free** and **paid** videos
- Live classes: planned for Phase 5
- Mobile apps: PWA in Phase 6, Expo (React Native) in Phase 7

**Current phase:** Phase 1 — Foundation & public pages (Phase 0 still needs domain, MongoDB Atlas and Vercel deploy). Update this line when a phase is completed.

## How to work with Varun

- Work **one phase at a time**, following `ROADMAP.md`. Do not build features from later phases unless asked.
- **Explain what you are building and why** before and after each step. Varun wants to understand the code, not just receive it.
- Prefer **simple, working solutions** over clever or feature-heavy ones.
- Deliver in small steps that can be run and tested immediately. Give the exact terminal commands to run.
- When finishing a task, tick the matching checkbox in `ROADMAP.md`.
- Ask before adding a new paid service or a large dependency.
- Varun works on a Mac in VS Code. Watch for wrong-directory and port-conflict issues when giving commands.

## Tech stack

- **Framework:** Next.js (App Router), TypeScript, React Server Components by default
- **Styling:** Tailwind CSS; reusable UI components in `components/ui/`
- **Database:** MongoDB Atlas with Mongoose
- **Auth:** Auth.js (NextAuth) — credentials + Google; JWT sessions with `role: "student" | "admin"`
- **Video:** Cloudflare Stream or Bunny Stream (decided in Phase 2), always accessed through `lib/video/`
- **Files:** Cloudinary or Cloudflare R2 for PDFs and images
- **Payments:** Razorpay (Phase 4)
- **Email:** Resend
- **Hosting:** Vercel; DNS on Hostinger
- **Validation:** Zod for all API inputs and forms

## Folder structure (planned)

```
app/
  (public)/            # home, classes → subject → chapter list, about, contact, legal pages
  (auth)/              # later: login, signup, reset password
  (student)/dashboard/ # later: student area (login required)
  admin/               # later: admin panel (role = admin)
  api/v1/              # later: all API routes — versioned so mobile apps can use them
  sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg
components/
  ui/                  # Button, ButtonLink, Card, Badge, Container, SectionHeading, Breadcrumbs, Prose
  layout/              # header, mobile menu (only client component), footer, logo
  catalog/             # class/subject cards, chapter list
  home/                # home page sections
  video/               # later: player, upload, lesson list
lib/
  syllabus.ts          # NCERT syllabus data + slugs (source of truth in Phase 1)
  catalog.ts           # data access used by pages ("use cache")
  db.ts                # cached Mongoose connection
  auth.ts, video/, payments/, validators/   # later
models/                # Mongoose models (Class, Subject, Chapter so far)
scripts/seed.ts        # seeds MongoDB from lib/syllabus.ts
config/
  site.ts              # site name, contact, legal details, nav, testimonials
```

Keep configuration (site name, prices, limits, feature flags) in `config/` — never hard-code it inside components.

## Data models

- **User** — name, email, passwordHash (optional for Google), image, role, grade, phone, emailVerified, createdAt
- **Class** — name (e.g. "Class 9"), slug, order, isPublished
- **Subject** — classId, name, slug, book (textbook name), order, thumbnail, isPublished
- **Chapter** — subjectId, title, slug, order (across the subject), part (textbook Part I/II), number (as printed within its part), isPublished
- **Video** — chapterId, title, slug, description, order, access (`free` | `paid`), provider, providerVideoId, status (`uploading` | `processing` | `ready` | `failed`), durationSec, thumbnailUrl, attachments[{ title, url }], isPublished, createdAt
- **Progress** — userId, videoId, positionSec, completed, updatedAt (unique on userId + videoId)
- **Product** (Phase 4) — type (`course` | `subscription`), title, price (paise), validityDays, includes (class/subject IDs)
- **Purchase** (Phase 4) — userId, productId, razorpayOrderId, razorpayPaymentId, amount, status, validUntil
- **LiveSession** (Phase 5) — title, classId, subjectId, scheduledAt, access, status (`scheduled` | `live` | `ended`), providerLiveId, recordingVideoId

Store money in **paise** as integers. Store times in **UTC**; display in IST (Asia/Kolkata).

## Video rules (important)

- **Never upload video files through our own server or Vercel functions.** Request a one-time upload URL from the video host in an API route, then upload **directly from the browser** to the host (resumable upload with progress).
- The video host notifies us through a **webhook** when processing finishes; verify the webhook signature, then set `status: "ready"`, duration and thumbnail.
- Free videos may use public playback. **Paid videos must use signed, short-lived playback URLs**, generated server-side only after checking the user's access.
- All provider-specific code lives in `lib/video/`. The rest of the app calls functions like `createUploadUrl()`, `getPlaybackUrl(video, user)`, `handleWebhook()` and never imports the provider SDK directly.

## Security rules

- Secrets only in `.env.local` (and Vercel env settings). Keep `.env.example` updated with variable **names**, never values.
- Check auth and role on the **server** in every admin route and API route — never trust the client.
- Validate every request body with Zod.
- Verify Razorpay payment signatures and webhooks server-side before granting access.
- Never expose stream keys, API tokens or signing keys to the browser.

## Environment variables

```
MONGODB_URI=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
VIDEO_PROVIDER=          # cloudflare | bunny
VIDEO_API_TOKEN=
VIDEO_ACCOUNT_ID=
VIDEO_SIGNING_KEY=
VIDEO_WEBHOOK_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

## Commands

```
npm run dev           # local dev server (http://localhost:3000)
npm run build         # production build — run before every deploy
npm run lint          # ESLint
npm run format        # Prettier (also sorts Tailwind classes)
npm run format:check
npm run seed          # copy lib/syllabus.ts into MongoDB (needs MONGODB_URI in .env.local)
npx tsc --noEmit      # type-check
```

No test runner is set up yet.

## Code style

- TypeScript strict mode; no `any` unless explained.
- Server Components by default; add `"use client"` only for interactive parts.
- Small components; one component per file.
- Mobile-first Tailwind classes; test every page at phone width.
- Meaningful names; short comments explaining _why_, not _what_.
- API responses: `{ ok: true, data }` or `{ ok: false, error }`.

## Design

- Clean, friendly, student-focused; large readable text; high contrast.
- Colours are Tailwind v4 tokens in the `@theme` block of `app/globals.css` (there is no `tailwind.config`). Use token classes (`bg-brand`, `text-ink`, `bg-blush`, `bg-lavender`, `text-body`, `text-muted`, `border-line`, `rounded-card`, `shadow-card`), never raw hex values in components.
- Pink (`brand`) for primary CTAs and highlights; indigo (`ink`) for headings, nav, footer; white dominant, blush/lavender used sparingly; 16px rounded cards.
- For pink **text** use `text-brand-ink` (#D81B55) — `#FF2D68` is only 3.6:1 on white. `text-muted` is #6B7091 (slightly darker than the palette's #74799A) to pass 4.5:1.
- Font: Plus Jakarta Sans via `next/font` (`--font-jakarta`).
- Base element styles go inside `@layer base` in `globals.css`; unlayered CSS overrides Tailwind utilities.
- Fast on slow mobile data: optimise images with `next/image`, lazy-load video players.

## Before marking any task done

1. `npm run build` passes with no errors.
2. Page works at phone width and desktop width.
3. Logged-out, student and admin views checked where relevant.
4. `ROADMAP.md` checkbox ticked; "Current phase" line above updated if a phase finished.
