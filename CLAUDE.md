# FLOWSTACY — Claude Code Context
Last updated: July 2026 | Last session: 2026-07-14 — Progress screen Zustand migration + localStorage cleanup

---

## SESSION RULES
- Read this file first. Do not write any code until task and done-state are confirmed.
- Change only what the prompt explicitly says. No refactoring, cleanup, or bonus features.
- Update this file last — only if something structural changed this session.
- After every session: update this file → review diff → git commit → push.
- For route details → read docs/ROUTES.md. For components → docs/COMPONENTS.md. For schema → docs/SUPABASE.md.

---

## WHAT THIS APP IS
A 21-day habit formation PWA. Users answer discovery questions, pick a track and subtrack, complete one daily task for 21 days, then graduate. Five paths: Move, Rhythm, Express, Calm, Mindful. One subtrack per path is the MVP. Additional subtracks are the paid tier ($2-3/month).

---

## TECH STACK
- UI: React 19 + Vite 8
- Styling: Tailwind CSS 3 (available) + inline JS objects (dominant pattern)
- Design system: src/styles/flowstacy.css
- Animation: Framer Motion 12
- Routing: React Router DOM 7 + AnimatePresence wrapping route tree
- Backend: Supabase 2 (auth + DB + RLS)
- State: Zustand 5
- PWA: vite-plugin-pwa
- Deploy: Vercel → master branch auto-deploy
- Fonts: Space Grotesk (headings) + Hanken Grotesk (body)

---

## WHAT IS BUILT AND WORKING
- Auth flow: login, signup, protected routes via ProtectedRoute.jsx
- Onboarding + Discovery + Recommendation flow
- Track select + Subtrack select
- Home page with hold-to-complete interaction and daily curriculum content
- Progress page (The Ascent)
- Graduation page (structure exists, needs emotional polish)
- Community page (basic)
- Settings + Profile
- BottomNav, PhoneFrame (desktop), LoadingScreen, AuroraBackground
- PWA install prompt
- Gym & Weightlifting 21-day curriculum in Supabase (Foundation / Build / Commit phases)
- Supabase as source of truth for journey state (migration complete — localStorage keys removed)
- src/lib/journeyService.js — getActiveJourney, createJourney, completeDay, calculateStreak
- src/lib/journeyStore.js — Zustand store: journey, currentDay, streak, completedDays, hydrate, markDayComplete, reset
- TrackSelect and SubTrackSelect fetch data from Supabase (tracks/subtracks tables)
- App.jsx hydrates store on login + clears stale localStorage keys on boot (flowstacy_current_day, completed_days, streak, reflections, selected_track, selected_subtrack, scores, open_answer)
- Home.jsx reads from journeyStore, calls completeDay() on hold-to-complete
- Progress.jsx (The Ascent) reads journey/currentDay/streak/completedDays from journeyStore — phase %, arc dots, DNA ring, and chart all driven by Supabase data

---

## WHAT IS INCOMPLETE OR NEEDS WORK
- Onboarding uncomfortable questions — not yet emotionally designed
- Graduation screen — needs progress visualization and emotional moment
- Micro-interactions — Framer Motion underused across the daily flow
- Missed-day handling — no strategy built yet
- Design system inconsistency — V1 CSS vars and V2 inline constants coexist (migrate to V2)
- No subscription or paywall mechanism
- No cross-track user profile architecture
- React Query installed but not yet used widely

---

## WHAT TO BUILD THIS SESSION
TBD next session.

## DEFINITION OF DONE
TBD next session.

---

## DESIGN SYSTEM

**V1 — CSS variables** (src/styles/flowstacy.css) — Welcome, Login, Signup, Onboarding, Bridge, Community, Experts, TrackDetail
- Background: #0A0812 | Card: rgba(255,255,255,0.05) | Purple: #534AB7 / #9D92F8 | Teal: #1D9E75

**V2 — inline constants** — Home, Progress, Graduation, BottomNav
- ABYSS #07090D | FATHOM #0F141A | SURGE #3DF5A6 | GLACIAL #82D4FF | PLASMA #FF4FD8 | ARC_LIGHT #EAFFF5

**Phase colors:**
- Days 1-7 FOUNDATION → GLACIAL | Days 8-14 BUILD → SURGE | Days 15-21 COMMIT → PLASMA

**Migration goal:** All new work uses V2 inline constants. Never introduce new V1 patterns.

---

## KEY FILES
- src/App.jsx — all routes
- src/pages/Home.jsx — daily experience, hold-to-complete, task_description parser at line 116
- src/pages/Graduation.jsx — graduation screen
- src/pages/Progress.jsx — The Ascent progress screen
- src/pages/Onboarding.jsx — discovery questions
- src/lib/curriculum.js — getDayContent(), subtrack resolution, SUBTRACK_IDS
- src/lib/tracks.jsx — TRACKS array, canonical track/subtrack structure
- src/styles/flowstacy.css — V1 CSS variables

---

## FORBIDDEN — NEVER TOUCH
- src/components/ProtectedRoute.jsx — breaking this locks all protected routes
- src/lib/supabase.js — single shared client, never create another
- SUBTRACK_IDS in src/lib/curriculum.js — must match live Supabase UUIDs exactly
- TRACKS in src/lib/tracks.jsx — canonical structure, changes break routing
- Do not introduce new npm packages without explicit approval
- Do not switch from inline style pattern to Tailwind classes mid-component
- Do not refactor working code unless the task explicitly requires it

---

## CODE PATTERNS TO FOLLOW
- task_description format: "What to do: [steps]. Why this matters: [why]" — parser at Home.jsx:116
- Hold-to-complete: 2s pointer hold via requestAnimationFrame, holdProgress (0-1) drives fill animation
- Page layout: BottomNav fixed + maxWidth 480 centered container + paddingBottom 100
- Every new page wraps content in PageTransition component

---

## GIT CONVENTION
feat: new feature
fix: bug fix
style: visual/design only
refactor: restructure, no behavior change
context: CLAUDE.md updated after session
