# Flowstate — Claude Code Project Context

## What is Flowstate
A 21-day habit and self-discovery web app.
Users discover what they want to work on,
commit to one track for 21 days, get daily
progressive tasks, build community, and
graduate to connect with verified experts.

## Tech Stack
- React + Vite + Tailwind CSS
- Supabase (auth, database, storage)
- Framer Motion (all animations)
- React Hot Toast (notifications)
- Canvas Confetti (celebrations)
- Zustand (state management)
- React Router (navigation)
- PWA enabled (vite-plugin-pwa)
- Deployed: Vercel (auto-deploy from GitHub)
- Project: C:\Users\rohit\Projects\flowstate

## Supabase
Project ref: ejgxaejafzhywufiipij
10 tables: profiles, tracks, subtracks,
curriculum_days, user_journeys, 
daily_completions, posts, experts,
expert_offerings, bookings

Gym & Weightlifting subtrack ID:
029740fe-cc23-42f1-9719-59e028cfe510

## Routes
/ → LoadingScreen (splash, handles routing)
/welcome → Welcome
/login → Login
/signup → Signup
/onboarding → Onboarding (life stage)
/bridge → Bridge (path choice)
/discovery → Discovery (5 questions)
/recommendation → Recommendation
/track-select → TrackSelect
/sub-track-select → SubTrackSelect
/home → Home (daily screen)
/community → Community
/progress → Progress
/settings → Settings
/graduation → Graduation
/experts → Experts

## Design System

### Colors
Background: #0A0812
Purple primary: #534AB7
Purple light: #9D92F8
Teal: #1D9E75
Amber: #EF9F27
Error: #E24B4A

### Typography
Font: Plus Jakarta Sans (Google Fonts)
Sizes: 10px labels, 13px body small,
15px body, 17px heading, 22px subheading,
28px heading large, 48-56px hero
Weights: 400 regular, 500 medium,
600 semibold, 700 bold, 800 hero only

### Cards
background: rgba(255,255,255,0.03)
border: 1px solid rgba(255,255,255,0.07)
border-radius: 18-20px
padding: 16-20px

### Buttons
Primary: #534AB7 background, white text,
border-radius 26-28px, height 52-56px
Secondary: transparent, border 1px solid
rgba(255,255,255,0.1), same radius

### Section Labels
font-size: 10-11px
font-weight: 500
letter-spacing: 0.08-0.12em
text-transform: uppercase
color: rgba(255,255,255,0.25-0.3)

### Inputs (forms)
Underline style only — no border box
border-bottom: 1px solid rgba(255,255,255,0.15)
background: transparent
color: white
Focus: border-bottom rgba(157,146,248,0.6)

### Spacing
Page padding: 20-28px horizontal
Section gaps: 24-32px
Card internal: 16-20px
Between elements: 8-12px
Bottom padding: 100px (clears nav)

### Animations (Framer Motion)
Page entrance: opacity 0→1, y 20→0, 0.4s
Stagger children: 0.06-0.08s delay each
Button tap: scale 0.97-0.98
Spring: stiffness 400, damping 20
Always use AnimatePresence for unmounting

## UI/UX Rules — Follow Always

### Layout
- Mobile first: max-width 480px centered
- All touch targets minimum 44px height
- Sticky top bar on all main screens
- Fixed bottom nav on main screens
- Never overflow horizontally
- Test mentally at 375px width

### Visual hierarchy
- ONE dominant element per screen
- Hero screens: day number or question is huge
- Supporting elements progressively smaller
- Never two elements of equal visual weight
  competing for attention

### Typography rules
- Never use font-weight 700+ except hero moments
- Line height: 1.5 for body, 1.2 for headings
- Letter spacing: -0.02em for large text
- Always readable on #0A0812 background

### What to avoid
- No pure white #FFFFFF on dark bg
- No box shadows on dark backgrounds
- No more than 3 colors per card
- No stacked primary buttons
- No emojis in UI — use SVG line icons
- No border-radius above 28px except circles
- No font-size below 11px
- No walls of text — always use structure

### Cards and sections
- Every card has ONE clear purpose
- Section labels always in small uppercase
- Dividers: 1px solid rgba(255,255,255,0.06)
- Numbered lists: purple numbers, white text
- Quote sections: left purple border

### Loading states
- Always show skeleton when fetching
- Never show blank space while loading
- Skeleton matches shape of content

### Error states
- Plain language, never raw error codes
- Always give user a clear next action
- Use toast for transient errors
- Use inline for form validation

### Navigation
- Every screen has back button except splash
- Settings accessible from all main screens
- Bottom nav: Home, Community, Progress, Settings
- Gear icon top right on all main screens

## Component Patterns

### QuestionScreen component
Reusable for all onboarding questions.
Props: stepNumber, totalSteps, question,
subtext, options, multiSelect, onContinue,
onBack, openText, openTextPlaceholder,
continueLabel

### Task description parsing
task_description from Supabase format:
"What to do: [steps]. Why this matters: [why]"

Parse with this function:
function parseTaskDescription(text) {
  if (!text) return { steps: [], why: '' }
  const whyIndex = text.indexOf('Why this matters:')
  let whatText = whyIndex > -1
    ? text.substring(0, whyIndex).trim()
    : text
  let whyText = whyIndex > -1
    ? text.substring(
        whyIndex + 'Why this matters:'.length
      ).trim()
    : ''
  whatText = whatText.replace('What to do:', '').trim()
  const steps = whatText
    .split(/\.\s+(?=[A-Z0-9])/)
    .map(s => s.trim())
    .filter(s => s.length > 15)
    .map(s => s.replace(/\.$/, '').trim())
  return { steps, why: whyText }
}

### AuroraBackground component
Used on onboarding and auth screens.
File: src/components/AuroraBackground.jsx

### PageTransition component
Wraps every page for smooth transitions.
File: src/components/PageTransition.jsx

### SkeletonCard component
Used for loading states.
File: src/components/SkeletonCard.jsx

### InstallPrompt component
PWA install prompt.
File: src/components/InstallPrompt.jsx

## Code Quality Rules

### Always do this
- Check if component already exists before creating
- Import from existing lib files (supabase.js,
  tracks.js, curriculum.js)
- Use existing CSS classes from flowstate.css
- Wrap pages in PageTransition component
- Add loading and error states to all data fetches
- Use toast for user feedback on actions
- Commit to GitHub after every completed feature

### Never do this
- Duplicate logic that exists elsewhere
- Hardcode data that should come from Supabase
- Skip error handling on async operations
- Use inline styles when CSS class exists
- Create new files without checking if they exist
- Leave console.log statements in production code

### File structure
src/
  components/ — reusable components
  pages/ — one file per route
  lib/ — supabase.js, tracks.js, curriculum.js
  styles/ — flowstate.css design system
  store/ — zustand stores

## Git Commit Convention
feat: new feature
fix: bug fix
style: visual/design changes only
refactor: code restructure no behavior change

Always commit after completing a feature:
git add .
git commit -m "type: description"
git push
