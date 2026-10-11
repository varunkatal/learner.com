# Educational Video Platform — Roadmap (Plan A: Zero Cost)

> Owner: Varun · Started: October 2026
> Working name: **LearnerHub** · Address: `learnerhub.<account>.workers.dev` (free) → custom domain later
> Target: up to **50 students** · Running cost: **₹0/month**

A website where Varun's students log in, watch lessons in order (Class → Subject → Chapter), download notes, and join live classes. Some lessons are **free**, the rest are for **members** who pay Varun directly by UPI.

---

## Guiding principles

1. **₹0 running cost.** Use only free plans. Upgrade only when a real problem appears (see "Future upgrades").
2. **One phase at a time.** Finish, test with real students, then move on.
3. **Simple and working beats feature-rich.**
4. **Mobile first.** Most students watch on phones.
5. **Easy to upgrade later.** Videos, payments and hosting are each kept behind one small module so they can be swapped without rebuilding.

---

## Zero-cost stack

| Need            | Choice                                                                   | Cost                                        |
| --------------- | ------------------------------------------------------------------------ | ------------------------------------------- |
| Website         | Next.js (App Router) + TypeScript + Tailwind CSS                         | Free                                        |
| Hosting         | Cloudflare Workers (free plan) via OpenNext adapter                      | ₹0                                          |
| Database        | MongoDB Atlas free cluster (M0) + Mongoose                               | ₹0                                          |
| Login           | Auth.js with **Google login only** (no passwords, no email service)      | ₹0                                          |
| Recorded videos | **YouTube unlisted**, embedded on the site                               | ₹0                                          |
| Live classes    | **YouTube Live unlisted**, link shown only to members                    | ₹0                                          |
| Notes / PDFs    | Google Drive share links                                                 | ₹0                                          |
| Payments        | **UPI QR code**; student submits transaction ID; Varun approves in admin | ₹0, keep 100%                               |
| Mobile app      | Installable web app (PWA)                                                | ₹0                                          |
| Domain          | Free `workers.dev` address                                               | ₹0 (custom domain optional, ~₹500–1,000/yr) |

**Accepted trade-off:** unlisted YouTube links can be shared by a member. Reduced by keeping notes/tests on the site, saying the site name in each video, and re-uploading a video if its link leaks.

---

## Content structure

```
Class (e.g. Class 9)
 └── Subject (e.g. Science)
      └── Chapter (e.g. Ch 1 – Matter in Our Surroundings)
           └── Lesson (YouTube video) — FREE or MEMBERS
                └── Notes (Google Drive link)
```

**Membership:** a student pays a fixed amount by UPI for a period (e.g. 1 month / 3 months / full year). After approval, all MEMBERS lessons and live classes unlock until the expiry date.

---

## Phase 0 — Setup (1–2 days)

**Goal:** an empty project that runs locally and is live online for free.

- [x] Decide site name (LearnerHub)
- [x] Create GitHub repository
- [x] Create Next.js + TypeScript + Tailwind project, set up for Cloudflare Workers with `@opennextjs/cloudflare` (`npm run preview` runs it locally)
- [x] Add `CLAUDE.md`, `ROADMAP.md`, `.env.example`, `.gitignore`
- [ ] Create MongoDB Atlas free cluster (new project)
- [ ] **Test:** a page on Cloudflare Workers that reads one record from MongoDB. If this fails after reasonable effort, stop and decide the fallback with Varun before continuing
- [ ] Deploy to `learnerhub.<account>.workers.dev`

**Done when:** a "Coming soon" page loads on the phone from the `workers.dev` address and shows data from MongoDB.

---

## Phase 1 — Public pages (1 week)

**Goal:** a clean, fast, mobile-friendly public website.

- [x] Colours, fonts, logo, basic components (button, card, badge)
- [x] Header with mobile menu, footer
- [x] Home page: intro, classes offered, how membership works, a few free lessons
- [x] About, Contact (WhatsApp link), Privacy Policy, Terms pages
- [x] Classes → Subjects → Chapters pages (sample data)
- [x] Page titles and descriptions for SEO

**Done when:** a visitor on a phone can browse Class → Subject → Chapter smoothly.

---

## Phase 2 — Login and admin panel (1 week)

**Goal:** students sign in with Google; Varun manages the course structure.

- [ ] Google login with Auth.js
- [ ] User saved in MongoDB on first login (role `student` by default)
- [ ] Varun's Gmail set as `admin` via config
- [ ] Protected `/admin` area (server-side role check)
- [ ] Admin: add / edit / reorder / publish Classes, Subjects, Chapters
- [ ] Student profile page: name, class, WhatsApp number

**Done when:** Varun can log in as admin and build the real syllabus; a student can log in with Gmail.

---

## Phase 3 — Video lessons (1 week)

**Goal:** Varun pastes a YouTube link and the lesson appears in the right chapter.

- [ ] Admin: add lesson — paste YouTube link (site extracts the video ID), title, description, chapter, order, FREE / MEMBERS, notes link
- [ ] Lesson page: embedded player (`youtube-nocookie.com`), description, notes button, next / previous lesson
- [ ] FREE lessons: anyone can watch
- [ ] MEMBERS lessons: video ID is **only sent from the server to active members**; others see a locked card with "Become a member"
- [ ] Chapter page shows lock icons on members-only lessons

**Done when:** a free lesson plays for a logged-out visitor, and a members-only lesson shows as locked.

---

## Phase 4 — Membership by UPI (1 week)

**Goal:** students pay by UPI and Varun unlocks them in two taps.

- [ ] Membership plans in `config/plans.ts` (name, price, days)
- [ ] "Become a member" page: choose plan, UPI QR code + UPI ID, amount shown
- [ ] Student submits UPI transaction ID (UTR) after paying → request saved as `pending`
- [ ] Admin: pending requests list → check UPI app → **Approve** / **Reject**
- [ ] Approve sets membership `active` with expiry date
- [ ] Student sees status: pending / active (valid till …) / expired
- [ ] Expired members automatically lose access; renew button shown
- [ ] Admin: manually add or extend a student's membership (for cash payments)

**Done when:** a test student pays ₹1 by UPI, submits the UTR, gets approved, and the members-only lessons unlock.

**Milestone:** launch to the first batch of students.

---

## Phase 5 — Student dashboard and progress (1 week)

**Goal:** students know where they left off.

- [ ] Track watching with the YouTube IFrame Player API (save position every ~15 seconds)
- [ ] Resume from last position
- [ ] Mark lesson complete at ~90% watched
- [ ] Dashboard: continue watching, chapter progress bars, membership expiry
- [ ] Admin: student list with membership status and lessons completed

**Done when:** a student stops halfway on the phone and resumes at the same point on a laptop.

---

## Phase 6 — Live classes (3–4 days)

**Goal:** members join live classes from the website.

- [ ] Admin: schedule a live class (title, date/time, class/subject, FREE / MEMBERS, YouTube Live link)
- [ ] Students see "Upcoming live classes" on their dashboard
- [ ] Live page: embedded YouTube Live player with live chat, visible only to allowed students
- [ ] After class: one click turns the live class into a normal lesson in the right chapter (same YouTube video)
- [ ] Optional: "Join live" WhatsApp message text generated for Varun to send

**Done when:** a test live class runs from OBS → YouTube Live and members watch it on the website.

---

## Phase 7 — Installable app (PWA) (2–3 days)

**Goal:** students "install" the site on Android and iPhone home screens.

- [ ] Web app manifest, icons, splash colour
- [ ] Offline fallback page
- [ ] Install prompt / instructions page for Android and iPhone

**Done when:** the site opens full-screen from the home-screen icon on both phones.

---

## Future upgrades (only when needed)

| When this happens                        | Upgrade                                                | Approx. cost                      |
| ---------------------------------------- | ------------------------------------------------------ | --------------------------------- |
| Want a professional address              | Custom domain (`.in` / `.com`)                         | ~₹500–1,000/year                  |
| Site outgrows the free hosting limit     | Cloudflare Workers Paid                                | $5/month                          |
| Too many UPI approvals to handle by hand | Razorpay (automatic unlock)                            | ~2% per payment                   |
| Members-only video links start leaking   | Cloudflare Stream for members' videos (expiring links) | Pay per minute watched            |
| YouTube channel crosses ~500 subscribers | Consider YouTube channel memberships                   | YouTube keeps 30%                 |
| Want Play Store / App Store apps         | Expo (React Native) app on the same backend            | $25 once (Google), $99/yr (Apple) |
| More than ~50–100 students               | Review database and hosting usage                      | Free tiers may still be enough    |

---

## Open decisions

| #   | Decision                       | Needed by |
| --- | ------------------------------ | --------- |
| 1   | Site name                      | Phase 0   |
| 2   | Classes and subjects at launch | Phase 1   |
| 3   | Logo and colours               | Phase 1   |
| 4   | Membership plans and prices    | Phase 4   |
| 5   | UPI ID / QR code to display    | Phase 4   |
