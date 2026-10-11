# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Read this file and `ROADMAP.md` before starting any task.

## Repository state

GitHub: https://github.com/varunkatal/learner.com (branch `main`). As of October 2026 the repo contains only planning docs (`CLAUDE.md`, `ROADMAP.md`) and `.gitignore` — no Next.js project or `package.json` yet. The folder structure, models and commands below describe the **intended** architecture; scaffold them as Phase 0/1 tasks call for them, and update this file if reality diverges from the plan.

## Project

**[SITE NAME]** — an educational video platform for Indian school students (CBSE/ICSE). The owner, Varun, is a teacher who uploads recorded lessons, sells some content, and will run live classes. Later the same backend will power Android and iPhone apps.

- Content: Class → Subject → Chapter → Video (+ notes PDFs)
- Access: mix of **free** and **paid** videos
- Live classes: planned for Phase 5
- Mobile apps: PWA in Phase 6, Expo (React Native) in Phase 7

**Current phase:** Phase 0 — Setup. Update this line when a phase is completed.

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
  (public)/            # home, classes, subjects, chapters, video pages, about, legal
  (auth)/              # login, signup, reset password
  (student)/dashboard/ # student area (login required)
  admin/               # admin panel (role = admin)
  api/v1/              # all API routes — versioned so mobile apps can use them
components/
  ui/                  # buttons, cards, inputs, modals
  video/               # player, upload, lesson list
  layout/              # header, footer, nav
lib/
  db.ts                # cached Mongoose connection
  auth.ts              # Auth.js config
  video/               # video provider wrapper (upload, signed URLs, webhooks)
  payments/            # Razorpay helpers
  validators/          # Zod schemas
models/                # Mongoose models
config/
  site.ts              # site name, contact, social links, feature flags
```

Keep configuration (site name, prices, limits, feature flags) in `config/` — never hard-code it inside components.

## Data models

- **User** — name, email, passwordHash (optional for Google), image, role, grade, phone, emailVerified, createdAt
- **Class** — name (e.g. "Class 9"), slug, order, isPublished
- **Subject** — classId, name, slug, order, thumbnail, isPublished
- **Chapter** — subjectId, title, slug, order, isPublished
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

## Commands (once the Next.js project exists)

```
npm run dev        # local dev server (http://localhost:3000)
npm run build      # production build — run before every deploy
npm run lint       # ESLint
```

## Code style

- TypeScript strict mode; no `any` unless explained.
- Server Components by default; add `"use client"` only for interactive parts.
- Small components; one component per file.
- Mobile-first Tailwind classes; test every page at phone width.
- Meaningful names; short comments explaining *why*, not *what*.
- API responses: `{ ok: true, data }` or `{ ok: false, error }`.

## Design

- Clean, friendly, student-focused; large readable text; high contrast.
- Brand colours and fonts: **[TO BE DECIDED in Phase 1]** — define them once in Tailwind config.
- Fast on slow mobile data: optimise images with `next/image`, lazy-load video players.

## Before marking any task done

1. `npm run build` passes with no errors.
2. Page works at phone width and desktop width.
3. Logged-out, student and admin views checked where relevant.
4. `ROADMAP.md` checkbox ticked; "Current phase" line above updated if a phase finished.
