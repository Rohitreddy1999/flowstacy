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
        { id: 'guilt', emoji: '😔',
          text: "Guilt. I knew what I needed to do. I just didn't do it.",
          tracks: ['discipline', 'journal'] },
        { id: 'frustration', emoji: '😤',
          text: "Frustration. I keep starting things and never following through.",
          tracks: ['fitness', 'discipline'] },
        { id: 'emptiness', emoji: '😶',
          text: "Emptiness. I was busy but none of it actually mattered.",
          tracks: ['journal', 'drawing'] },
        { id: 'fear', emoji: '😰',
          text: "Fear. Time is passing and I'm not becoming who I wanted to be.",
          tracks: ['journal', 'instrument'] },
        { id: 'numbness', emoji: '😴',
          text: "Numbness. I've honestly stopped expecting things to change.",
          tracks: ['discipline', 'journal'] }
      ]
    },
    {
      step: 4,
      question: "The person you pictured yourself becoming — what does their daily life look like?",
      subtext: "Select all that you feel.",
      multiSelect: true,
      options: [
        { id: 'fitness', emoji: '💪',
          text: "They move their body every day. No excuses, no negotiating.",
          tracks: ['fitness'] },
        { id: 'discipline', emoji: '☀️',
          text: "Their mornings belong to them. Not their phone. Not their stress.",
          tracks: ['discipline'] },
        { id: 'instrument', emoji: '🎵',
          text: "They play an instrument. They create music that is purely theirs.",
          tracks: ['instrument'] },
        { id: 'journal', emoji: '📓',
          text: "They know themselves. They've done the work to understand what they want.",
          tracks: ['journal'] },
        { id: 'drawing', emoji: '✏️',
          text: "They make things. They draw, sketch, create something from nothing.",
          tracks: ['drawing'] }
      ]
    },
    {
      step: 5,
      question: "Before the world gets to you — what does your morning honestly look like?",
      subtext: "Select all that you feel.",
      multiSelect: true,
      options: [
        { id: 'phone', emoji: '📱',
          text: "Phone first. Scrolling before I've had a single thought of my own.",
          tracks: ['discipline', 'journal'] },
        { id: 'rush', emoji: '☕',
          text: "Rush and survive. The day owns me before it's even started.",
          tracks: ['fitness', 'discipline'] },
        { id: 'tired', emoji: '😴',
          text: "I wake up already tired. Like sleep didn't actually rest me.",
          tracks: ['fitness', 'discipline'] },
        { id: 'quiet', emoji: '🌅',
          text: "I have quiet time but I waste it. I could be using it better.",
          tracks: ['journal', 'drawing', 'instrument'] },
        { id: 'move', emoji: '🏃',
          text: "I already move or do something — but I want more structure.",
          tracks: ['fitness'] }
      ]
    },
    {
      step: 6,
      question: "You've tried before. Something stopped you. What was it really?",
      subtext: "Select all that you feel.",
      multiSelect: true,
      options: [
        { id: 'time', emoji: '⏰',
          text: "I told myself I didn't have time. Even though I did.",
          tracks: ['discipline', 'journal'] },
        { id: 'results', emoji: '😔',
          text: "I didn't see results fast enough and convinced myself it wasn't working.",
          tracks: ['fitness', 'drawing'] },
        { id: 'identity', emoji: '🧠',
          text: "I decided I just wasn't the kind of person who was good at that.",
          tracks: ['instrument', 'drawing', 'journal'] },
        { id: 'alone', emoji: '👥',
          text: "I was doing it completely alone. Nobody around me cared.",
          tracks: ['fitness', 'discipline'] },
        { id: 'lost', emoji: '🌀',
          text: "Honestly? Life just swallowed it. I don't even know when I stopped.",
          tracks: ['discipline', 'journal'] }
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
