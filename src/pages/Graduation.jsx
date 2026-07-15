import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { SUBTRACK_IDS, SUBTRACK_NAMES } from '../lib/curriculum'
import { useJourneyStore } from '../lib/journeyStore'

const ABYSS    = '#07090D'
const SURGE    = '#3DF5A6'
const GLACIAL  = '#82D4FF'
const PLASMA   = '#FF4FD8'
const ARC_LIGHT = '#EAFFF5'
const HK       = '"Hanken Grotesk", sans-serif'

function getPhaseColor(day) {
  if (day <= 7)  return GLACIAL
  if (day <= 14) return SURGE
  return PLASMA
}

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

function Ring({ size, visibleSet }) {
  const cx = size / 2, cy = size / 2
  const scale = size / 260
  const outerR = 110 * scale
  const innerR = 90 * scale
  return (
    <svg
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {Array.from({ length: 21 }, (_, i) => {
        const day      = i + 1
        const segSpan  = 360 / 21
        const startDeg = i * segSpan
        const endDeg   = startDeg + segSpan - 2
        const d        = ringSegPath(cx, cy, outerR, innerR, startDeg, endDeg)
        const vis      = visibleSet[i]
        return (
          <path
            key={day}
            d={d}
            fill={getPhaseColor(day)}
            style={{
              opacity:         vis ? 0.9 : 0,
              transform:       vis ? 'scale(1)' : 'scale(0.82)',
              transformOrigin: `${cx}px ${cy}px`,
              transition:      'opacity 0.3s cubic-bezier(0.22,1,0.36,1), transform 0.3s cubic-bezier(0.22,1,0.36,1)',
            }}
          />
        )
      })}
    </svg>
  )
}

const ALL_LIT = Array(21).fill(true)

export default function AwakeningScreen() {
  const navigate        = useNavigate()
  const bgCanvasRef     = useRef(null)
  const burstCanvasRef  = useRef(null)
  const burstRef        = useRef([])
  const holdRafRef      = useRef(null)
  const holdStartRef    = useRef(null)
  const journeyNoteRef  = useRef('')
  const [hoveredRow, setHoveredRow] = useState(null)

  // ── Data reads ───────────────────────────────────────────────────────────────
  const { journey, completedDays: rawCompletedDays } = useJourneyStore()
  // Graduation expects {day, completedAt, dayOfWeek} shape; store holds plain integers.
  // completedAt and dayOfWeek are unavailable without a schema addition — default to 0.
  const completedDays = rawCompletedDays.map(d => ({ day: d, completedAt: 0, dayOfWeek: 0 }))

  // PLACEHOLDER: fallback copy — replace in Phase 4
  // Progress screen rework with real dynamic strings
  const [reflections, setReflections] = useState({})

  const subtractId  = journey?.subtrack_id ?? null
  const subtrackKey = subtractId
    ? (Object.keys(SUBTRACK_IDS).find(k => SUBTRACK_IDS[k] === subtractId) ?? null)
    : null

  const hasAnyReflections    = Object.keys(reflections).filter(k => k !== 'journey').length > 0
  const hasJourneyReflection = reflections['journey'] !== undefined
  const nextStage            = (hasJourneyReflection || hasAnyReflections) ? 3 : 2

  // ── State ────────────────────────────────────────────────────────────────────
  const [allDays,         setAllDays]         = useState([])
  const [stage,           setStage]           = useState(1)
  const [segVis,          setSegVis]          = useState(Array(21).fill(false))
  const [showTitle,       setShowTitle]       = useState(false)
  const [showSubline,     setShowSubline]     = useState(false)
  const [showScroll,      setShowScroll]      = useState(false)
  const [ringPulse,       setRingPulse]       = useState(false)
  const [selectedFeeling, setSelectedFeeling] = useState(null)
  const [journeyNote,     setJourneyNote]     = useState('')
  const [holdProgress,    setHoldProgress]    = useState(0)
  const [isHolding,       setIsHolding]       = useState(false)

  useEffect(() => { journeyNoteRef.current = journeyNote }, [journeyNote])

  // ── Supabase fetch ───────────────────────────────────────────────────────────
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

  // ── Fetch journey-level reflection from user_journeys.reflections ─────────────
  useEffect(() => {
    if (!journey?.id) return
    supabase
      .from('user_journeys')
      .select('reflections')
      .eq('id', journey.id)
      .single()
      .then(({ data }) => { if (data?.reflections) setReflections(data.reflections) })
  }, [journey?.id])

  // ── Background particle canvas ───────────────────────────────────────────────
  useEffect(() => {
    const canvas = bgCanvasRef.current
    if (!canvas) return
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    const ctx     = canvas.getContext('2d')
    const PCOLORS = [
      'rgba(61,245,166,0.2)',
      'rgba(255,79,216,0.15)',
      'rgba(130,212,255,0.15)',
    ]
    const dots = Array.from({ length: 50 }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      size:  1 + Math.random() * 2,
      vx:    (Math.random() - 0.5) * 0.3,
      vy:    (Math.random() - 0.5) * 0.3,
      color: PCOLORS[Math.floor(Math.random() * 3)],
    }))
    let id
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy
        if (d.x < 0) d.x = canvas.width;  else if (d.x > canvas.width)  d.x = 0
        if (d.y < 0) d.y = canvas.height; else if (d.y > canvas.height) d.y = 0
        ctx.fillStyle = d.color
        ctx.beginPath(); ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2); ctx.fill()
      })
      id = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(id)
  }, [])

  // ── Burst particle canvas ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = burstCanvasRef.current
    if (!canvas) return
    canvas.width = canvas.height = 260
    const ctx = canvas.getContext('2d')
    let id
    function draw() {
      ctx.clearRect(0, 0, 260, 260)
      const now = Date.now()
      burstRef.current = burstRef.current.filter(p => now - p.born < 400)
      burstRef.current.forEach(p => {
        const t    = (now - p.born) / 400
        const dist = p.speed * t
        ctx.globalAlpha = 1 - t
        ctx.fillStyle   = p.color
        ctx.beginPath()
        ctx.arc(
          p.x + Math.cos(p.angle) * dist,
          p.y + Math.sin(p.angle) * dist,
          2, 0, Math.PI * 2
        )
        ctx.fill()
      })
      ctx.globalAlpha = 1
      id = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(id)
  }, [])

  function fireBurst(i) {
    const day   = i + 1
    const color = getPhaseColor(day)
    const segSpan = 360 / 21
    const midDeg  = ((i * segSpan + segSpan / 2) - 90) * (Math.PI / 180)
    const r = 118
    const x = 130 + r * Math.cos(midDeg)
    const y = 130 + r * Math.sin(midDeg)
    const count = 4 + Math.floor(Math.random() * 3)
    for (let j = 0; j < count; j++) {
      burstRef.current.push({
        x, y,
        angle: midDeg + (Math.random() - 0.5) * (Math.PI / 2.5),
        speed: 20 + Math.random() * 20,
        color,
        born: Date.now(),
      })
    }
  }

  // ── Stage 1 animation sequence ───────────────────────────────────────────────
  useEffect(() => {
    const T = []
    for (let i = 0; i < 21; i++) {
      T.push(setTimeout(() => {
        setSegVis(prev => { const n = [...prev]; n[i] = true; return n })
        fireBurst(i)
      }, i * 40))
    }
    T.push(setTimeout(() => setRingPulse(true), 1500))
    T.push(setTimeout(() => setShowTitle(true), 2000))
    T.push(setTimeout(() => setShowSubline(true), 3000))
    T.push(setTimeout(() => setShowScroll(true), 3200))
    T.push(setTimeout(() => setStage(nextStage), 3500))
    return () => T.forEach(clearTimeout)
  }, []) // eslint-disable-line

  // ── Truth calculations ────────────────────────────────────────────────────────
  const effortRank = { crushed: 4, showed: 3, struggled: 2, almost: 1 }

  const bestDay = completedDays.length > 0
    ? completedDays.reduce((best, d) => {
        const rank     = effortRank[reflections[d.day]?.feeling] || 0
        const bestRank = effortRank[reflections[best?.day]?.feeling] || 0
        return rank >= bestRank ? d : best
      }, completedDays[completedDays.length - 1])
    : null

  const bestDayTitle = allDays.find(d => d.day_number === bestDay?.day)?.task_title || ''

  const hardDays = completedDays.filter(d =>
    ['struggled', 'almost'].includes(reflections[d.day]?.feeling)
  )
  let hardBase = '', hardAccent = ''
  if (hardDays.length > 0) {
    const worst = hardDays.reduce((h, d) =>
      (effortRank[reflections[d.day]?.feeling] || 0) <
      (effortRank[reflections[h.day]?.feeling] || 0) ? d : h
    )
    hardBase   = `Day ${worst.day} tested you. You `
    hardAccent = 'stayed.'
  } else {
    const sorted = [...completedDays].sort((a, b) => (a.completedAt || 0) - (b.completedAt || 0))
    let maxGap = 0, gapDay = null
    for (let i = 1; i < sorted.length; i++) {
      const gap = (sorted[i].completedAt || 0) - (sorted[i - 1].completedAt || 0)
      if (gap > maxGap) { maxGap = gap; gapDay = sorted[i] }
    }
    if (gapDay) {
      hardBase   = `Day ${gapDay.day} had the longest gap. You `
      hardAccent = 'came back.'
    } else {
      hardBase   = `You never let a day `
      hardAccent = 'slip.'
    }
  }

  const dayCounts   = Array(7).fill(0)
  completedDays.forEach(d => { if (typeof d.dayOfWeek === 'number') dayCounts[d.dayOfWeek]++ })
  const maxCount    = Math.max(...dayCounts, 0)
  const powerDayIdx = dayCounts.indexOf(maxCount)
  const DAY_NAMES   = ['Sundays','Mondays','Tuesdays','Wednesdays','Thursdays','Fridays','Saturdays']
  const trackName   = SUBTRACK_NAMES[subtrackKey] || 'track'

  // ── Hold-to-confirm ───────────────────────────────────────────────────────────
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
        const journeyReflection = { feeling: selectedFeeling, note: journeyNoteRef.current, savedAt: Date.now() }
        const updated = { ...reflections, journey: journeyReflection }
        if (journey?.id) {
          supabase
            .from('user_journeys')
            .update({ reflections: updated })
            .eq('id', journey.id)
            .then(() => {})
        }
        setReflections(updated)
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

  const feelingOptions = [
    { label: 'Crushed it',        feeling: 'crushed'   },
    { label: 'Showed up',         feeling: 'showed'    },
    { label: 'Struggled through', feeling: 'struggled' },
    { label: 'Almost quit',       feeling: 'almost'    },
  ]

  const paths = [
    { color: SURGE,   label: 'GO DEEPER',           headline: `Take your ${trackName} further.`, onClick: () => navigate('/experts'),      delay: 0     },
    { color: GLACIAL, label: 'BUILD SOMETHING NEW',  headline: 'Choose your next 21 days.',       onClick: () => navigate('/track-select'), delay: 0.15  },
    { color: PLASMA,  label: 'GIVE IT BACK',         headline: 'Share what changed.',             onClick: () => navigate('/community'),   delay: 0.3   },
  ]

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: ABYSS, minHeight: '100%', maxWidth: 480, margin: '0 auto', position: 'relative' }}>

      {/* Background drift particles */}
      <canvas
        ref={bgCanvasRef}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── STAGE 1 — THE EXPLOSION ─────────────────────────────────────── */}
        <div style={{
          minHeight: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '40px 28px', position: 'relative',
        }}>

          {/* Ring + aura + burst overlay */}
          <div style={{ position: 'relative', width: 260, height: 260, marginBottom: 40, flexShrink: 0 }}>

            {/* Plasma aura */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 320, height: 320, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,79,216,0.25) 0%, rgba(61,245,166,0.1) 50%, transparent 70%)',
              transform: 'translate(-50%,-50%) scale(0)',
              opacity: 0,
              animation: 'auraErupt 1s ease-out 1.5s forwards, auraBreathe 3s ease-in-out 2.5s infinite',
              zIndex: 0, pointerEvents: 'none',
            }} />

            {/* 21-segment ring */}
            <div style={{
              position: 'relative', zIndex: 1,
              animation: ringPulse ? 'ringPulse 0.6s ease-out' : 'none',
            }}>
              <Ring size={260} visibleSet={segVis} />
            </div>

            {/* Burst particle canvas */}
            <canvas
              ref={burstCanvasRef}
              style={{
                position: 'absolute', top: 0, left: 0,
                width: 260, height: 260,
                zIndex: 2, pointerEvents: 'none',
              }}
            />
          </div>

          {/* AWAKENED. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showTitle ? 1 : 0, y: showTitle ? 0 : 20 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', marginBottom: 16 }}
          >
            <div style={{
              fontFamily: HK, fontWeight: 900,
              fontSize: 'clamp(52px, 12vw, 80px)',
              color: ARC_LIGHT, letterSpacing: '0.06em', lineHeight: 1,
            }}>
              AWAKENED.
            </div>
          </motion.div>

          {/* Subline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showSubline ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontSize: 15, color: 'rgba(255,255,255,0.5)',
              fontFamily: HK, letterSpacing: '0.02em', lineHeight: 1.6,
            }}>
              The system is built. The path is yours.
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showScroll ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'absolute', bottom: 40,
              fontSize: 11, color: 'rgba(255,255,255,0.3)',
              fontFamily: HK, letterSpacing: '0.15em',
              animation: showScroll ? 'scrollBounce 2s ease-in-out infinite' : 'none',
            }}
          >
            ↓ See what you built
          </motion.div>
        </div>

        {/* ── STAGE 2 — FINAL REFLECTION ──────────────────────────────────── */}
        {stage === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{ padding: '48px 24px 80px' }}
          >
            {/* Small ring */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
              <Ring size={140} visibleSet={ALL_LIT} />
            </div>

            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: HK, marginBottom: 8 }}>
              Before we show you what you built —
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'white', fontFamily: HK, marginBottom: 32, lineHeight: 1.3 }}>
              How did these 21 days feel?
            </div>

            {feelingOptions.map(({ label, feeling }) => {
              const sel = selectedFeeling === feeling
              return (
                <button
                  key={feeling}
                  onClick={() => setSelectedFeeling(feeling)}
                  style={{
                    display: 'block', width: '100%', marginBottom: 8,
                    padding: '16px 20px',
                    background: sel ? 'rgba(61,245,166,0.08)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${sel ? 'rgba(61,245,166,0.35)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 12,
                    color: sel ? SURGE : 'white',
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
                <motion.div
                  key="reflection-form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <textarea
                    value={journeyNote}
                    onChange={e => setJourneyNote(e.target.value)}
                    placeholder="Anything you want to remember from this journey?"
                    style={{
                      display: 'block', width: '100%', boxSizing: 'border-box',
                      minHeight: 100, marginTop: 16, padding: 16,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 12, color: 'white', fontSize: 14,
                      fontFamily: HK, resize: 'none', outline: 'none', lineHeight: 1.6,
                    }}
                  />

                  <button
                    onPointerDown={startHold}
                    onPointerUp={cancelHold}
                    onPointerLeave={cancelHold}
                    style={{
                      marginTop: 24, width: '100%', height: 56, borderRadius: 28,
                      background: SURGE, color: ABYSS,
                      fontSize: 15, fontWeight: 700, fontFamily: HK,
                      border: 'none', cursor: 'pointer', position: 'relative',
                      overflow: 'hidden', userSelect: 'none',
                      WebkitUserSelect: 'none', touchAction: 'none',
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 0, left: 0, bottom: 0,
                      width: `${holdProgress * 100}%`,
                      background: ARC_LIGHT, opacity: 0.4,
                    }} />
                    <span style={{ position: 'relative', zIndex: 1 }}>
                      {isHolding ? 'Hold to reveal...' : 'Show me what I built'}
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── STAGE 3 — THE MIRROR ────────────────────────────────────────── */}
        {stage === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >

            {/* Three truths */}
            <div style={{ padding: '0 28px', marginTop: 80 }}>

              {/* Truth 01 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginBottom: 56 }}
              >
                <div style={{ fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.3em', fontFamily: HK, marginBottom: 12 }}>
                  01
                </div>
                <div style={{ fontSize: 'clamp(22px,5vw,32px)', fontWeight: 700, lineHeight: 1.3, color: 'white', fontFamily: HK }}>
                  {bestDayTitle ? (
                    <>Day {bestDay?.day} — {bestDayTitle} —<br />that was your <span style={{ color: SURGE }}>peak.</span></>
                  ) : (
                    <>Day {bestDay?.day || completedDays.length} was your <span style={{ color: SURGE }}>strongest.</span></>
                  )}
                </div>
              </motion.div>

              {/* Truth 02 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginBottom: 56 }}
              >
                <div style={{ fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.3em', fontFamily: HK, marginBottom: 12 }}>
                  02
                </div>
                <div style={{ fontSize: 'clamp(22px,5vw,32px)', fontWeight: 700, lineHeight: 1.3, color: 'white', fontFamily: HK }}>
                  {hardBase}<span style={{ color: GLACIAL }}>{hardAccent}</span>
                </div>
              </motion.div>

              {/* Truth 03 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginBottom: 0 }}
              >
                <div style={{ fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.3em', fontFamily: HK, marginBottom: 12 }}>
                  03
                </div>
                <div style={{ fontSize: 'clamp(22px,5vw,32px)', fontWeight: 700, lineHeight: 1.3, color: 'white', fontFamily: HK }}>
                  {maxCount > 0 ? (
                    <>You show up most on <span style={{ color: PLASMA }}>{DAY_NAMES[powerDayIdx]}.</span></>
                  ) : (
                    <>You built your own <span style={{ color: PLASMA }}>rhythm.</span></>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '48px 0' }} />

            {/* ── STAGE 4 — THE PUSH ────────────────────────────────────── */}
            <div style={{ padding: '0 28px', marginBottom: 80 }}>
              <div style={{
                fontSize: 'clamp(24px,5vw,36px)', fontWeight: 800,
                color: 'white', fontFamily: HK, marginBottom: 48, lineHeight: 1.2,
              }}>
                What do you do with this?
              </div>

              {paths.map(path => (
                <motion.div
                  key={path.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.7, delay: path.delay, ease: [0.22, 1, 0.36, 1] }}
                  onClick={path.onClick}
                  onMouseEnter={() => setHoveredRow(path.label)}
                  onMouseLeave={() => setHoveredRow(null)}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 28px',
                    margin: '0 -28px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: hoveredRow === path.label ? path.color + '0A' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  <div>
                    <div style={{
                      fontSize: 10, fontWeight: 500, letterSpacing: '0.25em',
                      color: path.color, fontFamily: HK, marginBottom: 6,
                      textTransform: 'uppercase',
                    }}>
                      {path.label}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'white', fontFamily: HK }}>
                      {path.headline}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 20, color: path.color, marginLeft: 20, flexShrink: 0,
                    animation: 'arrowPulse 1.5s ease-in-out infinite',
                  }}>
                    →
                  </div>
                </motion.div>
              ))}
            </div>

          </motion.div>
        )}

      </div>

      <style>{`
        @keyframes auraErupt {
          0%   { transform: translate(-50%,-50%) scale(0);   opacity: 0; }
          100% { transform: translate(-50%,-50%) scale(1.3); opacity: 1; }
        }
        @keyframes auraBreathe {
          0%, 100% { transform: translate(-50%,-50%) scale(1.3); opacity: 0.6; }
          50%       { transform: translate(-50%,-50%) scale(1.1); opacity: 0.3; }
        }
        @keyframes ringPulse {
          0%   { transform: scale(1);    }
          50%  { transform: scale(1.08); }
          100% { transform: scale(1);    }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0);   }
          50%       { transform: translateY(6px); }
        }
        @keyframes arrowPulse {
          0%, 100% { transform: translateX(0);   }
          50%       { transform: translateX(4px); }
        }
        textarea::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </div>
  )
}
