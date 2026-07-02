import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuroraBackground from '../components/AuroraBackground'
import BackButton from '../components/BackButton'

const QUESTIONS = [
  {
    text: "When you realize another week passed and you still didn't do the thing — what does that feel like?",
    subtext: "Select all that you feel.",
    type: 'multi',
    options: [
      { id: 'q1_guilt',       emoji: '😔', label: "Guilt. I knew what I needed to do. I just didn't do it.",              tracks: ['discipline', 'journal'] },
      { id: 'q1_frustration', emoji: '😤', label: 'Frustration. I keep starting things and never following through.',      tracks: ['fitness', 'discipline'] },
      { id: 'q1_emptiness',   emoji: '😶', label: 'Emptiness. I was busy but none of it actually mattered.',              tracks: ['journal', 'drawing'] },
      { id: 'q1_fear',        emoji: '😰', label: "Fear. Time is passing and I'm not becoming who I wanted to be.",       tracks: ['journal', 'instrument'] },
      { id: 'q1_numbness',    emoji: '😴', label: "Numbness. I've honestly stopped expecting things to change.",          tracks: ['discipline', 'journal'] },
    ],
  },
  {
    text: "The person you pictured yourself becoming — what does their daily life look like?",
    subtext: "Select all that you feel.",
    type: 'multi',
    options: [
      { id: 'q2_fitness',    emoji: '💪', label: 'They move their body every day. No excuses, no negotiating.',           tracks: ['fitness'] },
      { id: 'q2_discipline', emoji: '☀️', label: "Their mornings belong to them. Not their phone. Not their stress.",     tracks: ['discipline'] },
      { id: 'q2_instrument', emoji: '🎵', label: 'They play an instrument. They create music that is purely theirs.',     tracks: ['instrument'] },
      { id: 'q2_journal',    emoji: '📓', label: "They know themselves. They've done the work to understand what they want.", tracks: ['journal'] },
      { id: 'q2_drawing',    emoji: '✏️', label: 'They make things. They draw, sketch, create something from nothing.',   tracks: ['drawing'] },
    ],
  },
  {
    text: "Before the world gets to you — what does your morning honestly look like?",
    subtext: "Select all that you feel.",
    type: 'multi',
    options: [
      { id: 'q3_phone', emoji: '📱', label: "Phone first. Scrolling before I've had a single thought of my own.",          tracks: ['discipline', 'journal'] },
      { id: 'q3_rush',  emoji: '☕', label: "Rush and survive. The day owns me before it's even started.",                 tracks: ['fitness', 'discipline'] },
      { id: 'q3_tired', emoji: '😴', label: "I wake up already tired. Like sleep didn't actually rest me.",               tracks: ['fitness', 'discipline'] },
      { id: 'q3_waste', emoji: '🌅', label: 'I have quiet time but I waste it. I could be using it better.',              tracks: ['journal', 'drawing', 'instrument'] },
      { id: 'q3_move',  emoji: '🏃', label: 'I already move or do something — but I want more structure.',                tracks: ['fitness'] },
    ],
  },
  {
    text: "You've tried before. Something stopped you. What was it really?",
    subtext: "Select all that you feel.",
    type: 'multi',
    options: [
      { id: 'q4_time',      emoji: '⏰', label: "I told myself I didn't have time. Even though I did.",                   tracks: ['discipline', 'journal'] },
      { id: 'q4_results',   emoji: '😔', label: "I didn't see results fast enough and convinced myself it wasn't working.", tracks: ['fitness', 'drawing'] },
      { id: 'q4_identity',  emoji: '🧠', label: "I decided I just wasn't the kind of person who was good at that.",       tracks: ['instrument', 'drawing', 'journal'] },
      { id: 'q4_alone',     emoji: '👥', label: 'I was doing it completely alone. Nobody around me cared.',               tracks: ['fitness', 'discipline'] },
      { id: 'q4_swallowed', emoji: '🌀', label: "Honestly? Life just swallowed it. I don't even know when I stopped.",   tracks: ['discipline', 'journal'] },
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
  const [answers, setAnswers] = useState(Array.from({ length: 5 }, (_, i) => (i < 4 ? new Set() : '')))
  const [fading, setFading] = useState(false)

  const q = QUESTIONS[step]
  const currentAnswer = answers[step]
  const canNext = q.type === 'multi'
    ? currentAnswer instanceof Set && currentAnswer.size > 0
    : typeof currentAnswer === 'string' && currentAnswer.trim().length >= 3

  function goTo(nextStep) {
    setFading(true)
    setTimeout(() => { setStep(nextStep); setFading(false) }, 180)
  }

  function handleNext() {
    if (!canNext || fading) return
    if (step < 4) {
      goTo(step + 1)
    } else {
      const scores = computeScores(answers)
      localStorage.setItem('flowstate_scores', JSON.stringify(scores))
      localStorage.setItem('flowstate_open_answer', currentAnswer)
      navigate('/recommendation')
    }
  }

  function handleBack() { if (step > 0 && !fading) goTo(step - 1) }

  function toggleOption(optId) {
    setAnswers(prev => {
      const next = [...prev]
      const sel = new Set(next[step])
      if (sel.has(optId)) { sel.delete(optId) } else if (sel.size < 2) { sel.add(optId) }
      next[step] = sel
      return next
    })
  }

  function handleTextChange(e) {
    const val = e.target.value
    setAnswers(prev => { const next = [...prev]; next[step] = val; return next })
  }

  const progressPct = ((step + 1) / 5) * 100

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 24px' }}>
      <AuroraBackground />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, maxWidth: 560, margin: '0 auto 32px', width: '100%' }}>
        <BackButton onClick={step > 0 ? handleBack : () => navigate('/bridge')} />
        <span className="fs-logo">flowstate</span>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)', marginBottom: 8 }}>
            Question {step + 1} of 5
          </p>
          <div style={{ height: 2, background: 'var(--fs-border)', borderRadius: 1 }}>
            <div style={{ height: 2, background: 'var(--fs-purple-500)', borderRadius: 1, width: `${progressPct}%`, transition: 'width 0.5s ease' }} />
          </div>
        </div>

        <div style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.2s', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h1 className="fs-heading-sm" style={{ marginBottom: 6, fontWeight: 400 }}>{q.text}</h1>
          <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-sm)', marginBottom: 24 }}>{q.subtext}</p>

          {q.type === 'multi' ? (
            <>
              <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)', marginBottom: 12 }}>Select up to 2</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                {q.options.map(opt => {
                  const isSelected = currentAnswer instanceof Set && currentAnswer.has(opt.id)
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleOption(opt.id)}
                      className={isSelected ? 'fs-card fs-card-purple' : 'fs-card'}
                      style={{ padding: '14px 16px', textAlign: 'left', border: 'none', width: '100%', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}
                    >
                      {isSelected && (
                        <span style={{ position: 'absolute', top: 10, right: 10, width: 16, height: 16, borderRadius: '50%', background: 'var(--fs-purple-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'white' }}>✓</span>
                      )}
                      <span style={{ fontSize: 18 }}>{opt.emoji}</span>
                      <span style={{ color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-sm)', lineHeight: 1.5 }}>{opt.label}</span>
                    </button>
                  )
                })}
              </div>
            </>
          ) : (
            <div style={{ marginBottom: 32 }}>
              <textarea
                className="fs-input"
                style={{ minHeight: 160, resize: 'none' }}
                placeholder={q.placeholder}
                value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                onChange={handleTextChange}
              />
              <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)', marginTop: 6, textAlign: 'right' }}>
                {typeof currentAnswer === 'string' ? currentAnswer.length : 0} characters
              </p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleNext}
              disabled={!canNext || fading}
              className="fs-btn-primary"
              style={{ minWidth: 140 }}
            >
              {step === 4 ? 'Show my match →' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
