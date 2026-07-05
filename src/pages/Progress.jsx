import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'
import PageTransition from '../components/PageTransition'

// ── SVG Icons ──────────────────────────────────────────────────────────────────

function BackArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function FlameIcon({ color = '#EF9F27' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={color}>
      <path d="M12 2S6 10 6 15a6 6 0 0 0 12 0C18 10 12 2 12 2zm0 17a3 3 0 0 1-3-3c0-2.5 3-6 3-6s3 3.5 3 6a3 3 0 0 1-3 3z"/>
    </svg>
  )
}

function CheckIcon({ color = '#1D9E75', size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ClockIcon({ color = '#1D9E75' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8"/>
      <path d="M12 7v5l3 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getPhase(day) {
  if (day <= 7) return 'Foundation'
  if (day <= 14) return 'Build'
  return 'Peak'
}

function getPhaseForWeek(week) {
  if (week === 1) return { name: 'Foundation', label: 'Week 1', start: 1, end: 7 }
  if (week === 2) return { name: 'Build', label: 'Week 2', start: 8, end: 14 }
  return { name: 'Peak', label: 'Week 3', start: 15, end: 21 }
}

// ── Ring Component ─────────────────────────────────────────────────────────────

function ProgressRing({ percentage }) {
  const radius = 86
  const circumference = 2 * Math.PI * radius
  const [dashOffset, setDashOffset] = useState(circumference)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDashOffset(circumference - (percentage / 100) * circumference)
    }, 300)
    return () => clearTimeout(timer)
  }, [percentage, circumference])

  return (
    <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto' }}>
      <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#534AB7"/>
            <stop offset="100%" stopColor="#1D9E75"/>
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx="100" cy="100" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />
        {/* Progress arc */}
        <circle
          cx="100" cy="100" r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      {/* Center text */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 2,
      }}>
        <span style={{ fontSize: 48, fontWeight: 800, color: 'white', lineHeight: 1 }}>
          {percentage}%
        </span>
        <span style={{
          fontSize: 10, fontWeight: 500, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
        }}>
          complete
        </span>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function Progress() {
  const navigate = useNavigate()

  const currentDay = parseInt(localStorage.getItem('flowstate_current_day') || '1')
  const subtractId = localStorage.getItem('flowstate_selected_subtrack')
  const completedDays = JSON.parse(localStorage.getItem('flowstate_completed_days') || '[]')
  const streakCount = parseInt(localStorage.getItem('flowstate_streak') || '0')

  const [subtrack, setSubtrack] = useState(null)
  const [curriculumDays, setCurriculumDays] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!subtractId) { setLoading(false); return }
    Promise.all([
      supabase.from('subtracks').select('name, tracks(name, color)').eq('id', subtractId).single(),
      supabase.from('curriculum_days').select('day_number, task_title, duration_minutes').eq('subtrack_id', subtractId).order('day_number', { ascending: true }),
    ]).then(([{ data: st }, { data: days }]) => {
      if (st) setSubtrack(st)
      if (days) setCurriculumDays(days)
      setLoading(false)
    })
  }, [subtractId])

  const completedCount = completedDays.length
  const percentage = Math.round((completedCount / 21) * 100)
  const minsInvested = completedCount * 30

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' } }),
  }

  return (
    <PageTransition>
      <div style={{ background: '#0A0812', minHeight: '100vh', maxWidth: 480, margin: '0 auto', position: 'relative' }}>

        {/* Top Bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px 12px',
          position: 'sticky', top: 0, zIndex: 10,
          background: 'rgba(10,8,18,0.9)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', borderRadius: 8 }}
          >
            <BackArrow />
          </button>
          <span style={{
            fontSize: 17, fontWeight: 600, letterSpacing: '0.04em',
            color: '#9D92F8',
            textShadow: '0 0 20px rgba(157,146,248,0.4)',
          }}>
            progress
          </span>
          <div style={{ width: 36 }} />
        </div>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ padding: '24px 20px 100px' }}
        >

          {/* Section 2: Hero Ring */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            style={{ textAlign: 'center', marginBottom: 32 }}
          >
            <ProgressRing percentage={percentage} />

            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 24 }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'white', lineHeight: 1 }}>
                  Day {currentDay} <span style={{ fontSize: 15, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>of 21</span>
                </div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.02em' }}>
                  Phase
                </div>
                <div style={{ fontSize: 17, fontWeight: 600, color: '#9D92F8', marginTop: 2 }}>
                  {getPhase(currentDay)}
                </div>
              </div>
            </div>

            {subtrack && (
              <div style={{
                marginTop: 14, fontSize: 12, fontWeight: 500,
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                {subtrack.tracks?.name} · {subtrack.name}
              </div>
            )}
          </motion.div>

          {/* Section 3: Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
            {[
              { icon: <FlameIcon />, value: streakCount, label: 'Day Streak', color: '#EF9F27', delay: 0.1 },
              { icon: <CheckIcon />, value: completedCount, label: 'Days Done', color: 'white', delay: 0.2 },
              { icon: <ClockIcon />, value: minsInvested, label: 'Mins Invested', color: '#1D9E75', delay: 0.3 },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: '16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <div style={{ marginBottom: 4 }}>{stat.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: stat.color, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 500, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
                  textAlign: 'center',
                }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Section 4: Phase Breakdown */}
          <div style={{ marginBottom: 10 }}>
            <div style={{
              fontSize: 10, fontWeight: 500, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
              marginBottom: 12,
            }}>
              Phase Breakdown
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1, 2, 3].map((week, i) => {
                const phase = getPhaseForWeek(week)
                const daysInPhase = completedDays.filter(d => d >= phase.start && d <= phase.end).length
                const isCurrentPhase = currentDay >= phase.start && currentDay <= phase.end
                const isCompleted = currentDay > phase.end
                const isUpcoming = currentDay < phase.start
                const progressPct = (daysInPhase / 7) * 100

                return (
                  <motion.div
                    key={week}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 18,
                      padding: '16px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      opacity: isUpcoming ? 0.4 : 1,
                      borderLeft: isCurrentPhase ? '3px solid #534AB7' : '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 2 }}>
                        {phase.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>
                        {phase.label} · Days {phase.start}–{phase.end}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          flex: 1, height: 4, background: 'rgba(255,255,255,0.08)',
                          borderRadius: 2, overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${progressPct}%`, height: '100%',
                            background: isCompleted ? '#1D9E75' : '#534AB7',
                            borderRadius: 2,
                            transition: 'width 1s ease-out',
                          }} />
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
                          {daysInPhase}/7 days
                        </div>
                      </div>
                    </div>
                    {isCompleted && (
                      <div style={{ flexShrink: 0 }}>
                        <CheckIcon color="#1D9E75" size={20} />
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Section 5: 21-Day Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ marginTop: 28 }}
          >
            <div style={{
              fontSize: 10, fontWeight: 500, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
              marginBottom: 12,
            }}>
              Your 21 Days
            </div>

            {loading ? (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
              }}>
                {Array.from({ length: 21 }).map((_, i) => (
                  <div key={i} style={{
                    height: 96, borderRadius: 14,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} />
                ))}
              </div>
            ) : (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
              }}>
                {Array.from({ length: 21 }).map((_, idx) => {
                  const dayNum = idx + 1
                  const isDone = completedDays.includes(dayNum)
                  const isCurrent = dayNum === currentDay
                  const isFuture = dayNum > currentDay
                  const dayData = curriculumDays.find(d => d.day_number === dayNum)

                  let bg, border, boxShadow
                  if (isDone) {
                    bg = 'rgba(29,158,117,0.15)'
                    border = '1px solid rgba(29,158,117,0.3)'
                    boxShadow = 'none'
                  } else if (isCurrent) {
                    bg = 'rgba(83,74,183,0.2)'
                    border = '1px solid rgba(147,138,248,0.4)'
                    boxShadow = '0 0 12px rgba(83,74,183,0.3)'
                  } else {
                    bg = 'rgba(255,255,255,0.02)'
                    border = '1px solid rgba(255,255,255,0.06)'
                    boxShadow = 'none'
                  }

                  return (
                    <div
                      key={dayNum}
                      onClick={() => isCurrent && navigate('/home')}
                      style={{
                        background: bg, border, borderRadius: 14,
                        boxShadow, padding: '12px 10px',
                        minHeight: 96,
                        display: 'flex', flexDirection: 'column',
                        gap: 6,
                        cursor: isCurrent ? 'pointer' : 'default',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{
                        fontSize: 10, fontWeight: 500, letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: isDone ? 'rgba(29,158,117,0.7)' : isCurrent ? 'rgba(157,146,248,0.7)' : 'rgba(255,255,255,0.25)',
                      }}>
                        Day {dayNum}
                      </div>
                      <div style={{
                        fontSize: 11, fontWeight: 500, lineHeight: 1.4,
                        color: isFuture ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.85)',
                        flex: 1,
                      }}>
                        {dayData?.task_title || '—'}
                      </div>
                      {isDone && (
                        <div style={{ position: 'absolute', top: 8, right: 8 }}>
                          <CheckIcon color="rgba(29,158,117,0.8)" size={14} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>

        </motion.div>
      </div>
      <BottomNav />
    </PageTransition>
  )
}
