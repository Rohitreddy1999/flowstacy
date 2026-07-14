import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { getDayContent, SUBTRACK_NAMES, SUBTRACK_IDS } from '../lib/curriculum'
import DayView from '../components/DayView'

// ── Palette ────────────────────────────────────────────────────────────────────
const ABYSS    = '#07090D'
const FATHOM   = '#0F141A'
const SURGE    = '#3DF5A6'
const GLACIAL  = '#82D4FF'
const PLASMA   = '#FF4FD8'
const ARC_LIGHT = '#EAFFF5'

// ── Constants ──────────────────────────────────────────────────────────────────
const TOTAL = 21

const FEELINGS = [
  { id: 'crushed',   label: 'Crushed it'       },
  { id: 'showed',    label: 'Showed up'         },
  { id: 'struggled', label: 'Struggled through' },
  { id: 'almost',    label: 'Almost quit'       },
]

const COMMUNITY = [
  { initials: 'MJ', name: 'Maya J.',  day: 12, streak: 12, bg: 'rgba(130,212,255,0.12)', color: GLACIAL },
  { initials: 'TR', name: 'Theo R.',  day: 9,  streak: 9,  bg: 'rgba(61,245,166,0.12)',  color: SURGE   },
  { initials: 'AK', name: 'Aria K.',  day: 11, streak: 11, bg: 'rgba(255,79,216,0.12)',  color: PLASMA  },
]

// ── SVG Icons ──────────────────────────────────────────────────────────────────

function CheckSvg({ size = 28, color = SURGE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="14" cy="14" r="13" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <path d="M9 14l3.5 3.5 6.5-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DiamondSvg({ size = 11, color = SURGE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill={color} style={{ flexShrink: 0 }}>
      <path d="M6 1L11 6L6 11L1 6Z" />
    </svg>
  )
}

function ChevronRightSvg({ size = 16, color = 'rgba(255,255,255,0.25)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9 18l6-6-6-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronDownSvg({ size = 16, color = GLACIAL }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlaySvg({ size = 14, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function LinkSvg({ size = 14, color = 'rgba(255,255,255,0.4)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getPhaseLabel(day) {
  if (day <= 7)  return 'FOUNDATION'
  if (day <= 14) return 'BUILD'
  return 'COMMIT'
}

function getPhaseColor(day) {
  if (day <= 7)  return GLACIAL
  if (day <= 14) return SURGE
  return PLASMA
}

function getPhaseHeadline(day) {
  if (day <= 7)  return 'Build the foundation.'
  if (day <= 14) return 'Momentum is compounding.'
  return 'This is who you are now.'
}

function getJammyLine(day) {
  if (day <= 7)  return 'Every expert started exactly where you are right now.'
  if (day <= 14) return "You're past the point where most people quit. Keep moving."
  return '21 days becomes a lifestyle. You\'re almost there.'
}

function getJammyExpanded(day, name) {
  if (day <= 7)  return `The Foundation phase is about showing up — no matter how you feel. ${name} requires repetition before it requires perfection. Keep the bar low enough that you can't fail it.`
  if (day <= 14) return `The Build phase is where the habit starts to automate. You've already proven you can show up. Now you're wiring the loop so it runs on its own. The resistance is the signal, not the obstacle.`
  return `The Commit phase is where identity shifts. Neuroscience says 21 days to rewire — you're proving it right now. After this, ${name} is just part of who you are.`
}

function parseTaskDescription(text) {
  if (!text) return { steps: [], why: '' }
  const whyIndex = text.indexOf('Why this matters:')
  let whatText = whyIndex > -1 ? text.substring(0, whyIndex).trim() : text
  let whyText  = whyIndex > -1 ? text.substring(whyIndex + 'Why this matters:'.length).trim() : ''
  whatText = whatText.replace('What to do:', '').trim()
  const steps = whatText
    .split(/\.\s+(?=[A-Z0-9])/)
    .map(s => s.trim())
    .filter(s => s.length > 15)
    .map(s => s.replace(/\.$/, '').trim())
  return { steps, why: whyText }
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate()

  const subtrackKey  = localStorage.getItem('flowstacy_selected_subtrack') || 'gym'
  const subtrackName = SUBTRACK_NAMES[subtrackKey] || subtrackKey

  const [currentDay, setCurrentDay] = useState(() => {
    const v = localStorage.getItem('flowstacy_current_day')
    return v ? Math.min(parseInt(v, 10), 21) : 1
  })
  const [streak, setStreak] = useState(() => {
    const v = localStorage.getItem('flowstacy_streak')
    return v ? parseInt(v, 10) : 1
  })
  const [completedDays, setCompletedDays] = useState(() => {
    const v = localStorage.getItem('flowstacy_completed_days')
    return v ? JSON.parse(v) : []
  })

  const completed = completedDays.some(d => d.day === currentDay)
  const [celebrating,         setCelebrating]         = useState(false)
  const [showCelebrationCard, setShowCelebrationCard] = useState(false)
  const [showLogModal,        setShowLogModal]        = useState(false)
  const [feeling,             setFeeling]             = useState(null)
  const [logNote,             setLogNote]             = useState('')
  const [reflectionSaved,     setReflectionSaved]     = useState(false)
  const [showDevMenu,         setShowDevMenu]         = useState(false)
  const [showFullPlan,        setShowFullPlan]        = useState(false)
  const [jammyExpanded,       setJammyExpanded]       = useState(false)

  const [dayContent,     setDayContent]     = useState(null)
  const [contentLoading, setContentLoading] = useState(true)
  const [allDays,        setAllDays]        = useState([])

  // Hold-to-energize interaction state
  const [holdProgress,  setHoldProgress]  = useState(0)
  const [isHolding,     setIsHolding]     = useState(false)
  const holdStartRef = useRef(null)
  const rafRef       = useRef(null)

  // Squad hover state
  const [hoveredSquad, setHoveredSquad] = useState(null)

  // ── Fetch curriculum ───────────────────────────────────────────────────────

  useEffect(() => {
    async function fetchCurriculumData() {
      setContentLoading(true)
      const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      const subtrackId = UUID_RE.test(subtrackKey) ? subtrackKey : SUBTRACK_IDS[subtrackKey]
      if (!subtrackId) { setContentLoading(false); return }

      const content = await getDayContent(subtrackId, currentDay)
      setDayContent(content)

      const allContent = await Promise.all(
        Array.from({ length: 21 }, (_, i) => getDayContent(subtrackId, i + 1))
      )
      setAllDays(allContent)
      setContentLoading(false)
    }
    fetchCurriculumData()
  }, [currentDay])

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleMarkComplete() {
    if (completed) return
    const newCompletedDays = [
      ...completedDays,
      { day: currentDay, completedAt: Date.now(), dayOfWeek: new Date().getDay() }
    ]
    const newStreak        = streak + 1
    const newDay           = Math.min(currentDay + 1, 21)
    localStorage.setItem('flowstacy_completed_days', JSON.stringify(newCompletedDays))
    localStorage.setItem('flowstacy_streak',         String(newStreak))
    localStorage.setItem('flowstacy_current_day',    String(newDay))
    setCompletedDays(newCompletedDays)
    setStreak(newStreak)
    setCelebrating(true)
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: [SURGE, GLACIAL, PLASMA, ARC_LIGHT],
      disableForReducedMotion: true
    })
    setTimeout(() => setShowCelebrationCard(true), 400)
  }

  function handleSaveReflection() {
    if (!feeling) return
    const existing = JSON.parse(localStorage.getItem('flowstacy_reflections') || '[]')
    existing.push({ day: currentDay, feeling, note: logNote, date: new Date().toISOString() })
    localStorage.setItem('flowstacy_reflections', JSON.stringify(existing))
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

  function handleDayViewComplete(feeling, note) {
    const reflections = JSON.parse(localStorage.getItem('flowstacy_reflections') || '[]')
    reflections.push({ day: currentDay, feeling, note, date: new Date().toISOString() })
    localStorage.setItem('flowstacy_reflections', JSON.stringify(reflections))

    if (completed) return

    const newCompletedDays = [
      ...completedDays,
      { day: currentDay, completedAt: Date.now(), dayOfWeek: new Date().getDay() }
    ]
    const newStreak = streak + 1
    const newDay    = Math.min(currentDay + 1, 21)

    localStorage.setItem('flowstacy_completed_days', JSON.stringify(newCompletedDays))
    localStorage.setItem('flowstacy_streak',         String(newStreak))
    localStorage.setItem('flowstacy_current_day',    String(newDay))

    setCompletedDays(newCompletedDays)
    setStreak(newStreak)

    if (currentDay === 21) {
      navigate('/graduation')
    } else {
      setCurrentDay(prev => Math.min(prev + 1, 21))
    }
  }

  function resetApp() {
    localStorage.clear()
    navigate('/')
  }

  function jumpToDay(day) {
    const done = Array.from({ length: day - 1 }, (_, i) => ({
      day: i + 1, completedAt: Date.now(), dayOfWeek: new Date().getDay()
    }))
    localStorage.setItem('flowstacy_current_day',    String(day))
    localStorage.setItem('flowstacy_streak',         String(day))
    localStorage.setItem('flowstacy_completed_days', JSON.stringify(done))
    setCurrentDay(day)
    setStreak(day)
    setCompletedDays(done)
    setCelebrating(false)
    setShowDevMenu(false)
  }

  // ── Derived ────────────────────────────────────────────────────────────────

  const steps = dayContent?.steps ?? parseTaskDescription(dayContent?.task_description).steps
  const whyText = dayContent?.why_text ?? parseTaskDescription(dayContent?.task_description).why
  const refs = [
    { url: dayContent?.reference_url_1, label: dayContent?.ref_label_1 },
    { url: dayContent?.reference_url_2, label: dayContent?.ref_label_2 },
    { url: dayContent?.reference_url_3, label: dayContent?.ref_label_3 },
  ].filter(r => r.url && r.label)

  const phaseColor = getPhaseColor(currentDay)

  // Circuit ring math
  const ringR           = 80
  const ringCircum      = 2 * Math.PI * ringR
  const completedFrac   = completedDays.length / TOTAL
  const ringDashOffset  = ringCircum * (1 - completedFrac)
  const tipAngle        = -Math.PI / 2 + completedFrac * 2 * Math.PI
  const tipX            = (100 + ringR * Math.cos(tipAngle)).toFixed(2)
  const tipY            = (100 + ringR * Math.sin(tipAngle)).toFixed(2)

  const dayLabel = String(currentDay).padStart(2, '0')

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100%', background: ABYSS, paddingBottom: 100, fontFamily: '"Hanken Grotesk", sans-serif' }}>

      {/* ── Celebration overlay ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showCelebrationCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(7,9,13,0.88)',
              backdropFilter: 'blur(16px)',
              zIndex: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setShowCelebrationCard(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 32 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              style={{
                background: FATHOM,
                border: `1px solid rgba(61,245,166,0.2)`,
                borderRadius: '24px',
                padding: '36px 24px',
                textAlign: 'center',
                maxWidth: '320px', width: '100%'
              }}
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 400 }}
                style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}
              >
                {currentDay === 7 || currentDay === 14 || currentDay === 21 ? (
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: `rgba(61,245,166,0.1)`,
                    border: `1px solid rgba(61,245,166,0.3)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span style={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 900, fontSize: 24,
                      color: SURGE
                    }}>
                      {currentDay === 21 ? '21' : currentDay === 14 ? '14' : '7'}
                    </span>
                  </div>
                ) : (
                  <CheckSvg size={64} color={SURGE} />
                )}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 22, fontWeight: 700,
                  color: 'rgba(255,255,255,0.95)',
                  margin: '0 0 8px', letterSpacing: '-0.01em'
                }}
              >
                {currentDay === 7  ? 'Week 1 done.'   :
                 currentDay === 14 ? 'Halfway there.' :
                 currentDay === 21 ? 'You graduated.' :
                 `Day ${currentDay} complete.`}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: '0 0 24px', lineHeight: 1.6 }}
              >
                {currentDay === 7  ? 'You showed up every day this week. Most people quit here.'     :
                 currentDay === 14 ? 'Two weeks in. You are not the same person who started.'        :
                 currentDay === 21 ? 'You did it. All 21 days. That identity is yours now.'          :
                 'See you tomorrow. The circuit continues.'}
              </motion.p>

              <motion.div
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: streak >= 14 ? 'rgba(255,79,216,0.1)' : 'rgba(61,245,166,0.1)',
                  border: `1px solid ${streak >= 14 ? 'rgba(255,79,216,0.3)' : 'rgba(61,245,166,0.3)'}`,
                  borderRadius: 20, padding: '6px 14px',
                  marginBottom: 24
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <DiamondSvg size={11} color={streak >= 14 ? PLASMA : SURGE} />
                <span style={{ fontSize: 15, fontWeight: 700, color: streak >= 14 ? PLASMA : SURGE }}>
                  {streak} day streak
                </span>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setShowCelebrationCard(false)
                  if (currentDay === 21) {
                    navigate('/graduation')
                  } else {
                    setCurrentDay(prev => Math.min(prev + 1, 21))
                    setCelebrating(false)
                  }
                }}
                style={{
                  width: '100%', height: 52,
                  background: currentDay === 21 ? GLACIAL : SURGE,
                  border: 'none', borderRadius: 26,
                  color: ABYSS, fontSize: 15, fontWeight: 700,
                  cursor: 'pointer', fontFamily: '"Hanken Grotesk", sans-serif'
                }}
              >
                {currentDay === 21 ? 'Go to graduation' : 'Keep going'}
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
              background: 'rgba(7,9,13,0.8)', backdropFilter: 'blur(10px)',
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
                background: FATHOM,
                borderRadius: '24px 24px 0 0',
                borderTop: `1px solid rgba(255,255,255,0.08)`,
                padding: '24px 20px 40px'
              }}
              onClick={e => e.stopPropagation()}
            >
              <p style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 17, fontWeight: 700,
                color: 'rgba(255,255,255,0.95)', marginBottom: 16
              }}>
                How did today feel?
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                {FEELINGS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFeeling(f.id)}
                    style={{
                      padding: 12, textAlign: 'center', cursor: 'pointer',
                      background: feeling === f.id ? 'rgba(61,245,166,0.08)' : 'rgba(255,255,255,0.04)',
                      border: feeling === f.id ? `1px solid rgba(61,245,166,0.4)` : '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 14, color: feeling === f.id ? SURGE : 'rgba(255,255,255,0.7)',
                      fontSize: 13.5, fontFamily: '"Hanken Grotesk", sans-serif', fontWeight: 500
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
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12, padding: 12,
                  color: 'rgba(255,255,255,0.85)', fontSize: 13.5, outline: 'none',
                  fontFamily: '"Hanken Grotesk", sans-serif', boxSizing: 'border-box'
                }}
                placeholder="Anything on your mind? (optional)"
                value={logNote}
                onChange={e => setLogNote(e.target.value)}
              />
              {reflectionSaved ? (
                <p style={{
                  textAlign: 'center', fontSize: 14, fontWeight: 600,
                  padding: '14px 0', color: SURGE
                }}>
                  Reflection saved
                </p>
              ) : (
                <>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveReflection}
                    disabled={!feeling}
                    style={{
                      width: '100%', height: 52, marginTop: 12,
                      background: feeling ? SURGE : 'rgba(255,255,255,0.06)',
                      border: 'none', borderRadius: 26,
                      color: feeling ? ABYSS : 'rgba(255,255,255,0.2)',
                      fontSize: 15, fontWeight: 700, cursor: feeling ? 'pointer' : 'not-allowed',
                      fontFamily: '"Hanken Grotesk", sans-serif'
                    }}
                  >
                    Save reflection
                  </motion.button>
                  <button
                    onClick={closeLogModal}
                    style={{
                      width: '100%', height: 44, marginTop: 8,
                      background: 'none', border: 'none',
                      color: 'rgba(255,255,255,0.3)', fontSize: 13.5, cursor: 'pointer',
                      fontFamily: '"Hanken Grotesk", sans-serif'
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
              background: 'rgba(7,9,13,0.6)', backdropFilter: 'blur(4px)'
            }}
            onClick={() => setShowDevMenu(false)}
          >
            <div
              style={{
                position: 'fixed', bottom: 90, left: 16, right: 16, maxWidth: 448,
                margin: '0 auto', background: FATHOM,
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20, padding: 16, zIndex: 300
              }}
              onClick={e => e.stopPropagation()}
            >
              {[
                { label: 'Reset everything',   action: resetApp },
                { label: 'Jump to Day 7',      action: () => jumpToDay(7)  },
                { label: 'Jump to Day 14',     action: () => jumpToDay(14) },
                { label: 'Jump to Day 21',     action: () => jumpToDay(21) },
                { label: 'Go to Graduation',   action: () => navigate('/graduation') },
              ].map(({ label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '12px 4px', background: 'none', border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.7)', fontSize: 13.5, cursor: 'pointer',
                    fontFamily: '"Hanken Grotesk", sans-serif'
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
                  color: 'rgba(255,255,255,0.3)', fontSize: 13.5, cursor: 'pointer',
                  fontFamily: '"Hanken Grotesk", sans-serif'
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
              background: 'rgba(7,9,13,0.8)', backdropFilter: 'blur(10px)'
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
                background: FATHOM,
                borderRadius: '24px 24px 0 0',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                maxHeight: '80vh', overflow: 'hidden',
                display: 'flex', flexDirection: 'column'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{
                padding: '20px 20px 0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexShrink: 0
              }}>
                <span style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.95)'
                }}>
                  Your 21-day plan
                </span>
                <button
                  onClick={() => setShowFullPlan(false)}
                  style={{
                    background: 'none', border: 'none',
                    color: 'rgba(255,255,255,0.35)',
                    fontSize: 24, cursor: 'pointer', lineHeight: 1, padding: '4px'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
                {Array.from({ length: 21 }, (_, i) => {
                  const day     = i + 1
                  const isDone  = completedDays.some(d => d.day === day)
                  const isToday = day === currentDay && !isDone
                  const content = allDays[i]
                  const dColor  = getPhaseColor(day)

                  return (
                    <div
                      key={day}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '12px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700,
                        background: isDone  ? 'rgba(61,245,166,0.15)' :
                                    isToday ? `rgba(61,245,166,0.12)` :
                                    'rgba(255,255,255,0.05)',
                        color: isDone  ? SURGE :
                               isToday ? ARC_LIGHT :
                               'rgba(255,255,255,0.3)',
                        border: isToday ? `1px solid rgba(61,245,166,0.4)` : '1px solid transparent',
                        fontFamily: '"Space Grotesk", sans-serif'
                      }}>
                        {isDone ? '✓' : day}
                      </div>
                      <span style={{
                        flex: 1, fontSize: 13.5,
                        color:          isDone  ? 'rgba(255,255,255,0.35)' :
                                        isToday ? 'rgba(255,255,255,0.95)' :
                                        'rgba(255,255,255,0.55)',
                        fontWeight:     isToday ? 600 : 400,
                        textDecoration: isDone ? 'line-through' : 'none'
                      }}>
                        {content?.task_title || `Day ${day}`}
                      </span>
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


      {/* ── Day content (DayView) ──────────────────────────────────────────── */}
      {contentLoading ? (
        <div style={{ padding: '0 16px 16px', maxWidth: 480, margin: '0 auto', boxSizing: 'border-box' }}>
          <div style={{
            background: FATHOM,
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20, overflow: 'hidden'
          }}>
            <div style={{ height: 3, background: 'rgba(61,245,166,0.2)' }} />
            <div style={{ padding: 20 }}>
              {[80, 120, 60].map((h, i) => (
                <div key={i} style={{
                  height: h, background: 'rgba(255,255,255,0.05)',
                  borderRadius: 10, marginBottom: 12
                }} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <DayView
          day={currentDay}
          streak={streak}
          completed={completed}
          taskTitle={dayContent?.task_title}
          subtrackName={subtrackName}
          durationMinutes={dayContent?.duration_minutes}
          difficulty={dayContent?.difficulty}
          steps={steps}
          whyText={whyText}
          quoteText={dayContent?.quote_text}
          quoteAuthor={dayContent?.quote_author}
          youtubeUrl={dayContent?.youtube_url}
          youtubeLabel={dayContent?.must_watch_label}
          refs={refs}
          onComplete={handleDayViewComplete}
        />
      )}


      {/* ── Dev tools ────────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', paddingBottom: 16 }}>
        <button
          onClick={() => setShowDevMenu(true)}
          style={{
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.12)', fontSize: 11, cursor: 'pointer',
            fontFamily: '"Hanken Grotesk", sans-serif'
          }}
        >
          dev tools
        </button>
      </div>

    </div>
  )
}
