# Design System

The app has two palettes that coexist. V1 is in CSS variables and used on
auth/onboarding screens. V2 is inline JS constants and used on the main
post-onboarding screens (Home, Progress, Graduation).

Do not mix palettes within a single screen. Match the palette already in use
on whichever page you are editing.

---

## V1 Palette — CSS Variables

Defined in `src/styles/flowstate.css`. Import by using the class names
or referencing `var(--token-name)` in inline styles.

### Colors

```css
/* Backgrounds */
--fs-bg-primary:    #0A0812
--fs-bg-secondary:  #0F0C1A
--fs-bg-card:       rgba(255, 255, 255, 0.05)
--fs-bg-card-hover: rgba(255, 255, 255, 0.08)

/* Purple — primary brand */
--fs-purple-100: #EEEDFE
--fs-purple-300: #9D92F8
--fs-purple-500: #534AB7
--fs-purple-700: #3C3489
--fs-purple-glow: rgba(83, 74, 183, 0.4)

/* Teal — achievement */
--fs-teal-300: #5DCAA5
--fs-teal-500: #1D9E75
--fs-teal-glow: rgba(29, 158, 117, 0.3)

/* Text */
--fs-text-primary:   #FFFFFF
--fs-text-secondary: rgba(255, 255, 255, 0.6)
--fs-text-tertiary:  rgba(255, 255, 255, 0.35)

/* Borders */
--fs-border:        rgba(255, 255, 255, 0.08)
--fs-border-purple: rgba(83, 74, 183, 0.5)
--fs-border-teal:   rgba(29, 158, 117, 0.4)

/* Glows */
--fs-glow-purple: 0 0 20px rgba(83, 74, 183, 0.4)
--fs-glow-teal:   0 0 20px rgba(29, 158, 117, 0.3)
--fs-glow-white:  0 0 10px rgba(255, 255, 255, 0.1)
```

### Typography scale

```css
--fs-text-xs:   11px
--fs-text-sm:   13px
--fs-text-base: 15px
--fs-text-lg:   18px
--fs-text-xl:   22px
--fs-text-2xl:  28px
--fs-text-3xl:  36px
--fs-text-4xl:  48px
```

### Spacing

```css
--fs-space-1:  4px
--fs-space-2:  8px
--fs-space-3:  12px
--fs-space-4:  16px
--fs-space-5:  20px
--fs-space-6:  24px
--fs-space-8:  32px
--fs-space-10: 40px
```

### Border radius

```css
--fs-radius-sm:   8px
--fs-radius-md:   12px
--fs-radius-lg:   16px
--fs-radius-xl:   24px
--fs-radius-full: 9999px
```

### Transitions

```css
--fs-transition:      all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
--fs-transition-slow: all 0.6s cubic-bezier(0.4, 0, 0.2, 1)
```

---

## V1 CSS Utility Classes

### Cards

```css
.fs-card          /* glass card: rgba white 5%, blur 20px, border rgba white 8%, r-16 */
.fs-card:hover    /* rgba white 8%, border rgba white 12%, translateY(-2px) */
.fs-card-purple   /* purple-tinted: rgba purple 15%, border rgba purple 30% */
.fs-card-teal     /* teal-tinted: rgba teal 12%, border rgba teal 25% */
```

### Buttons

```css
.fs-btn-primary   /* #534AB7 bg, white text, r-12, 14px/24px padding */
.fs-btn-secondary /* transparent, rgba white 15% border */
.fs-btn-ghost     /* transparent, --fs-purple-300 text, no border */
```

Disabled state on `.fs-btn-primary`: rgba white 10% bg, rgba white 30% text.

### Typography classes

```css
.fs-heading-hero  /* 48px, weight 300, -0.02em spacing, lh 1.1 */
.fs-heading-lg    /* 36px, weight 400, -0.01em, lh 1.2 */
.fs-heading-md    /* 28px, weight 500, lh 1.3 */
.fs-heading-sm    /* 22px, weight 500 */
.fs-label         /* 11px, weight 500, uppercase, 0.1em spacing, tertiary color */
.fs-label-purple  /* .fs-label but purple-300 */
.fs-label-teal    /* .fs-label but teal-300 */
.fs-glow-text     /* purple-300 + text-shadow glow */
.fs-logo          /* 18px, weight 500, purple-300, 0.02em spacing */
```

### Progress dots

```css
.fs-dots-container  /* flex, 6px gap, wrap */
.fs-dot             /* 10×10px circle, transitions */
.fs-dot-completed   /* teal-500, teal glow shadow */
.fs-dot-today       /* purple-500, pulse animation */
.fs-dot-future      /* rgba white 12% */
```

### Navigation

```css
.fs-topbar    /* sticky top, blur bg, border-bottom, flex space-between */
.fs-bottom-nav /* fixed bottom, blur bg, border-top, flex */
.fs-nav-item  /* flex col, center, 1/4 width */
.fs-nav-item.active .fs-nav-item-label  /* purple-300 */
```

### Inputs

```css
.fs-input       /* rounded box, rgba white 5% bg, white border, blur focus */
.fs-input:focus /* purple border + rgba purple 8% bg + ring */
```

### Badges

```css
.fs-badge         /* inline-flex, pill shape, 11px, weight 500 */
.fs-badge-purple  /* rgba purple 20% bg, purple-300 text */
.fs-badge-teal    /* rgba teal 15% bg, teal-300 text */
```

### Reactions (Community)

```css
.fs-reaction        /* pill button, rgba white 10% border */
.fs-reaction.active /* rgba purple 20% bg, purple-300 text */
```

### Layout

```css
.fs-page       /* min-h 100vh, bg primary, max-w 480, centered, pb 80 */
.fs-page-full  /* min-h 100vh, bg primary, no max-w */
.fs-divider    /* 1px rgba white 6% line, my 16 */
```

### Aurora background

```css
.fs-aurora        /* fixed, inset 0, z-index -1, bg primary */
.fs-aurora::before /* 600px purple radial, aurora-pulse-1 8s */
.fs-aurora::after  /* 500px teal radial, aurora-pulse-2 10s */
```

### Skeleton / animation

```css
.fs-skeleton        /* rgba white 8% bg, r-8, skeleton-pulse 1.5s */
.fs-animate-up      /* fade-in-up 0.6s */
.fs-animate-in      /* fade-in 0.4s */
.fs-glow-pulse      /* box-shadow pulse 3s */
```

---

## V2 Palette — Inline Constants

Used in: `src/pages/Home.jsx`, `src/pages/Progress.jsx`,
`src/pages/Graduation.jsx`, `src/components/BottomNav.jsx`.

```js
const ABYSS     = '#07090D'   // page background (darker than V1)
const FATHOM    = '#0F141A'   // card background
const SURGE     = '#3DF5A6'   // primary action, BUILD phase accent
const GLACIAL   = '#82D4FF'   // FOUNDATION phase accent
const PLASMA    = '#FF4FD8'   // COMMIT phase accent
const ARC_LIGHT = '#EAFFF5'   // near-white, text on dark buttons, ring tip
```

### Phase system

| Day range | Phase name | Color |
|---|---|---|
| 1-7 | FOUNDATION | GLACIAL `#82D4FF` |
| 8-14 | BUILD | SURGE `#3DF5A6` |
| 15-21 | COMMIT | PLASMA `#FF4FD8` |

The phase color propagates to: sticky header border, ring arc, task card
accent strip, step labels, progress bar fill, celebration card border,
Jammy orb glow, and CTA button color.

---

## Typography

Fonts are loaded from Google Fonts (in `index.html`, not in JSX):
- **Space Grotesk** — wordmarks, hero day numbers, modal headings
- **Hanken Grotesk** — all body copy, labels, buttons, inputs

### V2 type rules observed in code

| Use | Size | Weight | Font |
|---|---|---|---|
| Page wordmark / splash | 52 px | 900 | Space Grotesk |
| Hero day number (ring) | 52-96 px | 900 | Hanken Grotesk |
| Section headlines | 22-26 px | 700 | Space Grotesk |
| Task card title | 20 px | 700 | Space Grotesk |
| Body / task steps | 13.5 px | 400-500 | Hanken Grotesk |
| Section labels (uppercase) | 10-11 px | 500 | Hanken Grotesk |
| Duration / difficulty badges | 11 px | 400 | Hanken Grotesk |
| Bottom nav labels | 10 px | 400/600 | Hanken Grotesk |

Letter spacing: `-0.02em` to `-0.03em` on large headings, `0.1-0.25em` on
uppercase labels.

---

## Cards (V2 style)

```js
background: '#0F141A'                          // FATHOM
border: '1px solid rgba(255,255,255,0.07-0.10)'
borderRadius: 18-20
```

Active / featured cards add a 3 px colored top border strip:
```js
background: 'linear-gradient(90deg, SURGE, rgba(61,245,166,0.4))'
```

---

## Buttons (V2 style)

Primary CTA (Home complete button):
```js
height: 54, borderRadius: 27
background: SURGE   // #3DF5A6
color: ABYSS        // #07090D (dark text on green)
fontSize: 15, fontWeight: 700
```

Secondary / ghost:
```js
height: 50, borderRadius: 27
border: '1px solid rgba(255,255,255,0.1)'
background: 'transparent'
color: 'rgba(255,255,255,0.5)'
```

Completed state (after hold):
```js
border: '1px solid rgba(61,245,166,0.4)'
color: SURGE
background: 'none'
```

---

## Motion Patterns

### Page entrance (PageTransition component)
```js
initial: { opacity: 0, y: 20, scale: 0.98 }
animate: { opacity: 1, y: 0,  scale: 1    } // 0.4 s, [0.25,0.46,0.45,0.94]
exit:    { opacity: 0, y: -10, scale: 0.98 } // 0.2 s, easeIn
```

### Section stagger (Home, Progress)
```js
// Each section has a slightly larger delay
transition={{ duration: 0.4, delay: 0.1 * n }}
```

### Spring (QuestionScreen checkmark, celebration modal)
```js
type: 'spring', stiffness: 400, damping: 20
```

### Bottom sheet slide-up
```js
initial: { y: '100%' }
animate: { y: 0 }
transition: { type: 'spring', damping: 30, stiffness: 300 }
```

### AnimatePresence usage
Wrap any conditionally-rendered element in `<AnimatePresence>` for unmount
animations. All modals, overlays, and bottom sheets in the app do this.

---

## Layout Rules

- Max-width: **480 px**, centered, `margin: 0 auto`
- Horizontal page padding: **20-24 px**
- Bottom padding on scrollable pages: **100 px** (clears fixed BottomNav)
- BottomNav height including safe area: ~72 px
- Touch targets: minimum 44 px height
- Never overflow horizontally — test mentally at 375 px

---

## Input Fields (V2 card style)

Used on: Signup.jsx (and any future auth/form screens migrated to V2).

```js
// Wrapper div
background: 'rgba(255,255,255,0.05)'
border: '1px solid rgba(255,255,255,0.08)'
borderRadius: 12
display: 'flex'
alignItems: 'center'

// Focused wrapper (onFocus/onBlur on the wrapper div)
borderColor: 'rgba(61,245,166,0.5)'   // SURGE tint

// Inner <input>
background: 'transparent'
border: 'none'
color: 'white'
fontSize: 16
padding: '14px 16px'
outline: 'none'
fontFamily: HK
```

Error state (e.g. password mismatch): `borderColor: '#E24B4A'`

Toggle buttons (show/hide password) sit inside the wrapper with
`padding: '8px 12px'` and `flexShrink: 0`.

---

## Auth Screen Conventions (Welcome, Signup, Login)

- Background: `#0A0812` (matches V1 `--fs-bg-primary`)
- Font: Hanken Grotesk throughout (set on the root container)
- Wordmark glow: teal pulse — `rgba(61,245,166,0.3)` → `0.6` → `0.3`
- Primary CTA: `background: SURGE (#3DF5A6)`, `color: ABYSS (#07090D)`,
  `borderRadius: 28`, `fontWeight: 700`
- Accent links (Terms, Sign in): `color: SURGE`
- Secondary ghost button: `border: '1px solid rgba(255,255,255,0.12)'`,
  `color: rgba(255,255,255,0.6)`, `background: transparent`

---

## What to Avoid

- No pure `#FFFFFF` text on dark backgrounds (use rgba white 0.9-0.95)
- No box shadows on dark backgrounds (use glows instead)
- No more than 3 colors per card
- No emoji in UI (use SVG icons instead) — Community mock data is an exception
- No border-radius above 28 px except for circular elements
- No font-size below 11 px
- No font-weight 700+ except hero moments and CTA buttons
