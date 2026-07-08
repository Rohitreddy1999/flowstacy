# FLOWSTACY DESIGN SYSTEM
## Context file for Claude Code — read this at the start of every session

---

## THE APP

**Flowstacy** — a 21-day personal transformation mobile app.
Built with: React + Vite + Tailwind + Supabase + Zustand
PWA (phone frame wrapper). Mobile-first. 390px viewport.

The emotional arc: stuck → momentum → flow state.
Day 1–7: Foundation. Day 8–14: Build. Day 15–21: Commit.

---

## COLOR PALETTE — DERIVED FROM COLD LIGHT
*"Electricity meeting deep water. Every accent is light against depth."*

| Name | Hex | Role | Usage |
|------|-----|------|-------|
| Abyss | `#07090D` | Background | App background. Deep-water near-black, cool cast. Never pure #000. |
| Fathom | `#0F141A` | Surface / Cards | Card backgrounds, modals, elevated surfaces. |
| Surge | `#3DF5A6` | Action accent | Primary CTAs, active states, progress ring, Surge phase. Signal green — bioluminescent. Saturation +18% for dark ground. |
| Glacial | `#82D4FF` | Reflection accent | "Why this matters" sections, Jammy's voice, Foundation phase accent. Ice-blue for the thinking register. |
| Plasma | `#FF4FD8` | Reward / Commit | Streaks 14+, completions, Commit phase. Ionized-gas magenta. Use sparingly — scarcity is the point. |
| Arc-Light | `#EAFFF5` | Live highlight | Today's active node, ring tip, active nav item. Near-white with green cast. The white-hot point of an electric arc. |

**Text hierarchy (never pure white):**
- Primary text: `rgba(255,255,255,0.95)`
- Secondary text: `rgba(255,255,255,0.70)`
- Tertiary text: `rgba(255,255,255,0.45)`

**Phase temperature (the system heats up as you do):**
- Foundation = Glacial `#82D4FF`
- Build = Surge `#3DF5A6`
- Commit = Plasma `#FF4FD8`

**Card elevation:** 1px border at `rgba(255,255,255,0.07)` — NEVER drop shadows on dark.

---

## TYPOGRAPHY

**Display: Space Grotesk Expanded (Black 900, 125% width)**
- Used for: Day numbers, hero stats, wordmark
- Day number reads like a jersey number — identity, not data
- Defiance through width and weight, no decoration

**Body: Hanken Grotesk**
- Tall x-height, open apertures, crisp at 13px on Abyss
- Scale:
  - Display: 96px
  - Heading: 26px
  - Body: 13.5px
  - Caption: 12px
  - Label: 10px, letter-spacing +2.5

---

## SIGNATURE ELEMENT — THE CIRCUIT

The 21 days are an **open circuit**. Each completed day closes one segment.
Current — glow intensity scaled by Momentum score — flows only through closed segments.
The same current appears everywhere: the ring on Home, the Ascent Arc, Jammy's orb temperature.
On Day 21 the circuit closes and the whole system runs at Arc-Light.
**You don't check off days — you energize them.**

---

## SCREENS & COMPONENTS

### Home / Dashboard
- Header: `DAY 09 · BUILD` (phase label) + streak diamond badge (Plasma for 14+)
- Hero headline: Phase-aware motivational text e.g. "Momentum is compounding."
- Progress ring: Surge stroke, Arc-Light tip, glow intensity = Momentum score
- Today's task card: Fathom surface, 1px Surge border, `TODAY · GYM & FITNESS` label
- Jammy strip: Glacial orb + phase-aware one-liner, tap to expand

### Day Task Screen
- Day number: MASSIVE display — jersey number treatment, behind content as watermark
- `/21` in secondary text next to the number
- `WHAT TO DO` section: numbered steps, Surge label color
- `WHY THIS MATTERS` section: Glacial label color, Jammy-voice tone
- Effort slider before completion: Low / Medium / All in → feeds Momentum score
- Complete CTA: full-width, Surge background → on complete, ring/arc lights up

### Progress Screen — "The Ascent"
- Title: "The Ascent" — YOUR JOURNEY label above
- Momentum score: top right, Surge color, large
- Arc visualization: rising curve, 21 nodes
  - Completed nodes: Surge glow
  - Today's node: Arc-Light pulse
  - Future nodes: dim/ghost
  - Phase boundaries: visible breaks with FOUNDATION / BUILD / COMMIT labels
- Phase cards (3): Foundation, Build, Commit — completion % each
  - Active phase: Surge border
- Momentum Trajectory: line graph, Surge stroke, "+32 this week" label
- Best streak badge: Plasma diamond + count

### Jammy (AI Assistant)
- Ambient charged orb — present but not demanding
- Color shifts with phase: Foundation = Glacial, Build = Surge, Commit = Plasma
- On Home: small orb + one-line check-in, tap to expand
- Expanded: one-breath response, never a full chat window
- Voice tone: direct, no fluff, phase-aware

### Navigation
- Floating pill nav OR edge-to-edge bottom bar (4 items max)
- Active state: Surge-tinted well + Arc-Light glyph
- NOT just a color change — it feels selected

---

## MOTION RULES

- **Home:** Ring draws in on load; headline fades up after ring lands; Jammy orb breathes on 2s cycle
- **Task:** Day number leads, content follows; complete flips CTA to earned outline + Jammy's phase-aware line
- **Progress:** Arc segments draw sequentially (800ms); nodes light Day 1 → today; momentum line draws after
- **Rule:** Every animation shows current flowing, never decoration

---

## COMPONENT RULES

- Border radius: 16–24px (soft but not bubbly)
- Card elevation: Fathom fill + 1px `rgba(255,255,255,0.07)` border
- Glow effects: only where they serve content (ring tip, active node, Jammy orb)
- No drop shadows anywhere

---

## SESSION RULES FOR CLAUDE CODE

1. **Always read this file first** before writing any code
2. **Never use hex values not in this palette** without explicit approval
3. **Never use Inter, Roboto, or SF Pro** as display — use Space Grotesk Expanded
4. **One screen at a time** — complete and screenshot before moving to next
5. **Mobile-first** — 390px viewport, phone frame wrapper
6. **The Tailwind config must include** all palette colors as named tokens
7. **When in doubt on color** — refer to the phase temperature rule

---

## MISSING SCREEN BRIEFS
*For screens without a Claude Design reference image — Claude Code derives these from the design system.*

### Splash Screen
- Background: Abyss `#07090D`
- FLOWSTACY wordmark: Space Grotesk Expanded Black, centered, large
- Behind wordmark: very subtle Surge `#3DF5A6` radial glow at 8% opacity — barely visible, like light behind deep water
- Below wordmark: "21 days. One decision." — Hanken Grotesk, 45% white, small
- Bottom center: Jammy orb — 24px circle, Glacial `#82D4FF`, soft pulse animation on 2s cycle
- No buttons, no nav, no other elements
- Auto-transitions to Login after 2.4s
- Motion: screen starts Abyss dark → glow blooms → wordmark fades up → tagline fades → Jammy orb pulses once → screen fades to Login

### Login / Auth Screen
- Background: Abyss `#07090D`
- Top: FLOWSTACY wordmark small, centered — same as splash but smaller
- Card: Fathom `#0F141A` surface, 1px `rgba(255,255,255,0.07)` border, 20px radius
- Inside card:
  - Heading: "Welcome back." — Hanken Grotesk, 95% white
  - Email input: Fathom background, 1px Surge border on focus, Arc-Light text
  - Password input: same treatment
  - CTA button: full width, Surge `#3DF5A6` background, Abyss text, "Continue"
  - Divider: "or" in 45% white
  - Google sign-in: outlined button, 1px `rgba(255,255,255,0.07)` border
- Below card: "New here? Start your 21 days." — Glacial color, links to onboarding
- No decorative elements — this screen is functional, the app earns the emotion after login

### Onboarding / Track Select Screen
- Background: Abyss `#07090D`
- Step indicator at top: small dots, current = Arc-Light, others = 20% white
- Headline: "What do you want to transform?" — Space Grotesk Expanded, large, 95% white
- Track cards: Fathom surface, 1px border
  - Active/selected: Surge `#3DF5A6` border + faint Surge glow
  - Icon + track name + one-line description
  - Tracks: MOVE / FOCUS / RHYTHM / EXPRESS / MINDFUL
- CTA: "Begin Day 1" — full width Surge button, only appears after selection
- Jammy orb bottom right — Glacial, ambient, not labeled

### SubTrack Select Screen
- After main track is chosen, user picks the specific sub-track
- e.g. MOVE → Gym & Weightlifting / Running / Yoga
- Same card treatment as Track Select
- Headline: "Choose your path." — Space Grotesk Expanded
- Cards show sub-track name + brief description
- Selected state: Surge border + glow
- CTA: "Lock it in." — Surge button

---

## HOW TO USE THIS FILE IN CLAUDE CODE

### Session Opening (copy-paste this every time):
```
Read FLOWSTACY_DESIGN_SYSTEM.md before writing any code.
We are rebuilding ONE screen only this session: [SCREEN NAME].
Do not touch any other screens or files.
Current screen screenshot: [attach screenshot]
Reference design: [attach Claude Design image if available]
Follow the design system exactly — palette, typography, motion, components.
```

### One Screen Per Session Rule:
- Complete the screen fully before ending the session
- Screenshot the result before closing
- Bring screenshot here for critique before starting next session
- Next session starts fresh with the same file read

### Screen Rebuild Order:
1. Tailwind config — add all 6 palette colors as named tokens
2. Splash screen
3. Login / Auth screen
4. Onboarding / Track Select
5. Home / Dashboard (reference: Claude Design Image 2 bottom-left)
6. Day Task screen (reference: Claude Design Image 2 bottom-right)
7. Progress screen — The Ascent (reference: Claude Design Image 3)
8. SubTrack Select

### Tailwind Token Names (add to tailwind.config.js):
```js
colors: {
  abyss: '#07090D',
  fathom: '#0F141A',
  surge: '#3DF5A6',
  glacial: '#82D4FF',
  plasma: '#FF4FD8',
  'arc-light': '#EAFFF5',
}
```
