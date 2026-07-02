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

export default function TrackSelect() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  function handleContinue() {
    if (!selected) return
    localStorage.setItem('flowstate_selected_track', selected)
    navigate('/sub-track-select', { state: { from: 'track-select' } })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 24px' }}>
      <AuroraBackground />

      <div style={{ maxWidth: 480, margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>

        <BackButton onClick={() => navigate('/bridge')} />

        <div style={{ margin: '16px 0 28px' }}>
          <p className="fs-label fs-label-purple" style={{ marginBottom: 8 }}>Choose your path</p>
          <h1 className="fs-heading-md" style={{ marginBottom: 8 }}>What do you want to work on?</h1>
          <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)', lineHeight: 1.6 }}>
            Pick the track that calls to you. You can always try others after you graduate.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, marginBottom: 20 }}>
          {TRACKS.map(track => {
            const isSelected = selected === track.id
            return (
              <button
                key={track.id}
                onClick={() => setSelected(track.id)}
                className="fs-card"
                style={{
                  padding: 18, textAlign: 'left', cursor: 'pointer', width: '100%',
                  position: 'relative',
                  borderColor: isSelected ? track.color : undefined,
                  background: isSelected ? `${track.color}22` : undefined,
                  border: isSelected ? `1px solid ${track.color}` : undefined,
                }}
              >
                {isSelected && (
                  <span style={{ position: 'absolute', top: 14, right: 14, width: 18, height: 18, borderRadius: '50%', background: track.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'white' }}>✓</span>
                )}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingRight: 24 }}>
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

        <button onClick={handleContinue} disabled={!selected} className="fs-btn-primary" style={{ width: '100%' }}>
          Let's go →
        </button>
      </div>
    </div>
  )
}
