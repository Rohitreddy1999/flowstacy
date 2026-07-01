import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TOTAL = 21

// ── Stage indicator dots ──────────────────────────────────────────────────────

function StageDots({ stage }) {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      {[1, 2, 3].map(s => (
        <div
          key={s}
          className="w-2 h-2 rounded-full transition-all duration-300"
          style={
            s === stage
              ? { backgroundColor: '#534AB7' }
              : { border: '1.5px solid #d1d5db', backgroundColor: 'transparent' }
          }
        />
      ))}
    </div>
  )
}

// ── Stage 1 — Quiet and personal ─────────────────────────────────────────────

const STATS = [
  { value: '21',      label: 'days completed' },
  { value: '21',      label: 'day streak' },
  { value: '~8h',     label: 'total practice' },
  { value: 'Top 12%', label: 'of all starters' },
]

const ACHIEVEMENTS = [
  "You proved consistency beats talent. You showed up on the days it was hard, boring, and inconvenient.",
  "You learned 5 fundamental movements and built your own training split from scratch.",
  "You became someone who doesn't quit. That identity doesn't disappear after today.",
]

function Stage1({ onContinue }) {
  return (
    <div className="space-y-7 pb-8">

      {/* 21 green dots */}
      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: TOTAL }, (_, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: '#1D9E75' }}
          />
        ))}
      </div>

      {/* Track badge */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#EEEDFE' }}
        >
          <span className="text-5xl">💪</span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Body &amp; Fitness
        </p>
      </div>

      {/* Day label */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold" style={{ color: '#1a1a1a' }}>
          Day 21 Complete
        </h1>
        <p className="text-lg font-medium" style={{ color: '#534AB7' }}>
          You showed up. Every single day.
        </p>
      </div>

      {/* Stats 2×2 grid */}
      <div className="grid grid-cols-2 gap-3">
        {STATS.map(({ value, label }) => (
          <div
            key={label}
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: '#f9f9f9' }}
          >
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Achievement cards */}
      <div className="space-y-3">
        {ACHIEVEMENTS.map((text, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-xl p-4 border"
            style={{ borderColor: '#e5e5e5' }}
          >
            <span
              className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: '#1D9E75' }}
            >
              ✓
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full py-3 rounded-xl text-white font-semibold text-base transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#534AB7' }}
      >
        Continue →
      </button>
    </div>
  )
}

// ── Stage 2 — Emotional peak ──────────────────────────────────────────────────

function Stage2({ onContinue }) {
  return (
    <div className="space-y-6 pb-8">

      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-400">A message for you</p>
        <h2 className="text-2xl font-bold text-gray-900 leading-snug">
          From the people who built this for you
        </h2>
        <p className="text-sm text-gray-400">We made this because we were you.</p>
      </div>

      {/* Video placeholder */}
      <div>
        <div
          className="w-full rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#EEEDFE', height: '160px' }}
        >
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#534AB7' }}
            >
              <span className="text-white text-xl" style={{ marginLeft: '3px' }}>▶</span>
            </div>
            <p className="text-xs text-gray-500">Watch — 90 seconds</p>
          </div>
        </div>
        <p className="text-base font-semibold text-gray-900 mt-3">
          You did something most people never do
        </p>
        <p className="text-sm text-gray-400 mt-1">
          A personal message from the Flowstate team
        </p>
      </div>

      {/* Founder's letter */}
      <div
        className="rounded-r-xl py-4 px-4"
        style={{ borderLeft: '3px solid #534AB7', backgroundColor: '#f9f9f9' }}
      >
        <p className="text-sm text-gray-700 italic leading-relaxed">
          "I know what it felt like on Day 3 when you almost stopped. I know what Day 11 felt like when it got boring. I know you showed up anyway — not because it was easy, but because something in you decided this time was different. That decision is yours. Nobody can take it from you. You are not the same person who opened this app 21 days ago."
        </p>
        <p className="text-sm font-semibold mt-3" style={{ color: '#534AB7' }}>
          — The Flowstate team
        </p>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-3 rounded-xl text-white font-semibold text-base transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#534AB7' }}
      >
        I'm ready for what's next →
      </button>
    </div>
  )
}

// ── Stage 3 — Celebration and open door ──────────────────────────────────────

function Stage3() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 pb-8">

      {/* Graduation badge */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#534AB7' }}
        >
          <span className="text-5xl">🏆</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">You graduated.</h1>
        <p className="text-gray-500">Now the real question — what do you do with this?</p>
      </div>

      {/* Shareable card */}
      <div className="rounded-xl p-5" style={{ backgroundColor: '#EEEDFE' }}>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">
          Body &amp; Fitness
        </p>
        <p className="text-2xl font-bold mb-1" style={{ color: '#26215C' }}>
          Day 21 — Graduated
        </p>
        <p className="text-xs text-gray-500 mb-4">
          21 day streak · Top 12% of all starters
        </p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {Array.from({ length: TOTAL }, (_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: '#1D9E75' }}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <button
            className="flex-1 py-2 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#534AB7' }}
          >
            Share to feed
          </button>
          <button
            className="flex-1 py-2 rounded-xl font-semibold text-sm border-2 bg-white transition-colors hover:bg-gray-50"
            style={{ borderColor: '#534AB7', color: '#534AB7' }}
          >
            Save card
          </button>
        </div>
      </div>

      {/* 21% surprise reveal */}
      <div className="rounded-xl p-5 text-center" style={{ backgroundColor: '#E1F5EE' }}>
        <p className="text-3xl mb-3">🎁</p>
        <p className="text-sm font-semibold text-gray-800 mb-3">
          Before you meet the experts — we have something for you.
        </p>
        <p className="text-3xl font-bold mb-1" style={{ color: '#534AB7' }}>
          21% graduate discount
        </p>
        <p className="text-sm text-gray-600 mb-3">
          21 days. 21 percent. You earned every bit of it.
        </p>
        <p className="text-xs text-gray-400">
          Applied automatically when you book your first expert session.
        </p>
      </div>

      {/* Final buttons */}
      <div className="space-y-3">
        <button
          onClick={() => navigate('/experts')}
          className="w-full py-3 rounded-xl text-white font-semibold text-base transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#534AB7' }}
        >
          Meet the experts →
        </button>
        <button
          onClick={() => {
            [
              'flowstate_selected_track',
              'flowstate_selected_subtrack',
              'flowstate_current_day',
              'flowstate_streak',
              'flowstate_completed_days',
              'flowstate_reflections',
              'flowstate_scores',
            ].forEach(key => localStorage.removeItem(key))
            navigate('/bridge?restart=true')
          }}
          className="w-full py-3 rounded-xl font-semibold text-base border-2 bg-white transition-colors hover:bg-gray-50"
          style={{ borderColor: '#534AB7', color: '#534AB7' }}
        >
          Start a new 21-day track
        </button>
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function Graduation() {
  const [stage, setStage] = useState(1)

  return (
    <div className="min-h-screen bg-white">

      {/* Sticky stage indicator */}
      <div className="sticky top-0 bg-white z-10 border-b border-gray-50">
        <StageDots stage={stage} />
      </div>

      <div className="max-w-[480px] mx-auto px-6 py-6">
        {stage === 1 && <Stage1 onContinue={() => setStage(2)} />}
        {stage === 2 && <Stage2 onContinue={() => setStage(3)} />}
        {stage === 3 && <Stage3 />}
      </div>

    </div>
  )
}
