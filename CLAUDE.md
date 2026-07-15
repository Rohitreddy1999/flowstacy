# FLOWSTACY — Claude Code Context
Last updated: July 2026 | Last session: 2026-07-15 (session 3) — Onboarding flow visual redesign (complete)

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
- Fonts: Hanken Grotesk throughout (Space Grotesk retired from new work)

---

## WHAT IS BUILT AND WORKING
- Auth flow: login, signup, protected routes via ProtectedRoute.jsx
- Onboarding + Discovery + Recommendation flow — V2 redesign complete (slide+blur transitions, spring cards, AnimatePresence CTAs, weighted scoring Q2–Q6)
- Track select + Subtrack select — V2 redesign complete; shared via TrackSelectScreen.jsx
- Home page with hold-to-complete interaction and daily curriculum content
- Progress page (The Ascent)
- Graduation page (structure exists, needs emotional polish)
- Community page (basic)
- Settings + Profile
- BottomNav, PhoneFrame (desktop), LoadingScreen, AuroraBackground
- PWA install prompt
- Gym & Weightlifting 21-day curriculum in Supabase (Foundation / Build / Commit phases)
- Music Theory Fundamentals 21-day curriculum in Supabase (Rhythm path)
- Art & Sketching Fundamentals 21-day curriculum in Supabase (Express path)
- Gratitude & Reflection Practice 21-day curriculum in Supabase (Mindful path)
- curriculum_days table now has 105 rows total (5 subtracks × 21 days)
- Supabase as source of truth for journey state (migration complete — localStorage keys removed)
- src/lib/journeyService.js — getActiveJourney, createJourney, completeDay, calculateStreak
- src/lib/journeyStore.js — Zustand store: journey, currentDay, streak, completedDays, hydrate, markDayComplete, reset
- TrackSelectScreen.jsx — new shared component used by both Recommendation.jsx and TrackSelect.jsx; uses local TRACKS config (no Supabase fetch needed for track list)
- App.jsx hydrates store on login + clears stale localStorage keys on boot (flowstacy_current_day, completed_days, streak, reflections, selected_track, selected_subtrack, scores, open_answer)
- Home.jsx reads from journeyStore, calls completeDay() on hold-to-complete
- Progress.jsx (The Ascent) reads journey/currentDay/streak/completedDays from journeyStore — phase %, arc dots, DNA ring, and chart all driven by Supabase data

---

## WHAT IS INCOMPLETE OR NEEDS WORK
- Graduation screen — needs progress visualization and emotional moment
- Micro-interactions — Framer Motion underused in the daily Home flow
- Missed-day handling — no strategy built yet
- Design system inconsistency — V1 CSS vars remain in Welcome, Login, Signup, Community (migrate to V2)
- No subscription or paywall mechanism
- No cross-track user profile architecture
- React Query installed but not yet used widely

---

## SUBTRACK REGISTRY (as of 2026-07-14)
| Key | UUID | Path |
|---|---|---|
| gym | e50741ee-e792-4220-8e68-4f231dc44bc3 | Move |
| breathwork | 5e2368f6-0d47-4722-b0df-5a1478ca0cee | Calm |
| music_theory | db822e9e-24d6-46dc-8cd7-b59a8811f9b0 | Rhythm |
| art_sketching | eb55db2d-7766-41b0-bac5-070bb3bc8efe | Express |
| gratitude_reflection | c111d349-7be4-4898-b85d-1779c8452371 | Mindful |

---

## DESIGN SYSTEM

**V1 — CSS variables** (src/styles/flowstacy.css) — Welcome, Login, Signup, Community, Experts, TrackDetail (remaining V1 pages)
- Background: #0A0812 | Card: rgba(255,255,255,0.05) | Purple: #534AB7 / #9D92F8 | Teal: #1D9E75

**V2 — inline constants** — Home, Progress, Graduation, BottomNav, Onboarding, Bridge, Discovery, Recommendation, TrackSelect, SubTrackSelect, QuestionScreen, TrackSelectScreen
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
- src/pages/Onboarding.jsx — life stage question (Q1, pre-step, no dots)
- src/pages/Bridge.jsx — guided vs direct routing (→ /discovery or /track-select)
- src/pages/Discovery.jsx — Q2–Q6 weighted scoring; trackScores { Move, Calm, Mindful, Express, Rhythm }
- src/components/QuestionScreen.jsx — shared question UI: slide+blur, spring cards, shake on max-select, AnimatePresence CTA
- src/components/TrackSelectScreen.jsx — shared track picker used by Recommendation + TrackSelect; props: recommendedTrack, backTo
- src/pages/Recommendation.jsx — thin wrapper: reads flowstacy_scores, passes top scorer to TrackSelectScreen
- src/pages/TrackSelect.jsx — thin wrapper: TrackSelectScreen backTo="/bridge"
- src/pages/SubTrackSelect.jsx — subtrack picker; all Supabase upsert logic lives here
- src/lib/curriculum.js — getDayContent(), subtrack resolution, SUBTRACK_IDS
- src/lib/tracks.jsx — TRACKS array, canonical track/subtrack structure (do not touch)
- src/styles/flowstacy.css — V1 CSS variables

## ANIMATION PATTERNS (V2)
- Screen transition: `x: '100%'→0→'-100%'`, `filter: 'blur(6px)'→0→'blur(6px)'`, spring stiffness 280 damping 28
- Card entry stagger: scale 0.96→1, y 16→0, 80ms delay per card, spring stiffness 320 damping 26
- Checkmark: spring stiffness 520 damping 20
- Progress pill dots: spring stiffness 300 damping 30
- CTA slide-up: AnimatePresence, y 20→0, spring stiffness 420 damping 30
- Shake on max-select: `x: [0,-9,9,-7,7,-4,4,0]`, 500ms, then reset
- Ghost background number: 200px Hanken Grotesk, opacity 0.15, 5s drift up (y 0→-30)

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
