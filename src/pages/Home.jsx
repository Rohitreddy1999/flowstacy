import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import BottomNav from '../components/BottomNav'
import { getDayContent, getSubtrackByName } from '../lib/curriculum'

// ── Constants ──────────────────────────────────────────────────────────────────

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

const FEELINGS = [
  { id: 'crushed',   label: '🔥 Crushed it' },
  { id: 'showed',    label: '✅ Showed up' },
  { id: 'struggled', label: '😤 Struggled but did it' },
  { id: 'almost',    label: '😓 Almost quit' },
]

const COMMUNITY = [
  { initials: 'MJ', name: 'Maya J.',  day: 12, streak: 12,
    bg: 'rgba(83,74,183,0.3)',   color: '#9D92F8' },
  { initials: 'TR', name: 'Theo R.',  day: 9,  streak: 9,
    bg: 'rgba(15,110,86,0.3)',   color: '#5DCAA5' },
  { initials: 'AK', name: 'Aria K.',  day: 11, streak: 11,
    bg: 'rgba(133,79,11,0.3)',   color: '#EF9F27' },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function getPhase(day) {
  if (day <= 7)  return 'Week 1 — Foundation'
  if (day <= 14) return 'Week 2 — Build'
  return 'Week 3 — Commit'
}

function getDayType(content) {
  if (!content) return 'Session'
  if (content.difficulty) return content.difficulty
  return 'Training'
}

function parseTaskDescription(text) {
  if (!text) return { steps: [], why: '' }

  const whyIndex = text.indexOf('Why this matters:')

  let whatText = whyIndex > -1
    ? text.substring(0, whyIndex).trim()
    : text

  let whyText = whyIndex > -1
    ? text.substring(whyIndex + 'Why this matters:'.length).trim()
    : ''

  whatText = whatText.replace('What to do:', '').trim()

  const rawSteps = whatText
    .split(/\.\s+(?=[A-Z0-9])/)
    .map(s => s.trim())
    .filter(s => s.length > 15)

  const steps = rawSteps.map(step => step.replace(/\.$/, '').trim())

  return { steps, why: whyText }
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate()

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

  const [completed,           setCompleted]           = useState(false)
  const [celebrating,         setCelebrating]         = useState(false)
  const [showCelebrationCard, setShowCelebrationCard] = useState(false)
  const [showLogModal,        setShowLogModal]        = useState(false)
  const [feeling,             setFeeling]             = useState(null)
  const [logNote,             setLogNote]             = useState('')
  const [reflectionSaved,     setReflectionSaved]     = useState(false)
  const [showDevMenu,         setShowDevMenu]         = useState(false)
  const [showFullPlan,        setShowFullPlan]        = useState(false)

  const [dayContent,     setDayContent]     = useState(null)
  const [contentLoading, setContentLoading] = useState(true)
  const [allDays,        setAllDays]        = useState([])

  // ── Fetch curriculum ───────────────────────────────────────────────────────

  useEffect(() => {
    async function fetchCurriculumData() {
      setContentLoading(true)
      const subtracks_name = localStorage.getItem('flowstate_selected_subtrack')
      if (!subtracks_name) { setContentLoading(false); return }

      const displayName  = SUBTRACK_NAMES[subtracks_name] || subtracks_name
      const subtrackData = await getSubtrackByName(displayName)

      if (subtrackData) {
        const content = await getDayContent(subtrackData.id, currentDay)
        setDayContent(content)

        // Fetch all 21 days for the full plan sheet
        const allContent = await Promise.all(
          Array.from({ length: 21 }, (_, i) =>
            getDayContent(subtrackData.id, i + 1)
          )
        )
        setAllDays(allContent)
      }

      setContentLoading(false)
    }
    fetchCurriculumData()
  }, [currentDay])

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleMarkComplete() {
    if (completed) return

    const newCompletedDays = [...completedDays, currentDay]
    const newStreak        = streak + 1
    const newDay           = Math.min(currentDay + 1, 21)

    localStorage.setItem('flowstate_completed_days', JSON.stringify(newCompletedDays))
    localStorage.setItem('flowstate_streak',         String(newStreak))
    localStorage.setItem('flowstate_current_day',    String(newDay))

    setCompleted(true)
    setCompletedDays(newCompletedDays)
    setStreak(newStreak)
    setCelebrating(true)

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#534AB7', '#9D92F8', '#1D9E75', '#5DCAA5', '#ffffff'],
      disableForReducedMotion: true
    })

    setTimeout(() => setShowCelebrationCard(true), 400)
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
    const done = Array.from({ length: day - 1 }, (_, i) => i + 1)
    localStorage.setItem('flowstate_current_day',    String(day))
    localStorage.setItem('flowstate_streak',         String(day))
    localStorage.setItem('flowstate_completed_days', JSON.stringify(done))
    setCurrentDay(day)
    setStreak(day)
    setCompletedDays(done)
    setCompleted(false)
    setCelebrating(false)
    setShowDevMenu(false)
  }

  // ── Derived ────────────────────────────────────────────────────────────────

  const { steps, why: whyText } = parseTaskDescription(dayContent?.task_description)
  const phase     = getPhase(currentDay)
  const dayType   = getDayType(dayContent)
  const refs      = [
    { url: dayContent?.reference_url_1, label: dayContent?.ref_label_1 },
    { url: dayContent?.reference_url_2, label: dayContent?.ref_label_2 },
    { url: dayContent?.reference_url_3, label: dayContent?.ref_label_3 },
  ].filter(r => r.url && r.label)

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: '#0A0812', paddingBottom: 100 }}>

      {/* ── Celebration overlay ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showCelebrationCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(10,8,18,0.85)',
              backdropFilter: 'blur(12px)',
              zIndex: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setShowCelebrationCard(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
              style={{
                background: 'rgba(20,16,40,0.98)',
                border: '0.5px solid rgba(157,146,248,0.3)',
                borderRadius: '24px',
                padding: '32px 24px',
                textAlign: 'center',
                maxWidth: '320px', width: '100%'
              }}
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                style={{ fontSize: '64px', marginBottom: '16px', lineHeight: 1 }}
              >
                {currentDay === 7 ? '🔥' : currentDay === 14 ? '⚡' : currentDay === 21 ? '🏆' : '✓'}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ fontSize: '24px', fontWeight: '500', color: 'white', margin: '0 0 8px' }}
              >
                {currentDay === 7  ? 'Week 1 done.'   :
                 currentDay === 14 ? 'Halfway there.' :
                 currentDay === 21 ? 'You graduated.' :
                 `Day ${currentDay} complete.`}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', margin: '0 0 24px', lineHeight: 1.5 }}
              >
                {currentDay === 7  ? 'You showed up every day this week. Most people quit here.' :
                 currentDay === 14 ? 'Two weeks in. You are not the same person who started.'    :
                 currentDay === 21 ? 'You did it. All 21 days. That identity is yours now.'      :
                 'See you tomorrow. The streak continues.'}
              </motion.p>

              <motion.div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '24px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span style={{ fontSize: '28px', fontWeight: '600', color: '#9D92F8' }}>{streak}</span>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>day streak 🔥</span>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setShowCelebrationCard(false)
                  if (currentDay === 21) {
                    navigate('/graduation')
                  } else {
                    setCurrentDay(prev => Math.min(prev + 1, 21))
                    setCompleted(false)
                    setCelebrating(false)
                  }
                }}
                style={{
                  width: '100%', padding: '14px',
                  background: currentDay === 21 ? '#1D9E75' : '#534AB7',
                  border: 'none', borderRadius: '14px',
                  color: 'white', fontSize: '15px', fontWeight: '500', cursor: 'pointer'
                }}
              >
                {currentDay === 21 ? 'Go to graduation →' : 'Keep going →'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Reflection modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showLogModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'flex-end'
            }}
            onClick={closeLogModal}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                width: '100%', maxWidth: 480, margin: '0 auto',
                background: '#0F0C1A',
                borderRadius: '24px 24px 0 0',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                padding: '24px 20px 40px'
              }}
              onClick={e => e.stopPropagation()}
            >
              <p style={{ fontSize: '17px', fontWeight: 600, color: 'white', marginBottom: 16 }}>
                How did today feel?
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                {FEELINGS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFeeling(f.id)}
                    style={{
                      padding: 12, textAlign: 'center', cursor: 'pointer',
                      background: feeling === f.id ? 'rgba(83,74,183,0.2)' : 'rgba(255,255,255,0.05)',
                      border: feeling === f.id ? '1px solid rgba(157,146,248,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 12, color: 'white', fontSize: 14
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <textarea
                style={{
                  width: '100%', height: 80, resize: 'none',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, padding: 12,
                  color: 'white', fontSize: 14, outline: 'none',
                  fontFamily: 'system-ui', boxSizing: 'border-box'
                }}
                placeholder="Anything else on your mind? (optional)"
                value={logNote}
                onChange={e => setLogNote(e.target.value)}
              />
              {reflectionSaved ? (
                <p style={{ textAlign: 'center', fontSize: 14, fontWeight: 500, padding: '12px 0', color: '#5DCAA5' }}>
                  Reflection saved ✓
                </p>
              ) : (
                <>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveReflection}
                    disabled={!feeling}
                    style={{
                      width: '100%', height: 50, marginTop: 12,
                      background: feeling ? '#534AB7' : 'rgba(255,255,255,0.06)',
                      border: 'none', borderRadius: 25,
                      color: feeling ? 'white' : 'rgba(255,255,255,0.2)',
                      fontSize: 15, fontWeight: 500, cursor: feeling ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Save reflection
                  </motion.button>
                  <button
                    onClick={closeLogModal}
                    style={{
                      width: '100%', height: 44, marginTop: 8,
                      background: 'none', border: 'none',
                      color: 'rgba(255,255,255,0.3)', fontSize: 14, cursor: 'pointer'
                    }}
                  >
                    Skip
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Dev menu ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showDevMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 300,
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)'
            }}
            onClick={() => setShowDevMenu(false)}
          >
            <div
              style={{
                position: 'fixed', bottom: 80, left: 16, right: 16, maxWidth: 448,
                margin: '0 auto', background: '#0F0C1A',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: 16, zIndex: 300
              }}
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
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '12px 0', background: 'none', border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.8)', fontSize: 14, cursor: 'pointer'
                  }}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => setShowDevMenu(false)}
                style={{
                  display: 'block', width: '100%', textAlign: 'center',
                  padding: '12px 0 0', background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.3)', fontSize: 14, cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Full plan bottom sheet ────────────────────────────────────────── */}
      <AnimatePresence>
        {showFullPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)'
            }}
            onClick={() => setShowFullPlan(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                maxWidth: 480, margin: '0 auto',
                background: '#0F0C1A',
                borderRadius: '24px 24px 0 0',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                maxHeight: '80vh',
                overflow: 'hidden',
                display: 'flex', flexDirection: 'column'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Sheet header */}
              <div style={{
                padding: '20px 20px 0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexShrink: 0
              }}>
                <span style={{ fontSize: 17, fontWeight: 600, color: 'white' }}>
                  Your 21-day plan
                </span>
                <button
                  onClick={() => setShowFullPlan(false)}
                  style={{
                    background: 'none', border: 'none',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: 24, cursor: 'pointer', lineHeight: 1, padding: '4px'
                  }}
                >
                  ×
                </button>
              </div>

              {/* Scrollable list */}
              <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
                {Array.from({ length: 21 }, (_, i) => {
                  const day     = i + 1
                  const isDone  = completedDays.includes(day)
                  const isToday = day === currentDay && !isDone
                  const content = allDays[i]

                  return (
                    <div
                      key={day}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '12px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      {/* Day circle */}
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 600,
                        background: isDone  ? '#1D9E75' :
                                    isToday ? '#534AB7'  :
                                    'rgba(255,255,255,0.06)',
                        color: isDone || isToday ? 'white' : 'rgba(255,255,255,0.3)',
                        boxShadow: isToday ? '0 0 12px rgba(83,74,183,0.5)' : 'none'
                      }}>
                        {isDone ? '✓' : day}
                      </div>

                      {/* Title */}
                      <span style={{
                        flex: 1, fontSize: 14,
                        color:          isDone  ? 'rgba(255,255,255,0.4)' :
                                        isToday ? 'white' :
                                        'rgba(255,255,255,0.6)',
                        fontWeight:     isToday ? 500 : 400,
                        textDecoration: isDone ? 'line-through' : 'none'
                      }}>
                        {content?.task_title || `Day ${day} — ${getPhase(day).split(' — ')[1]}`}
                      </span>

                      {/* Duration pill */}
                      {content?.duration_minutes && (
                        <span style={{
                          fontSize: 11, color: 'rgba(255,255,255,0.3)',
                          background: 'rgba(255,255,255,0.05)',
                          padding: '3px 8px', borderRadius: 10
                        }}>
                          {content.duration_minutes}m
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sticky top bar ───────────────────────────────────────────────── */}
      <div style={{
        height: 52,
        padding: '0 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(10,8,18,0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 100,
        maxWidth: 480, width: '100%', margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        <motion.span
          animate={{
            textShadow: [
              '0 0 10px rgba(157,146,248,0.3)',
              '0 0 20px rgba(157,146,248,0.7)',
              '0 0 10px rgba(157,146,248,0.3)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontSize: 18, fontWeight: 600,
            color: '#9D92F8', letterSpacing: '0.01em'
          }}
        >
          flowstate
        </motion.span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 13 }}>🔥</span>
          <span style={{ fontSize: 13, color: '#9D92F8', fontWeight: 600 }}>{streak}</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}> day streak</span>
        </div>
      </div>

      {/* ── Day hero ─────────────────────────────────────────────────────── */}
      <div style={{ padding: '28px 20px 16px', maxWidth: 480, margin: '0 auto' }}>
        <p style={{
          fontSize: 11, fontWeight: 500, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
          margin: '0 0 8px'
        }}>
          {subtrackName.toUpperCase()}
        </p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: 48, fontWeight: 700, color: 'white',
            letterSpacing: '-0.02em', lineHeight: 1,
            margin: '0 0 6px'
          }}
        >
          Day {currentDay}
        </motion.h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          {phase} · {dayType}
        </p>
      </div>

      {/* ── Progress section ─────────────────────────────────────────────── */}
      <div style={{ padding: '0 20px 20px', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Your journey</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{currentDay} of 21 days</span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 2, background: 'rgba(255,255,255,0.08)',
          borderRadius: 1, marginBottom: 14, overflow: 'hidden'
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentDay / 21) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              height: 2, background: '#534AB7',
              boxShadow: '0 0 8px rgba(83,74,183,0.5)'
            }}
          />
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {Array.from({ length: 21 }, (_, i) => {
            const day   = i + 1
            const done  = completedDays.includes(day)
            const today = day === currentDay && !done
            return (
              <motion.div
                key={day}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.02, type: 'spring', stiffness: 400, damping: 20 }}
                style={{
                  width: 9, height: 9, borderRadius: '50%',
                  background: done  ? '#1D9E75' :
                              today ? '#9D92F8'  :
                              'rgba(255,255,255,0.1)'
                }}
              >
                {today && (
                  <motion.div
                    animate={{ scale: [1, 1.6, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      width: '100%', height: '100%', borderRadius: '50%',
                      background: '#9D92F8'
                    }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>

        <button
          onClick={() => setShowFullPlan(true)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, color: 'rgba(157,146,248,0.6)',
            marginTop: 10, padding: 0
          }}
        >
          View full 21-day plan →
        </button>
      </div>

      {/* ── Today's task card ─────────────────────────────────────────────── */}
      <div style={{ margin: '0 16px 16px' }}>
        {contentLoading ? (
          <div style={{
            padding: 20, background: 'rgba(83,74,183,0.08)',
            border: '1px solid rgba(157,146,248,0.12)',
            borderRadius: 20
          }}>
            {[120, 80, 60].map((h, i) => (
              <div
                key={i}
                style={{
                  height: h, background: 'rgba(255,255,255,0.06)',
                  borderRadius: 8, marginBottom: 12,
                  animation: 'pulse 1.5s ease-in-out infinite'
                }}
              />
            ))}
          </div>
        ) : (
          <div style={{
            padding: 20,
            background: 'rgba(83,74,183,0.08)',
            border: '1px solid rgba(157,146,248,0.12)',
            borderRadius: 20
          }}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: 11, fontWeight: 500, letterSpacing: '0.08em',
                color: 'rgba(157,146,248,0.7)'
              }}>
                TODAY'S TASK
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                {dayContent?.duration_minutes && (
                  <span style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 20,
                    background: 'rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.45)'
                  }}>
                    ⏱ {dayContent.duration_minutes} min
                  </span>
                )}
                {dayContent?.difficulty && (
                  <span style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 20,
                    background: 'rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.45)'
                  }}>
                    {dayContent.difficulty}
                  </span>
                )}
              </div>
            </div>

            {/* Task title */}
            {dayContent?.task_title && (
              <p style={{
                fontSize: 16, fontWeight: 600, color: 'white',
                margin: '12px 0 0', lineHeight: 1.3
              }}>
                {dayContent.task_title}
              </p>
            )}

            {/* WHAT TO DO */}
            <div style={{ marginTop: 16 }}>
              <p style={{
                fontSize: 11, fontWeight: 500, letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.25)', marginBottom: 12
              }}>
                WHAT TO DO
              </p>

              {steps.length > 0 ? (
                steps.map((step, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10
                  }}>
                    <span style={{
                      fontSize: 14, fontWeight: 600, color: '#9D92F8',
                      minWidth: 20, lineHeight: 1.5
                    }}>
                      {i + 1}.
                    </span>
                    <span style={{
                      fontSize: 14, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5
                    }}>
                      {step}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{
                  fontSize: 14, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, margin: 0
                }}>
                  {dayContent?.task_description ||
                    `Day ${currentDay} of your ${subtrackName} journey. Show up today. That's all that's required.`}
                </p>
              )}
            </div>

            {/* WHY THIS MATTERS */}
            {whyText && (
              <>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />
                <p style={{
                  fontSize: 11, fontWeight: 500, letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.25)', marginBottom: 8
                }}>
                  WHY THIS MATTERS
                </p>
                <p style={{
                  fontSize: 13, color: 'rgba(255,255,255,0.4)',
                  lineHeight: 1.6, margin: 0
                }}>
                  {whyText}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Watch & Learn ─────────────────────────────────────────────────── */}
      {!contentLoading && (dayContent?.youtube_url || refs.length > 0) && (
        <div style={{ padding: '0 16px 16px' }}>
          <p style={{
            fontSize: 11, fontWeight: 500, letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.25)', marginBottom: 12
          }}>
            WATCH &amp; LEARN
          </p>

          {/* Must watch */}
          {dayContent?.youtube_url && (
            <div
              onClick={() => window.open(dayContent.youtube_url, '_blank')}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, marginBottom: 8, cursor: 'pointer'
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(83,74,183,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#9D92F8', fontSize: 14, flexShrink: 0
              }}>
                ▶
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, color: 'white', fontWeight: 500, margin: 0 }}>
                  {dayContent.must_watch_label || "Watch today's guide"}
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '2px 0 0' }}>
                  Must watch{dayContent.duration_minutes ? ` · ${dayContent.duration_minutes} min` : ''}
                </p>
              </div>
              <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.2)' }}>›</span>
            </div>
          )}

          {/* Reference links */}
          {refs.map((ref, i) => (
            <div
              key={i}
              onClick={() => window.open(ref.url, '_blank')}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, marginBottom: 8, cursor: 'pointer'
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.4)', fontSize: 14, flexShrink: 0
              }}>
                ↗
              </div>
              <p style={{ flex: 1, fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: 0, fontWeight: 500 }}>
                {ref.label}
              </p>
              <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.2)' }}>›</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Daily quote ───────────────────────────────────────────────────── */}
      {!contentLoading && (
        <div style={{
          margin: '0 16px 16px', padding: '14px 16px',
          borderLeft: '2px solid #534AB7',
          background: 'rgba(83,74,183,0.06)',
          borderRadius: '0 14px 14px 0'
        }}>
          <p style={{
            fontSize: 14, color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.6, fontStyle: 'italic', marginBottom: 6
          }}>
            "{dayContent?.quote_text || 'The secret of getting ahead is getting started.'}"
          </p>
          <p style={{ fontSize: 12, color: '#9D92F8', margin: 0 }}>
            {dayContent?.quote_author ? `— ${dayContent.quote_author}` : '— Mark Twain'}
          </p>
        </div>
      )}

      {/* ── Action buttons ────────────────────────────────────────────────── */}
      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <motion.button
          whileTap={{ scale: completed ? 1 : 0.98 }}
          onClick={handleMarkComplete}
          disabled={completed}
          style={{
            width: '100%', height: 54, border: 'none', borderRadius: 27,
            background: completed ? '#1D9E75' : '#534AB7',
            color: 'white', fontSize: 15, fontWeight: 500,
            cursor: completed ? 'default' : 'pointer',
            boxShadow: completed
              ? '0 0 30px rgba(29,158,117,0.3)'
              : '0 0 30px rgba(83,74,183,0.3)',
            transition: 'all 0.3s'
          }}
        >
          {completed ? `Day ${currentDay} Complete ✓` : `Mark Day ${currentDay} Complete`}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowLogModal(true)}
          style={{
            width: '100%', height: 46, border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 27, background: 'transparent',
            color: 'rgba(255,255,255,0.45)', fontSize: 14, cursor: 'pointer'
          }}
        >
          Add to my log
        </motion.button>
      </div>

      {/* ── Community peek ────────────────────────────────────────────────── */}
      <div style={{ padding: '0 16px 24px' }}>
        <p style={{
          fontSize: 11, fontWeight: 500, letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.25)', marginBottom: 12
        }}>
          YOUR SQUAD TODAY
        </p>
        {COMMUNITY.map(user => (
          <div
            key={user.initials}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: user.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 500, color: user.color, flexShrink: 0
            }}>
              {user.initials}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, color: 'white', fontWeight: 500, margin: 0 }}>{user.name}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>Day {user.day}</p>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#EF9F27' }}>
              {user.streak}d 🔥
            </span>
          </div>
        ))}
      </div>

      {/* ── Testing tools ────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', paddingBottom: 16 }}>
        <button
          onClick={() => setShowDevMenu(true)}
          style={{
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.15)', fontSize: 11, cursor: 'pointer'
          }}
        >
          Testing tools
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
