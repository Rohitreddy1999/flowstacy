import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionScreen from '../components/QuestionScreen'

export default function Discovery() {
  const navigate = useNavigate()
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState({
    fitness: 0, discipline: 0,
    instrument: 0, journal: 0, drawing: 0
  })
  const [answers, setAnswers] = useState({})

  const questions = [
    {
      step: 3,
      question: "When you realize another week passed and you still didn't do the thing — what does that feel like?",
      subtext: "Select all that you feel.",
      multiSelect: true,
      options: [
        { id: 'guilt', label: "Guilt. I knew what I needed to do. I just didn't do it.", tracks: ['discipline', 'journal'] },
        { id: 'frustration', label: "Frustration. I keep starting things and never following through.", tracks: ['fitness', 'discipline'] },
        { id: 'emptiness', label: "Emptiness. I was busy but none of it actually mattered.", tracks: ['journal', 'drawing'] },
        { id: 'fear', label: "Fear. Time is passing and I'm not becoming who I wanted to be.", tracks: ['journal', 'instrument'] },
        { id: 'numbness', label: "Numbness. I've stopped expecting anything from myself.", tracks: ['discipline', 'journal'] }
      ]
    },
    {
      step: 4,
      question: "The person you pictured yourself becoming — what does their daily life look like?",
      subtext: "Select all that you feel.",
      multiSelect: true,
      options: [
        { id: 'fitness', label: 'My body and fitness', tracks: ['fitness'] },
        { id: 'discipline', label: 'My daily discipline and routine', tracks: ['discipline'] },
        { id: 'instrument', label: 'Learning an instrument', tracks: ['instrument'] },
        { id: 'journal', label: 'Journaling and self-reflection', tracks: ['journal'] },
        { id: 'drawing', label: 'Drawing and sketching', tracks: ['drawing'] }
      ]
    },
    {
      step: 5,
      question: "Before the world gets to you — what does your morning honestly look like?",
      subtext: "Select all that you feel.",
      multiSelect: true,
      options: [
        { id: 'phone', label: "I reach for my phone before I'm fully awake", tracks: ['discipline', 'journal'] },
        { id: 'rush', label: 'I rush through everything and feel behind immediately', tracks: ['fitness', 'discipline'] },
        { id: 'tired', label: "I'm tired before the day even starts", tracks: ['fitness', 'discipline'] },
        { id: 'quiet', label: 'I have a moment of quiet before the chaos starts', tracks: ['journal', 'drawing', 'instrument'] },
        { id: 'move', label: 'I move my body first thing and it sets the tone', tracks: ['fitness'] }
      ]
    },
    {
      step: 6,
      question: "You've tried before. Something stopped you. What was it really?",
      subtext: "Select all that you feel.",
      multiSelect: true,
      options: [
        { id: 'time', label: "I told myself I didn't have time", tracks: ['discipline', 'journal'] },
        { id: 'results', label: "I didn't see results fast enough", tracks: ['fitness', 'drawing'] },
        { id: 'identity', label: "I didn't believe I was the type of person who does this", tracks: ['instrument', 'drawing', 'journal'] },
        { id: 'alone', label: 'I had nobody to do it with', tracks: ['fitness', 'discipline'] },
        { id: 'lost', label: "I didn't know where to start or what to do", tracks: ['discipline', 'journal'] }
      ]
    },
    {
      step: 7,
      question: "What's the one thing you keep saying you'll start — when life calms down, when you're ready, when the time is right?",
      subtext: "Write it here. Nobody else sees this.",
      openText: true,
      openTextPlaceholder: "Be honest with yourself..."
    }
  ]

  const handleContinue = (selected) => {
    const q = questions[currentQ]

    setAnswers(prev => ({
      ...prev,
      [currentQ]: selected
    }))

    if (!q.openText && q.options) {
      const newScores = { ...scores }
      const selectedIds = Array.isArray(selected)
        ? selected : [selected]

      selectedIds.forEach(id => {
        const option = q.options.find(o => o.id === id)
        if (option?.tracks) {
          option.tracks.forEach(track => {
            newScores[track] = (newScores[track] || 0) + 1
          })
        }
      })
      setScores(newScores)
    }

    if (q.openText) {
      localStorage.setItem('flowstate_open_answer', selected)
    }

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      localStorage.setItem(
        'flowstate_scores',
        JSON.stringify(scores)
      )
      navigate('/recommendation')
    }
  }

  const handleBack = () => {
    if (currentQ === 0) {
      navigate('/bridge')
    } else {
      setCurrentQ(currentQ - 1)
    }
  }

  const q = questions[currentQ]

  return (
    <QuestionScreen
      key={currentQ}
      stepNumber={q.step}
      totalSteps={7}
      question={q.question}
      subtext={q.subtext}
      options={q.options}
      multiSelect={q.multiSelect}
      openText={q.openText}
      openTextPlaceholder={q.openTextPlaceholder}
      onContinue={handleContinue}
      onBack={handleBack}
      continueLabel={
        currentQ === questions.length - 1
          ? 'Show my match →'
          : 'Continue'
      }
    />
  )
}
