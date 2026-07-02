import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuroraBackground from '../components/AuroraBackground'

const TOTAL = 21

const STATS = [
  { value: '21',      label: 'days completed' },
  { value: '21',      label: 'day streak' },
  { value: '~8h',     label: 'total practice' },
  { value: 'Top 12%', label: 'of all starters' },
]

const ACHIEVEMENTS = [
  "You proved consistency beats talent. You showed up on the days it was hard, boring, and inconvenient.",
  "You learned 5 fundamental movements and built your own training split from scratch.",
  "You became someone who doesn't quit. That identity doesn't disappear after today.",
]

function StageDots({ stage }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '16px 0' }}>
      {[1, 2, 3].map(s => (
        <div
          key={s}
          style={{
            width: 8, height: 8, borderRadius: '50%', transition: 'all 0.3s',
            background: s === stage ? 'var(--fs-purple-500)' : 'transparent',
            border: s === stage ? 'none' : '1.5px solid var(--fs-border)',
            boxShadow: s === stage ? 'var(--fs-glow-purple)' : 'none',
          }}
        />
      ))}
    </div>
  )
}

function Stage1({ onContinue }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 32 }}>
      <div className="fs-dots-container" style={{ justifyContent: 'center' }}>
        {Array.from({ length: TOTAL }, (_, i) => (
          <div key={i} className="fs-dot fs-dot-completed" />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(83,74,183,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--fs-border-purple)' }}>
          <span style={{ fontSize: 44 }}>💪</span>
        </div>
        <p className="fs-label fs-label-purple">Body &amp; Fitness</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h1 className="fs-heading-lg" style={{ marginBottom: 8 }}>Day 21 Complete</h1>
        <p style={{ color: 'var(--fs-purple-300)', fontSize: 'var(--fs-text-lg)', fontWeight: 400 }}>
          You showed up. Every single day.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {STATS.map(({ value, label }) => (
          <div key={label} className="fs-card" style={{ padding: 16, textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--fs-text-2xl)', fontWeight: 700, color: 'var(--fs-text-primary)', marginBottom: 4 }}>{value}</p>
            <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)' }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ACHIEVEMENTS.map((text, i) => (
          <div key={i} className="fs-card" style={{ padding: 16, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--fs-teal-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>✓</span>
            <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)', lineHeight: 1.6 }}>{text}</p>
          </div>
        ))}
      </div>

      <button onClick={onContinue} className="fs-btn-primary" style={{ width: '100%' }}>Continue →</button>
    </div>
  )
}

function Stage2({ onContinue }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-sm)', marginBottom: 6 }}>A message for you</p>
        <h2 className="fs-heading-sm" style={{ fontWeight: 400, marginBottom: 4 }}>From the people who built this for you</h2>
        <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-sm)' }}>We made this because we were you.</p>
      </div>

      <div>
        <div className="fs-card fs-card-purple" style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, flexDirection: 'column', gap: 8 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--fs-purple-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--fs-glow-purple)' }}>
            <span style={{ color: 'white', fontSize: 20, marginLeft: 3 }}>▶</span>
          </div>
          <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)' }}>Watch — 90 seconds</p>
        </div>
        <p style={{ fontWeight: 500, color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-base)', marginBottom: 4 }}>You did something most people never do</p>
        <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)' }}>A personal message from the Flowstate team</p>
      </div>

      <div style={{ padding: '16px', borderLeft: '2px solid var(--fs-purple-500)', background: 'rgba(83,74,183,0.08)', borderRadius: '0 var(--fs-radius-md) var(--fs-radius-md) 0' }}>
        <p style={{ color: 'var(--fs-text-secondary)', fontStyle: 'italic', fontSize: 'var(--fs-text-sm)', lineHeight: 1.7, marginBottom: 12 }}>
          "I know what it felt like on Day 3 when you almost stopped. I know what Day 11 felt like when it got boring. I know you showed up anyway — not because it was easy, but because something in you decided this time was different. That decision is yours. Nobody can take it from you. You are not the same person who opened this app 21 days ago."
        </p>
        <p style={{ color: 'var(--fs-purple-300)', fontSize: 'var(--fs-text-sm)', fontWeight: 500 }}>— The Flowstate team</p>
      </div>

      <button onClick={onContinue} className="fs-btn-primary" style={{ width: '100%' }}>I'm ready for what's next →</button>
    </div>
  )
}

function Stage3() {
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
        <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--fs-purple-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--fs-glow-purple)' }}>
          <span style={{ fontSize: 44 }}>🏆</span>
        </div>
        <h1 className="fs-heading-lg">You graduated.</h1>
        <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)' }}>Now the real question — what do you do with this?</p>
      </div>

      <div className="fs-card fs-card-purple" style={{ padding: 20 }}>
        <p className="fs-label fs-label-purple" style={{ marginBottom: 4 }}>Body &amp; Fitness</p>
        <p className="fs-heading-sm" style={{ marginBottom: 4 }}>Day 21 — Graduated</p>
        <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)', marginBottom: 16 }}>21 day streak · Top 12% of all starters</p>
        <div className="fs-dots-container" style={{ marginBottom: 20 }}>
          {Array.from({ length: TOTAL }, (_, i) => <div key={i} className="fs-dot fs-dot-completed" />)}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="fs-btn-primary" style={{ flex: 1, padding: '10px' }}>Share to feed</button>
          <button className="fs-btn-secondary" style={{ flex: 1, padding: '10px' }}>Save card</button>
        </div>
      </div>

      <div className="fs-card fs-card-teal" style={{ padding: 20, textAlign: 'center' }}>
        <p style={{ fontSize: 28, marginBottom: 12 }}>🎁</p>
        <p style={{ fontWeight: 500, color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-sm)', marginBottom: 12 }}>
          Before you meet the experts — we have something for you.
        </p>
        <p style={{ fontSize: 'var(--fs-text-2xl)', fontWeight: 700, color: 'var(--fs-purple-300)', marginBottom: 4 }}>21% graduate discount</p>
        <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)', marginBottom: 8 }}>21 days. 21 percent. You earned every bit of it.</p>
        <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)' }}>Applied automatically when you book your first expert session.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={() => navigate('/experts')} className="fs-btn-primary" style={{ width: '100%' }}>Meet the experts →</button>
        <button
          onClick={() => {
            ['flowstate_selected_track','flowstate_selected_subtrack','flowstate_current_day','flowstate_streak','flowstate_completed_days','flowstate_reflections','flowstate_scores'].forEach(k => localStorage.removeItem(k))
            navigate('/bridge?restart=true')
          }}
          className="fs-btn-secondary"
          style={{ width: '100%' }}
        >
          Start a new 21-day track
        </button>
      </div>
    </div>
  )
}

export default function Graduation() {
  const [stage, setStage] = useState(1)

  return (
    <>
      <AuroraBackground />
      <div style={{ minHeight: '100vh', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(10,8,18,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--fs-border)' }}>
          <StageDots stage={stage} />
        </div>
        <div style={{ padding: '24px 20px' }}>
          {stage === 1 && <Stage1 onContinue={() => setStage(2)} />}
          {stage === 2 && <Stage2 onContinue={() => setStage(3)} />}
          {stage === 3 && <Stage3 />}
        </div>
      </div>
    </>
  )
}
