import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getDayContent } from '../lib/curriculum'
import { completeDay } from '../lib/journeyService'
import { supabase } from '../lib/supabase'
import { useJourneyStore } from '../lib/journeyStore'
import DayView from '../components/DayView'

// ── Palette ────────────────────────────────────────────────────────────────────
const ABYSS     = '#07090D'
const FATHOM    = '#0F141A'
const SURGE     = '#3DF5A6'
const GLACIAL   = '#82D4FF'
const PLASMA    = '#FF4FD8'
const ARC_LIGHT = '#EAFFF5'

// ── Constants ──────────────────────────────────────────────────────────────────
const TOTAL = 21

// ── Helpers ────────────────────────────────────────────────────────────────────

function getPhaseColor(day) {
  if (day <= 7)  return GLACIAL
  if (day <= 14) return SURGE
  return PLASMA
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

  const { journey, currentDay, streak, completedDays, markDayComplete, isLoading } = useJourneyStore()
  const subtrackId   = journey?.subtrack_id
  const subtrackName = journey?.subtracks?.name || ''

  const completed = completedDays.includes(currentDay)

  const [showDevMenu,   setShowDevMenu]   = useState(false)
  const [showFullPlan,  setShowFullPlan]  = useState(false)

  const [dayContent,     setDayContent]     = useState(null)
  const [contentLoading, setContentLoading] = useState(true)
  const [allDays,        setAllDays]        = useState([])

  // Redirect to track select if store is loaded but no active journey
  useEffect(() => {
    if (!isLoading && !journey) {
      navigate('/track-select', { replace: true })
    }
  }, [isLoading, journey])

  // ── Fetch curriculum ───────────────────────────────────────────────────────

  useEffect(() => {
    async function fetchCurriculumData() {
      setContentLoading(true)
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
  }, [subtrackId, currentDay])

  // ── Handlers ───────────────────────────────────────────────────────────────

  async function handleDayViewComplete(feeling, note) {
    if (completed || !journey) return
    // Optimistic store update so UI advances immediately
    markDayComplete(currentDay)
    // Fire-and-forget Supabase write
    const { data: { session } } = await supabase.auth.getSession()
    if (session) completeDay(journey.id, session.user.id, currentDay, feeling, note)
    if (currentDay === 21) navigate('/graduation')
  }

  function resetApp() {
    useJourneyStore.getState().reset()
    navigate('/')
  }

  function jumpToDay(day) {
    useJourneyStore.setState({
      currentDay:    day,
      streak:        day,
      completedDays: Array.from({ length: day - 1 }, (_, i) => i + 1),
    })
    setShowDevMenu(false)
  }

  // ── Derived ────────────────────────────────────────────────────────────────

  const steps   = dayContent?.steps   ?? parseTaskDescription(dayContent?.task_description).steps
  const whyText = dayContent?.why_text ?? parseTaskDescription(dayContent?.task_description).why
  const refs = [
    { url: dayContent?.reference_url_1, label: dayContent?.ref_label_1 },
    { url: dayContent?.reference_url_2, label: dayContent?.ref_label_2 },
    { url: dayContent?.reference_url_3, label: dayContent?.ref_label_3 },
  ].filter(r => r.url && r.label)

  // Circuit ring math
  const ringR          = 80
  const ringCircum     = 2 * Math.PI * ringR
  const completedFrac  = completedDays.length / TOTAL
  const ringDashOffset = ringCircum * (1 - completedFrac)
  const tipAngle       = -Math.PI / 2 + completedFrac * 2 * Math.PI
  const tipX           = (100 + ringR * Math.cos(tipAngle)).toFixed(2)
  const tipY           = (100 + ringR * Math.sin(tipAngle)).toFixed(2)

  const dayLabel = String(currentDay).padStart(2, '0')

  // ── Loading guard ──────────────────────────────────────────────────────────

  if (isLoading) return (
    <div style={{
      background: ABYSS, minHeight: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        color: 'rgba(255,255,255,0.3)',
        fontFamily: '"Hanken Grotesk", sans-serif', fontSize: 14,
      }}>
        Loading…
      </div>
    </div>
  )

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100%', background: ABYSS, paddingBottom: 100, fontFamily: '"Hanken Grotesk", sans-serif' }}>

      {/* ── Dev menu ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showDevMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 300,
              background: 'rgba(7,9,13,0.6)', backdropFilter: 'blur(4px)',
            }}
            onClick={() => setShowDevMenu(false)}
          >
            <div
              style={{
                position: 'fixed', bottom: 90, left: 16, right: 16, maxWidth: 448,
                margin: '0 auto', background: FATHOM,
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20, padding: 16, zIndex: 300,
              }}
              onClick={e => e.stopPropagation()}
            >
              {[
                { label: 'Reset everything', action: resetApp },
                { label: 'Jump to Day 7',    action: () => jumpToDay(7)  },
                { label: 'Jump to Day 14',   action: () => jumpToDay(14) },
                { label: 'Jump to Day 21',   action: () => jumpToDay(21) },
                { label: 'Go to Graduation', action: () => navigate('/graduation') },
              ].map(({ label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '12px 4px', background: 'none', border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.7)', fontSize: 13.5, cursor: 'pointer',
                    fontFamily: '"Hanken Grotesk", sans-serif',
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
                  fontFamily: '"Hanken Grotesk", sans-serif',
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
              background: 'rgba(7,9,13,0.8)', backdropFilter: 'blur(10px)',
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
                display: 'flex', flexDirection: 'column',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{
                padding: '20px 20px 0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.95)',
                }}>
                  Your 21-day plan
                </span>
                <button
                  onClick={() => setShowFullPlan(false)}
                  style={{
                    background: 'none', border: 'none',
                    color: 'rgba(255,255,255,0.35)',
                    fontSize: 24, cursor: 'pointer', lineHeight: 1, padding: '4px',
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
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700,
                        background: isDone  ? 'rgba(61,245,166,0.15)' :
                                    isToday ? 'rgba(61,245,166,0.12)' :
                                    'rgba(255,255,255,0.05)',
                        color: isDone  ? SURGE :
                               isToday ? ARC_LIGHT :
                               'rgba(255,255,255,0.3)',
                        border:  isToday ? '1px solid rgba(61,245,166,0.4)' : '1px solid transparent',
                        fontFamily: '"Space Grotesk", sans-serif',
                      }}>
                        {isDone ? '✓' : day}
                      </div>
                      <span style={{
                        flex: 1, fontSize: 13.5,
                        color:          isDone  ? 'rgba(255,255,255,0.35)' :
                                        isToday ? 'rgba(255,255,255,0.95)' :
                                        'rgba(255,255,255,0.55)',
                        fontWeight:     isToday ? 600 : 400,
                        textDecoration: isDone ? 'line-through' : 'none',
                      }}>
                        {content?.task_title || `Day ${day}`}
                      </span>
                      {content?.duration_minutes && (
                        <span style={{
                          fontSize: 11, color: 'rgba(255,255,255,0.3)',
                          background: 'rgba(255,255,255,0.05)',
                          padding: '3px 8px', borderRadius: 10,
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

      {/* ── Day content ───────────────────────────────────────────────────── */}
      {contentLoading ? (
        <div style={{ padding: '0 16px 16px', maxWidth: 480, margin: '0 auto', boxSizing: 'border-box' }}>
          <div style={{
            background: FATHOM,
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20, overflow: 'hidden',
          }}>
            <div style={{ height: 3, background: 'rgba(61,245,166,0.2)' }} />
            <div style={{ padding: 20 }}>
              {[80, 120, 60].map((h, i) => (
                <div key={i} style={{
                  height: h, background: 'rgba(255,255,255,0.05)',
                  borderRadius: 10, marginBottom: 12,
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
            fontFamily: '"Hanken Grotesk", sans-serif',
          }}
        >
          dev tools
        </button>
      </div>

    </div>
  )
}
