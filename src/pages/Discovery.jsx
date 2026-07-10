import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionScreen from '../components/QuestionScreen'
import { supabase } from '../lib/supabase'

const QUESTIONS = [
  {
    id: 'q1',
    question: "There's a version of you that doesn't exist yet. What does that person do that you don't?",
    subtext: 'Pick up to 2.',
    multiSelect: true,
    options: [
      { id: 'move',      label: "They move their body without negotiating with themselves.",     tracks: ['fitness'] },
      { id: 'rituals',   label: "They have rituals they never skip. Not once.",                 tracks: ['discipline'] },
      { id: 'create',    label: "They create or make something every single day.",               tracks: ['instrument', 'journal'] },
      { id: 'write',     label: "They write down what they're thinking instead of just carrying it.", tracks: ['journal'] },
      { id: 'stillness', label: "They've found stillness. They don't need noise to feel okay.", tracks: ['drawing'] },
    ],
  },
  {
    id: 'q2',
    question: "The voice that talks you out of it — what does it actually say?",
    subtext: 'Pick up to 2.',
    multiSelect: true,
    options: [
      { id: 'tired',     label: "I'm too tired right now. I'll start tomorrow.",                tracks: ['fitness', 'discipline'] },
      { id: 'order',     label: "I need to get my life in order first. Then I'll start.",       tracks: ['discipline'] },
      { id: 'creative',  label: "I'm probably not creative or talented enough for this.",       tracks: ['instrument', 'drawing'] },
      { id: 'point',     label: "What's even the point. I've tried before.",                    tracks: ['journal', 'drawing'] },
      { id: 'time',      label: "I don't have time. That's just the truth.",                    tracks: ['fitness', 'discipline'] },
    ],
  },
  {
    id: 'q3',
    question: "How many times have you started over?",
    subtext: 'Be honest. Nobody is counting.',
    multiSelect: false,
    options: [
      { id: 'tenth',     label: "This might be my 10th attempt at something like this.",        tracks: ['discipline', 'journal'] },
      { id: 'lost',      label: "I stopped counting a while ago.",                              tracks: ['discipline', 'drawing'] },
      { id: 'few',       label: "A few times. But I feel genuinely different now.",             tracks: ['fitness', 'instrument'] },
      { id: 'never',     label: "Honestly — I've never really started. Just planned.",         tracks: ['journal', 'drawing'] },
      { id: 'scared',    label: "Too many. That's why I'm scared to try again.",               tracks: ['fitness', 'discipline'] },
    ],
  },
  {
    id: 'q4',
    question: "When you see someone who has what you want — your very first honest reaction?",
    subtext: "The real one. Not the one you'd say out loud.",
    multiSelect: false,
    options: [
      { id: 'inspired',  label: "Inspired. Then I close the app and forget about it.",          tracks: ['fitness', 'instrument'] },
      { id: 'envy',      label: "Something I don't want to name. Maybe envy.",                  tracks: ['journal', 'drawing'] },
      { id: 'explain',   label: "I immediately explain to myself why it's easier for them.",    tracks: ['discipline', 'journal'] },
      { id: 'numb',      label: "Nothing. I think I've gone numb to it.",                       tracks: ['drawing', 'journal'] },
      { id: 'good',      label: "'Good for them.' But I don't really feel it.",                 tracks: ['instrument', 'drawing'] },
    ],
  },
  {
    id: 'q5',
    question: "What's the one thing you keep saying you'll start — when life calms down, when you're ready, when the time is right?",
    openText: true,
    openTextPlaceholder: 'The thing you\'ve been putting off the longest...',
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
  const [trackScores, setTrackScores] = useState({
    fitness: 0, discipline: 0, instrument: 0, journal: 0, drawing: 0,
  })
  const [answers, setAnswers] = useState({})

  const handleContinue = async (selected) => {
    const q = QUESTIONS[currentQ]
    const selectedArr = Array.isArray(selected) ? selected : [selected]

    const updatedAnswers = { ...answers, [q.id]: selectedArr }
    setAnswers(updatedAnswers)

    // Accumulate track scores from option mappings
    if (!q.openText && q.options) {
      const newScores = { ...trackScores }
      selectedArr.forEach(id => {
        const option = q.options.find(o => o.id === id)
        option?.tracks?.forEach(track => {
          newScores[track] = (newScores[track] || 0) + 1
        })
      })
      setTrackScores(newScores)

      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1)
      }
    } else if (q.openText) {
      // Last question — save everything and navigate
      const openAnswer = selected
      localStorage.setItem('flowstacy_scores', JSON.stringify(trackScores))
      localStorage.setItem('flowstacy_open_answer', openAnswer)

      // Save to Supabase (non-blocking)
      saveDiscoveryToSupabase(updatedAnswers, trackScores, openAnswer)

      navigate('/recommendation')
    }
  }

  const handleBack = () => {
    if (currentQ === 0) navigate('/bridge')
    else setCurrentQ(currentQ - 1)
  }

  const q = QUESTIONS[currentQ]

  return (
    <QuestionScreen
      key={currentQ}
      stepNumber={currentQ + 1}
      totalSteps={QUESTIONS.length}
      question={q.question}
      subtext={q.subtext}
      options={q.options}
      multiSelect={q.multiSelect}
      openText={q.openText}
      openTextPlaceholder={q.openTextPlaceholder}
      onContinue={handleContinue}
      onBack={handleBack}
      continueLabel={currentQ === QUESTIONS.length - 1 ? 'Show my match' : 'Continue'}
    />
  )
}
