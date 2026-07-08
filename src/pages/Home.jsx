import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import BottomNav from '../components/BottomNav'
import { getDayContent, SUBTRACK_NAMES, SUBTRACK_IDS } from '../lib/curriculum'

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
    localStorage.setItem('flowstate_completed_days', JSON.stringify(newCompletedDays))
    localStorage.setItem('flowstate_streak',         String(newStreak))
    localStorage.setItem('flowstate_current_day',    String(newDay))
    setCompleted(true)
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
    const done = Array.from({ length: day - 1 }, (_, i) => ({
      day: i + 1, completedAt: Date.now(), dayOfWeek: new Date().getDay()
    }))
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
    <div style={{ minHeight: '100vh', background: ABYSS, paddingBottom: 100, fontFamily: '"Hanken Grotesk", sans-serif' }}>

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
                    setCompleted(false)
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

      {/* ── Sticky header ───────────────────────────────────────────────── */}
      <div style={{
        height: 56,
        padding: '0 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(7,9,13,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        borderLeft: `3px solid ${phaseColor}`,
        position: 'sticky', top: 0, zIndex: 100,
        maxWidth: 480, width: '100%', margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        <span style={{
          fontFamily: '"Hanken Grotesk", sans-serif',
          fontWeight: 700, fontSize: 11,
          letterSpacing: '0.25em',
          color: phaseColor,
          textTransform: 'uppercase'
        }}>
          DAY {dayLabel} · {getPhaseLabel(currentDay)}
        </span>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: streak >= 7 ? 'rgba(255,79,216,0.1)' : 'rgba(61,245,166,0.1)',
          border: `1px solid ${streak >= 7 ? 'rgba(255,79,216,0.3)' : 'rgba(61,245,166,0.25)'}`,
          borderRadius: 20, padding: '5px 12px'
        }}>
          <DiamondSvg size={10} color={streak >= 7 ? PLASMA : SURGE} />
          <span style={{
            fontSize: 13, fontWeight: 700,
            color: streak >= 7 ? PLASMA : SURGE,
            fontFamily: '"Hanken Grotesk", sans-serif'
          }}>
            {streak}
          </span>
        </div>
      </div>

      {/* ── Hero + Ring section ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ padding: '20px 20px 12px', maxWidth: 480, margin: '0 auto' }}
      >
        {/* Headline above ring */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4 }}
          style={{ textAlign: 'center', marginBottom: 20 }}
        >
          <h1 style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 900, fontSize: 24,
            letterSpacing: '-0.02em', lineHeight: 1.2,
            color: 'rgba(255,255,255,0.95)',
            margin: '0 0 5px'
          }}>
            {getPhaseHeadline(currentDay)}
          </h1>
          <p style={{
            fontSize: 12, color: 'rgba(255,255,255,0.35)',
            margin: 0, lineHeight: 1.4
          }}>
            {subtrackName}
          </p>
        </motion.div>

        {/* Circuit ring — centered hero */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12, duration: 0.5, ease: 'easeOut' }}
          >
            <svg
              width="240" height="240"
              viewBox="0 0 200 200"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <filter id="surge-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="tip-glow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Track */}
              <circle
                cx="100" cy="100" r={ringR}
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="5"
              />

              {/* Progress arc */}
              {completedFrac > 0 && (
                <circle
                  cx="100" cy="100" r={ringR}
                  fill="none"
                  stroke={phaseColor}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={ringCircum}
                  strokeDashoffset={ringDashOffset}
                  transform="rotate(-90 100 100)"
                  filter="url(#surge-glow)"
                  style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
                />
              )}

              {/* Arc-Light tip dot */}
              {completedFrac > 0 && (
                <motion.circle
                  cx={tipX} cy={tipY} r="5"
                  fill={ARC_LIGHT}
                  filter="url(#tip-glow)"
                  animate={{ r: [5, 8, 5], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              {/* Day number */}
              <text
                x="100" y="95"
                textAnchor="middle"
                style={{
                  fontFamily: '"Hanken Grotesk", sans-serif',
                  fontSize: 52, fontWeight: 900,
                  fill: ARC_LIGHT,
                  letterSpacing: '-2px'
                }}
              >
                {currentDay}
              </text>

              {/* /21 label */}
              <text
                x="100" y="118"
                textAnchor="middle"
                style={{
                  fontFamily: '"Hanken Grotesk", sans-serif',
                  fontSize: 13,
                  fill: 'rgba(255,255,255,0.35)',
                  fontWeight: 500
                }}
              >
                /{TOTAL}
              </text>
            </svg>
          </motion.div>
        </div>

        {/* Progress bar row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
              {completedDays.length} / {TOTAL} days
            </span>
            <button
              onClick={() => setShowFullPlan(true)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 11, color: 'rgba(255,255,255,0.35)', padding: 0,
                fontFamily: '"Hanken Grotesk", sans-serif'
              }}
            >
              Full plan
            </button>
          </div>
          <div style={{
            height: 2, borderRadius: 2,
            background: 'rgba(255,255,255,0.07)',
            overflow: 'hidden'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completedFrac * 100}%` }}
              transition={{ duration: 1.0, delay: 0.3, ease: 'easeOut' }}
              style={{ height: '100%', background: phaseColor, borderRadius: 2 }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* ── Today's task card ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ padding: '0 16px 16px', maxWidth: 480, margin: '0 auto', boxSizing: 'border-box' }}
      >
        {contentLoading ? (
          <div style={{
            background: FATHOM,
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20, overflow: 'hidden'
          }}>
            <div style={{ height: 3, background: `rgba(61,245,166,0.2)` }} />
            <div style={{ padding: 20 }}>
              {[80, 120, 60].map((h, i) => (
                <div key={i} style={{
                  height: h, background: 'rgba(255,255,255,0.05)',
                  borderRadius: 10, marginBottom: 12
                }} />
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            background: FATHOM,
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 0 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
          }}>
            {/* Surge accent strip */}
            <div style={{ height: 3, background: `linear-gradient(90deg, ${SURGE}, rgba(61,245,166,0.4))` }} />

            <div style={{ padding: 20 }}>
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: 10, fontWeight: 500, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: SURGE
                }}>
                  TODAY · {subtrackName.toUpperCase()}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {dayContent?.duration_minutes && (
                    <span style={{
                      fontSize: 11, padding: '4px 10px', borderRadius: 20,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.45)'
                    }}>
                      {dayContent.duration_minutes} min
                    </span>
                  )}
                  {dayContent?.difficulty && (
                    <span style={{
                      fontSize: 11, padding: '4px 10px', borderRadius: 20,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
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
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 20, fontWeight: 700,
                  color: 'rgba(255,255,255,0.95)',
                  margin: '10px 0 0', lineHeight: 1.25,
                  letterSpacing: '-0.01em'
                }}>
                  {dayContent.task_title}
                </p>
              )}

              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '14px 0 0' }} />

              {/* WHAT TO DO */}
              <div style={{ paddingTop: 14 }}>
                <p style={{
                  fontSize: 10, fontWeight: 500, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: SURGE,
                  margin: '0 0 2px'
                }}>
                  WHAT TO DO
                </p>

                {steps.length > 0 ? (
                  steps.map((step, i) => (
                    <div key={i} style={{
                      borderLeft: `2px solid ${phaseColor}`,
                      paddingLeft: 12,
                      paddingTop: 5, paddingBottom: 5,
                      marginBottom: i < steps.length - 1 ? 12 : 0,
                      marginTop: i === 0 ? 10 : 0,
                    }}>
                      <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6 }}>
                        {step}
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{
                    fontSize: 13.5, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6,
                    margin: 0, paddingTop: 12
                  }}>
                    {dayContent?.task_description ||
                      `Day ${currentDay} of your ${subtrackName} journey. Show up. That's all that's required.`}
                  </p>
                )}
              </div>

              {/* WHY THIS MATTERS */}
              {whyText && (
                <>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '16px 0 14px' }} />
                  <p style={{
                    fontSize: 10, fontWeight: 500, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: GLACIAL,
                    margin: '0 0 10px'
                  }}>
                    WHY THIS MATTERS
                  </p>
                  <p style={{
                    fontSize: 13.5, color: 'rgba(255,255,255,0.65)',
                    lineHeight: 1.7, margin: 0, fontStyle: 'italic',
                    borderLeft: `3px solid ${phaseColor}`,
                    paddingLeft: 14, paddingTop: 10, paddingBottom: 10,
                    background: `${phaseColor}09`,
                    borderRadius: '0 8px 8px 0',
                  }}>
                    {whyText}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Jammy strip ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        style={{ padding: '0 16px 16px', maxWidth: 480, margin: '0 auto', boxSizing: 'border-box' }}
      >
        <motion.div
          style={{
            background: FATHOM,
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 18, overflow: 'hidden', cursor: 'pointer'
          }}
          onClick={() => setJammyExpanded(prev => !prev)}
          whileTap={{ scale: 0.99 }}
        >
          {/* Main row */}
          <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Glacial orb */}
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 8px rgba(130,212,255,0.3)',
                  '0 0 20px rgba(130,212,255,0.6)',
                  '0 0 8px rgba(130,212,255,0.3)',
                ],
                scale: [1, 1.08, 1],
                y: [0, -2, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                background: 'radial-gradient(circle at 35% 30%, rgba(130,212,255,0.75), rgba(130,212,255,0.2))',
                border: '1px solid rgba(130,212,255,0.4)'
              }}
            />
            <p style={{ flex: 1, fontSize: 13, color: GLACIAL, margin: 0, lineHeight: 1.5 }}>
              {getJammyLine(currentDay)}
            </p>
            <motion.div
              animate={{ rotate: jammyExpanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <ChevronDownSvg size={16} color={`rgba(130,212,255,0.5)`} />
            </motion.div>
          </div>

          {/* Expanded content */}
          <AnimatePresence>
            {jammyExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{
                  padding: '0 16px 16px',
                  borderTop: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <p style={{
                    fontSize: 13.5, color: 'rgba(255,255,255,0.55)',
                    lineHeight: 1.65, margin: '12px 0 0'
                  }}>
                    {getJammyExpanded(currentDay, subtrackName)}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* ── Watch & Learn ─────────────────────────────────────────────────── */}
      {!contentLoading && (dayContent?.youtube_url || refs.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          style={{ padding: '0 16px 16px', maxWidth: 480, margin: '0 auto', boxSizing: 'border-box' }}
        >
          <p style={{
            fontSize: 10, fontWeight: 500, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
            margin: '0 0 10px'
          }}>
            WATCH &amp; LEARN
          </p>

          {dayContent?.youtube_url && (
            <motion.div
              whileTap={{ scale: 0.99 }}
              onClick={() => window.open(dayContent.youtube_url, '_blank')}
              style={{
                background: FATHOM,
                border: `1px solid rgba(61,245,166,0.15)`,
                borderLeft: `3px solid ${SURGE}`,
                borderRadius: 14,
                padding: '14px 16px',
                marginBottom: 8, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: `rgba(61,245,166,0.12)`,
                border: `1px solid rgba(61,245,166,0.25)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <PlaySvg size={13} color={SURGE} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.9)', fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
                  {dayContent.must_watch_label || "Watch today's guide"}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '3px 0 0' }}>
                  Must watch{dayContent.duration_minutes ? ` · ${dayContent.duration_minutes} min` : ''}
                </p>
              </div>
              <ChevronRightSvg size={16} />
            </motion.div>
          )}

          {refs.map((ref, i) => (
            <motion.div
              key={i}
              whileTap={{ scale: 0.99 }}
              onClick={() => window.open(ref.url, '_blank')}
              style={{
                background: FATHOM,
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, padding: '14px 16px',
                marginBottom: 8, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <LinkSvg size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.7)', fontWeight: 500, margin: 0, lineHeight: 1.3 }}>
                  {ref.label}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '3px 0 0' }}>
                  Reference
                </p>
              </div>
              <ChevronRightSvg size={16} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ── Daily quote ───────────────────────────────────────────────────── */}
      {!contentLoading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            margin: '0 16px 20px',
            padding: '14px 0 14px 18px',
            borderLeft: `3px solid rgba(130,212,255,0.35)`,
            maxWidth: 448
          }}
        >
          <p style={{
            fontSize: 14, color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.65, fontStyle: 'italic', margin: '0 0 8px'
          }}>
            "{dayContent?.quote_text || 'The secret of getting ahead is getting started.'}"
          </p>
          <p style={{ fontSize: 12, color: GLACIAL, margin: 0, fontStyle: 'normal' }}>
            — {dayContent?.quote_author || 'Mark Twain'}
          </p>
        </motion.div>
      )}

      {/* ── Action buttons ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.22 }}
        style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 480, margin: '0 auto', boxSizing: 'border-box' }}
      >
        {completed ? (
          <div style={{
            width: '100%', height: 54, borderRadius: 27,
            border: `1px solid rgba(61,245,166,0.4)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: 15, fontWeight: 700, color: SURGE,
          }}>
            <CheckSvg size={20} color={SURGE} />
            Day {currentDay} complete
          </div>
        ) : (
          <div style={{ position: 'relative', borderRadius: 27, overflow: 'hidden' }}>
            {holdProgress > 0 && (
              <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0,
                width: `${holdProgress * 100}%`,
                background: ARC_LIGHT,
                zIndex: 0,
              }} />
            )}
            <motion.button
              onPointerDown={(e) => {
                e.preventDefault()
                holdStartRef.current = performance.now()
                setIsHolding(true)
                function tick(now) {
                  const p = Math.min((now - holdStartRef.current) / 2000, 1)
                  setHoldProgress(p)
                  if (p < 1) {
                    rafRef.current = requestAnimationFrame(tick)
                  } else {
                    setIsHolding(false)
                    setHoldProgress(0)
                    handleMarkComplete()
                  }
                }
                rafRef.current = requestAnimationFrame(tick)
              }}
              onPointerUp={() => {
                if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
                setIsHolding(false); setHoldProgress(0)
              }}
              onPointerLeave={() => {
                if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
                setIsHolding(false); setHoldProgress(0)
              }}
              onPointerCancel={() => {
                if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
                setIsHolding(false); setHoldProgress(0)
              }}
              style={{
                position: 'relative', zIndex: 1,
                width: '100%', height: 54, border: 'none', borderRadius: 27,
                background: holdProgress > 0 ? 'transparent' : SURGE,
                color: ABYSS, fontSize: 15, fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 0 32px rgba(61,245,166,0.2)',
                fontFamily: '"Hanken Grotesk", sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'none',
              }}
            >
              {isHolding ? `Hold to energize Day ${dayLabel}...` : `Hold to energize Day ${dayLabel}`}
            </motion.button>
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowLogModal(true)}
          style={{
            width: '100%', height: 50,
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 27, background: 'transparent',
            color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 500,
            cursor: 'pointer', fontFamily: '"Hanken Grotesk", sans-serif'
          }}
        >
          Add to my log
        </motion.button>
      </motion.div>

      {/* ── Squad peek ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.26 }}
        style={{ padding: '0 16px 24px', maxWidth: 480, margin: '0 auto', boxSizing: 'border-box' }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 10
        }}>
          <span style={{
            fontSize: 10, fontWeight: 500, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)'
          }}>
            YOUR SQUAD TODAY
          </span>
          <span
            onClick={() => navigate('/community')}
            style={{ fontSize: 12, color: SURGE, cursor: 'pointer' }}
          >
            View all
          </span>
        </div>

        <div style={{
          background: FATHOM,
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 18, overflow: 'hidden'
        }}>
          {COMMUNITY.map((user, idx) => (
            <div key={user.initials}>
              <div
                onMouseEnter={() => setHoveredSquad(user.initials)}
                onMouseLeave={() => setHoveredSquad(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px',
                  transform: hoveredSquad === user.initials ? 'scale(1.02)' : 'scale(1)',
                  transition: 'transform 200ms ease',
                  borderLeft: hoveredSquad === user.initials ? `3px solid ${user.color}` : '3px solid transparent',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: user.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  color: user.color, flexShrink: 0,
                  fontFamily: '"Space Grotesk", sans-serif'
                }}>
                  {user.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.9)', fontWeight: 600, margin: 0 }}>
                    {user.name}
                  </p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                    Day {user.day}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <DiamondSvg size={9} color={user.streak >= 14 ? PLASMA : SURGE} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: user.streak >= 14 ? PLASMA : SURGE }}>
                    {user.streak}
                  </span>
                </div>
              </div>
              {idx < COMMUNITY.length - 1 && (
                <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0 16px' }} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

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

      <BottomNav />
    </div>
  )
}
