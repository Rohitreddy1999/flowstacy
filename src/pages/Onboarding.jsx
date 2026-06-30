import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LIFE_STAGES = [
  {
    id: 'studying',
    emoji: '🎓',
    title: 'Still studying',
    description: 'Figuring out who I am and what I want',
  },
  {
    id: 'career',
    emoji: '💼',
    title: 'Building my career',
    description: 'Finding my footing in the real world',
  },
  {
    id: 'family',
    emoji: '🏠',
    title: 'Juggling family life',
    description: 'Carving out time for myself',
  },
  {
    id: 'reinventing',
    emoji: '🔄',
    title: 'Reinventing myself',
    description: 'Starting a fresh new chapter',
  },
]

export default function Onboarding() {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  function handleContinue() {
    if (!selected) return
    localStorage.setItem('flowstate_life_stage', selected)
    navigate('/signup')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10">
      {/* Logo */}
      <div className="mb-10">
        <span className="text-lg font-semibold tracking-tight" style={{ color: '#534AB7' }}>
          flowstate
        </span>
      </div>

      {/* Heading */}
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col">
        <h1
          className="text-3xl sm:text-4xl font-medium leading-snug mb-3"
          style={{ color: '#1a1a1a' }}
        >
          Before we begin — where are you in life right now?
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Just so we speak your language. No wrong answers.
        </p>

        {/* Option cards — 2×2 on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {LIFE_STAGES.map((stage) => {
            const isSelected = selected === stage.id
            return (
              <button
                key={stage.id}
                onClick={() => setSelected(stage.id)}
                className="relative text-left rounded-xl p-5 border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  borderColor: isSelected ? '#534AB7' : '#e5e5e5',
                  backgroundColor: isSelected ? '#EEEDFE' : '#ffffff',
                  '--tw-ring-color': '#534AB7',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#534AB7'
                    e.currentTarget.style.backgroundColor = '#EEEDFE'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#e5e5e5'
                    e.currentTarget.style.backgroundColor = '#ffffff'
                  }
                }}
              >
                {/* Checkmark badge */}
                {isSelected && (
                  <span
                    className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                    style={{ backgroundColor: '#534AB7' }}
                  >
                    ✓
                  </span>
                )}
                <span className="text-3xl block mb-3">{stage.emoji}</span>
                <span className="block font-semibold text-gray-900 mb-1">
                  {stage.title}
                </span>
                <span className="block text-sm text-gray-400">
                  {stage.description}
                </span>
              </button>
            )
          })}
        </div>

        {/* Continue button */}
        <div className="sm:flex sm:justify-start">
          <button
            onClick={handleContinue}
            disabled={!selected}
            className="w-full sm:w-auto sm:px-10 py-3 rounded-xl text-white font-semibold text-base transition-all duration-150"
            style={{
              backgroundColor: selected ? '#534AB7' : '#c4c4c4',
              cursor: selected ? 'pointer' : 'not-allowed',
            }}
          >
            Let's go →
          </button>
        </div>
      </div>
    </div>
  )
}
