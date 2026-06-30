import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

// ── Constants ─────────────────────────────────────────────────────────────────

const TOTAL = 21

const SUBTRACK_NAMES = {
  gym: 'Gym & Weightlifting', calisthenics: 'Calisthenics', running: 'Running & Stamina',
  sport: 'Sport & Athletics', yoga: 'Yoga & Flexibility',
  morning: 'Morning Routine', reading: 'Daily Reading', steps: '10,000 Steps',
  meditation: 'Meditation', detox: 'Digital Detox',
  guitar: 'Guitar', piano: 'Piano & Keyboard', drums: 'Drums & Rhythm', vocals: 'Vocals & Singing',
  self: 'Self-Discovery', gratitude: 'Gratitude Practice', stream: 'Stream of Consciousness', goals: 'Goal Setting & Vision',
  fundamentals: 'Sketching Fundamentals', portrait: 'Portrait Drawing', urban: 'Urban Sketching', nature: 'Nature & Animals',
}

const FITNESS_TASKS = {
  1:  { text: 'Learn the 5 fundamental movement patterns — push, pull, hinge, squat, carry. Watch one short explainer video. No gym needed. Just 15 minutes.', duration: '15 min', difficulty: 'Easy' },
  2:  { text: 'Bodyweight only — 3 sets of 10 squats, 10 push-ups, 10 rows using a table edge. Rest 60 seconds between sets. Focus on form.', duration: '25 min', difficulty: 'Easy' },
  3:  { text: '15-minute walk + 5 minutes stretching. Log how your body feels — energy, soreness, mood.', duration: '20 min', difficulty: 'Easy' },
  4:  { text: 'Repeat Day 2 movements. Focus on form over speed. Try to feel the muscle working.', duration: '25 min', difficulty: 'Easy' },
  5:  { text: 'Core day — 3 sets of plank 20 seconds, dead bug 10 reps, glute bridge 15 reps.', duration: '20 min', difficulty: 'Easy' },
  6:  { text: 'Active rest — 20 minute walk, 10 minute full body stretch. No intensity today.', duration: '30 min', difficulty: 'Rest' },
  7:  { text: 'Week 1 check-in — repeat Day 2 workout and notice what feels easier than Day 1.', duration: '25 min', difficulty: 'Medium' },
  8:  { text: 'Add resistance — 3x10 goblet squats, 3x10 dumbbell rows, 3x10 overhead press.', duration: '30 min', difficulty: 'Medium' },
  9:  { text: 'Push focus — push-ups, dips on a chair. 3 sets each. Go to failure on last set.', duration: '25 min', difficulty: 'Medium' },
  10: { text: '20 minute run/walk intervals — 1 min run, 2 min walk, repeat 6 times.', duration: '20 min', difficulty: 'Medium' },
  11: { text: 'Pull focus — rows, face pulls or Superman holds. 4 sets each.', duration: '30 min', difficulty: 'Medium' },
  12: { text: 'Leg day — squats, lunges, calf raises, glute bridges. 3x12 each.', duration: '30 min', difficulty: 'Medium' },
  13: { text: 'Active rest + mobility — hip flexor stretch, thoracic rotation, hamstring flow. 20 min.', duration: '20 min', difficulty: 'Rest' },
  14: { text: 'Milestone day — repeat your Day 2 workout. Compare. Feel the difference.', duration: '25 min', difficulty: 'Medium' },
  15: { text: 'Design your own push/pull/legs split for the week. Write it out today.', duration: '15 min', difficulty: 'Easy' },
  16: { text: 'Execute Day 1 of your own split. Track weights, reps, sets.', duration: '45 min', difficulty: 'Hard' },
  17: { text: 'Run or cardio — push your Day 10 time or distance by 10%.', duration: '25 min', difficulty: 'Hard' },
  18: { text: 'Execute Day 2 of your split. Add one set or one rep to each exercise.', duration: '45 min', difficulty: 'Hard' },
  19: { text: 'Active recovery — yoga flow or full body stretch. 30 minutes intentional movement.', duration: '30 min', difficulty: 'Rest' },
  20: { text: 'Execute Day 3 of your split. Go heavier or harder than Day 16.', duration: '45 min', difficulty: 'Hard' },
  21: { text: 'Final day — film your best movement. Compare to Day 1. You earned this.', duration: '30 min', difficulty: 'Final' },
}

const FITNESS_SUBTRACKS = new Set(['gym', 'calisthenics', 'running', 'sport', 'yoga'])

const FEELINGS = [
  { id: 'crushed',   label: '🔥 Crushed it' },
  { id: 'showed',    label: '✅ Showed up' },
  { id: 'struggled', label: '😤 Struggled but did it' },
  { id: 'almost',    label: '😓 Almost quit' },
]

const COMMUNITY = [
  { initials: 'AK', name: 'Arjun K.', color: '#534AB7' },
  { initials: 'SM', name: 'Sarah M.', color: '#0D9488' },
  { initials: 'RJ', name: 'Raj J.',   color: '#E8604A' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function getHeading(day) {
  if (day <= 7)  return `Welcome to Day ${day}`
  if (day <= 14) return `Day ${day} — Build`
  if (day <= 20) return `Day ${day} — Commit`
  return 'Day 21 — Final day'
}

function getSubtext(day) {
  if (day <= 7)  return "Every legend started exactly here. Let's begin."
  if (day <= 14) return "You made it through Week 1. Most people didn't. You did."
  if (day <= 20) return 'You are not the same person who started this.'
  return 'This is it. Show up one last time.'
}

function getCelebration(day) {
  if (day === 7)  return { emoji: '🔥', line: 'Week 1 done!' }
  if (day === 14) return { emoji: '⚡', line: 'Halfway there!' }
  if (day === 21) return { emoji: '🏆', line: 'You graduated!' }
  return { emoji: '✓', line: `Day ${day} complete!` }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate()

  const trackKey     = localStorage.getItem('flowstate_selected_track')    || 'fitness'
  const subtrackKey  = localStorage.getItem('flowstate_selected_subtrack') || 'gym'
  const subtrackName = SUBTRACK_NAMES[subtrackKey] || subtrackKey

  const [currentDay, setCurrentDay] = useState(() => {
    const v = localStorage.getItem('flowstate_current_day')
    return v ? Math.min(parseInt(v, 10), 21) : 1
  })
  const [streak, setStreak] = useState(() => {
    const v = localStorage.getItem('flowstate_streak')
    return v ? parseInt(v, 10) : 1
  })
  const [completedDays, setCompletedDays] = useState(() => {
    const v = localStorage.getItem('flowstate_completed_days')
    return v ? JSON.parse(v) : []
  })

  const [completed,       setCompleted]       = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showLogModal,    setShowLogModal]    = useState(false)
  const [feeling,         setFeeling]         = useState(null)
  const [logNote,         setLogNote]         = useState('')
  const [reflectionSaved, setReflectionSaved] = useState(false)
  const [showDevMenu,     setShowDevMenu]     = useState(false)

  const isFitness = FITNESS_SUBTRACKS.has(subtrackKey) || trackKey === 'fitness'
  const task      = isFitness ? FITNESS_TASKS[currentDay] : null
  const taskText  = task?.text ?? `Day ${currentDay} of your ${subtrackName} journey. Show up today. That's all that's required.`

  const celebration = getCelebration(currentDay)

  function handleMarkComplete() {
    if (completed) return

    const newCompletedDays = [...completedDays, currentDay]
    const newStreak  = streak + 1
    const newDay     = Math.min(currentDay + 1, 21)

    localStorage.setItem('flowstate_completed_days', JSON.stringify(newCompletedDays))
    localStorage.setItem('flowstate_streak', String(newStreak))
    localStorage.setItem('flowstate_current_day', String(newDay))

    setCompleted(true)
    setCompletedDays(newCompletedDays)
    setStreak(newStreak)

    setTimeout(() => {
      setShowCelebration(true)
      setTimeout(() => {
        if (currentDay === 21) {
          navigate('/graduation')
        } else {
          setCurrentDay(newDay)
          setCompleted(false)
          setShowCelebration(false)
        }
      }, 2000)
    }, 1500)
  }

  function handleSaveReflection() {
    if (!feeling) return
    const existing = JSON.parse(localStorage.getItem('flowstate_reflections') || '[]')
    existing.push({ day: currentDay, feeling, note: logNote, date: new Date().toISOString() })
    localStorage.setItem('flowstate_reflections', JSON.stringify(existing))
    setReflectionSaved(true)
    setTimeout(() => {
      setShowLogModal(false)
      setFeeling(null)
      setLogNote('')
      setReflectionSaved(false)
    }, 1200)
  }

  function closeLogModal() {
    setShowLogModal(false)
    setFeeling(null)
    setLogNote('')
  }

  function resetApp() {
    localStorage.clear()
    navigate('/')
  }

  function jumpToDay(day) {
    const completed = Array.from({ length: day - 1 }, (_, i) => i + 1)
    localStorage.setItem('flowstate_current_day', String(day))
    localStorage.setItem('flowstate_streak', String(day))
    localStorage.setItem('flowstate_completed_days', JSON.stringify(completed))
    setCurrentDay(day)
    setStreak(day)
    setCompletedDays(completed)
    setCompleted(false)
    setShowDevMenu(false)
  }

  return (
    <div className="min-h-screen bg-white pb-20">

      {/* ── Celebration overlay ──────────────────────────────── */}
      {showCelebration && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white text-center px-6"
          style={{ backgroundColor: '#534AB7' }}
        >
          <p className="text-7xl mb-4">{celebration.emoji}</p>
          <p className="text-3xl font-bold mb-2">{celebration.line}</p>
          {currentDay !== 21 && (
            <p className="text-lg" style={{ opacity: 0.8 }}>See you tomorrow</p>
          )}
        </div>
      )}

      {/* ── Log modal ────────────────────────────────────────── */}
      {showLogModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-[440px]">
            <h2 className="text-lg font-bold text-gray-900 mb-4">How did today feel?</h2>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {FEELINGS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFeeling(f.id)}
                  className="py-3 px-3 rounded-xl text-sm font-medium border text-left transition-all"
                  style={{
                    borderColor:     feeling === f.id ? '#534AB7' : '#e5e5e5',
                    backgroundColor: feeling === f.id ? '#EEEDFE' : 'white',
                    color:           feeling === f.id ? '#534AB7' : '#374151',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <textarea
              className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-700 resize-none focus:outline-none focus:border-gray-300 mb-4"
              style={{ minHeight: '80px' }}
              placeholder="Anything else on your mind? (optional)"
              value={logNote}
              onChange={e => setLogNote(e.target.value)}
            />

            {reflectionSaved ? (
              <p className="text-center text-sm font-semibold py-2" style={{ color: '#1D9E75' }}>
                Reflection saved ✓
              </p>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSaveReflection}
                  disabled={!feeling}
                  className="flex-1 py-3 rounded-xl text-white font-semibold text-sm transition-opacity"
                  style={{ backgroundColor: feeling ? '#534AB7' : '#c4c4c4', cursor: feeling ? 'pointer' : 'not-allowed' }}
                >
                  Save reflection
                </button>
                <button
                  onClick={closeLogModal}
                  className="px-5 py-3 rounded-xl text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
                >
                  Skip
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Top nav ──────────────────────────────────────────── */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
        <span className="text-lg font-semibold tracking-tight" style={{ color: '#534AB7' }}>
          flowstate
        </span>
        <div className="flex items-center gap-1.5">
          <span>🔥</span>
          <span className="text-sm text-gray-500">{streak} day streak</span>
        </div>
      </nav>

      {/* ── Page content ─────────────────────────────────────── */}
      <div className="max-w-[480px] mx-auto px-6 py-8 space-y-7">

        {/* Milestone banners */}
        {currentDay === 8 && (
          <div className="rounded-xl px-4 py-3 text-sm font-medium leading-snug" style={{ backgroundColor: '#E1F5EE', color: '#0F6E56' }}>
            🎉 Week 1 complete — you're ahead of 68% of people who started the same day
          </div>
        )}
        {currentDay === 15 && (
          <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ backgroundColor: '#EEEDFE', color: '#534AB7' }}>
            ⚡ Halfway there — 14 days down, 7 to go
          </div>
        )}

        {/* Track + day label */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            {subtrackName} — Day {currentDay} of {TOTAL}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-1.5">
            {getHeading(currentDay)}
          </h1>
          <p className="text-sm text-gray-400">{getSubtext(currentDay)}</p>
        </div>

        {/* Progress dots + bar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400">Your journey</span>
            <span className="text-xs font-semibold" style={{ color: '#534AB7' }}>
              {completedDays.length}/{TOTAL} days
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {Array.from({ length: TOTAL }, (_, i) => {
              const day = i + 1
              const done  = completedDays.includes(day)
              const today = day === currentDay && !done
              const bg    = done ? '#1D9E75' : today ? '#534AB7' : null
              return (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full transition-colors"
                  style={bg ? { backgroundColor: bg } : { border: '1.5px solid #e5e5e5' }}
                />
              )
            })}
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
            <div
              className="h-1 rounded-full transition-all duration-500"
              style={{ backgroundColor: '#534AB7', width: `${(completedDays.length / TOTAL) * 100}%` }}
            />
          </div>
        </div>

        {/* Today's task card */}
        <div className="rounded-xl p-5" style={{ backgroundColor: '#EEEDFE' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#3C3489' }}>
            Today's Task
          </p>
          <p className="text-sm text-gray-800 leading-relaxed mb-4">{taskText}</p>
          {task && (
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs text-white px-3 py-1 rounded-full font-medium" style={{ backgroundColor: '#534AB7' }}>
                ⏱ {task.duration}
              </span>
              <span className="text-xs text-white px-3 py-1 rounded-full font-medium" style={{ backgroundColor: '#534AB7' }}>
                {task.difficulty}
              </span>
            </div>
          )}
        </div>

        {/* Daily quote */}
        <div className="py-3 px-4 rounded-r-lg" style={{ borderLeft: '3px solid #534AB7', backgroundColor: '#f9f9f9' }}>
          <p className="text-sm italic text-gray-700 leading-relaxed mb-1">
            "The secret of getting ahead is getting started."
          </p>
          <p className="text-xs text-gray-400">— Mark Twain</p>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={handleMarkComplete}
            disabled={completed}
            className="w-full py-3 px-6 rounded-xl text-white font-semibold text-base transition-all duration-300"
            style={{ backgroundColor: completed ? '#1D9E75' : '#534AB7' }}
          >
            {completed ? `Day ${currentDay} Complete! ✓` : `Mark Day ${currentDay} Complete ✓`}
          </button>
          <button
            onClick={() => setShowLogModal(true)}
            className="w-full py-3 px-6 rounded-xl font-semibold text-base border-2 bg-white transition-colors hover:bg-gray-50"
            style={{ borderColor: '#534AB7', color: '#534AB7' }}
          >
            Add to my log
          </button>
        </div>

        {/* Community peek */}
        <div className="pb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Others on their journey
          </p>
          <div className="space-y-4">
            {COMMUNITY.map(user => (
              <div key={user.initials} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: user.color }}
                >
                  {user.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-400">Day {currentDay} · {streak} day streak 🔥</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dev menu — remove before launch */}
        <div className="text-center pb-4">
          <button
            onClick={() => setShowDevMenu(true)}
            className="text-xs text-gray-300 hover:text-gray-400 transition-colors"
          >
            Testing tools
          </button>
        </div>

        {showDevMenu && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center pb-8 px-6"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            onClick={() => setShowDevMenu(false)}
          >
            <div
              className="w-full max-w-[440px] bg-white rounded-xl shadow-xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {[
                { label: '🗑 Reset everything',  action: resetApp },
                { label: '⏩ Jump to Day 7',      action: () => jumpToDay(7) },
                { label: '⏩ Jump to Day 14',     action: () => jumpToDay(14) },
                { label: '⏩ Jump to Day 21',     action: () => jumpToDay(21) },
                { label: '🏆 Go to Graduation',   action: () => navigate('/graduation') },
              ].map(({ label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="w-full text-left px-5 py-4 text-sm font-medium text-gray-800 border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-0"
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => setShowDevMenu(false)}
                className="w-full px-5 py-4 text-sm font-medium text-gray-400 hover:bg-gray-50 transition-colors border-t border-gray-100"
              >
                Cancel
              </button>
              <p className="text-center text-xs text-gray-300 py-3">
                Testing tools — remove before launch
              </p>
            </div>
          </div>
        )}

      </div>

      <BottomNav />
    </div>
  )
}
