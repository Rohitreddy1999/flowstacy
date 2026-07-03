import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import BottomNav from '../components/BottomNav'
import AuroraBackground from '../components/AuroraBackground'
import PageTransition from '../components/PageTransition'
import SkeletonCard from '../components/SkeletonCard'
import { getDayContent, getSubtrackByName } from '../lib/curriculum'

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

// ── Stagger variants ───────────────────────────────────────────────────────────

const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: 'easeOut'
    }
  })
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton({ height = 16, style = {} }) {
  return (
    <div
      className="fs-skeleton"
      style={{ height, marginBottom: 10, ...style }}
    />
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

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

  const [completed,            setCompleted]            = useState(false)
  const [celebrating,          setCelebrating]          = useState(false)
  const [showCelebrationCard,  setShowCelebrationCard]  = useState(false)
  const [showLogModal,         setShowLogModal]         = useState(false)
  const [feeling,              setFeeling]              = useState(null)
  const [logNote,              setLogNote]              = useState('')
  const [reflectionSaved,      setReflectionSaved]      = useState(false)
  const [showDevMenu,          setShowDevMenu]          = useState(false)

  // Curriculum state
  const [dayContent,      setDayContent]      = useState(null)
  const [contentLoading,  setContentLoading]  = useState(true)
  const [subtracksId,     setSubtracksId]     = useState(null)

  // ── Fetch curriculum data ──────────────────────────────────────────────────

  useEffect(() => {
    async function fetchCurriculumData() {
      setContentLoading(true)

      const subtracks_name = localStorage.getItem('flowstate_selected_subtrack')
      if (!subtracks_name) {
        setContentLoading(false)
        return
      }

      const displayName = SUBTRACK_NAMES[subtracks_name] || subtracks_name
      const subtrackData = await getSubtrackByName(displayName)

      if (subtrackData) {
        setSubtracksId(subtrackData.id)
        const content = await getDayContent(subtrackData.id, currentDay)
        setDayContent(content)
      }

      setContentLoading(false)
    }

    fetchCurriculumData()
  }, [currentDay])

  // ── Handlers ──────────────────────────────────────────────────────────────

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
    setCelebrating(true)

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#534AB7', '#9D92F8', '#1D9E75', '#5DCAA5', '#ffffff'],
      disableForReducedMotion: true
    })

    setTimeout(() => {
      setShowCelebrationCard(true)
    }, 400)
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
    localStorage.setItem('flowstate_current_day', String(day))
    localStorage.setItem('flowstate_streak', String(day))
    localStorage.setItem('flowstate_completed_days', JSON.stringify(done))
    setCurrentDay(day)
    setStreak(day)
    setCompletedDays(done)
    setCompleted(false)
    setCelebrating(false)
    setShowDevMenu(false)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <PageTransition>
      <AuroraBackground />

      {/* ── Celebration card overlay ─────────────────────────── */}
      <AnimatePresence>
        {showCelebrationCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(10,8,18,0.85)',
              backdropFilter: 'blur(12px)',
              zIndex: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
                maxWidth: '320px',
                width: '100%'
              }}
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                style={{ fontSize: '64px', marginBottom: '16px', lineHeight: 1 }}
              >
                {currentDay === 7 ? '🔥' :
                 currentDay === 14 ? '⚡' :
                 currentDay === 21 ? '🏆' : '✓'}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ fontSize: '24px', fontWeight: '500', color: 'white', margin: '0 0 8px' }}
              >
                {currentDay === 7 ? 'Week 1 done.' :
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
                {currentDay === 7 ?
                  'You showed up every day this week. Most people quit here.' :
                 currentDay === 14 ?
                  'Two weeks in. You are not the same person who started.' :
                 currentDay === 21 ?
                  'You did it. All 21 days. That identity is yours now.' :
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
                  width: '100%',
                  padding: '14px',
                  background: currentDay === 21 ? '#1D9E75' : '#534AB7',
                  border: 'none',
                  borderRadius: '14px',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {currentDay === 21 ? 'Go to graduation →' : 'Keep going →'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Reflection modal ─────────────────────────────────── */}
      {showLogModal && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={closeLogModal}
        >
          <div
            className="fs-card"
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              borderRadius: 'var(--fs-radius-xl) var(--fs-radius-xl) 0 0',
              padding: '24px 20px 40px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <p className="fs-heading-sm" style={{ marginBottom: 16 }}>How did today feel?</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {FEELINGS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFeeling(f.id)}
                  className={feeling === f.id ? 'fs-card fs-card-purple' : 'fs-card'}
                  style={{ padding: 12, textAlign: 'center', cursor: 'pointer', border: 'none', width: '100%', color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-sm)' }}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <textarea
              className="fs-input"
              style={{ marginTop: 12, height: 80, resize: 'none' }}
              placeholder="Anything else on your mind? (optional)"
              value={logNote}
              onChange={e => setLogNote(e.target.value)}
            />
            {reflectionSaved ? (
              <p style={{ textAlign: 'center', fontSize: 'var(--fs-text-sm)', fontWeight: 500, padding: '12px 0', color: 'var(--fs-teal-300)' }}>
                Reflection saved ✓
              </p>
            ) : (
              <>
                <button onClick={handleSaveReflection} disabled={!feeling} className="fs-btn-primary" style={{ width: '100%', marginTop: 12 }}>
                  Save reflection
                </button>
                <button onClick={closeLogModal} className="fs-btn-ghost" style={{ width: '100%', marginTop: 4 }}>
                  Skip
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Dev menu ─────────────────────────────────────────── */}
      {showDevMenu && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowDevMenu(false)}
        >
          <div
            className="fs-card"
            style={{ position: 'fixed', bottom: 80, left: 16, right: 16, padding: 16, zIndex: 300 }}
            onClick={e => e.stopPropagation()}
          >
            {[
              { label: '🗑 Reset everything', action: resetApp },
              { label: '⏩ Jump to Day 7',     action: () => jumpToDay(7) },
              { label: '⏩ Jump to Day 14',    action: () => jumpToDay(14) },
              { label: '⏩ Jump to Day 21',    action: () => jumpToDay(21) },
              { label: '🏆 Go to Graduation',  action: () => navigate('/graduation') },
            ].map(({ label, action }) => (
              <button
                key={label}
                onClick={action}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '12px 0', background: 'none', border: 'none',
                  borderBottom: '1px solid var(--fs-border)',
                  color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-sm)',
                  cursor: 'pointer',
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
                color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-sm)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Main page ────────────────────────────────────────── */}
      <div className="fs-page">

        {/* Top bar */}
        <nav className="fs-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {currentDay === 1 && (
              <button
                onClick={() => navigate('/bridge')}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '22px', cursor: 'pointer', padding: '8px', lineHeight: 1, display: 'flex', alignItems: 'center' }}
              >
                ←
              </button>
            )}
            <button
              onClick={() => navigate('/settings')}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '20px', cursor: 'pointer', padding: '8px', lineHeight: 1 }}
            >
              ⚙
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              🔥
            </motion.span>
            <span style={{ color: 'var(--fs-teal-300)', fontSize: 'var(--fs-text-sm)', fontWeight: 500 }}>{streak}</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-text-sm)' }}>day streak</span>
          </div>
        </nav>

        {/* Milestone banners */}
        {currentDay === 8 && (
          <div className="fs-card fs-card-teal" style={{ margin: '0 16px 16px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--fs-teal-300)' }}>🎉</span>
            <span style={{ color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-sm)' }}>
              Week 1 complete — you're ahead of 68% of people who started the same day
            </span>
          </div>
        )}
        {currentDay === 15 && (
          <div className="fs-card fs-card-teal" style={{ margin: '0 16px 16px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--fs-teal-300)' }}>⚡</span>
            <span style={{ color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-sm)' }}>
              Halfway there — 14 days down, 7 to go
            </span>
          </div>
        )}

        {/* Day label + heading — custom={0} */}
        <motion.div
          variants={itemVariants}
          initial="initial"
          animate="animate"
          custom={0}
          style={{ padding: '24px 20px 16px' }}
        >
          <p className="fs-label fs-label-purple" style={{ marginBottom: 8 }}>
            {subtrackName} — Day {currentDay} of {TOTAL}
          </p>
          <h1 className="fs-heading-md" style={{ marginBottom: 6 }}>{getHeading(currentDay)}</h1>
          <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)' }}>{getSubtext(currentDay)}</p>
        </motion.div>

        {/* Progress bar + dots — custom={1} */}
        <motion.div
          variants={itemVariants}
          initial="initial"
          animate="animate"
          custom={1}
          style={{ padding: '0 20px 20px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span className="fs-label">Your journey</span>
            <span style={{ color: 'var(--fs-purple-300)', fontSize: 13 }}>{currentDay}/21 days</span>
          </div>
          <div style={{ height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 1, marginBottom: 12 }}>
            <div style={{
              height: 2,
              background: 'var(--fs-purple-500)',
              boxShadow: '0 0 8px var(--fs-purple-glow)',
              borderRadius: 1,
              width: `${(completedDays.length / TOTAL) * 100}%`,
              transition: 'width 0.5s ease',
            }} />
          </div>
          <div className="fs-dots-container">
            {Array.from({ length: TOTAL }, (_, i) => {
              const day   = i + 1
              const done  = completedDays.includes(day)
              const today = day === currentDay && !done
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.03, type: 'spring', stiffness: 400, damping: 20 }}
                  className={`fs-dot ${done ? 'fs-dot-completed' : today ? 'fs-dot-today' : 'fs-dot-future'}`}
                />
              )
            })}
          </div>
        </motion.div>

        {/* Today's task card — custom={2} */}
        <motion.div
          variants={itemVariants}
          initial="initial"
          animate="animate"
          custom={2}
        >
          {contentLoading ? (
            <>
              <SkeletonCard height={120} />
              <SkeletonCard height={80} />
              <SkeletonCard height={60} />
            </>
          ) : (
            <>
              <div className="fs-card fs-card-purple" style={{ margin: '0 16px 16px', padding: 16 }}>
                <p className="fs-label fs-label-purple" style={{ marginBottom: 10 }}>
                  {dayContent?.task_title || "TODAY'S TASK"}
                </p>
                <p style={{ color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-sm)', lineHeight: 1.6, marginBottom: 14 }}>
                  {dayContent?.task_description || `Day ${currentDay} of your ${subtrackName} journey. Show up today. That's all that's required.`}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {dayContent?.duration_minutes && (
                    <span className="fs-badge fs-badge-purple">⏱ {dayContent.duration_minutes} min</span>
                  )}
                  {dayContent?.difficulty && (
                    <span className="fs-badge fs-badge-purple">{dayContent.difficulty}</span>
                  )}
                </div>
              </div>

              {/* No content fallback */}
              {!dayContent && (
                <div className="fs-card" style={{ margin: '0 16px 16px', padding: 20 }}>
                  <p style={{ fontSize: 24, marginBottom: 10 }}>🚧</p>
                  <p style={{ color: 'var(--fs-text-primary)', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                    {subtrackName}
                  </p>
                  <p style={{ color: 'var(--fs-purple-300)', fontSize: 'var(--fs-text-xs)', fontWeight: 500, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Curriculum launching soon
                  </p>
                  <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)', lineHeight: 1.6, marginBottom: 16 }}>
                    In the meantime, Day 1 is simple: show up. Commit to this track for 21 days and watch what happens.
                  </p>
                  <button
                    onClick={() => navigate('/sub-track-select')}
                    className="fs-btn-secondary"
                    style={{ width: '100%' }}
                  >
                    Change track
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Watch & Learn */}
        {!contentLoading && dayContent?.youtube_url && (
          <motion.div
            variants={itemVariants}
            initial="initial"
            animate="animate"
            custom={3}
            className="fs-card"
            style={{ margin: '0 16px 16px', padding: '14px 16px' }}
          >
            <p className="fs-label fs-label-purple" style={{ marginBottom: 10 }}>WATCH &amp; LEARN</p>
            <a
              href={dayContent.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 'var(--fs-radius-md)',
                textDecoration: 'none',
                marginBottom: 8,
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'var(--fs-transition)',
              }}
            >
              <span style={{ fontSize: 20 }}>▶️</span>
              <div>
                <p style={{ color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-sm)', fontWeight: 500 }}>
                  {dayContent.must_watch_label || "Watch today's guide"}
                </p>
                <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)' }}>Must watch</p>
              </div>
            </a>
            {[
              { url: dayContent.reference_url_1, label: dayContent.ref_label_1 },
              { url: dayContent.reference_url_2, label: dayContent.ref_label_2 },
              { url: dayContent.reference_url_3, label: dayContent.ref_label_3 },
            ].filter(ref => ref.url && ref.label).map((ref, i) => (
              <a
                key={i}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px',
                  borderRadius: 'var(--fs-radius-md)',
                  textDecoration: 'none',
                  marginBottom: 4,
                  transition: 'var(--fs-transition)',
                }}
              >
                <span style={{ fontSize: 14, color: 'var(--fs-text-tertiary)' }}>↗</span>
                <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-xs)' }}>{ref.label}</p>
              </a>
            ))}
          </motion.div>
        )}

        {/* Daily quote — custom={3} */}
        {(dayContent?.quote_text || !contentLoading) && !contentLoading && (
          <motion.div
            variants={itemVariants}
            initial="initial"
            animate="animate"
            custom={3}
            style={{
              margin: '0 16px 16px', padding: '14px 16px',
              borderLeft: '2px solid var(--fs-purple-500)',
              background: 'rgba(83, 74, 183, 0.08)',
              borderRadius: '0 var(--fs-radius-md) var(--fs-radius-md) 0',
            }}
          >
            <p style={{ color: 'var(--fs-text-secondary)', fontStyle: 'italic', fontSize: 'var(--fs-text-sm)', lineHeight: 1.6, marginBottom: 6 }}>
              "{dayContent?.quote_text || 'The secret of getting ahead is getting started.'}"
            </p>
            <p style={{ color: 'var(--fs-purple-300)', fontSize: 'var(--fs-text-xs)' }}>
              {dayContent?.quote_author ? `— ${dayContent.quote_author}` : '— Mark Twain'}
            </p>
          </motion.div>
        )}

        {/* Source credits */}
        {!contentLoading && dayContent?.source_credits && (
          <div style={{ margin: '0 16px 16px', padding: '10px 14px' }}>
            <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 11, lineHeight: 1.5 }}>
              📚 Sources: {dayContent.source_credits}
            </p>
          </div>
        )}

        {/* Action buttons — custom={4} */}
        <motion.div
          variants={itemVariants}
          initial="initial"
          animate="animate"
          custom={4}
          style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.01 }}
            animate={celebrating ? {
              backgroundColor: '#1D9E75',
              transition: { duration: 0.3 }
            } : {}}
            onClick={handleMarkComplete}
            disabled={completed}
            className="fs-btn-primary"
            style={{
              width: '100%',
              ...(completed ? { background: 'var(--fs-teal-500)', boxShadow: 'var(--fs-glow-teal)' } : {}),
            }}
          >
            {celebrating ? 'Day complete ✓' : `Mark Day ${currentDay} Complete ✓`}
          </motion.button>
          <button onClick={() => setShowLogModal(true)} className="fs-btn-secondary" style={{ width: '100%' }}>
            Add to my log
          </button>
        </motion.div>

        {/* Community peek — custom={5} */}
        <motion.div
          variants={itemVariants}
          initial="initial"
          animate="animate"
          custom={5}
          style={{ padding: '0 16px 24px' }}
        >
          <p className="fs-label" style={{ marginBottom: 12 }}>OTHERS ON THE SAME JOURNEY</p>
          {COMMUNITY.map(user => (
            <div
              key={user.initials}
              className="fs-card"
              style={{ padding: '10px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: user.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 500, color: 'white', flexShrink: 0,
              }}>
                {user.initials}
              </div>
              <span style={{ color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-sm)', flex: 1 }}>{user.name}</span>
              <span style={{ color: 'var(--fs-teal-300)', fontSize: 'var(--fs-text-xs)' }}>{streak} day streak 🔥</span>
            </div>
          ))}
        </motion.div>

        {/* Testing tools */}
        <div style={{ textAlign: 'center', paddingBottom: 16 }}>
          <button
            onClick={() => setShowDevMenu(true)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', fontSize: 11, cursor: 'pointer' }}
          >
            Testing tools
          </button>
        </div>

      </div>

      <BottomNav />
    </PageTransition>
  )
}
