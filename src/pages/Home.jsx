import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import BottomNav from '../components/BottomNav'
import { getDayContent, getSubtrackByName, SUBTRACK_NAMES } from '../lib/curriculum'

// ── Constants ──────────────────────────────────────────────────────────────────

const TOTAL = 21

const FEELINGS = [
  { id: 'crushed',   label: '🔥 Crushed it' },
  { id: 'showed',    label: '✅ Showed up' },
  { id: 'struggled', label: '😤 Struggled but did it' },
  { id: 'almost',    label: '😓 Almost quit' },
]

const COMMUNITY = [
  { initials: 'MJ', name: 'Maya J.',  day: 12, streak: 12, bg: 'rgba(83,74,183,0.3)',  color: '#9D92F8' },
  { initials: 'TR', name: 'Theo R.',  day: 9,  streak: 9,  bg: 'rgba(15,110,86,0.3)',  color: '#5DCAA5' },
  { initials: 'AK', name: 'Aria K.',  day: 11, streak: 11, bg: 'rgba(133,79,11,0.3)', color: '#EF9F27' },
]

// ── SVG Icons ──────────────────────────────────────────────────────────────────

function FlameSvg({ size = 14, color = '#EF9F27' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0, display: 'block' }}>
      <path d="M12 2S6 10 6 15a6 6 0 0 0 12 0C18 10 12 2 12 2zm0 17a3 3 0 0 1-3-3c0-2.5 3-6 3-6s3 3.5 3 6a3 3 0 0 1-3 3z"/>
    </svg>
  )
}

function PlaySvg({ size = 14, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0, display: 'block', marginLeft: 2 }}>
      <path d="M8 5v14l11-7z"/>
    </svg>
  )
}

function ChevronRightSvg({ size = 18, color = 'rgba(255,255,255,0.3)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, display: 'block' }}>
      <path d="M9 18l6-6-6-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getPhase(day) {
  if (day <= 7)  return 'Week 1 — Foundation'
  if (day <= 14) return 'Week 2 — Build'
  return 'Week 3 — Commit'
}

function getPhaseName(day) {
  if (day <= 7)  return 'Foundation'
  if (day <= 14) return 'Build'
  return 'Commit'
}

function getDayType(content) {
  if (!content) return 'Session'
  if (content.difficulty) return content.difficulty
  return 'Training'
}

function getDifficultyColor(difficulty) {
  if (!difficulty) return 'rgba(255,255,255,0.4)'
  const d = difficulty.toLowerCase()
  if (d.includes('light') || d.includes('easy') || d.includes('beginner') || d.includes('recovery')) return '#1D9E75'
  if (d.includes('moderate') || d.includes('medium')) return '#EF9F27'
  if (d.includes('hard') || d.includes('intense') || d.includes('heavy')) return '#E24B4A'
  return 'rgba(255,255,255,0.45)'
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
        height: 56,
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
              '0 0 10px rgba(83,74,183,0.3)',
              '0 0 20px rgba(83,74,183,0.6)',
              '0 0 10px rgba(83,74,183,0.3)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: 18, fontWeight: 700, color: '#9D92F8', letterSpacing: '0.01em' }}
        >
          flowstate
        </motion.span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <FlameSvg size={15} color="#EF9F27" />
          <span style={{
            fontSize: 15, fontWeight: 700, color: '#EF9F27',
            textShadow: '0 0 10px rgba(239,159,39,0.45)'
          }}>
            {streak}
          </span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>day streak</span>
        </div>
      </div>

      {/* ── Day hero ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0 }}
        style={{ padding: '28px 20px 16px', maxWidth: 480, margin: '0 auto' }}
      >
        <p style={{
          fontSize: 11, fontWeight: 500, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
          margin: '0 0 10px'
        }}>
          {subtrackName.toUpperCase()}
        </p>
        <h1 style={{
          fontSize: 56, fontWeight: 800, color: 'white',
          letterSpacing: '-0.02em', lineHeight: 1,
          margin: '0 0 14px'
        }}>
          Day {currentDay}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 12, fontWeight: 500, color: '#9D92F8',
            background: 'rgba(83,74,183,0.2)',
            border: '1px solid rgba(147,138,248,0.3)',
            borderRadius: 20, padding: '4px 12px'
          }}>
            {getPhaseName(currentDay)}
          </span>
          {dayContent?.difficulty && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                background: getDifficultyColor(dayContent.difficulty)
              }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                {dayContent.difficulty}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Progress section ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        style={{ padding: '0 20px 24px', maxWidth: 480, margin: '0 auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 500, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)'
          }}>
            Progress
          </span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            {completedDays.length} of 21 days
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 2, background: 'rgba(255,255,255,0.08)',
          borderRadius: 1, marginBottom: 14, overflow: 'hidden'
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedDays.length / 21) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              height: 2,
              background: 'linear-gradient(90deg, #534AB7, #9D92F8)',
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
                  position: 'relative', flexShrink: 0,
                  background: done  ? '#534AB7' :
                              today ? '#9D92F8'  :
                              'rgba(255,255,255,0.12)'
                }}
              >
                {today && (
                  <motion.div
                    animate={{ scale: [1, 2.4, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '100%', height: '100%',
                      borderRadius: '50%',
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
            fontSize: 12, color: '#9D92F8',
            textDecoration: 'underline',
            marginTop: 12, padding: 0
          }}
        >
          View full 21-day plan →
        </button>
      </motion.div>

      {/* ── Today's task card ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {contentLoading ? (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, overflow: 'hidden',
            margin: '0 16px 16px'
          }}>
            <div style={{ height: 4, background: 'rgba(83,74,183,0.25)' }} />
            <div style={{ padding: 20 }}>
              {[100, 80, 60].map((h, i) => (
                <div key={i} style={{
                  height: h, background: 'rgba(255,255,255,0.06)',
                  borderRadius: 8, marginBottom: 12,
                  animation: 'pulse 1.5s ease-in-out infinite'
                }} />
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, overflow: 'hidden',
            margin: '0 16px 16px'
          }}>
            {/* Gradient accent strip */}
            <div style={{
              height: 4,
              background: 'linear-gradient(90deg, #534AB7, #1D9E75)'
            }} />

            <div style={{ padding: 20 }}>
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: 11, fontWeight: 500, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)'
                }}>
                  TODAY'S TASK
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {dayContent?.duration_minutes && (
                    <span style={{
                      fontSize: 11, padding: '4px 10px', borderRadius: 20,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.5)'
                    }}>
                      {dayContent.duration_minutes} min
                    </span>
                  )}
                  {dayContent?.difficulty && (
                    <span style={{
                      fontSize: 11, padding: '4px 10px', borderRadius: 20,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.5)'
                    }}>
                      {dayContent.difficulty}
                    </span>
                  )}
                </div>
              </div>

              {/* Task title */}
              {dayContent?.task_title && (
                <p style={{
                  fontSize: 21, fontWeight: 700, color: 'white',
                  margin: '8px 0 0', lineHeight: 1.25
                }}>
                  {dayContent.task_title}
                </p>
              )}

              {/* Divider below title */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '14px 0 0' }} />

              {/* WHAT TO DO */}
              <div style={{ paddingTop: 14 }}>
                <p style={{
                  fontSize: 11, fontWeight: 500, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
                  margin: '0 0 2px'
                }}>
                  WHAT TO DO
                </p>

                {steps.length > 0 ? (
                  steps.map((step, i) => (
                    <div key={i}>
                      <div style={{
                        display: 'flex', alignItems: 'flex-start', gap: 14,
                        paddingTop: 12, paddingBottom: 12
                      }}>
                        <span style={{
                          fontSize: 15, fontWeight: 700, color: '#9D92F8',
                          minWidth: 22, lineHeight: 1.5, flexShrink: 0
                        }}>
                          {i + 1}.
                        </span>
                        <span style={{
                          fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.55
                        }}>
                          {step}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
                      )}
                    </div>
                  ))
                ) : (
                  <p style={{
                    fontSize: 14, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6,
                    margin: 0, paddingTop: 12
                  }}>
                    {dayContent?.task_description ||
                      `Day ${currentDay} of your ${subtrackName} journey. Show up today. That's all that's required.`}
                  </p>
                )}
              </div>

              {/* WHY THIS MATTERS */}
              {whyText && (
                <>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '16px 0 14px' }} />
                  <p style={{
                    fontSize: 11, fontWeight: 500, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
                    margin: '0 0 10px'
                  }}>
                    WHY THIS MATTERS
                  </p>
                  <p style={{
                    fontSize: 14, color: 'rgba(255,255,255,0.65)',
                    lineHeight: 1.7, margin: 0,
                    fontStyle: 'italic',
                    borderLeft: '3px solid rgba(83,74,183,0.5)',
                    paddingLeft: 14
                  }}>
                    {whyText}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Watch & Learn ─────────────────────────────────────────────────── */}
      {!contentLoading && (dayContent?.youtube_url || refs.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          style={{ padding: '0 16px 16px' }}
        >
          <p style={{
            fontSize: 11, fontWeight: 500, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
            margin: '0 0 12px'
          }}>
            WATCH &amp; LEARN
          </p>

          {/* Must watch */}
          {dayContent?.youtube_url && (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderLeft: '3px solid #534AB7',
              borderRadius: 14,
              padding: '14px 16px',
              marginBottom: 8
            }}>
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open(dayContent.youtube_url, '_blank')}
                style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: '#534AB7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <PlaySvg size={14} color="white" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, color: 'white', fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
                    {dayContent.must_watch_label || "Watch today's guide"}
                  </p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '3px 0 0' }}>
                    Must watch{dayContent.duration_minutes ? ` · ${dayContent.duration_minutes} min` : ''}
                  </p>
                </div>
                <ChevronRightSvg size={18} color="rgba(255,255,255,0.3)" />
              </motion.div>
            </div>
          )}

          {/* Reference links */}
          {refs.map((ref, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14,
              padding: '14px 16px',
              marginBottom: 8
            }}>
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open(ref.url, '_blank')}
                style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <PlaySvg size={14} color="rgba(255,255,255,0.5)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: 500, margin: 0, lineHeight: 1.3 }}>
                    {ref.label}
                  </p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '3px 0 0' }}>
                    Reference
                  </p>
                </div>
                <ChevronRightSvg size={18} color="rgba(255,255,255,0.25)" />
              </motion.div>
            </div>
          ))}
        </motion.div>
      )}

      {/* ── Daily quote ───────────────────────────────────────────────────── */}
      {!contentLoading && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            margin: '0 16px 24px',
            padding: '16px 0 16px 18px',
            borderLeft: '3px solid #534AB7'
          }}
        >
          <p style={{
            fontSize: 15, color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.7, fontStyle: 'italic', margin: '0 0 8px'
          }}>
            "{dayContent?.quote_text || 'The secret of getting ahead is getting started.'}"
          </p>
          <p style={{ fontSize: 12, color: '#9D92F8', margin: 0, fontStyle: 'normal' }}>
            -- {dayContent?.quote_author || 'Mark Twain'}
          </p>
        </motion.div>
      )}

      {/* ── Action buttons ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        <motion.button
          whileTap={{ scale: completed ? 1 : 0.98 }}
          whileHover={completed ? {} : { scale: 1.01, filter: 'brightness(1.1)' }}
          onClick={handleMarkComplete}
          disabled={completed}
          style={{
            width: '100%', height: 54, border: 'none', borderRadius: 27,
            background: completed
              ? '#1D9E75'
              : 'linear-gradient(135deg, #534AB7, #3d35a0)',
            color: 'white', fontSize: 16, fontWeight: 700,
            cursor: completed ? 'default' : 'pointer',
            boxShadow: completed
              ? '0 0 30px rgba(29,158,117,0.3)'
              : '0 0 30px rgba(83,74,183,0.25)',
            transition: 'background 0.3s'
          }}
        >
          {completed ? `Day ${currentDay} Complete` : `Mark Day ${currentDay} Complete`}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowLogModal(true)}
          style={{
            width: '100%', height: 50,
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 27, background: 'transparent',
            color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 400,
            cursor: 'pointer'
          }}
        >
          Add to my log
        </motion.button>
      </motion.div>

      {/* ── Community peek ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        style={{ padding: '0 16px 24px' }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 12
        }}>
          <span style={{
            fontSize: 11, fontWeight: 500, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)'
          }}>
            YOUR SQUAD TODAY
          </span>
          <span
            onClick={() => navigate('/community')}
            style={{ fontSize: 11, color: '#9D92F8', cursor: 'pointer' }}
          >
            View all
          </span>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, overflow: 'hidden'
        }}>
          {COMMUNITY.map((user, idx) => (
            <div key={user.initials}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px'
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: user.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600, color: user.color, flexShrink: 0
                }}>
                  {user.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, color: 'white', fontWeight: 500, margin: 0 }}>{user.name}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>Day {user.day}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#EF9F27' }}>{user.streak}</span>
                  <FlameSvg size={13} color="#EF9F27" />
                </div>
              </div>
              {idx < COMMUNITY.length - 1 && (
                <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

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
