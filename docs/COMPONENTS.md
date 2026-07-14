# Flowstacy — Component Reference

---

## Core Components (`src/components/`)

| File | Purpose | Used by |
|---|---|---|
| `ProtectedRoute.jsx` | Checks Supabase session; redirects to /login if missing | App.jsx — wraps all protected routes |
| `PhoneFrame.jsx` | On desktop (>480px) renders a phone-shaped preview frame around the app | App.jsx root |
| `LoadingScreen.jsx` | Splash screen with lightning animation; auto-routes after 3s | Route `/` |
| `AuroraBackground.jsx` | Fixed animated background using `.fs-aurora` CSS class | Multiple pages |
| `BottomNav.jsx` | Fixed bottom navigation: Home / Community / Progress / Settings | All protected pages |
| `BackButton.jsx` | Simple ← back button with hover styling | Onboarding, detail pages |
| `InstallPrompt.jsx` | PWA install banner; dismissable, persists via `pwa-install-dismissed` in localStorage | App level |
| `PageTransition.jsx` | Framer Motion page wrapper — opacity + y + scale, 0.4s | Every page |
| `QuestionScreen.jsx` | Reusable question UI — used for both Discovery and Onboarding question flows | Discovery, Onboarding |
| `SkeletonCard.jsx` | Pulsing loading placeholder; configurable `height` prop | Home, Progress |
| `RootRedirect.jsx` | Legacy redirect helper — not currently mounted in App.jsx | Unused |

---

## Page Components (`src/pages/`)

| File | Key behavior |
|---|---|
| `Home.jsx` | Loads daily curriculum content from Supabase. Hold-to-complete interaction (2s RAF loop). task_description parser at line 116. Writes completions to localStorage and Supabase. |
| `Progress.jsx` | "The Ascent" — visualizes 21-day progress from localStorage data |
| `Graduation.jsx` | Day 21 graduation screen — shows achievement summary. Needs emotional polish. |
| `Onboarding.jsx` | Life stage selection + uncomfortable discovery questions. Uses QuestionScreen. |
| `Discovery.jsx` | Scored question set → writes scores to `flowstacy_scores` in localStorage |
| `Recommendation.jsx` | Reads discovery scores → shows recommended track |
| `TrackSelect.jsx` | Displays 5 paths (Move/Rhythm/Express/Calm/Mindful) for user selection |
| `SubTrackSelect.jsx` | Shows available subtracks within chosen path; writes selection to localStorage + Supabase |
| `TrackDetail.jsx` | Detail view of a specific track |
| `Community.jsx` | Community posts — basic implementation |
| `Experts.jsx` | Expert connection post-graduation — future monetization surface |
| `Settings.jsx` | User account settings |
| `Welcome.jsx` | First screen — brand intro |
| `Bridge.jsx` | Transition screen between onboarding and track selection |
| `Login.jsx` / `Signup.jsx` | Supabase auth forms |

---

## Component Patterns

### Every protected page uses:
```jsx
<BottomNav />  // fixed bottom
<div style={{ maxWidth: 480, margin: '0 auto', paddingBottom: 100 }}>
  // content
</div>
```

### Every page uses:
```jsx
<PageTransition>
  // page content
</PageTransition>
```

### QuestionScreen props:
```jsx
<QuestionScreen
  question="string"
  options={[{ id, label, icon }]}
  onAnswer={(answerId) => {}}
  currentStep={number}
  totalSteps={number}
/>
```

### SkeletonCard props:
```jsx
<SkeletonCard height={120} />
```
