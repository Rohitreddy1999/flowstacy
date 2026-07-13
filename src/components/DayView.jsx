import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Palette (mirrors Home.jsx V2 constants — do not hardcode elsewhere) ────────
const ABYSS     = '#07090D'
const FATHOM    = '#0F141A'
const SURGE     = '#3DF5A6'
const GLACIAL   = '#82D4FF'
const PLASMA    = '#FF4FD8'
const ARC_LIGHT = '#EAFFF5'

// ── Phase helpers ──────────────────────────────────────────────────────────────
function getPhaseColor(day) {
  if (day <= 7)  return GLACIAL
  if (day <= 14) return SURGE
  return PLASMA
}

function getPhaseLabel(day) {
  if (day <= 7)  return 'FOUNDATION'
  if (day <= 14) return 'BUILD'
  return 'COMMIT'
}

// ── Mood definitions (SVG mouth paths from design) ────────────────────────────
const MOOD_DEFS = [
  { id: 'terrible', label: 'TERRIBLE', mouth: 'M10 23.5 Q16 17.5 22 23.5'     },
  { id: 'bad',      label: 'BAD',      mouth: 'M10.5 22.5 Q16 19.5 21.5 22.5' },
  { id: 'okay',     label: 'OKAY',     mouth: 'M11 21.5 L21 21.5'              },
  { id: 'good',     label: 'GOOD',     mouth: 'M10.5 19.5 Q16 23.5 21.5 19.5' },
  { id: 'great',    label: 'GREAT',    mouth: 'M9.5 19 Q16 26 22.5 19'         },
]

const HOLD_MS = 1000

// ── DayView ───────────────────────────────────────────────────────────────────
export default function DayView({
  day           = 1,
  streak        = 1,
  completed     = false,
  taskTitle     = '',
  subtrackName  = '',
  durationMinutes,
  difficulty,
  steps         = [],
  whyText       = '',
  quoteText     = '',
  quoteAuthor   = '',
  youtubeUrl,
  youtubeLabel,
  refs          = [],
  onComplete,
}) {
  const phaseColor = getPhaseColor(day)
  const phaseLabel = getPhaseLabel(day)
  const dayLabel   = String(day).padStart(2, '0')

  // ── UI state ────────────────────────────────────────────────────────────────
  const [checkedSteps, setCheckedSteps] = useState({})
  const [holdProgress, setHoldProgress] = useState(0)
  const [isHolding,    setIsHolding]    = useState(false)
  // 'day' | 'celebrate' | 'mood'
  const [phase,        setPhase]        = useState('day')
  const [mood,         setMood]         = useState(-1)
  const [noteText,     setNoteText]     = useState('')
  const [saved,        setSaved]        = useState(false)

  const holdStartRef = useRef(null)
  const rafRef       = useRef(null)
  const moodTimerRef = useRef(null)

  // cleanup on unmount
  useEffect(() => () => {
    if (rafRef.current)       cancelAnimationFrame(rafRef.current)
    if (moodTimerRef.current) clearTimeout(moodTimerRef.current)
  }, [])

  // ── Hold interaction ────────────────────────────────────────────────────────
  function startHold(e) {
    if (completed || phase !== 'day' || isHolding) return
    e.preventDefault()
    holdStartRef.current = performance.now()
    setIsHolding(true)
    function tick(now) {
      const p = Math.min((now - holdStartRef.current) / HOLD_MS, 1)
      setHoldProgress(p)
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setIsHolding(false)
        setHoldProgress(0)
        setPhase('celebrate')
        moodTimerRef.current = setTimeout(() => setPhase('mood'), 2600)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  function cancelHold() {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    setIsHolding(false)
    setHoldProgress(0)
  }

  // ── Mood save ───────────────────────────────────────────────────────────────
  function handleSave() {
    if (mood === -1 || saved) return
    setSaved(true)
    setTimeout(() => onComplete?.(MOOD_DEFS[mood].id, noteText), 800)
  }

  // ── Celebration letter split ─────────────────────────────────────────────
  const celebrateText    = `DAY ${dayLabel} COMPLETE`
  const celebrateLetters = celebrateText.split('').map((ch, i) => ({
    ch:   ch === ' ' ? ' ' : ch,
    minW: ch === ' ' ? '10px'  : '0px',
    delay: 0.55 + i * 0.045,
  }))

  const hasResources = youtubeUrl || refs.length > 0

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'relative', background: ABYSS, fontFamily: '"Hanken Grotesk", sans-serif' }}>

      {/* ── Scrollable content ──────────────────────────────────────────────── */}
      <div style={{ paddingBottom: 16, paddingLeft: 22, paddingRight: 22, boxSizing: 'border-box' }}>

        {/* 1 · Day header row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 24 }}
        >
          <span style={{
            fontSize: 12, fontWeight: 700, letterSpacing: '0.18em',
            fontFamily: '"Space Mono", monospace', color: ARC_LIGHT,
          }}>
            DAY {dayLabel}
          </span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(234,255,245,0.35)', flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.32em', color: phaseColor }}>
            {phaseLabel}
          </span>
          <div style={{ flex: 1 }} />
          {/* Streak badge — diamond + number */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 10px 5px 8px', borderRadius: 100,
            background: `${phaseColor}24`,
            border: `1px solid ${phaseColor}4D`,
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10">
              <rect x="2.1" y="2.1" width="5.8" height="5.8" rx="1" fill={phaseColor} transform="rotate(45 5 5)" />
            </svg>
            <span style={{
              fontSize: 12, fontWeight: 700, color: phaseColor,
              fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '0.04em',
            }}>
              {streak}
            </span>
          </div>
        </motion.div>

        {/* 2 · Task title + meta */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          style={{
            margin: '30px 0 0',
            fontSize: 34, fontWeight: 700, lineHeight: 1.12,
            fontFamily: '"Space Grotesk", sans-serif',
            letterSpacing: '-0.015em', color: ARC_LIGHT,
          }}
        >
          {taskTitle || `Day ${day}`}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginTop: 10, fontSize: 14, fontWeight: 500, color: '#4FB596', letterSpacing: '0.02em' }}
        >
          {[subtrackName, durationMinutes ? `${durationMinutes} min` : null, difficulty].filter(Boolean).join(' · ')}
        </motion.div>

        {/* 3 · WHAT TO DO */}
        {steps.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              style={{
                marginTop: 40, fontSize: 11, fontWeight: 600,
                letterSpacing: '0.28em', color: 'rgba(234,255,245,0.4)',
              }}
            >
              WHAT TO DO
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
              {steps.map((text, i) => {
                const done = !!checkedSteps[i]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.div
                      onClick={() => setCheckedSteps(prev => ({ ...prev, [i]: !prev[i] }))}
                      whileTap={{ scale: 0.985 }}
                      animate={{
                        boxShadow: done
                          ? `inset 3px 0 12px -4px ${phaseColor}8C`
                          : `inset 3px 0 8px -6px ${phaseColor}4D`,
                      }}
                      transition={{ duration: 0.35 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '16px 16px 16px 18px',
                        background: FATHOM,
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderLeft: `3px solid ${phaseColor}`,
                        borderRadius: 14, cursor: 'pointer',
                      }}
                    >
                      <motion.span
                        animate={{ color: done ? phaseColor : 'rgba(234,255,245,0.35)' }}
                        transition={{ duration: 0.3 }}
                        style={{
                          fontSize: 11, fontWeight: 700, flexShrink: 0,
                          fontFamily: '"Space Mono", monospace',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {'0' + (i + 1)}
                      </motion.span>

                      <motion.span
                        animate={{ opacity: done ? 0.6 : 1 }}
                        transition={{ duration: 0.35 }}
                        style={{ flex: 1, fontSize: 14.5, lineHeight: 1.45, color: ARC_LIGHT }}
                      >
                        {text}
                      </motion.span>

                      {/* Check circle */}
                      <motion.span
                        animate={{
                          background: done ? phaseColor : 'transparent',
                          borderColor: done ? phaseColor : 'rgba(255,255,255,0.18)',
                        }}
                        transition={{ duration: 0.3 }}
                        style={{
                          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '1.5px solid rgba(255,255,255,0.18)',
                        }}
                      >
                        <motion.svg
                          width="11" height="9" viewBox="0 0 12 10"
                          animate={{ opacity: done ? 1 : 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <path
                            d="M1.5 5.2 4.6 8.2 10.5 1.8"
                            fill="none"
                            stroke={ABYSS}
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      </motion.span>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </>
        )}

        {/* 4 · WHY THIS MATTERS */}
        {whyText && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              style={{
                marginTop: 40, fontSize: 11, fontWeight: 600,
                letterSpacing: '0.28em', color: 'rgba(234,255,245,0.4)',
              }}
            >
              WHY THIS MATTERS
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'relative',
                marginTop: 14,
                padding: '22px 20px 26px',
                borderRadius: 16,
                background: 'rgba(15,20,26,0.6)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden',
              }}
            >
              {/* Breathing ambient glow */}
              <motion.div
                animate={{ opacity: [0.55, 0.95, 0.55] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  left: '50%', bottom: -70,
                  transform: 'translateX(-50%)',
                  width: '120%', height: 120,
                  background: `radial-gradient(ellipse at center, ${phaseColor}42 0%, transparent 68%)`,
                  pointerEvents: 'none',
                }}
              />
              <p style={{
                position: 'relative', margin: 0,
                fontSize: 15.5, lineHeight: 1.62,
                color: 'rgba(234,255,245,0.86)',
              }}>
                {whyText}
              </p>
            </motion.div>
          </>
        )}

        {/* 5 · Motivational quote */}
        {quoteText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 1.0 }}
            style={{ margin: '56px 0', textAlign: 'center' }}
          >
            <div style={{ width: 36, height: 1, background: phaseColor, opacity: 0.7, margin: '0 auto 24px' }} />
            <p style={{
              margin: 0, padding: '0 8px',
              fontSize: 20, fontWeight: 600, lineHeight: 1.5,
              fontFamily: '"Space Grotesk", sans-serif',
              fontStyle: 'italic', letterSpacing: '0.06em',
              color: ARC_LIGHT,
            }}>
              {quoteText}
            </p>
            <div style={{ width: 36, height: 1, background: phaseColor, opacity: 0.7, margin: '24px auto 14px' }} />
            <div style={{
              fontSize: 10.5, fontWeight: 500,
              letterSpacing: '0.26em',
              color: 'rgba(234,255,245,0.38)',
            }}>
              {quoteAuthor ? `— ${quoteAuthor}` : 'FLOWSTACY'}
            </div>
          </motion.div>
        )}

        {/* 6 · Watch & Learn */}
        {hasResources && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
          >
            <div style={{
              fontSize: 11, fontWeight: 600,
              letterSpacing: '0.28em', color: 'rgba(234,255,245,0.4)',
              marginBottom: 14,
            }}>
              WATCH &amp; LEARN
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {youtubeUrl && (
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  onClick={() => window.open(youtubeUrl, '_blank')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px',
                    background: FATHOM,
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderLeft: `3px solid ${phaseColor}`,
                    borderRadius: 14, cursor: 'pointer',
                  }}
                >
                  <span style={{
                    width: 38, height: 38, flexShrink: 0,
                    borderRadius: '50%',
                    background: `${phaseColor}29`,
                    border: `1px solid ${phaseColor}4D`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {/* Play icon */}
                    <svg width="12" height="14" viewBox="0 0 12 14" style={{ marginLeft: 2 }}>
                      <path d="M1.5 1.6c0-.9 1-1.5 1.8-1L11 6c.8.5.8 1.6 0 2.1L3.3 13.4c-.8.5-1.8-.1-1.8-1V1.6z" fill={phaseColor} />
                    </svg>
                  </span>
                  <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', color: ARC_LIGHT }}>
                      {youtubeLabel || "Watch today's guide"}
                    </span>
                    <span style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '0.14em', color: phaseColor }}>
                      MUST WATCH · VIDEO{durationMinutes ? ` · ${durationMinutes} MIN` : ''}
                    </span>
                  </span>
                  <ChevronRight />
                </motion.div>
              )}

              {refs.map((ref, i) => (
                <motion.div
                  key={i}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => window.open(ref.url, '_blank')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px',
                    background: FATHOM,
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderLeft: '3px solid rgba(255,255,255,0.14)',
                    borderRadius: 14, cursor: 'pointer',
                  }}
                >
                  <span style={{
                    width: 38, height: 38, flexShrink: 0,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {/* Link/arrow icon */}
                    <svg width="13" height="13" viewBox="0 0 13 13">
                      <path d="M3 10 10 3M4.5 3H10v5.5" fill="none" stroke={phaseColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', color: ARC_LIGHT }}>
                      {ref.label}
                    </span>
                    <span style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '0.14em', color: 'rgba(234,255,245,0.4)' }}>
                      ARTICLE · READ
                    </span>
                  </span>
                  <ChevronRight />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Sticky footer: Hold to Complete / Completed state ──────────────── */}
      <div style={{
        position: 'sticky', bottom: 80,
        padding: '36px 20px 34px',
        background: `linear-gradient(to top, ${ABYSS} 62%, transparent)`,
        zIndex: 20,
      }}>
        {completed ? (
          // Already completed externally
          <div style={{
            height: 58, borderRadius: 18,
            border: `1px solid ${phaseColor}66`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke={phaseColor} strokeWidth="1.5" opacity="0.4" />
              <path d="M5.5 9l2.5 2.5 4.5-5" stroke={phaseColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{
              fontSize: 15, fontWeight: 600,
              fontFamily: '"Space Grotesk", sans-serif',
              color: phaseColor,
            }}>
              Day {dayLabel} complete
            </span>
          </div>
        ) : phase === 'day' ? (
          <>
            {/* Progress fill bar along bottom edge */}
            <div style={{
              position: 'absolute', left: 0, bottom: 0, height: 4, zIndex: 6,
              width: `${holdProgress * 100}%`,
              background: phaseColor,
              boxShadow: `0 0 14px 1px ${phaseColor}99`,
            }} />

            {/* Hold button */}
            <motion.div
              onPointerDown={startHold}
              onPointerUp={cancelHold}
              onPointerLeave={cancelHold}
              onPointerCancel={cancelHold}
              // Idle heartbeat when not holding
              animate={!isHolding ? {
                scale: [1, 1.012, 1, 1.008, 1, 1],
              } : {
                scale: 1,
                boxShadow: [
                  `inset 0 0 18px 0 ${phaseColor}38, 0 0 24px 0 ${phaseColor}2E`,
                  `inset 0 0 34px 2px ${phaseColor}6B, 0 0 44px 4px ${phaseColor}4D`,
                  `inset 0 0 18px 0 ${phaseColor}38, 0 0 24px 0 ${phaseColor}2E`,
                ],
              }}
              transition={!isHolding ? {
                duration: 2.6, repeat: Infinity, ease: 'easeInOut',
                times: [0, 0.1, 0.22, 0.32, 0.44, 1],
              } : {
                boxShadow: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' },
                scale: { duration: 0.15 },
              }}
              style={{
                position: 'relative', height: 58, borderRadius: 18,
                background: '#10161D',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', userSelect: 'none',
                WebkitUserSelect: 'none', touchAction: 'none',
                overflow: 'hidden',
              }}
            >
              <span style={{
                fontSize: 15.5, fontWeight: 500,
                fontFamily: '"Space Grotesk", sans-serif',
                letterSpacing: '0.04em', color: ARC_LIGHT,
                pointerEvents: 'none',
              }}>
                {isHolding ? 'Completing…' : 'Hold to Complete'}
              </span>
            </motion.div>
          </>
        ) : null}
      </div>

      {/* ── Celebration overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {phase !== 'day' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              background: ABYSS,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Outward burst ring */}
            <motion.div
              initial={{ scale: 0.08, opacity: 0.95 }}
              animate={{ scale: 3.4, opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute', left: '50%', top: '44%',
                transform: 'translate(-50%, -50%)',
                width: 390, height: 390, borderRadius: '50%',
                background: `radial-gradient(circle, ${phaseColor}8C 0%, transparent 62%)`,
                pointerEvents: 'none',
              }}
            />

            {/* Ambient breathing glow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.55, 0.95, 0.55] }}
              transition={{
                duration: 5, times: [0, 0.28, 0.34, 0.67, 1],
                repeat: Infinity, ease: 'easeInOut',
              }}
              style={{
                position: 'absolute', left: '50%', top: '44%',
                transform: 'translate(-50%, -50%)',
                width: 340, height: 340, borderRadius: '50%',
                background: `radial-gradient(circle, ${phaseColor}33 0%, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />

            {/* Animated check ring */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring', damping: 9, stiffness: 160, delay: 0.15,
              }}
              style={{
                position: 'relative',
                width: 96, height: 96, borderRadius: '50%',
                border: `2px solid ${phaseColor}`,
                background: `${phaseColor}1F`,
                boxShadow: `0 0 44px 4px ${phaseColor}59`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="42" height="34" viewBox="0 0 42 34">
                <motion.path
                  d="M4 18.5 15.5 29.5 38 4.5"
                  fill="none"
                  stroke={phaseColor}
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.45, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
            </motion.div>

            {/* Letter-by-letter "DAY XX COMPLETE" */}
            <div style={{ display: 'flex', gap: 2, marginTop: 34 }}>
              {celebrateLetters.map((L, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: L.delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{
                    fontSize: 26, fontWeight: 700,
                    fontFamily: '"Space Grotesk", sans-serif',
                    letterSpacing: '0.1em', color: ARC_LIGHT,
                    minWidth: L.minW, textAlign: 'center', display: 'inline-block',
                  }}
                >
                  {L.ch}
                </motion.span>
              ))}
            </div>

            {/* Phase · X of 21 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.9 }}
              style={{
                marginTop: 14,
                fontSize: 12, fontWeight: 500, letterSpacing: '0.28em',
                color: 'rgba(234,255,245,0.5)', whiteSpace: 'nowrap',
              }}
            >
              {phaseLabel}&nbsp;&nbsp;·&nbsp;&nbsp;{day} OF 21
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mood log sheet ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'mood' && (
          <motion.div
            key="mood-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'fixed', inset: 0, zIndex: 110 }}
          >
            {/* Dim backdrop */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(4,6,9,0.45)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
            }} />

            {/* Bottom sheet */}
            <motion.div
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              exit={{ y: '105%' }}
              transition={{ duration: 0.65, ease: [0.22, 1.2, 0.36, 1] }}
              style={{
                position: 'absolute', left: 0, right: 0, bottom: 0,
                maxWidth: 480, margin: '0 auto',
                borderRadius: '28px 28px 0 0',
                background: 'rgba(15,20,26,0.88)',
                backdropFilter: 'blur(26px)',
                WebkitBackdropFilter: 'blur(26px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderBottom: 'none',
                padding: '14px 24px 40px',
              }}
            >
              {/* Drag handle */}
              <div style={{
                width: 38, height: 4, borderRadius: 100,
                background: 'rgba(255,255,255,0.18)',
                margin: '0 auto 22px',
              }} />

              <p style={{
                margin: 0, fontSize: 21, fontWeight: 500,
                fontFamily: '"Space Grotesk", sans-serif',
                color: ARC_LIGHT, textAlign: 'center',
              }}>
                How did today feel?
              </p>

              {/* Emoji face row */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 14, margin: '26px 0 8px' }}>
                {MOOD_DEFS.map((m, i) => {
                  const on = mood === i
                  return (
                    <motion.div
                      key={m.id}
                      onClick={() => setMood(i)}
                      animate={{ opacity: mood === -1 || on ? 1 : 0.4 }}
                      transition={{ duration: 0.3 }}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, cursor: 'pointer' }}
                    >
                      <motion.span
                        animate={{
                          borderColor: on ? phaseColor : 'rgba(255,255,255,0.16)',
                          background:  on ? `${phaseColor}29` : 'rgba(255,255,255,0.03)',
                          boxShadow:   on
                            ? `inset 0 0 14px 0 ${phaseColor}66, 0 0 18px 0 ${phaseColor}40`
                            : 'none',
                        }}
                        whileTap={{ scale: [1, 1.12, 0.97, 1] }}
                        transition={{ duration: 0.3 }}
                        style={{
                          width: 46, height: 46, borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '1.5px solid rgba(255,255,255,0.16)',
                        }}
                      >
                        <svg width="26" height="26" viewBox="0 0 32 32">
                          <motion.circle
                            cx="11.5" cy="13" r="1.7"
                            animate={{ fill: on ? phaseColor : 'rgba(234,255,245,0.65)' }}
                            transition={{ duration: 0.3 }}
                          />
                          <motion.circle
                            cx="20.5" cy="13" r="1.7"
                            animate={{ fill: on ? phaseColor : 'rgba(234,255,245,0.65)' }}
                            transition={{ duration: 0.3 }}
                          />
                          <motion.path
                            d={m.mouth}
                            fill="none"
                            strokeWidth="2"
                            strokeLinecap="round"
                            animate={{ stroke: on ? phaseColor : 'rgba(234,255,245,0.65)' }}
                            transition={{ duration: 0.3 }}
                          />
                        </svg>
                      </motion.span>
                      <motion.span
                        animate={{ color: on ? phaseColor : 'rgba(234,255,245,0.35)' }}
                        transition={{ duration: 0.3 }}
                        style={{
                          fontSize: 9.5, fontWeight: 500,
                          letterSpacing: '0.14em',
                          display: 'block',
                        }}
                      >
                        {m.label}
                      </motion.span>
                    </motion.div>
                  )
                })}
              </div>

              {/* Note input */}
              <input
                placeholder="Anything to note?"
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  marginTop: 18, padding: '15px 16px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: ARC_LIGHT,
                  fontSize: 14, fontFamily: '"Hanken Grotesk", sans-serif',
                  outline: 'none',
                }}
              />

              {/* Save button */}
              <motion.div
                onClick={handleSave}
                animate={{
                  background: saved
                    ? '#1D9E75'
                    : mood !== -1 ? phaseColor : 'rgba(255,255,255,0.08)',
                }}
                transition={{ duration: 0.3 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  marginTop: 16, height: 52, borderRadius: 15,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: mood !== -1 ? 'pointer' : 'not-allowed',
                }}
              >
                <span style={{
                  fontSize: 15, fontWeight: 600,
                  fontFamily: '"Space Grotesk", sans-serif',
                  color: ABYSS,
                }}>
                  {saved ? 'Saved ✓' : 'Save to Log'}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Internal SVG helpers ───────────────────────────────────────────────────────
function ChevronRight() {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" style={{ flexShrink: 0, opacity: 0.35 }}>
      <path d="M1 1l5 5-5 5" stroke={ARC_LIGHT} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
