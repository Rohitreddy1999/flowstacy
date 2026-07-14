# Flowstacy — Supabase Reference

Project ref: `ejgxaejafzhywufiipij`
Client: `src/lib/supabase.js` — single shared instance, never create another.

---

## Tables

| Table | Purpose |
|---|---|
| `profiles` | User profile data — linked to Supabase auth.users |
| `tracks` | The 5 paths (Move, Rhythm, Express, Calm, Mindful) |
| `subtracks` | Subtracks within each track — UUIDs must match SUBTRACK_IDS in curriculum.js |
| `curriculum_days` | 21 days of content per subtrack — what to do + why it matters |
| `user_journeys` | Active journey per user — which subtrack, start date, current day |
| `daily_completions` | Log of completed days per user |
| `posts` | Community posts |
| `experts` | Expert profiles for post-graduation connection |
| `expert_offerings` | Services/packages offered by experts |
| `bookings` | User bookings with experts |

Full column reference to be documented as schema is confirmed.

---

## Key Relationships
```
auth.users → profiles (1:1)
tracks → subtracks (1:many)
subtracks → curriculum_days (1:21)
profiles → user_journeys (1:active)
user_journeys → daily_completions (1:many)
profiles → posts (1:many)
experts → expert_offerings (1:many)
profiles → bookings (1:many)
experts → bookings (1:many)
```

---

## RLS Policy Rules
- Users can only read and write their own data
- `profiles`: select/update where auth.uid() = id
- `user_journeys`: select/insert/update where auth.uid() = user_id
- `daily_completions`: select/insert where auth.uid() = user_id
- `posts`: select all (public), insert where authenticated
- `curriculum_days`: select all (public read — content is not user-specific)
- `tracks` / `subtracks`: select all (public read)
- `experts` / `expert_offerings`: select all (public read)
- `bookings`: select/insert where auth.uid() = user_id

---

## curriculum_days — task_description Format
```
"What to do: [step sentences]. Why this matters: [why text]"
```
Parser lives at `src/pages/Home.jsx` line 116.
If you need this parsing logic elsewhere, duplicate that function — do not move it.

---

## SUBTRACK_IDS
Defined in `src/lib/curriculum.js`.
These are live Supabase UUIDs. They must match exactly.
Never hardcode these anywhere else — always import from curriculum.js.

---

## LocalStorage ↔ Supabase Boundary

**LocalStorage** — primary state for active journey:
- `flowstacy_life_stage` — onboarding answer
- `flowstacy_selected_track` — chosen track id
- `flowstacy_selected_subtrack` — chosen subtrack key or UUID
- `flowstacy_current_day` — current day number (string)
- `flowstacy_streak` — current streak count (string)
- `flowstacy_completed_days` — array of `{day, completedAt, dayOfWeek}`
- `flowstacy_reflections` — array of `{day, feeling, note, date}`
- `flowstacy_scores` — object of `{trackId: score}` from discovery
- `pwa-install-dismissed` — "true" if user dismissed install banner

**Supabase** — written on:
- Subtrack selection → creates `user_journeys` row
- Day completion → writes to `daily_completions`
- Auth check → reads `profiles`

**Rule:** localStorage is the source of truth for UI rendering speed. Supabase is the persistent backup. Never block UI on a Supabase write.

---

## Environment Variables
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```
Both read in `src/lib/supabase.js`. Never expose service role key to frontend.
