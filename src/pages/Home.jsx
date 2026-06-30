import { useState } from 'react'
import BottomNav from '../components/BottomNav'

const DAY = 1
const TOTAL_DAYS = 21

const COMMUNITY = [
  { initials: 'AK', name: 'Arjun K.', color: '#534AB7' },
  { initials: 'SM', name: 'Sarah M.', color: '#0D9488' },
  { initials: 'RJ', name: 'Raj J.',   color: '#E8604A' },
]

export default function Home() {
  const [completed, setCompleted] = useState(false)

  return (
    <div className="min-h-screen bg-white pb-20">

      {/* ── Top nav ─────────────────────────────────────────── */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
        <span className="text-lg font-semibold tracking-tight" style={{ color: '#534AB7' }}>
          flowstate
        </span>
        <div className="flex items-center gap-1.5">
          <span>🔥</span>
          <span className="text-sm text-gray-500">1 day streak</span>
        </div>
      </nav>

      {/* ── Page content ────────────────────────────────────── */}
      <div className="max-w-[480px] mx-auto px-6 py-8 space-y-7">

        {/* 1. Track & day label */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Body &amp; Fitness — Day {DAY} of {TOTAL_DAYS}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-1.5">
            Welcome to Day {DAY}
          </h1>
          <p className="text-sm text-gray-400">
            Every legend started exactly here. Let's begin.
          </p>
        </div>

        {/* 2. Progress dots + bar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400">Your journey</span>
            <span className="text-xs font-semibold" style={{ color: '#534AB7' }}>
              {DAY}/{TOTAL_DAYS} days
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {Array.from({ length: TOTAL_DAYS }, (_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full transition-colors"
                style={
                  i < DAY
                    ? { backgroundColor: '#534AB7' }
                    : { border: '1.5px solid #e5e5e5' }
                }
              />
            ))}
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
            <div
              className="h-1 rounded-full"
              style={{
                backgroundColor: '#534AB7',
                width: `${(DAY / TOTAL_DAYS) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* 3. Today's task card */}
        <div className="rounded-xl p-5" style={{ backgroundColor: '#EEEDFE' }}>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: '#3C3489' }}
          >
            Today's Task
          </p>
          <p className="text-sm text-gray-800 leading-relaxed mb-4">
            Learn the 5 fundamental movement patterns — push, pull, hinge, squat, carry.
            Watch one short explainer video today. No gym needed. Just 15 minutes and your
            full attention.
          </p>
          <div className="flex gap-2 flex-wrap">
            <span
              className="text-xs text-white px-3 py-1 rounded-full font-medium"
              style={{ backgroundColor: '#534AB7' }}
            >
              ⏱ 15 min
            </span>
            <span
              className="text-xs text-white px-3 py-1 rounded-full font-medium"
              style={{ backgroundColor: '#534AB7' }}
            >
              Easy
            </span>
          </div>
        </div>

        {/* 4. Daily quote */}
        <div
          className="py-3 px-4 rounded-r-lg"
          style={{ borderLeft: '3px solid #534AB7', backgroundColor: '#f9f9f9' }}
        >
          <p className="text-sm italic text-gray-700 leading-relaxed mb-1">
            "The secret of getting ahead is getting started."
          </p>
          <p className="text-xs text-gray-400">— Mark Twain</p>
        </div>

        {/* 5. Action buttons */}
        <div className="space-y-3">
          <button
            onClick={() => setCompleted(true)}
            className="w-full py-3 px-6 rounded-xl text-white font-semibold text-base transition-all duration-300"
            style={{ backgroundColor: completed ? '#1D9E75' : '#534AB7' }}
          >
            {completed ? 'Day 1 Complete! ✓' : 'Mark Day 1 Complete ✓'}
          </button>
          <button
            className="w-full py-3 px-6 rounded-xl font-semibold text-base border-2 bg-white transition-colors hover:bg-gray-50"
            style={{ borderColor: '#534AB7', color: '#534AB7' }}
          >
            Add to my log
          </button>
        </div>

        {/* 6. Community peek */}
        <div className="pb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Others starting today
          </p>
          <div className="space-y-4">
            {COMMUNITY.map((user) => (
              <div key={user.initials} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: user.color }}
                >
                  {user.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-400">Day 1 · 1 day streak 🔥</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  )
}
