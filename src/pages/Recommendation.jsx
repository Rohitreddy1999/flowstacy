import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuroraBackground from '../components/AuroraBackground'
import BackButton from '../components/BackButton'

const TRACKS = [
  { id: 'fitness',    emoji: '💪', title: 'Body & Fitness',              desc: 'Show up. Move. Become someone who never skips.',              color: '#534AB7' },
  { id: 'discipline', emoji: '☀️', title: 'Daily Discipline',            desc: "Master the boring things. That's where the magic lives.",     color: '#0F6E56' },
  { id: 'instrument', emoji: '🎵', title: 'Learn an Instrument',         desc: "You don't need talent. You need 21 days and one song.",       color: '#993C1D' },
  { id: 'journal',    emoji: '📓', title: 'Journaling & Self-Discovery', desc: 'Write it down. Find out who you actually are.',               color: '#993556' },
  { id: 'drawing',    emoji: '✏️', title: 'Drawing & Sketching',         desc: "You don't need to be an artist. You just need to start.",    color: '#854F0B' },
]

function getRecommendedIds(scores) {
  if (!scores) return []
  const sorted = Object.keys(scores)
    .sort((a, b) => { const diff = scores[b] - scores[a]; return diff !== 0 ? diff : a.localeCompare(b) })
    .filter(id => scores[id] > 0)
  return sorted.slice(0, 2)
}

export default function Recommendation() {
  const navigate = useNavigate()
  const raw = localStorage.getItem('flowstate_scores')
  const scores = raw ? JSON.parse(raw) : null
  const recommendedIds = getRecommendedIds(scores)
  const [selected, setSelected] = useState(null)

  function handleStart() {
    if (!selected) return
    localStorage.setItem('flowstate_selected_track', selected)
    navigate('/sub-track-select', { state: { from: 'recommendation' } })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 24px' }}>
      <AuroraBackground />

      <div style={{ maxWidth: 480, margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <BackButton onClick={() => navigate('/discovery')} />
          <span className="fs-logo">flowstate</span>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h1 className="fs-heading-sm" style={{ marginBottom: 8, fontWeight: 400 }}>
            Here's what we think — but you know yourself best.
          </h1>
          <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)', lineHeight: 1.6 }}>
            We've highlighted what resonated most from your answers. But choose whatever calls to you.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, marginBottom: 20 }}>
          {TRACKS.map(track => {
            const isSelected = selected === track.id
            const isRecommended = recommendedIds.includes(track.id)
            return (
              <button
                key={track.id}
                onClick={() => setSelected(track.id)}
                className="fs-card"
                style={{
                  padding: 18, textAlign: 'left', cursor: 'pointer', width: '100%',
                  position: 'relative',
                  border: isSelected ? `1px solid ${track.color}` : undefined,
                  background: isSelected ? `${track.color}22` : undefined,
                }}
              >
                {isRecommended && !isSelected && (
                  <span className="fs-badge fs-badge-purple" style={{ position: 'absolute', top: 12, right: 12 }}>
                    ✨ Recommended
                  </span>
                )}
                {isSelected && (
                  <span style={{ position: 'absolute', top: 14, right: 14, width: 18, height: 18, borderRadius: '50%', background: track.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'white' }}>✓</span>
                )}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingRight: 80 }}>
                  <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{track.emoji}</span>
                  <div>
                    <p style={{ fontWeight: 500, color: 'var(--fs-text-primary)', marginBottom: 4, fontSize: 'var(--fs-text-base)' }}>{track.title}</p>
                    <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)', lineHeight: 1.5 }}>{track.desc}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <button onClick={handleStart} disabled={!selected} className="fs-btn-primary" style={{ width: '100%', marginBottom: 10 }}>
          Start this track →
        </button>
        <button onClick={() => navigate('/track-select')} className="fs-btn-secondary" style={{ width: '100%' }}>
          Explore all tracks
        </button>
      </div>
    </div>
  )
}
