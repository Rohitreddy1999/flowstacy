import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const QUESTIONS = [
  {
    text: "When you realize another week passed and you still didn't do the thing — what does that feel like?",
    subtext: "Select all that you feel.",
    type: 'multi',
    options: [
      { id: 'q1_guilt', emoji: '😔', label: "Guilt. I knew what I needed to do. I just didn't do it.", tracks: ['discipline', 'journal'] },
      { id: 'q1_frustration', emoji: '😤', label: 'Frustration. I keep starting things and never following through.', tracks: ['fitness', 'discipline'] },
      { id: 'q1_emptiness', emoji: '😶', label: 'Emptiness. I was busy but none of it actually mattered.', tracks: ['journal', 'drawing'] },
      { id: 'q1_fear', emoji: '😰', label: "Fear. Time is passing and I'm not becoming who I wanted to be.", tracks: ['journal', 'instrument'] },
      { id: 'q1_numbness', emoji: '😴', label: "Numbness. I've honestly stopped expecting things to change.", tracks: ['discipline', 'journal'] },
    ],
  },
  {
    text: "The person you pictured yourself becoming — what does their daily life look like?",
    subtext: "Select all that you feel.",
    type: 'multi',
    options: [
      { id: 'q2_fitness', emoji: '💪', label: 'They move their body every day. No excuses, no negotiating.', tracks: ['fitness'] },
      { id: 'q2_discipline', emoji: '☀️', label: "Their mornings belong to them. Not their phone. Not their stress.", tracks: ['discipline'] },
      { id: 'q2_instrument', emoji: '🎵', label: 'They play an instrument. They create music that is purely theirs.', tracks: ['instrument'] },
      { id: 'q2_journal', emoji: '📓', label: "They know themselves. They've done the work to understand what they want.", tracks: ['journal'] },
      { id: 'q2_drawing', emoji: '✏️', label: 'They make things. They draw, sketch, create something from nothing.', tracks: ['drawing'] },
    ],
  },
  {
    text: "Before the world gets to you — what does your morning honestly look like?",
    subtext: "Select all that you feel.",
    type: 'multi',
    options: [
      { id: 'q3_phone', emoji: '📱', label: "Phone first. Scrolling before I've had a single thought of my own.", tracks: ['discipline', 'journal'] },
      { id: 'q3_rush', emoji: '☕', label: "Rush and survive. The day owns me before it's even started.", tracks: ['fitness', 'discipline'] },
      { id: 'q3_tired', emoji: '😴', label: "I wake up already tired. Like sleep didn't actually rest me.", tracks: ['fitness', 'discipline'] },
      { id: 'q3_waste', emoji: '🌅', label: 'I have quiet time but I waste it. I could be using it better.', tracks: ['journal', 'drawing', 'instrument'] },
      { id: 'q3_move', emoji: '🏃', label: 'I already move or do something — but I want more structure.', tracks: ['fitness'] },
    ],
  },
  {
    text: "You've tried before. Something stopped you. What was it really?",
    subtext: "Select all that you feel.",
    type: 'multi',
    options: [
      { id: 'q4_time', emoji: '⏰', label: "I told myself I didn't have time. Even though I did.", tracks: ['discipline', 'journal'] },
      { id: 'q4_results', emoji: '😔', label: "I didn't see results fast enough and convinced myself it wasn't working.", tracks: ['fitness', 'drawing'] },
      { id: 'q4_identity', emoji: '🧠', label: "I decided I just wasn't the kind of person who was good at that.", tracks: ['instrument', 'drawing', 'journal'] },
      { id: 'q4_alone', emoji: '👥', label: 'I was doing it completely alone. Nobody around me cared.', tracks: ['fitness', 'discipline'] },
      { id: 'q4_swallowed', emoji: '🌀', label: "Honestly? Life just swallowed it. I don't even know when I stopped.", tracks: ['discipline', 'journal'] },
    ],
  },
  {
    text: "What's the one thing you keep saying you'll start — when life calms down, when you're ready, when the time is right?",
    subtext: "Write it here. Nobody else sees this.",
    type: 'text',
    placeholder: 'Write it here. Nobody else sees this.',
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
            onClick={() => navigate('/bridge')}
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
              placeholder={q.placeholder || "Type anything. There's no right answer. Just be honest with yourself..."}
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
