# Educational Video Platform — Roadmap

> Owner: Varun · Started: October 2026
> Working name: **[SITE NAME]** · Domain: **[DOMAIN]** (to be decided)

A separate educational website where Varun uploads recorded lessons, offers a mix of **free and paid** content, runs **live classes**, and later ships **Android and iPhone apps** on the same backend.

---

## Guiding principles

1. **One phase at a time.** Finish, test with real videos and real users, then move on.
2. **Simple and working beats feature-rich.** Every phase ends with something usable.
3. **Videos never live on our own server.** A video hosting service stores, converts and streams them. Our site stores only _information about_ videos.
4. **Build for mobile first.** Most students will watch on phones over mobile data.
5. **Build the backend once.** The website and future apps share the same API and database.

---

## Tech stack

| Layer                          | Choice                                                        | Why                                                             |
| ------------------------------ | ------------------------------------------------------------- | --------------------------------------------------------------- |
| Website                        | Next.js (App Router) + TypeScript + Tailwind CSS              | Already used on mathslearner; SEO-friendly; API routes built in |
| Hosting                        | Vercel                                                        | Free tier to start, easy deploys from GitHub                    |
| Domain / DNS                   | Hostinger                                                     | Already familiar                                                |
| Database                       | MongoDB Atlas + Mongoose                                      | Already familiar; flexible for course structure                 |
| Auth                           | Auth.js (NextAuth) — email/password + Google login            | Role-based sessions (student / admin)                           |
| Video hosting                  | Cloudflare Stream **or** Bunny Stream (final pick in Phase 2) | Adaptive quality, CDN, signed URLs; Cloudflare also does live   |
| Files (notes PDFs, thumbnails) | Cloudinary or Cloudflare R2                                   | Cheap file storage                                              |
| Payments                       | Razorpay                                                      | Indian payments: UPI, cards, netbanking                         |
| Email                          | Resend (or similar)                                           | Welcome, password reset, payment receipts                       |
| Live streaming                 | OBS Studio → video host's live input                          | Free software, professional output                              |
| Mobile apps                    | PWA first → Expo (React Native)                               | Instant install now; store apps later on same API               |

---

## Content structure

```
Class (e.g. Class 9)
 └── Subject (e.g. Science)
      └── Chapter (e.g. Ch 1 – Matter in Our Surroundings)
           └── Video (lesson) — marked FREE or PAID
                └── Attachments (notes PDF, worksheet)
```

**Paid access model (decide in Phase 4):**

- Option A — buy a whole **course** (e.g. "Class 9 Science full year")
- Option B — monthly/yearly **subscription** to everything
- Option C — both

---

## Phase 0 — Setup (1–2 days)

**Goal:** an empty project that runs locally and deploys online.

- [ ] Decide site name and buy domain
- [x] Create GitHub repository
- [x] Create Next.js + TypeScript + Tailwind project
- [x] Add `CLAUDE.md`, `ROADMAP.md`, `.env.example`, `.gitignore`
- [ ] Create MongoDB Atlas cluster (new project, not mathslearner's)
- [ ] Deploy to Vercel, connect domain via Hostinger DNS
- [x] Set up ESLint + Prettier

**Done when:** a "Coming soon" page is live on the real domain.

---

## Phase 1 — Foundation & public pages (1–2 weeks)

**Goal:** a good-looking, fast, mobile-friendly public website.

- [x] Design system: colours, fonts, logo, button and card components
- [x] Layout: header with navigation, footer, mobile menu
- [x] Home page: hero, featured classes, how it works, free lessons preview, testimonials placeholder
- [x] Classes page → Subjects page → Chapter list page (using sample data)
- [x] About, Contact, Privacy Policy, Terms, Refund Policy pages (Razorpay requires the last three)
- [ ] Database models: Class, Subject, Chapter (seed with real syllabus)
- [x] SEO basics: page titles, descriptions, sitemap, Open Graph images
- [ ] Lighthouse check on mobile (aim 90+ performance)

**Done when:** a visitor on a phone can browse Class → Subject → Chapter smoothly.

---

## Phase 2 — Video library & admin panel (2–3 weeks)

**Goal:** Varun can upload a video from the browser and students can watch it.

- [ ] Compare Cloudflare Stream vs Bunny Stream on current pricing, live support, India delivery; pick one
- [ ] Video provider wrapper (`lib/video/`) so the provider can be swapped later
- [ ] Admin login (role = admin) and protected `/admin` area
- [ ] Admin: create/edit/reorder Classes, Subjects, Chapters
- [ ] Admin: upload video **directly from browser to video host** (resumable upload, progress bar)
- [ ] Webhook from video host → mark video `ready`, save duration and thumbnail
- [ ] Admin: set title, description, chapter, order, **Free/Paid** flag, attach notes PDF
- [ ] Public video page: player, description, notes download, next/previous lesson
- [ ] Free videos playable by anyone

**Done when:** upload a real 30-minute lesson, see it on a phone within minutes, in good quality on slow data.

---

## Phase 3 — Student accounts (2 weeks)

**Goal:** students sign up and the site remembers them.

- [ ] Sign up / login with email + password and Google
- [ ] Email verification and password reset
- [ ] Student dashboard: "Continue watching", recently added, my courses
- [ ] Watch progress saved (resume where left off, mark lesson complete)
- [ ] Chapter progress bar (e.g. 6 of 10 lessons done)
- [ ] Profile page: name, class, phone (optional)
- [ ] Admin: list of students, basic stats (sign-ups, most-watched videos)

**Done when:** a student can log in on phone, stop halfway, and resume on laptop at the same point.

**Milestone:** soft launch with free content only.

---

## Phase 4 — Payments & paid content (2–3 weeks)

**Goal:** paid videos are locked and can be unlocked by paying.

- [ ] Decide pricing model (course / subscription / both)
- [ ] Razorpay account + KYC; test mode first
- [ ] Course/Plan model with price and validity period
- [ ] Checkout flow → Razorpay → webhook verifies payment → grant access
- [ ] Paid videos use **signed, expiring playback URLs** (generated only for students with access)
- [ ] Locked state on paid videos: preview/thumbnail + "Unlock" button
- [ ] Purchase history and GST-ready receipts emailed to student
- [ ] Admin: payments list, grant/revoke access manually, coupon codes
- [ ] Access expiry handled automatically

**Done when:** a test payment unlocks a paid video, and the video link does not work if copied to a logged-out browser.

**Milestone:** public launch with free + paid content.

---

## Phase 5 — Live classes (2–3 weeks)

**Goal:** Varun teaches live; recordings land in the library automatically.

- [ ] Set up live input on video host; connect OBS on laptop
- [ ] Admin: schedule a live class (title, time, free/paid, class/subject)
- [ ] Students see upcoming live classes + reminder email
- [ ] Live page: player with low delay + live chat (real-time)
- [ ] Admin chat moderation (delete message, mute student)
- [ ] After class: recording auto-saved as a video in the right chapter
- [ ] Paid live classes visible only to students with access

**Done when:** a 1-hour live class runs smoothly for test students and appears as a recording afterwards.

---

## Phase 6 — Installable web app (PWA) (1 week)

**Goal:** students can "install" the site on Android and iPhone home screens.

- [ ] Web app manifest, app icons, splash screen
- [ ] Offline fallback page
- [ ] Push notifications for new videos and live classes (where supported)
- [ ] Test install on Android Chrome and iPhone Safari

**Done when:** the site opens full-screen from the home-screen icon on both platforms.

---

## Phase 7 — Native mobile apps (4–6 weeks)

**Goal:** real apps on Google Play and Apple App Store.

- [ ] Make sure every feature is available through clean API routes (`/api/v1/...`) with token auth
- [ ] Expo (React Native) project: login, browse, player, dashboard, live
- [ ] Native video player with the same signed URLs
- [ ] Push notifications via Expo
- [ ] Google Play developer account; Apple developer account
- [ ] Check store rules on in-app payments for digital content before launch
- [ ] Beta testing (Play internal testing, Apple TestFlight)
- [ ] Store listings: screenshots, descriptions, privacy policy

**Done when:** both apps are approved and live in the stores.

---

## Phase 8 — Growth features (ongoing, pick as needed)

- Quizzes after each lesson, with scores
- Doubts / comments under videos
- Downloadable lessons for offline viewing in the app
- Certificates on course completion
- Analytics: watch time, drop-off points, revenue
- Teacher accounts (other teachers upload content)
- Hindi / Punjabi interface

---

## Running costs to watch

Review monthly once real usage starts:

- Video hosting (grows with minutes stored and minutes watched — the biggest cost)
- MongoDB Atlas (free tier at first)
- Vercel (free tier at first)
- Domain renewal
- Razorpay fees per transaction
- Apple developer account (yearly) and Google Play account (one-time)

---

## Open decisions

| #   | Decision                          | Needed by |
| --- | --------------------------------- | --------- |
| 1   | Site name and domain              | Phase 0   |
| 2   | Classes and subjects at launch    | Phase 1   |
| 3   | Logo, colours, reference sites    | Phase 1   |
| 4   | Expected hours of video per month | Phase 2   |
| 5   | Cloudflare Stream vs Bunny Stream | Phase 2   |
| 6   | Pricing model and prices          | Phase 4   |
