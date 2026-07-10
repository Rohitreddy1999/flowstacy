# Flowstacy — Claude Code Project Context
<!-- Project renamed from flowstate → Flowstacy -->

## Session Rules
- Read this file first before touching any code.
- Update this file last — only if you've confirmed a structural change.
- Change only what the prompt says. Do not refactor, clean up, or add
  features beyond the stated task.

---

## What Is Flowstacy

A 21-day habit formation web app. Users:
1. Answer 5 discovery questions → receive a track recommendation
2. Pick a track + subtrack
3. Complete one daily task for 21 days (content loaded from Supabase)
4. Graduate at day 21 → connect with verified experts

Target user: mobile-first, ages ~18-35, wants to build a new habit.
Tone: motivational but honest — not hype.

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| UI | React | 19 |
| Build | Vite | 8 |
| Styling | Tailwind CSS | 3 (available but most styles are inline JS objects) |
| Design system | `src/styles/flowstacy.css` | — |
| Animation | Framer Motion | 12 |
| Routing | React Router DOM | 7 |
| Backend | Supabase (auth + DB) | 2 |
| State | Zustand | 5 |
| Toasts | react-hot-toast | 2 |
| Confetti | canvas-confetti | 1 |
| Icons | react-icons/hi2 | 5 |
| Data fetching | @tanstack/react-query | 5 (installed, not yet used widely) |
| PWA | vite-plugin-pwa | 1 |
| Linter | oxlint | 1 |

Fonts (loaded in index.html, referenced in inline styles):
- **Space Grotesk** — hero headings, wordmarks, large numerals
- **Hanken Grotesk** — body text, UI labels, buttons

Deploy: Vercel auto-deploy from `master` branch.
Supabase project ref: `ejgxaejafzhywufiipij`

---

## Route Map

All routes are in `src/App.jsx`. `AnimatePresence` wraps the whole
route tree — every page transition animates automatically.

| Path | Component file | Protected |
|---|---|---|
| `/` | `components/LoadingScreen` | No — self-routes after auth check |
| `/welcome` | `pages/Welcome` | No |
| `/onboarding` | `pages/Onboarding` | No |
| `/bridge` | `pages/Bridge` | No |
| `/track-select` | `pages/TrackSelect` | No |
| `/login` | `pages/Login` | No |
| `/signup` | `pages/Signup` | No |
| `/discovery` | `pages/Discovery` | No |
| `/recommendation` | `pages/Recommendation` | No |
| `/sub-track-select` | `pages/SubTrackSelect` | No |
| `/track/:trackId` | `pages/TrackDetail` | No |
| `/home` | `pages/Home` | **Yes** |
| `/community` | `pages/Community` | **Yes** |
| `/progress` | `pages/Progress` | **Yes** |
| `/progress-preview` | `pages/Progress` | No — dev preview |
| `/graduation-preview` | `pages/Graduation` | No — dev preview |
| `/profile` | `pages/Profile` | **Yes** — immediately redirects to `/settings` |
| `/graduation` | `pages/Graduation` | **Yes** |
| `/experts` | `pages/Experts` | **Yes** |
| `/settings` | `pages/Settings` | **Yes** |

Full per-route details → `docs/ROUTES.md`

---

## Key Components

| File | Purpose |
|---|---|
| `components/ProtectedRoute.jsx` | Checks Supabase session; redirects to /login if missing |
| `components/PhoneFrame.jsx` | On desktop (>480 px) renders a phone-shaped preview frame |
| `components/LoadingScreen.jsx` | Splash screen with lightning animation; auto-routes after 3 s |
| `components/AuroraBackground.jsx` | Fixed animated bg using `.fs-aurora` CSS class |
| `components/BottomNav.jsx` | Fixed bottom nav: Home / Community / Progress / Settings |
| `components/BackButton.jsx` | Simple ← Back button with hover styling |
| `components/InstallPrompt.jsx` | PWA install banner; dismissable via `localStorage` |
| `components/PageTransition.jsx` | Framer Motion page wrapper (opacity+y+scale, 0.4 s) |
| `components/QuestionScreen.jsx` | Reusable question UI for Discovery and Onboarding |
| `components/RootRedirect.jsx` | Legacy redirect helper — not currently mounted in App.jsx |
| `components/SkeletonCard.jsx` | Pulsing placeholder, configurable `height` prop |

Full details → `docs/COMPONENTS.md`

---

## Lib Files

| File | Exports |
|---|---|
| `lib/supabase.js` | `supabase` client (reads `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`) |
| `lib/curriculum.js` | `getDayContent()`, `getSubtrackByName()`, `getSubtracksByTrack()`, `resolveSubtrack()`, `SUBTRACK_IDS`, `SUBTRACK_NAMES` |
| `lib/tracks.jsx` | `TRACKS` array — 5 tracks, subtracks, colors, SVG icons, `available` flags |

---

## LocalStorage Keys

localStorage is the primary state store for the 21-day journey.
Supabase is written to on subtrack selection and read on auth check.

| Key | Value type | Written by |
|---|---|---|
| `flowstacy_life_stage` | string id | Onboarding |
| `flowstacy_selected_track` | track id string | TrackSelect, Recommendation |
| `flowstacy_selected_subtrack` | subtrack short-key or UUID | SubTrackSelect |
| `flowstacy_current_day` | string number 1-21 | Home (on day complete) |
| `flowstacy_streak` | string number | Home (on day complete) |
| `flowstacy_completed_days` | JSON array `{day, completedAt, dayOfWeek}` | Home |
| `flowstacy_reflections` | JSON array `{day, feeling, note, date}` | Home log modal |
| `flowstacy_scores` | JSON object `{trackId: score}` | Discovery |
| `pwa-install-dismissed` | `"true"` | InstallPrompt |

---

## Design System

Two palettes exist in the codebase simultaneously:

**V1 — CSS variables** (`src/styles/flowstacy.css`)
Used on: Welcome, Login, Signup, Onboarding, Bridge, Community, Experts, TrackDetail
- Background: `#0A0812`
- Card: `rgba(255,255,255,0.05)`
- Purple primary: `#534AB7` / light: `#9D92F8`
- Teal: `#1D9E75`

**V2 — inline constants**
Used on: Home, Progress, Graduation, BottomNav
- `ABYSS #07090D` — page background
- `FATHOM #0F141A` — card background
- `SURGE #3DF5A6` — primary action, BUILD phase
- `GLACIAL #82D4FF` — FOUNDATION phase color
- `PLASMA #FF4FD8` — COMMIT phase color
- `ARC_LIGHT #EAFFF5` — near-white accent

Phase system:
| Days | Phase | V2 Color |
|---|---|---|
| 1-7 | FOUNDATION | GLACIAL |
| 8-14 | BUILD | SURGE |
| 15-21 | COMMIT | PLASMA |

Full design spec → `docs/DESIGN.md`

---

## Code Patterns

### task_description parsing
`curriculum_days.task_description` format:
```
What to do: [step sentences]. Why this matters: [why text]
```
Parser lives in `src/pages/Home.jsx:116` — duplicate it if needed in other pages.

### Hold-to-complete interaction
Home's primary CTA uses a 2-second pointer-hold (requestAnimationFrame loop).
`onPointerDown` starts the RAF; `onPointerUp / onPointerLeave / onPointerCancel`
cancel it. `holdProgress` (0-1) drives a fill animation.

### Page pattern
Every main page (post-onboarding) uses:
- `BottomNav` component (fixed)
- Inline `maxWidth: 480` container centered
- `paddingBottom: 100` to clear the nav

---

## What NOT to Touch

- **`src/components/ProtectedRoute.jsx`** — auth gate; breaking it locks all protected routes
- **`src/components/PhoneFrame.jsx`** — desktop preview shell
- **`src/lib/supabase.js`** — single shared client; never create another
- **`SUBTRACK_IDS` in `src/lib/curriculum.js`** — must match live Supabase UUIDs exactly
- **`TRACKS` in `src/lib/tracks.jsx`** — canonical track/subtrack structure
- **`src/styles/flowstacy.css`** — shared CSS variables; edit with care

---

## Supabase Tables

Tables confirmed from code (not all columns are confirmed — see `docs/SUPABASE.md`):
`profiles`, `tracks`, `subtracks`, `curriculum_days`, `user_journeys`,
`daily_completions`, `posts`, `experts`, `expert_offerings`, `bookings`

Full column reference → `docs/SUPABASE.md`

---

## Git Convention
```
feat: new feature
fix: bug fix
style: visual/design only
refactor: restructure, no behavior change
```
