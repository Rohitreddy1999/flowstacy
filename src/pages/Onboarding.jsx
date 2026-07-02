import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuroraBackground from '../components/AuroraBackground'

const LIFE_STAGES = [
  { id: 'studying',   emoji: '🎓', title: 'Still studying',      description: 'Figuring out who I am and what I want' },
  { id: 'career',     emoji: '💼', title: 'Building my career',   description: 'Finding my footing in the real world' },
  { id: 'family',     emoji: '🏠', title: 'Juggling family life', description: 'Carving out time for myself' },
  { id: 'reinventing',emoji: '🔄', title: 'Reinventing myself',   description: 'Starting a fresh new chapter' },
]

export default function Onboarding() {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  function handleContinue() {
    if (!selected) return
    localStorage.setItem('flowstate_life_stage', selected)
    navigate('/bridge')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 24px' }}>
      <AuroraBackground />

      <div style={{ marginBottom: 40 }}>
        <span className="fs-logo">flowstate</span>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h1 className="fs-heading-lg" style={{ marginBottom: 8 }}>
          Before we begin — where are you in life right now?
        </h1>
        <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-sm)', marginBottom: 32 }}>
          Just so we speak your language. No wrong answers.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
          {LIFE_STAGES.map(stage => {
            const isSelected = selected === stage.id
            return (
              <button
                key={stage.id}
                onClick={() => setSelected(stage.id)}
                className={isSelected ? 'fs-card fs-card-purple' : 'fs-card'}
                style={{ padding: 20, textAlign: 'left', border: 'none', width: '100%', cursor: 'pointer', position: 'relative' }}
              >
                {isSelected && (
                  <span style={{
                    position: 'absolute', top: 10, right: 10,
                    width: 18, height: 18, borderRadius: '50%',
                    background: 'var(--fs-purple-500)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: 'white',
                  }}>✓</span>
                )}
                <span style={{ fontSize: 28, display: 'block', marginBottom: 10 }}>{stage.emoji}</span>
                <span style={{ display: 'block', fontWeight: 500, color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-sm)', marginBottom: 4 }}>
                  {stage.title}
                </span>
                <span style={{ display: 'block', fontSize: 'var(--fs-text-xs)', color: 'var(--fs-text-secondary)' }}>
                  {stage.description}
                </span>
              </button>
            )
          })}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selected}
          className="fs-btn-primary"
          style={{ width: '100%' }}
        >
          Let's go →
        </button>
      </div>
    </div>
  )
}
