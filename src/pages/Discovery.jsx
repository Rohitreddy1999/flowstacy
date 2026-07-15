import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import QuestionScreen from '../components/QuestionScreen'
import { supabase } from '../lib/supabase'

const QUESTIONS = [
  {
    id: 'q1',
    question: "There's a version of you that doesn't exist yet. What does that person do that you don't?",
    subtext: 'Pick up to 2.',
    multiSelect: true,
    maxSelect: 2,
    options: [
      { id: 'move',    label: "They move their body without negotiating with themselves", scores: { Move: 3 } },
      { id: 'rituals', label: "They have rituals they never skip. Not once.",              scores: { Calm: 2, Mindful: 1 } },
      { id: 'create',  label: "They create or make something every single day",            scores: { Express: 2, Rhythm: 1 } },
      { id: 'write',   label: "They write down what they're thinking instead of carrying it", scores: { Mindful: 3 } },
    ],
  },
  {
    id: 'q2',
    question: "Honestly — where are you running on right now?",
    multiSelect: false,
    options: [
      { id: 'fumes',    label: "Running on fumes. I'm more tired than I let on.",              scores: { Calm: 3 } },
      { id: 'restless', label: "Restless. I have energy but nowhere to put it.",               scores: { Move: 3 } },
      { id: 'numb',     label: "Numb. Not low, not high. Just flat.",                          scores: { Mindful: 2, Express: 1 } },
      { id: 'anxious',  label: "Anxious. My mind doesn't stop even when my body does.",       scores: { Mindful: 3, Calm: 1 } },
      { id: 'okay',     label: "Actually okay. I just want to build something real.",          scores: { Express: 2, Rhythm: 2 } },
    ],
  },
  {
    id: 'q3',
    question: "What actually stops you — be honest.",
    subtext: 'Pick up to 2.',
    multiSelect: true,
    maxSelect: 2,
    options: [
      { id: 'thread',    label: "I start strong then lose the thread after a few days.",        scores: { Calm: 2 } },
      { id: 'begin',     label: "I don't know where to begin so I don't begin.",               scores: { Move: 2 } },
      { id: 'wrong',     label: "I pick the wrong thing and quit when it doesn't feel right.", scores: { Mindful: 2 } },
      { id: 'interrupt', label: "Life interrupts and I never restart after.",                   scores: { Rhythm: 2 } },
      { id: 'afraid',    label: "I'm afraid of finding out I can't stick to anything.",        scores: { Express: 2 } },
    ],
  },
  {
    id: 'q4',
    question: "Which of these feels most like something you secretly believe about yourself?",
    subtext: 'Pick up to 2.',
    multiSelect: true,
    maxSelect: 2,
    options: [
      { id: 'creative', label: "I'm not really a creative person. That's just not me.",                     scores: { Express: 3 } },
      { id: 'lazy',     label: "I'm lazy by nature. I've accepted it.",                                      scores: { Move: 2 } },
      { id: 'think',    label: "I care too much what people think to really commit.",                        scores: { Mindful: 2, Express: 1 } },
      { id: 'lost',     label: "I've lost touch with what I actually want.",                                 scores: { Mindful: 3 } },
      { id: 'capable',  label: "I'm capable of more than I'm currently doing. Just haven't proven it yet.", scores: { Move: 2, Rhythm: 1 } },
    ],
  },
  {
    id: 'q5',
    question: "What's the one thing you keep saying you'll start — when life calms down, when you're ready, when the time is right?",
    openText: true,
    openTextPlaceholder: "The thing you've been putting off the longest...",
  },
]

async function saveDiscoveryToSupabase(answers, trackScores, openAnswer) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    await supabase
      .from('profiles')
      .update({
        discovery_answers: {
          q1: answers.q1 ?? [],
          q2: answers.q2 ?? [],
          q3: answers.q3 ?? [],
          q4: answers.q4 ?? [],
          track_scores: trackScores,
          completed_at: new Date().toISOString(),
        },
        open_answer: openAnswer,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id)
  } catch (err) {
    console.error('Discovery save failed:', err)
  }
}

export default function Discovery() {
  const navigate = useNavigate()
  const [currentQ, setCurrentQ] = useState(0)
  const [slideDir, setSlideDir] = useState(1)
  const [trackScores, setTrackScores] = useState({
    Move: 0, Calm: 0, Mindful: 0, Express: 0, Rhythm: 0,
  })
  const [answers, setAnswers] = useState({})

  const handleContinue = async (selected) => {
    const q = QUESTIONS[currentQ]
    const selectedArr = Array.isArray(selected) ? selected : [selected]

    const updatedAnswers = { ...answers, [q.id]: selectedArr }
    setAnswers(updatedAnswers)

    if (!q.openText && q.options) {
      const newScores = { ...trackScores }
      selectedArr.forEach(id => {
        const option = q.options.find(o => o.id === id)
        if (option?.scores) {
          Object.entries(option.scores).forEach(([track, pts]) => {
            newScores[track] = (newScores[track] || 0) + pts
          })
        }
      })
      setTrackScores(newScores)

      if (currentQ < QUESTIONS.length - 1) {
        setSlideDir(1)
        setCurrentQ(currentQ + 1)
      }
    } else if (q.openText) {
      const openAnswer = selected
      saveDiscoveryToSupabase(updatedAnswers, trackScores, openAnswer)
      navigate('/recommendation', { state: { scores: trackScores } })
    }
  }

  const handleBack = () => {
    setSlideDir(-1)
    if (currentQ === 0) navigate('/bridge')
    else setCurrentQ(currentQ - 1)
  }

  const q = QUESTIONS[currentQ]

  return (
    <AnimatePresence mode="wait">
      <QuestionScreen
        key={currentQ}
        stepNumber={currentQ + 1}
        totalSteps={QUESTIONS.length}
        question={q.question}
        subtext={q.subtext}
        options={q.options}
        multiSelect={q.multiSelect}
        maxSelect={q.maxSelect ?? 2}
        openText={q.openText}
        openTextPlaceholder={q.openTextPlaceholder}
        onContinue={handleContinue}
        onBack={handleBack}
        slideDir={slideDir}
        continueLabel={currentQ === QUESTIONS.length - 1 ? 'Show my match →' : 'Continue'}
      />
    </AnimatePresence>
  )
}
