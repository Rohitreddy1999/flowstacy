# Flowstacy — Route Reference

All routes defined in `src/App.jsx`.
`AnimatePresence` wraps the full route tree — every page transition animates automatically.

---

## Route Map

| Path | Component file | Protected | Notes |
|---|---|---|---|
| `/` | `components/LoadingScreen` | No | Self-routes after auth check (3s) |
| `/welcome` | `pages/Welcome` | No | First screen new users see |
| `/onboarding` | `pages/Onboarding` | No | Life stage + discovery questions |
| `/bridge` | `pages/Bridge` | No | Transition screen between onboarding and track select |
| `/track-select` | `pages/TrackSelect` | No | User picks a path (Move/Rhythm/Express/Calm/Mindful) |
| `/login` | `pages/Login` | No | |
| `/signup` | `pages/Signup` | No | |
| `/discovery` | `pages/Discovery` | No | Scored questions → recommendation |
| `/recommendation` | `pages/Recommendation` | No | Shows recommended track based on discovery scores |
| `/sub-track-select` | `pages/SubTrackSelect` | No | User picks subtrack within chosen path |
| `/track/:trackId` | `pages/TrackDetail` | No | Detail view of a specific track |
| `/home` | `pages/Home` | **Yes** | Main daily experience — loads curriculum day content |
| `/community` | `pages/Community` | **Yes** | Community posts and sharing |
| `/progress` | `pages/Progress` | **Yes** | The Ascent — 21-day progress visualization |
| `/progress-preview` | `pages/Progress` | No | Dev preview — bypasses auth |
| `/graduation-preview` | `pages/Graduation` | No | Dev preview — bypasses auth |
| `/profile` | `pages/Profile` | **Yes** | Immediately redirects to /settings |
| `/graduation` | `pages/Graduation` | **Yes** | Day 21 graduation screen |
| `/experts` | `pages/Experts` | **Yes** | Expert connection (post-graduation) |
| `/settings` | `pages/Settings` | **Yes** | User settings and account |

---

## Flow Sequence

### New user
```
/ (LoadingScreen) → /welcome → /onboarding → /bridge → /track-select
→ /discovery → /recommendation → /sub-track-select → /signup → /home
```

### Returning user
```
/ (LoadingScreen) → auth check → /home
```

### Graduation
```
/home (day 21 complete) → /graduation → /experts
```

---

## Protected Route Behavior
`components/ProtectedRoute.jsx` checks Supabase session on every render.
If no session exists → redirects to `/login`.
Do not modify this component — breaking it locks all protected routes.
