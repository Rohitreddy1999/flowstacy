import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiArrowLeft, HiCog6Tooth } from 'react-icons/hi2'
import BottomNav from '../components/BottomNav'
import AuroraBackground from '../components/AuroraBackground'
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

function getCelebration(day) {
  if (day === 7)  return { emoji: '🔥', line: 'Week 1 done!' }
  if (day === 14) return { emoji: '⚡', line: 'Halfway there!' }
  if (day === 21) return { emoji: '🏆', line: 'You graduated!' }
  return { emoji: '✓', line: `Day ${day} complete!` }
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

  const [completed,       setCompleted]       = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showLogModal,    setShowLogModal]    = useState(false)
  const [feeling,         setFeeling]         = useState(null)
  const [logNote,         setLogNote]         = useState('')
  const [reflectionSaved, setReflectionSaved] = useState(false)
  const [showDevMenu,     setShowDevMenu]     = useState(false)

  // Curriculum state
  const [dayContent,      setDayContent]      = useState(null)
  const [contentLoading,  setContentLoading]  = useState(true)
  const [subtracksId,     setSubtracksId]     = useState(null)

  const celebration = getCelebration(currentDay)

  // ── Fetch curriculum data ──────────────────────────────────────────────────

  useEffect(() => {
    async function fetchCurriculumData() {
      setContentLoading(true)

      const subtracks_name = localStorage.getItem('flowstate_selected_subtrack')
      if (!subtracks_name) {
        setContentLoading(false)
        return
      }

      // Map short key → full display name for Supabase lookup
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
    const done = Array.from({ length: day - 1 }, (_, i) => i + 1)
    localStorage.setItem('flowstate_current_day', String(day))
    localStorage.setItem('flowstate_streak', String(day))
    localStorage.setItem('flowstate_completed_days', JSON.stringify(done))
    setCurrentDay(day)
    setStreak(day)
    setCompletedDays(done)
    setCompleted(false)
    setShowDevMenu(false)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <AuroraBackground />

      {/* ── Celebration overlay ──────────────────────────────── */}
      {showCelebration && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-6"
          style={{ background: 'radial-gradient(circle at center, rgba(83,74,183,0.95) 0%, #0A0812 100%)' }}
        >
          <p style={{ fontSize: 72, marginBottom: 16 }}>{celebration.emoji}</p>
          <p style={{ fontSize: 32, fontWeight: 300, color: 'white', marginBottom: 8, letterSpacing: '-0.02em' }}>
            {celebration.line}
          </p>
          {currentDay !== 21 && (
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>See you tomorrow</p>
          )}
        </div>
      )}

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
          {currentDay === 1 ? (
            <button
              onClick={() => navigate('/bridge')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
            >
              <HiArrowLeft size={20} color="rgba(255,255,255,0.6)" />
            </button>
          ) : (
            <span className="fs-logo">flowstate</span>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🔥</span>
              <span style={{ color: 'var(--fs-teal-300)', fontSize: 'var(--fs-text-sm)', fontWeight: 500 }}>{streak}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-text-sm)' }}>day streak</span>
            </div>
            <button
              onClick={() => navigate('/settings')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
            >
              <HiCog6Tooth size={20} color="rgba(255,255,255,0.6)" />
            </button>
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

        {/* Day label + heading */}
        <div style={{ padding: '24px 20px 16px' }}>
          <p className="fs-label fs-label-purple" style={{ marginBottom: 8 }}>
            {subtrackName} — Day {currentDay} of {TOTAL}
          </p>
          <h1 className="fs-heading-md" style={{ marginBottom: 6 }}>{getHeading(currentDay)}</h1>
          <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)' }}>{getSubtext(currentDay)}</p>
        </div>

        {/* Progress bar + dots */}
        <div style={{ padding: '0 20px 20px' }}>
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
                <div key={i} className={`fs-dot ${done ? 'fs-dot-completed' : today ? 'fs-dot-today' : 'fs-dot-future'}`} />
              )
            })}
          </div>
        </div>

        {/* Today's task card */}
        <div className="fs-card fs-card-purple" style={{ margin: '0 16px 16px', padding: 16 }}>
          {contentLoading ? (
            <>
              <Skeleton height={12} style={{ width: '40%', marginBottom: 10 }} />
              <Skeleton height={14} style={{ marginBottom: 6 }} />
              <Skeleton height={14} style={{ width: '85%', marginBottom: 14 }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <Skeleton height={22} style={{ width: 80, borderRadius: 999, margin: 0 }} />
                <Skeleton height={22} style={{ width: 60, borderRadius: 999, margin: 0 }} />
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* No content fallback */}
        {!contentLoading && !dayContent && (
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

        {/* Watch & Learn */}
        {!contentLoading && dayContent?.youtube_url && (
          <div className="fs-card" style={{ margin: '0 16px 16px', padding: '14px 16px' }}>
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
          </div>
        )}

        {/* Daily quote */}
        {(dayContent?.quote_text || !contentLoading) && (
          <div style={{
            margin: '0 16px 16px', padding: '14px 16px',
            borderLeft: '2px solid var(--fs-purple-500)',
            background: 'rgba(83, 74, 183, 0.08)',
            borderRadius: '0 var(--fs-radius-md) var(--fs-radius-md) 0',
          }}>
            {contentLoading ? (
              <>
                <Skeleton height={13} style={{ marginBottom: 6 }} />
                <Skeleton height={13} style={{ width: '60%', marginBottom: 6 }} />
                <Skeleton height={11} style={{ width: '30%', margin: 0 }} />
              </>
            ) : (
              <>
                <p style={{ color: 'var(--fs-text-secondary)', fontStyle: 'italic', fontSize: 'var(--fs-text-sm)', lineHeight: 1.6, marginBottom: 6 }}>
                  "{dayContent?.quote_text || 'The secret of getting ahead is getting started.'}"
                </p>
                <p style={{ color: 'var(--fs-purple-300)', fontSize: 'var(--fs-text-xs)' }}>
                  {dayContent?.quote_author ? `— ${dayContent.quote_author}` : '— Mark Twain'}
                </p>
              </>
            )}
          </div>
        )}

        {/* Source credits */}
        {!contentLoading && dayContent?.source_credits && (
          <div style={{ margin: '0 16px 16px', padding: '10px 14px' }}>
            <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 11, lineHeight: 1.5 }}>
              📚 Sources: {dayContent.source_credits}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={handleMarkComplete}
            disabled={completed}
            className="fs-btn-primary"
            style={{
              width: '100%',
              ...(completed ? { background: 'var(--fs-teal-500)', boxShadow: 'var(--fs-glow-teal)' } : {}),
            }}
          >
            {completed ? `Day ${currentDay} Complete! ✓` : `Mark Day ${currentDay} Complete ✓`}
          </button>
          <button onClick={() => setShowLogModal(true)} className="fs-btn-secondary" style={{ width: '100%' }}>
            Add to my log
          </button>
        </div>

        {/* Community peek */}
        <div style={{ padding: '0 16px 24px' }}>
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
        </div>

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
    </>
  )
}
