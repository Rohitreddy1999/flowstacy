import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const QUESTIONS = [
  {
    text: "When you picture the best version of yourself — what are they doing differently?",
    subtext: "No wrong answers. This is just between you and us.",
    type: 'multi',
    options: [
      { id: 'q1_fitness', emoji: '💪', label: 'Moving their body every day — strong, energetic, unstoppable', tracks: ['fitness'] },
      { id: 'q1_discipline', emoji: '☀️', label: 'Following a morning routine that actually sticks', tracks: ['discipline'] },
      { id: 'q1_instrument', emoji: '🎵', label: 'Playing an instrument they always wished they could', tracks: ['instrument'] },
      { id: 'q1_journal', emoji: '📓', label: 'Journaling and actually knowing what they want from life', tracks: ['journal'] },
      { id: 'q1_drawing', emoji: '✏️', label: 'Creating things — sketching, drawing, making something', tracks: ['drawing'] },
    ],
  },
  {
    text: "What does your typical morning look like right now?",
    subtext: "Be real. We're not judging.",
    type: 'multi',
    options: [
      { id: 'q2_phone', emoji: '📱', label: 'Phone first, scroll for 20 minutes, regret it', tracks: ['discipline', 'journal'] },
      { id: 'q2_coffee', emoji: '☕', label: 'Coffee, rush, out the door — survival mode', tracks: ['fitness', 'discipline'] },
      { id: 'q2_move', emoji: '🏃', label: 'I already move but want more structure', tracks: ['fitness'] },
      { id: 'q2_quiet', emoji: '🌅', label: "Quiet time — I like mornings but don't use them well", tracks: ['journal', 'drawing', 'instrument'] },
    ],
  },
  {
    text: "When you tried to build a habit before and quit — what actually killed it?",
    subtext: "This one matters. Your answer helps us protect you from that this time.",
    type: 'multi',
    options: [
      { id: 'q3_time', emoji: '⏰', label: "It took too long — I couldn't find the time", tracks: ['discipline', 'journal'] },
      { id: 'q3_results', emoji: '😔', label: "I didn't see results fast enough", tracks: ['fitness', 'drawing'] },
      { id: 'q3_alone', emoji: '👥', label: "I was doing it alone — no one around me cared", tracks: ['fitness', 'discipline'] },
      { id: 'q3_goal', emoji: '❓', label: "I never really knew what I was working toward", tracks: ['journal', 'instrument', 'drawing'] },
    ],
  },
  {
    text: "If money, time, and judgment didn't exist — what would fill your evenings?",
    subtext: "The thing that crosses your mind but you always push aside.",
    type: 'multi',
    options: [
      { id: 'q4_physical', emoji: '🏋️', label: 'Training, playing sport, moving — anything physical', tracks: ['fitness'] },
      { id: 'q4_music', emoji: '🎸', label: 'Playing music or creating sounds that mean something', tracks: ['instrument'] },
      { id: 'q4_visual', emoji: '🎨', label: 'Drawing, sketching, making visual things', tracks: ['drawing'] },
      { id: 'q4_reading', emoji: '📚', label: 'Reading, writing, thinking — going deep on myself', tracks: ['journal', 'discipline'] },
    ],
  },
  {
    text: "Last one — and this is the important one.",
    subtext: "In your own words: what's the one thing you keep saying you'll start, but never do?",
    type: 'text',
  },
]

function computeScores(answers) {
  const scores = { fitness: 0, discipline: 0, instrument: 0, journal: 0, drawing: 0 }
  QUESTIONS.forEach((q, i) => {
    if (q.type === 'multi' && answers[i] instanceof Set) {
      answers[i].forEach(optId => {
        const opt = q.options.find(o => o.id === optId)
        opt?.tracks.forEach(track => { scores[track]++ })
      })
    }
  })
  return scores
}

export default function Discovery() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(
    Array.from({ length: 5 }, (_, i) => (i < 4 ? new Set() : ''))
  )
  const [fading, setFading] = useState(false)

  const q = QUESTIONS[step]
  const currentAnswer = answers[step]

  const canNext =
    q.type === 'multi'
      ? currentAnswer instanceof Set && currentAnswer.size > 0
      : typeof currentAnswer === 'string' && currentAnswer.trim().length >= 3

  function goTo(nextStep) {
    setFading(true)
    setTimeout(() => {
      setStep(nextStep)
      setFading(false)
    }, 180)
  }

  function handleNext() {
    if (!canNext || fading) return
    if (step < 4) {
      goTo(step + 1)
    } else {
      const scores = computeScores(answers)
      console.log('Flowstate final scores:', scores)
      localStorage.setItem('flowstate_scores', JSON.stringify(scores))
      localStorage.setItem('flowstate_open_answer', currentAnswer)
      navigate('/recommendation')
    }
  }

  function handleBack() {
    if (step > 0 && !fading) goTo(step - 1)
  }

  function toggleOption(optId) {
    setAnswers(prev => {
      const next = [...prev]
      const sel = new Set(next[step])
      if (sel.has(optId)) {
        sel.delete(optId)
      } else if (sel.size < 2) {
        sel.add(optId)
      }
      next[step] = sel
      return next
    })
  }

  function handleTextChange(e) {
    const val = e.target.value
    setAnswers(prev => {
      const next = [...prev]
      next[step] = val
      return next
    })
  }

  const progressPct = ((step + 1) / 5) * 100

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10">

      {/* Header row */}
      <div className="flex items-center justify-between mb-8 max-w-xl mx-auto w-full">
        {step > 0 ? (
          <button
            onClick={handleBack}
            className="text-sm font-medium flex items-center gap-1"
            style={{ color: '#534AB7' }}
          >
            ← Back
          </button>
        ) : (
          <button
            onClick={() => navigate('/')}
            className="text-sm font-medium flex items-center gap-1"
            style={{ color: '#534AB7' }}
          >
            ← Back
          </button>
        )}
        <span className="text-lg font-semibold tracking-tight" style={{ color: '#534AB7' }}>
          flowstate
        </span>
      </div>

      {/* Progress bar */}
      <div className="max-w-xl mx-auto w-full mb-10">
        <p className="text-xs text-gray-400 mb-2">Question {step + 1} of 5</p>
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{ backgroundColor: '#534AB7', width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question content — fades on step change */}
      <div
        className="max-w-xl mx-auto w-full flex-1 flex flex-col transition-opacity duration-200"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <h1
          className="text-2xl sm:text-3xl font-medium leading-snug mb-2"
          style={{ color: '#1a1a1a' }}
        >
          {q.text}
        </h1>
        <p className="text-sm text-gray-400 mb-8">{q.subtext}</p>

        {q.type === 'multi' ? (
          <>
            <p className="text-xs text-gray-300 mb-3">Select up to 2</p>
            <div className="space-y-3 mb-10">
              {q.options.map(opt => {
                const isSelected = currentAnswer instanceof Set && currentAnswer.has(opt.id)
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleOption(opt.id)}
                    className="relative w-full text-left rounded-xl p-4 border transition-all duration-150 focus:outline-none focus-visible:ring-2"
                    style={{
                      borderColor: isSelected ? '#534AB7' : '#e5e5e5',
                      backgroundColor: isSelected ? '#EEEDFE' : '#ffffff',
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#534AB7'
                        e.currentTarget.style.backgroundColor = '#EEEDFE'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#e5e5e5'
                        e.currentTarget.style.backgroundColor = '#ffffff'
                      }
                    }}
                  >
                    {isSelected && (
                      <span
                        className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                        style={{ backgroundColor: '#534AB7' }}
                      >
                        ✓
                      </span>
                    )}
                    <span className="text-xl mr-3">{opt.emoji}</span>
                    <span className="text-sm text-gray-800">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </>
        ) : (
          <div className="mb-10">
            <textarea
              className="w-full rounded-xl border p-4 text-sm text-gray-800 resize-none focus:outline-none transition-colors duration-200"
              style={{
                borderColor: typeof currentAnswer === 'string' && currentAnswer.trim().length >= 3 ? '#534AB7' : '#e5e5e5',
                minHeight: '160px',
              }}
              placeholder="Type anything. There's no right answer. Just be honest with yourself..."
              value={typeof currentAnswer === 'string' ? currentAnswer : ''}
              onChange={handleTextChange}
            />
            <p className="text-xs text-gray-300 mt-2 text-right">
              {typeof currentAnswer === 'string' ? currentAnswer.length : 0} characters
            </p>
          </div>
        )}

        {/* Next / Submit button */}
        <div className="flex justify-end mt-auto pt-4">
          <button
            onClick={handleNext}
            disabled={!canNext || fading}
            className="px-8 py-3 rounded-xl text-white font-semibold text-base transition-all duration-150"
            style={{
              backgroundColor: canNext ? '#534AB7' : '#c4c4c4',
              cursor: canNext && !fading ? 'pointer' : 'not-allowed',
            }}
          >
            {step === 4 ? 'Show my match →' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}
