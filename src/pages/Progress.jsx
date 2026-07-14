import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { SUBTRACK_NAMES, SUBTRACK_IDS } from '../lib/curriculum'
import PageTransition from '../components/PageTransition'
import { useJourneyStore } from '../lib/journeyStore'

// ── V2 Colors ──────────────────────────────────────────────────────────────────
const ABYSS    = '#07090D'
const FATHOM   = '#0F141A'
const SURGE    = '#3DF5A6'
const GLACIAL  = '#82D4FF'
const PLASMA   = '#FF4FD8'
const ARC_LIGHT = '#EAFFF5'

const HK = '"Hanken Grotesk", sans-serif'

// ── Helpers ────────────────────────────────────────────────────────────────────
function getPhaseColor(day) {
  if (day <= 7)  return GLACIAL
  if (day <= 14) return SURGE
  return PLASMA
}

function calculateMomentum(completedDays, streak, reflections) {
  const base            = completedDays.length * 4
  const streakBonus     = streak * 2
  const reflBonus       = Object.keys(reflections).length * 3
  return Math.min(base + streakBonus + reflBonus, 100)
}

function getMomentumLine(score) {
  if (score <= 30) return 'The foundation is forming.'
  if (score <= 60) return "You're building real momentum."
  if (score <= 90) return 'The circuit is alive.'
  return 'You are the current.'
}

// Cubic bezier: M 40 200 C 120 200, 160 80, 320 40
// P0=(40,200) P1=(120,200) P2=(160,80) P3=(320,40)
function getCubicPoint(t) {
  const mt = 1 - t
  return {
    x: mt*mt*mt*40  + 3*mt*mt*t*120 + 3*mt*t*t*160 + t*t*t*320,
    y: mt*mt*mt*200 + 3*mt*mt*t*200 + 3*mt*t*t*80  + t*t*t*40,
  }
}

// DNA ring arc path helper
function polarToCart(cx, cy, r, deg) {
  const rad = (deg - 90) * (Math.PI / 180)
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function ringSegPath(cx, cy, outerR, innerR, startDeg, endDeg) {
  const o1    = polarToCart(cx, cy, outerR, startDeg)
  const o2    = polarToCart(cx, cy, outerR, endDeg)
  const i2    = polarToCart(cx, cy, innerR, endDeg)
  const i1    = polarToCart(cx, cy, innerR, startDeg)
  const large = (endDeg - startDeg) > 180 ? 1 : 0
  return [
    `M${o1.x.toFixed(2)},${o1.y.toFixed(2)}`,
    `A${outerR},${outerR},0,${large},1,${o2.x.toFixed(2)},${o2.y.toFixed(2)}`,
    `L${i2.x.toFixed(2)},${i2.y.toFixed(2)}`,
    `A${innerR},${innerR},0,${large},0,${i1.x.toFixed(2)},${i1.y.toFixed(2)}`,
    'Z',
  ].join(' ')
}

// ── Icons ──────────────────────────────────────────────────────────────────────
function BackArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CheckIcon({ color = SURGE, size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Progress() {
  const navigate = useNavigate()

  // ── Data reads ───────────────────────────────────────────────────────────────
  const { journey, currentDay, streak, completedDays } = useJourneyStore()
  const subtractId = journey?.subtrack_id ?? null

  // Normalize reflections — Home stores as array, we key by day number
  const _reflRaw   = JSON.parse(localStorage.getItem('flowstacy_reflections') || '[]')
  const reflections = Array.isArray(_reflRaw)
    ? _reflRaw.reduce((acc, r) => ({ ...acc, [r.day]: r }), {})
    : (_reflRaw || {})

  // ── State ────────────────────────────────────────────────────────────────────
  const [curriculumDays, setCurriculumDays] = useState([])
  const [loading,        setLoading]        = useState(true)
  const [displayScore,   setDisplayScore]   = useState(0)
  const [selectedDot,    setSelectedDot]    = useState(null)
  const [arcPathLength,  setArcPathLength]  = useState(0)
  const [arcDashOffset,  setArcDashOffset]  = useState(2000)
  const [dotsVisible,    setDotsVisible]    = useState(false)
  const [tempBarLeft,    setTempBarLeft]    = useState('0%')
  const [dnaVisible,     setDnaVisible]     = useState(false)
  const [energyReady,    setEnergyReady]    = useState(false)
  const [flippedCards,   setFlippedCards]   = useState(new Set())

  const canvasRef  = useRef(null)
  const arcPathRef = useRef(null)

  const momentumScore = calculateMomentum(completedDays, streak, reflections)

  // ── Supabase fetch (logic unchanged) ─────────────────────────────────────────
  useEffect(() => {
    if (!subtractId) { setLoading(false); return }
    const UUID_RE   = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const subtrackId = UUID_RE.test(subtractId) ? subtractId : SUBTRACK_IDS[subtractId]
    if (!subtrackId) { setLoading(false); return }
    supabase
      .from('curriculum_days')
      .select('day_number, task_title, duration_minutes')
      .eq('subtrack_id', subtrackId)
      .order('day_number', { ascending: true })
      .then(({ data }) => {
        if (data) setCurriculumDays(data)
        setLoading(false)
      })
  }, [subtractId])

  // ── Momentum count-up ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (momentumScore === 0) return
    let current = 0
    const step  = Math.max(1, Math.ceil(momentumScore / 30))
    const timer = setInterval(() => {
      current = Math.min(current + step, momentumScore)
      setDisplayScore(current)
      if (current >= momentumScore) clearInterval(timer)
    }, 33)
    return () => clearInterval(timer)
  }, [momentumScore])

  // ── Particle canvas (fixed) ───────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d')
    const dots = Array.from({ length: 30 }, () => ({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      size: Math.random() + 1,
      vx:   (Math.random() - 0.5) * 0.4,
      vy:   (Math.random() - 0.5) * 0.4,
    }))
    let animId
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(61,245,166,0.12)'
      dots.forEach(dot => {
        dot.x += dot.vx; dot.y += dot.vy
        if (dot.x < 0) dot.x = canvas.width
        else if (dot.x > canvas.width) dot.x = 0
        if (dot.y < 0) dot.y = canvas.height
        else if (dot.y > canvas.height) dot.y = 0
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2)
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  // ── Arc draw + cascade reveals ────────────────────────────────────────────────
  useEffect(() => {
    const el = arcPathRef.current
    if (!el) return
    const len = el.getTotalLength()
    setArcPathLength(len)
    setArcDashOffset(len)
    // Only draw the arc up to where the user currently is
    const progress = Math.max(0, Math.min(1, (currentDay - 1) / 20))
    const targetOffset = len * (1 - progress)
    const t1 = setTimeout(() => setArcDashOffset(targetOffset), 80)
    const t2 = setTimeout(() => setDotsVisible(true),  1700)
    const t3 = setTimeout(() => setTempBarLeft(`${temperatureScore * 100}%`), 600)
    const t4 = setTimeout(() => setDnaVisible(true),   800)
    const t5 = setTimeout(() => setEnergyReady(true),  900)
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout)
  }, []) // eslint-disable-line

  // ── Computed values ───────────────────────────────────────────────────────────
  const completedCount = completedDays.length

  const thisWeekDays   = completedDays.filter(d => d >= Math.max(1, currentDay - 6) && d <= currentDay)
  const thisWeekPoints = thisWeekDays.length * 4

  // Temperature = recent consistency (50%) + streak rate (30%) + reflection rate (20%)
  const recentRate   = thisWeekDays.length / Math.min(7, Math.max(1, currentDay - 1))
  const streakRate   = streak / Math.max(1, Math.min(currentDay - 1, 21))
  const reflCount    = Object.keys(reflections).length
  const reflRate     = completedCount > 0 ? reflCount / completedCount : 0
  const temperatureScore = Math.min(1, recentRate * 0.5 + streakRate * 0.3 + reflRate * 0.2)

  const tempLabel = temperatureScore >= 0.8
    ? 'You\'re on fire. Don\'t stop now.'
    : temperatureScore >= 0.5
    ? 'Solid momentum. Keep showing up.'
    : temperatureScore >= 0.2
    ? 'Starting to build. Stay consistent.'
    : 'Light the spark. One day at a time.'

  const phases = [
    { name: 'Foundation', range: 'Days 1–7',   start: 1,  end: 7,  color: GLACIAL,
      border: 'rgba(130,212,255,0.15)', activeBorder: 'rgba(130,212,255,0.35)',
      glow: 'rgba(130,212,255,0.08)' },
    { name: 'Build',      range: 'Days 8–14',  start: 8,  end: 14, color: SURGE,
      border: 'rgba(61,245,166,0.15)',  activeBorder: 'rgba(61,245,166,0.35)',
      glow: 'rgba(61,245,166,0.08)' },
    { name: 'Commit',     range: 'Days 15–21', start: 15, end: 21, color: PLASMA,
      border: 'rgba(255,79,216,0.15)',  activeBorder: 'rgba(255,79,216,0.35)',
      glow: 'rgba(255,79,216,0.08)' },
  ]

  // Energy map
  const DAY_NAMES  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dayCounts  = Array(7).fill(0)
  completedDays.forEach(d => { if (typeof d.dayOfWeek === 'number') dayCounts[d.dayOfWeek]++ })
  const maxCount   = Math.max(...dayCounts, 1)
  const powerDay   = dayCounts.indexOf(Math.max(...dayCounts))
  const hasPowerDay = dayCounts[powerDay] > 0

  // Weekday completion counts for DNA brightness
  const wdCounts = Array(7).fill(0)
  completedDays.forEach(d => { if (typeof d.dayOfWeek === 'number') wdCounts[d.dayOfWeek]++ })

  // Chart: cumulative momentum per day (uses .day)
  const chartW   = 300
  const chartH   = 80
  const chartPad = 10
  const toX = i => chartPad + (i / 20) * (chartW - chartPad * 2)
  const toY = v => chartH - chartPad - (v / 100) * (chartH - chartPad * 2)

  const chartPts = Array.from({ length: 21 }, (_, i) => {
    const done = completedDays.filter(d => d <= i + 1).length
    return Math.min(done * 4, 100)
  })
  const linePath = `M ${toX(0)} ${toY(chartPts[0])} ` +
    chartPts.slice(1).map((v, i) => `L ${toX(i + 1)} ${toY(v)}`).join(' ')
  const areaPath = linePath +
    ` L ${toX(20)} ${chartH} L ${toX(0)} ${chartH} Z`

  // Sorted completed days for Reflection Replay
  const sortedCompleted = [...completedDays].sort((a, b) => a - b)

  // ── Section label style ───────────────────────────────────────────────────────
  const sLabel = {
    fontSize: 10, fontWeight: 500, letterSpacing: '0.25em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
    fontFamily: HK,
  }

  function toggleFlip(day) {
    setFlippedCards(prev => {
      const next = new Set(prev)
      next.has(day) ? next.delete(day) : next.add(day)
      return next
    })
  }

  return (
    <PageTransition>
      <div
        onClick={() => selectedDot && setSelectedDot(null)}
        style={{ minHeight: '100%', maxWidth: 480, margin: '0 auto', position: 'relative', background: ABYSS }}
      >
        {/* ── Particle canvas ──────────────────────────────────────────────── */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'fixed', top: 0, left: 0,
            width: '100%', height: '100%',
            zIndex: 0, pointerEvents: 'none',
          }}
        />

        {/* ── All content ──────────────────────────────────────────────────── */}
        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* ── HEADER ───────────────────────────────────────────────────────── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 'max(48px, env(safe-area-inset-top, 48px))',
            paddingBottom: 16,
            paddingLeft: 20,
            paddingRight: 20,
            position: 'sticky', top: 0, zIndex: 10,
            background: 'rgba(7,9,13,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}>
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <div style={{ ...sLabel, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>YOUR JOURNEY</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.95)', fontFamily: HK, lineHeight: 1.2 }}>
                The Ascent
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 4, fontFamily: HK }}>
                {getMomentumLine(momentumScore)}
              </div>
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: SURGE, fontFamily: HK, lineHeight: 1 }}>
                {displayScore}
              </div>
              <div style={{ ...sLabel, letterSpacing: '0.2em', marginTop: 2 }}>MOMENTUM</div>
            </div>
          </div>

          <div style={{ paddingBottom: 100 }}>

            {/* ── ASCENT ARC ───────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ width: '100%', height: 260, position: 'relative' }}
            >
              <svg
                viewBox="0 0 360 240"
                width="100%" height="260"
                style={{ display: 'block', overflow: 'visible' }}
              >
                <defs>
                  {/* Phase gradient: GLACIAL → SURGE → PLASMA along the arc left→right */}
                  <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"    stopColor={GLACIAL} />
                    <stop offset="33%"   stopColor={GLACIAL} />
                    <stop offset="50%"   stopColor={SURGE} />
                    <stop offset="66%"   stopColor={SURGE} />
                    <stop offset="100%"  stopColor={PLASMA} />
                  </linearGradient>
                </defs>

                {/* Faint track */}
                <path
                  key="arc-track"
                  d="M 40 200 C 120 200, 160 80, 320 40"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1.5"
                  fill="none"
                />

                {/* Animated arc — phase-colored, draws to current day only */}
                <path
                  key="arc-line"
                  ref={arcPathRef}
                  d="M 40 200 C 120 200, 160 80, 320 40"
                  stroke="url(#arcGrad)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={arcPathLength || 2000}
                  strokeDashoffset={arcDashOffset}
                  style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                />

                {/* Phase labels */}
                <text key="label-f" x="30" y="218" textAnchor="start"
                  style={{ fontFamily: HK, fontSize: 8, fill: GLACIAL, letterSpacing: '0.2em' }}>
                  FOUNDATION
                </text>
                <text key="label-b" x="175" y="95" textAnchor="middle"
                  style={{ fontFamily: HK, fontSize: 8, fill: SURGE, letterSpacing: '0.2em' }}>
                  BUILD
                </text>
                <text key="label-c" x="295" y="35" textAnchor="middle"
                  style={{ fontFamily: HK, fontSize: 8, fill: PLASMA, letterSpacing: '0.2em' }}>
                  COMMIT
                </text>

                {/* 21 dots along cubic bezier */}
                {Array.from({ length: 21 }, (_, i) => {
                  const t         = i / 20
                  const { x, y }  = getCubicPoint(t)
                  const dayNum    = i + 1
                  const isDone    = completedDays.includes(dayNum)
                  const isCurrent = dayNum === currentDay
                  const dotColor  = getPhaseColor(dayNum)
                  const dayData   = curriculumDays.find(d => d.day_number === dayNum)
                  const isSelected = selectedDot?.day === dayNum

                  return (
                    <g key={dayNum}>
                      {isCurrent ? (
                        <>
                          <motion.circle
                            cx={x} cy={y} r="8"
                            fill="none"
                            stroke={ARC_LIGHT}
                            strokeWidth="1.5"
                            animate={{ r: [8, 14], opacity: [0.8, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                            style={{ filter: 'drop-shadow(0 0 6px #EAFFF5)' }}
                          />
                          <circle cx={x} cy={y} r="5" fill={ARC_LIGHT}
                            style={{ filter: 'drop-shadow(0 0 4px #EAFFF5)' }} />
                        </>
                      ) : isDone ? (
                        <circle
                          cx={x} cy={y} r="5"
                          fill={dotColor}
                          opacity={dotsVisible ? 0.9 : 0}
                          style={{
                            cursor: 'pointer',
                            transition: `opacity 0.3s ease ${i * 50}ms, transform 0.3s ease ${i * 50}ms`,
                          }}
                          onClick={e => {
                            e.stopPropagation()
                            setSelectedDot({
                              day: dayNum, x, y, color: dotColor,
                              title: dayData?.task_title || `Day ${dayNum}`,
                            })
                          }}
                        />
                      ) : (
                        <circle cx={x} cy={y} r="4" fill="rgba(255,255,255,0.12)" />
                      )}

                      {/* Tooltip */}
                      {isSelected && (() => {
                        const label = (selectedDot.title || '').length > 22
                          ? selectedDot.title.slice(0, 22) + '…'
                          : (selectedDot.title || '')
                        const tipY = y < 60 ? y + 18 : y - 38
                        const tipX = Math.min(Math.max(x - 55, 4), 248)
                        return (
                          <g>
                            <rect x={tipX} y={tipY} width="112" height="26" rx="8"
                              fill={FATHOM} stroke={dotColor} strokeWidth="1" />
                            <text
                              x={tipX + 56} y={tipY + 17}
                              textAnchor="middle"
                              style={{ fontFamily: HK, fontSize: 10, fill: 'white' }}
                            >
                              Day {dayNum} · {label}
                            </text>
                          </g>
                        )
                      })()}
                    </g>
                  )
                })}
              </svg>
            </motion.div>

            {/* ── PHASE CARDS ──────────────────────────────────────────────── */}
            <div style={{ padding: '0 16px', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {phases.map((ph, i) => {
                  const done     = completedDays.filter(d => d >= ph.start && d <= ph.end).length
                  const pct      = Math.round((done / 7) * 100)
                  const isActive = currentDay >= ph.start && currentDay <= ph.end

                  return (
                    <motion.div
                      key={ph.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        flex: 1, minWidth: 0,
                        background: FATHOM,
                        border: `1px solid ${isActive ? ph.activeBorder : ph.border}`,
                        borderRadius: 16,
                        padding: '16px 12px',
                        boxShadow: isActive ? `0 0 20px ${ph.glow}` : 'none',
                        fontFamily: HK,
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 700, color: ph.color, marginBottom: 2 }}>{ph.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>{ph.range}</div>
                      <div style={{ fontSize: 28, fontWeight: 900, color: 'rgba(255,255,255,0.95)', lineHeight: 1, marginBottom: 10 }}>
                        {pct}%
                      </div>
                      <div style={{ height: 2, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                          style={{ height: '100%', background: ph.color, borderRadius: 2 }}
                        />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* ── TEMPERATURE BAR ──────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ padding: '0 20px', marginBottom: 28 }}
            >
              <div style={{ ...sLabel, marginBottom: 4 }}>MOMENTUM TEMPERATURE</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: HK, marginBottom: 14 }}>
                {tempLabel}
              </div>
              <div style={{
                position: 'relative', height: 4, borderRadius: 2,
                background: 'linear-gradient(to right, #82D4FF, #3DF5A6, #FF4FD8)',
                marginBottom: 8,
              }}>
                <div style={{
                  position: 'absolute', top: '50%',
                  left: tempBarLeft,
                  transform: 'translate(-50%, -50%)',
                  width: 12, height: 12, borderRadius: '50%',
                  background: ARC_LIGHT,
                  boxShadow: `0 0 8px ${ARC_LIGHT}`,
                  transition: 'left 1.2s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: GLACIAL, fontFamily: HK, fontWeight: 500 }}>GLACIAL</span>
                <span style={{ fontSize: 10, color: PLASMA,  fontFamily: HK, fontWeight: 500 }}>PLASMA</span>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: HK }}>
                  Recent: <span style={{ color: 'rgba(255,255,255,0.55)' }}>{Math.round(recentRate * 100)}%</span>
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: HK }}>
                  Streak: <span style={{ color: 'rgba(255,255,255,0.55)' }}>{Math.round(streakRate * 100)}%</span>
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: HK }}>
                  Reflection: <span style={{ color: 'rgba(255,255,255,0.55)' }}>{Math.round(reflRate * 100)}%</span>
                </div>
              </div>
            </motion.div>

            {/* ── STREAK DNA RING ───────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ padding: '0 20px', marginBottom: 28 }}
            >
              <div style={{ ...sLabel, marginBottom: 4 }}>YOUR DNA</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: HK, marginBottom: 16 }}>
                Your consistency pattern
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <svg width="200" height="200" viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
                  {/* 21 segments */}
                  {Array.from({ length: 21 }, (_, i) => {
                    const dayNum     = i + 1
                    const segSpan    = 360 / 21
                    const startDeg   = i * segSpan
                    const endDeg     = startDeg + segSpan - 2
                    const isDone     = completedDays.includes(dayNum)
                    const isCurrent  = dayNum === currentDay
                    const phColor    = getPhaseColor(dayNum)
                    const wdCount    = 0
                    const segOpacity = isCurrent ? 1 : isDone ? (wdCount > 1 ? 0.9 : 0.7) : 1
                    const segFill    = isCurrent ? ARC_LIGHT : isDone ? phColor : 'rgba(255,255,255,0.06)'
                    const segPath    = ringSegPath(100, 100, 90, 68, startDeg, endDeg)

                    if (isCurrent) {
                      return (
                        <motion.path
                          key={dayNum}
                          d={segPath}
                          fill={segFill}
                          animate={{ opacity: [1, 0.35, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          style={{ filter: 'drop-shadow(0 0 4px #EAFFF5)' }}
                        />
                      )
                    }
                    return (
                      <path
                        key={dayNum}
                        d={segPath}
                        fill={segFill}
                        opacity={dnaVisible ? segOpacity : 0}
                        style={{ transition: `opacity 0.3s ease ${i * 30}ms` }}
                      />
                    )
                  })}

                  {/* Inner donut hole */}
                  <circle key="dna-hole" cx="100" cy="100" r="67" fill={ABYSS} />

                  {/* Center text */}
                  <text key="dna-count" x="100" y="96" textAnchor="middle"
                    style={{ fontFamily: HK, fontSize: 18, fontWeight: 900, fill: ARC_LIGHT }}>
                    {completedCount}/21
                  </text>
                  <text key="dna-label" x="100" y="112" textAnchor="middle"
                    style={{ fontFamily: HK, fontSize: 9, fill: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                    DAYS
                  </text>
                </svg>
              </div>
            </motion.div>

            {/* ── ENERGY MAP ────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ padding: '0 20px', marginBottom: 28 }}
            >
              <div style={{ ...sLabel, marginBottom: 8 }}>YOUR ENERGY MAP</div>

              <div style={{ fontSize: 12, color: hasPowerDay ? SURGE : 'rgba(255,255,255,0.3)', fontFamily: HK, marginBottom: 20 }}>
                {hasPowerDay
                  ? `You show up most on ${DAY_NAMES[powerDay]}s.`
                  : 'Complete days to reveal your pattern.'}
              </div>

              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 88 }}>
                {DAY_NAMES.map((name, wi) => {
                  const count  = dayCounts[wi]
                  const barH   = count > 0 ? Math.max(4, (count / maxCount) * 60) : 4
                  const isPower = wi === powerDay && count > 0
                  const barColor = isPower ? SURGE : count > 0 ? GLACIAL : 'rgba(255,255,255,0.06)'

                  return (
                    <div key={name} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: 60 }}>
                        <div style={{
                          width: '100%',
                          height: energyReady ? barH : 4,
                          background: barColor,
                          borderRadius: 4,
                          transition: `height 0.6s ease ${wi * 50}ms`,
                        }} />
                      </div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: HK }}>{name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: HK }}>{count}</div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* ── REFLECTION REPLAY ─────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ marginBottom: 28 }}
            >
              <div style={{ padding: '0 20px', ...sLabel, marginBottom: 4 }}>YOUR JOURNEY</div>
              <div style={{ padding: '0 20px', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: HK, marginBottom: 16 }}>
                Tap a day to read your reflection
              </div>

              {sortedCompleted.length === 0 ? (
                <div style={{ padding: '0 20px', fontSize: 13, color: 'rgba(255,255,255,0.25)', fontFamily: HK }}>
                  Complete your first day to unlock reflections.
                </div>
              ) : (
                <div style={{
                  display: 'flex', gap: 12, overflowX: 'auto',
                  padding: '0 20px 12px',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}>
                  {sortedCompleted.map((dayNum, i) => {
                    const phColor = getPhaseColor(dayNum)
                    const dayData = curriculumDays.find(d => d.day_number === dayNum)
                    const refl    = reflections[dayNum]
                    const isFlipped = flippedCards.has(dayNum)

                    return (
                      <motion.div
                        key={dayNum}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.06 }}
                        onClick={() => toggleFlip(dayNum)}
                        style={{
                          width: 140, height: 160, flexShrink: 0,
                          position: 'relative', cursor: 'pointer',
                          perspective: 600,
                        }}
                      >
                        <div style={{
                          position: 'absolute', inset: 0,
                          transition: 'transform 0.5s',
                          transformStyle: 'preserve-3d',
                          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}>
                          {/* Front */}
                          <div style={{
                            position: 'absolute', inset: 0,
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            background: FATHOM,
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 16, padding: 16,
                            display: 'flex', flexDirection: 'column',
                          }}>
                            <div style={{ width: 32, height: 2, background: phColor, borderRadius: 2, marginBottom: 12 }} />
                            <div style={{ fontSize: 10, color: phColor, letterSpacing: '0.2em', fontFamily: HK, marginBottom: 6 }}>
                              DAY {dayNum}
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)', fontFamily: HK, lineHeight: 1.4, flex: 1 }}>
                              {dayData?.task_title || `Day ${dayNum}`}
                            </div>
                            {refl?.feeling && (
                              <div style={{
                                marginTop: 8,
                                display: 'inline-block',
                                background: `${phColor}1F`,
                                color: phColor,
                                borderRadius: 20,
                                padding: '4px 10px',
                                fontSize: 10,
                                fontFamily: HK,
                                alignSelf: 'flex-start',
                              }}>
                                {refl.feeling}
                              </div>
                            )}
                          </div>

                          {/* Back */}
                          <div style={{
                            position: 'absolute', inset: 0,
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            background: FATHOM,
                            border: `1px solid ${phColor}33`,
                            borderRadius: 16, padding: 16,
                            display: 'flex', flexDirection: 'column',
                          }}>
                            <div style={{ ...sLabel, marginBottom: 10 }}>REFLECTION</div>
                            <div style={{
                              fontSize: 12, fontFamily: HK, lineHeight: 1.5, flex: 1,
                              color: refl?.note ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
                              fontStyle: refl?.note ? 'normal' : 'italic',
                              overflow: 'hidden',
                            }}>
                              {refl?.note || 'No reflection saved for this day.'}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>

            {/* ── MOMENTUM TRAJECTORY ───────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ padding: '0 16px' }}
            >
              <div style={{
                background: FATHOM,
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, padding: 20,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={sLabel}>MOMENTUM TRAJECTORY</span>
                  <span style={{ fontSize: 12, color: SURGE, fontFamily: HK }}>
                    +{thisWeekPoints} this week
                  </span>
                </div>

                <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" height="80" style={{ display: 'block', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="pgFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={SURGE} stopOpacity="0.15" />
                      <stop offset="100%" stopColor={SURGE} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={areaPath} fill="url(#pgFill)" />
                  <motion.path
                    d={linePath}
                    fill="none"
                    stroke={SURGE}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </svg>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
                  <svg width="10" height="10" viewBox="0 0 12 12">
                    <polygon points="6,0 12,6 6,12 0,6" fill={PLASMA} />
                  </svg>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: HK }}>
                    Best streak:{' '}
                    <span style={{ color: PLASMA, fontWeight: 700 }}>{streak} days</span>
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </PageTransition>
  )
}
