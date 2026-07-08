import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { SUBTRACK_IDS, SUBTRACK_NAMES } from '../lib/curriculum'

// ── V2 Colors ──────────────────────────────────────────────────────────────────
const ABYSS     = '#07090D'
const FATHOM    = '#0F141A'
const SURGE     = '#3DF5A6'
const GLACIAL   = '#82D4FF'
const PLASMA    = '#FF4FD8'
const ARC_LIGHT = '#EAFFF5'
const HK        = '"Hanken Grotesk", sans-serif'

function getPhaseColor(day) {
  if (day <= 7)  return GLACIAL
  if (day <= 14) return SURGE
  return PLASMA
}

// ── SVG helpers ────────────────────────────────────────────────────────────────
function polarToCart(cx, cy, r, deg) {
  const rad = (deg - 90) * (Math.PI / 180)
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function ringSegPath(cx, cy, outerR, innerR, startDeg, endDeg) {
  const o1 = polarToCart(cx, cy, outerR, startDeg)
  const o2 = polarToCart(cx, cy, outerR, endDeg)
  const i2 = polarToCart(cx, cy, innerR, endDeg)
  const i1 = polarToCart(cx, cy, innerR, startDeg)
  const large = (endDeg - startDeg) > 180 ? 1 : 0
  return [
    `M${o1.x.toFixed(2)},${o1.y.toFixed(2)}`,
    `A${outerR},${outerR},0,${large},1,${o2.x.toFixed(2)},${o2.y.toFixed(2)}`,
    `L${i2.x.toFixed(2)},${i2.y.toFixed(2)}`,
    `A${innerR},${innerR},0,${large},0,${i1.x.toFixed(2)},${i1.y.toFixed(2)}`,
    'Z',
  ].join(' ')
}

// ── Circuit Ring ───────────────────────────────────────────────────────────────
function CircuitRing({ size, segmentsVisible }) {
  const half   = size / 2
  const outerR = half * 0.9
  const innerR = half * 0.68
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', overflow: 'visible' }}>
      {Array.from({ length: 21 }, (_, i) => {
        const dayNum   = i + 1
        const segSpan  = 360 / 21
        const startDeg = i * segSpan
        const endDeg   = startDeg + segSpan - 2
        const seg      = ringSegPath(half, half, outerR, innerR, startDeg, endDeg)
        const vis      = segmentsVisible[i]
        return (
          <path
            key={dayNum}
            d={seg}
            fill={getPhaseColor(dayNum)}
            style={{
              opacity:         vis ? 0.9 : 0,
              transform:       vis ? 'scale(1)' : 'scale(0.85)',
              transformOrigin: `${half}px ${half}px`,
              transition:      'opacity 0.3s ease, transform 0.3s ease',
            }}
          />
        )
      })}
    </svg>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function AwakeningScreen() {
  const navigate       = useNavigate()
  const canvasRef      = useRef(null)
  const holdRafRef     = useRef(null)
  const holdStartRef   = useRef(null)
  const journeyNoteRef = useRef('')

  // ── Data reads ─────────────────────────────────────────────────────────────
  const _rawDays      = JSON.parse(localStorage.getItem('flowstate_completed_days') || '[]')
  const completedDays = _rawDays.map(d =>
    typeof d === 'number' ? { day: d, completedAt: 0, dayOfWeek: 0 } : d
  )
  const _rawRefl    = JSON.parse(localStorage.getItem('flowstate_reflections') || '{}')
  const reflections = Array.isArray(_rawRefl)
    ? _rawRefl.reduce((acc, r) => ({ ...acc, [r.day]: r }), {})
    : (_rawRefl || {})
  const subtrackKey = localStorage.getItem('flowstate_selected_subtrack')

  const hasAnyReflections    = Object.keys(reflections).filter(k => k !== 'journey').length > 0
  const hasJourneyReflection = reflections['journey'] !== undefined
  const nextStage            = (hasJourneyReflection || hasAnyReflections) ? 3 : 2

  // ── State ──────────────────────────────────────────────────────────────────
  const [allDays,         setAllDays]         = useState([])
  const [stage,           setStage]           = useState(1)
  const [segVis,          setSegVis]          = useState(Array(21).fill(false))
  const [showTitle,       setShowTitle]       = useState(false)
  const [showSubline,     setShowSubline]     = useState(false)
  const [showScroll,      setShowScroll]      = useState(false)
  const [selectedFeeling, setSelectedFeeling] = useState(null)
  const [journeyNote,     setJourneyNote]     = useState('')
  const [holdProgress,    setHoldProgress]    = useState(0)
  const [isHolding,       setIsHolding]       = useState(false)

  useEffect(() => { journeyNoteRef.current = journeyNote }, [journeyNote])

  // ── Supabase fetch ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!subtrackKey) return
    const UUID_RE    = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const subtrackId = UUID_RE.test(subtrackKey) ? subtrackKey : SUBTRACK_IDS[subtrackKey]
    if (!subtrackId) return
    supabase
      .from('curriculum_days')
      .select('day_number, task_title')
      .eq('subtrack_id', subtrackId)
      .order('day_number', { ascending: true })
      .then(({ data }) => { if (data) setAllDays(data) })
  }, []) // eslint-disable-line

  // ── Particle canvas ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    const ctx  = canvas.getContext('2d')
    const dots = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
    }))
    let animId
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(255,79,216,0.15)'
      dots.forEach(dot => {
        dot.x += dot.vx; dot.y += dot.vy
        if (dot.x < 0) dot.x = canvas.width; else if (dot.x > canvas.width) dot.x = 0
        if (dot.y < 0) dot.y = canvas.height; else if (dot.y > canvas.height) dot.y = 0
        ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2); ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  // ── Stage 1 animation sequence ─────────────────────────────────────────────
  useEffect(() => {
    const timers = []
    for (let i = 0; i < 21; i++) {
      timers.push(setTimeout(() => {
        setSegVis(prev => { const n = [...prev]; n[i] = true; return n })
      }, i * 40))
    }
    timers.push(setTimeout(() => setShowTitle(true), 1640))
    timers.push(setTimeout(() => setShowSubline(true), 3340))
    timers.push(setTimeout(() => { if (nextStage === 3) setShowScroll(true) }, 2000))
    timers.push(setTimeout(() => setStage(nextStage), 2500))
    return () => timers.forEach(clearTimeout)
  }, []) // eslint-disable-line

  // ── Truth calculations ─────────────────────────────────────────────────────
  const effortRank = { crushed: 4, showed: 3, struggled: 2, almost: 1 }

  const bestDay = completedDays.length > 0
    ? completedDays.reduce((best, d) => {
        const rank = effortRank[reflections[d.day]?.feeling] || 0
        return rank >= (effortRank[reflections[best?.day]?.feeling] || 0) ? d : best
      }, completedDays[completedDays.length - 1])
    : null

  const bestDayTitle = allDays.find(d => d.day_number === bestDay?.day)?.task_title || ''

  const hardDays = completedDays.filter(d =>
    ['struggled', 'almost'].includes(reflections[d.day]?.feeling)
  )
  let hardestLine = ''
  if (hardDays.length > 0) {
    const worst = hardDays.reduce((h, d) =>
      (effortRank[reflections[d.day]?.feeling] || 0) < (effortRank[reflections[h.day]?.feeling] || 0) ? d : h
    )
    hardestLine = `Day ${worst.day} tested you. You stayed.`
  } else {
    const sorted = [...completedDays].sort((a, b) => (a.completedAt || 0) - (b.completedAt || 0))
    let maxGap = 0, gapDay = null
    for (let i = 1; i < sorted.length; i++) {
      const gap = (sorted[i].completedAt || 0) - (sorted[i - 1].completedAt || 0)
      if (gap > maxGap) { maxGap = gap; gapDay = sorted[i] }
    }
    hardestLine = gapDay ? `Day ${gapDay.day} had the longest gap. You came back.` : 'You never let a day slip.'
  }

  const dayCounts    = Array(7).fill(0)
  completedDays.forEach(d => { if (typeof d.dayOfWeek === 'number') dayCounts[d.dayOfWeek]++ })
  const maxCount     = Math.max(...dayCounts, 0)
  const powerDayIdx  = dayCounts.indexOf(maxCount)
  const DAY_NAMES    = ['Sundays','Mondays','Tuesdays','Wednesdays','Thursdays','Fridays','Saturdays']
  const powerDayLine = maxCount > 0 ? `You show up most on ${DAY_NAMES[powerDayIdx]}.` : 'You built your own rhythm.'
  const trackName    = SUBTRACK_NAMES[subtrackKey] || 'track'

  // ── Hold-to-confirm ────────────────────────────────────────────────────────
  function startHold() {
    if (!selectedFeeling || isHolding) return
    setIsHolding(true)
    holdStartRef.current = Date.now()
    function tick() {
      const progress = Math.min((Date.now() - holdStartRef.current) / 2000, 1)
      setHoldProgress(progress)
      if (progress < 1) {
        holdRafRef.current = requestAnimationFrame(tick)
      } else {
        const raw    = JSON.parse(localStorage.getItem('flowstate_reflections') || '{}')
        const normed = Array.isArray(raw) ? raw.reduce((a, r) => ({ ...a, [r.day]: r }), {}) : (raw || {})
        localStorage.setItem('flowstate_reflections', JSON.stringify({
          ...normed,
          journey: { feeling: selectedFeeling, note: journeyNoteRef.current, savedAt: Date.now() },
        }))
        setStage(3)
      }
    }
    holdRafRef.current = requestAnimationFrame(tick)
  }

  function cancelHold() {
    if (!isHolding) return
    cancelAnimationFrame(holdRafRef.current)
    setIsHolding(false)
    setHoldProgress(0)
  }

  // ── Shared styles ──────────────────────────────────────────────────────────
  const sLabel = {
    fontSize: 10, fontWeight: 500, letterSpacing: '0.25em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: HK,
  }

  const truthCards = [
    {
      label: 'YOUR STRONGEST', color: SURGE,
      text: bestDayTitle
        ? `Day ${bestDay?.day} — ${bestDayTitle} — that was your peak.`
        : `Day ${bestDay?.day || completedDays.length} was your strongest.`,
    },
    { label: 'YOUR TEST',   color: GLACIAL, text: hardestLine  },
    { label: 'YOUR RHYTHM', color: PLASMA,  text: powerDayLine },
  ]

  const pathCards = [
    { color: SURGE,  label: 'GO DEEPER',            headline: `Take your ${trackName} further.`, subline: 'Meet your guide.',                     onClick: () => navigate('/experts'),     delay: 1.4 },
    { color: GLACIAL,label: 'BUILD SOMETHING NEW',   headline: 'Choose your next 21 days.',        subline: 'One circuit closes. Another begins.', onClick: () => navigate('/track-select'), delay: 1.6 },
    { color: PLASMA, label: 'GIVE IT BACK',          headline: 'Share what changed.',               subline: 'Someone needs to hear it.',           onClick: () => navigate('/community'),   delay: 1.8 },
  ]

  const feelingOptions = [
    { label: 'Crushed it',        feeling: 'crushed',   phaseDay: 1  },
    { label: 'Showed up',         feeling: 'showed',    phaseDay: 8  },
    { label: 'Struggled through', feeling: 'struggled', phaseDay: 15 },
    { label: 'Almost quit',       feeling: 'almost',    phaseDay: 21 },
  ]

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', maxWidth: 480, margin: '0 auto', background: ABYSS, position: 'relative' }}>

      {/* Plasma particle canvas */}
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── STAGE 1: THE AWAKENING ──────────────────────────────────────── */}
        {stage === 1 && (
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', position: 'relative' }}>
            {/* Aura + ring */}
            <div style={{ position: 'relative', marginBottom: 48 }}>
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                width: 280, height: 280, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,79,216,0.15) 0%, transparent 70%)',
                animation: 'plasmaAura 3s ease-in-out infinite',
              }} />
              <CircuitRing size={220} segmentsVisible={segVis} />
            </div>

            <motion.div
              animate={{ opacity: showTitle ? 1 : 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: 'center', marginBottom: 16 }}
            >
              <div style={{ fontFamily: HK, fontWeight: 800, fontSize: 'clamp(28px, 5vw, 40px)', color: ARC_LIGHT, letterSpacing: '0.05em', lineHeight: 1.1 }}>
                YOU ARE AWAKENED.
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: showSubline ? 1 : 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', fontFamily: HK, lineHeight: 1.6 }}>
                The system is built.<br />The path is yours.
              </div>
            </motion.div>

            {nextStage === 3 && (
              <motion.div
                animate={{ opacity: showScroll ? 1 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ position: 'absolute', bottom: 40, fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: HK, letterSpacing: '0.15em', animation: showScroll ? 'scrollBounce 1.5s ease-in-out infinite' : 'none' }}
              >
                ↓ See what you built
              </motion.div>
            )}
          </div>
        )}

        {/* ── STAGE 2: FINAL REFLECTION ───────────────────────────────────── */}
        {stage === 2 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            style={{ minHeight: '100vh', padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ marginBottom: 40 }}>
              <CircuitRing size={120} segmentsVisible={Array(21).fill(true)} />
            </div>

            <div style={{ width: '100%', maxWidth: 420 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontFamily: HK, marginBottom: 8 }}>
                Before we show you what you built —
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'white', fontFamily: HK, marginBottom: 32, lineHeight: 1.3 }}>
                How did these 21 days feel?
              </div>

              {feelingOptions.map(({ label, feeling, phaseDay }) => {
                const phColor = getPhaseColor(phaseDay)
                const sel     = selectedFeeling === feeling
                return (
                  <button
                    key={feeling}
                    onClick={() => setSelectedFeeling(feeling)}
                    style={{
                      display: 'block', width: '100%', marginBottom: 8,
                      padding: '14px 20px',
                      background: sel ? `${phColor}1F` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${sel ? phColor + '66' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 12, color: sel ? phColor : 'white',
                      fontSize: 14, fontFamily: HK, textAlign: 'left', cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {label}
                  </button>
                )
              })}

              <AnimatePresence>
                {selectedFeeling && (
                  <motion.div key="note" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <textarea
                      value={journeyNote}
                      onChange={e => setJourneyNote(e.target.value)}
                      placeholder="Anything you want to remember from this journey?"
                      style={{
                        display: 'block', width: '100%', minHeight: 100, marginTop: 16,
                        boxSizing: 'border-box', background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12,
                        padding: 16, color: 'white', fontSize: 14, fontFamily: HK,
                        resize: 'none', outline: 'none', lineHeight: 1.6,
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {selectedFeeling && (
                  <motion.div key="hold-btn" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: 0.1 }} style={{ marginTop: 24 }}>
                    <button
                      onPointerDown={startHold} onPointerUp={cancelHold} onPointerLeave={cancelHold}
                      style={{
                        width: '100%', height: 56, borderRadius: 28,
                        background: SURGE, color: ABYSS,
                        fontSize: 15, fontWeight: 700, fontFamily: HK,
                        border: 'none', cursor: 'pointer',
                        position: 'relative', overflow: 'hidden',
                        userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'none',
                      }}
                    >
                      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${holdProgress * 100}%`, background: ARC_LIGHT, opacity: 0.35, borderRadius: 28 }} />
                      <span style={{ position: 'relative', zIndex: 1 }}>
                        {isHolding ? 'Hold to reveal...' : 'Show me what I built'}
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ── STAGE 3: THE MIRROR + THE PUSH (same scroll) ───────────────── */}
        {stage === 3 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            style={{ padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {/* Grounded small ring */}
            <div style={{ marginBottom: 32 }}>
              <CircuitRing size={80} segmentsVisible={Array(21).fill(true)} />
            </div>

            <div style={{ ...sLabel, marginBottom: 24, textAlign: 'center' }}>WHAT YOU BUILT</div>

            {/* Truth cards */}
            <div style={{ width: '100%' }}>
              {truthCards.map((truth, i) => (
                <motion.div
                  key={truth.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: 'relative', background: FATHOM, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px 24px', marginBottom: 12, overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: truth.color, borderRadius: '3px 0 0 3px' }} />
                  <div style={{ fontSize: 10, color: truth.color, fontFamily: HK, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
                    {truth.label}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.9)', fontFamily: HK, lineHeight: 1.5 }}>
                    {truth.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)', margin: '32px 0' }}
            />

            {/* The Push */}
            <div style={{ width: '100%', paddingBottom: 60 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'white', fontFamily: HK, textAlign: 'center', marginBottom: 32, lineHeight: 1.3 }}>
                What do you do with this?
              </div>

              {pathCards.map(path => (
                <motion.div
                  key={path.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: path.delay, ease: [0.22, 1, 0.36, 1] }}
                  onClick={path.onClick}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ background: FATHOM, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24, marginBottom: 12, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: path.color, flexShrink: 0 }} />
                      <div style={{ fontSize: 10, color: path.color, letterSpacing: '0.25em', fontFamily: HK, fontWeight: 500, textTransform: 'uppercase' }}>
                        {path.label}
                      </div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'white', fontFamily: HK, marginBottom: 4, lineHeight: 1.3 }}>{path.headline}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontFamily: HK, lineHeight: 1.5 }}>{path.subline}</div>
                  </div>
                  <div style={{ fontSize: 20, color: path.color, marginLeft: 20, flexShrink: 0 }}>→</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </div>

      <style>{`
        @keyframes plasmaAura {
          0%, 100% { transform: translate(-50%, -50%) scale(1);    opacity: 0.6; }
          50%       { transform: translate(-50%, -50%) scale(1.15); opacity: 0.3; }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0);   }
          50%       { transform: translateY(6px); }
        }
      `}</style>
    </div>
  )
}
