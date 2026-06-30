import { useNavigate } from 'react-router-dom'

const TRACKS = {
  discipline: {
    name: 'Daily Discipline',
    emoji: '☀️',
    tagline: 'Master the boring things. That\'s where the magic lives.',
    color: '#0F6E56',
    reasons: [
      'Your mornings feel wasted right now',
      'You want a routine that actually sticks',
      'You know the small things matter — you just need to start',
    ],
  },
  drawing: {
    name: 'Drawing & Sketching',
    emoji: '✏️',
    tagline: 'You don\'t need to be an artist. You just need to start.',
    color: '#854F0B',
    reasons: [
      'You\'re drawn to creating visual things',
      'You want to see tangible progress you can photograph',
      'You\'ve always thought I can\'t draw — we\'re about to prove that wrong',
    ],
  },
  fitness: {
    name: 'Body & Fitness',
    emoji: '💪',
    tagline: 'Show up. Move. Become someone who never skips.',
    color: '#534AB7',
    reasons: [
      'You see yourself moving and being physically strong',
      'You\'ve struggled with consistency more than motivation',
      'You want structure, not just inspiration',
    ],
  },
  instrument: {
    name: 'Learn an Instrument',
    emoji: '🎵',
    tagline: 'You don\'t need talent. You need 21 days and one song.',
    color: '#993C1D',
    reasons: [
      'Music keeps coming up when you imagine your best self',
      'You want to create something that feels personal',
      'You\'ve always said I wish I could play',
    ],
  },
  journal: {
    name: 'Journaling & Self-Discovery',
    emoji: '📓',
    tagline: 'Write it down. Find out who you actually are.',
    color: '#993556',
    reasons: [
      'You\'re searching for direction, not just activity',
      'You\'ve never really sat down and asked the hard questions',
      'Writing feels natural but you\'ve never made it a practice',
    ],
  },
}

function getTopTrack(scores) {
  if (!scores) return 'journal'
  return Object.keys(scores)
    .sort((a, b) => {
      const diff = scores[b] - scores[a]
      return diff !== 0 ? diff : a.localeCompare(b)
    })[0]
}

export default function Recommendation() {
  const navigate = useNavigate()

  const raw = localStorage.getItem('flowstate_scores')
  const scores = raw ? JSON.parse(raw) : null
  const trackKey = getTopTrack(scores)
  const track = TRACKS[trackKey]

  function handleStart() {
    localStorage.setItem('flowstate_selected_track', trackKey)
    navigate('/home')
  }

  function handleExplore() {
    console.log('explore all tracks clicked')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10">
      <div className="max-w-[480px] mx-auto w-full flex flex-col flex-1">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate('/discovery')}
            className="text-sm font-medium flex items-center gap-1"
            style={{ color: '#534AB7' }}
          >
            ← Back
          </button>
          <span className="text-lg font-semibold tracking-tight" style={{ color: '#534AB7' }}>
            flowstate
          </span>
        </div>

        {/* Mantra label */}
        <p className="text-sm text-gray-400 mb-4">Your 21-day mantra</p>

        {/* Track hero */}
        <div className="mb-8">
          <div className="text-5xl mb-4">{track.emoji}</div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3 leading-tight"
            style={{ color: track.color }}
          >
            {track.name}
          </h1>
          <p className="text-gray-400 text-base italic">"{track.tagline}"</p>
        </div>

        {/* Why it matched */}
        <div className="rounded-2xl p-6 mb-8 space-y-4" style={{ backgroundColor: '#F8F8FF' }}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Why this matches you
          </p>
          {track.reasons.map((reason, i) => (
            <div key={i} className="flex items-start gap-3">
              <span
                className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs shrink-0"
                style={{ backgroundColor: track.color }}
              >
                ✓
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">{reason}</p>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="space-y-3 mt-auto">
          <button
            onClick={handleStart}
            className="w-full py-3 px-6 rounded-xl text-white font-semibold text-base transition-opacity hover:opacity-90"
            style={{ backgroundColor: track.color }}
          >
            Start my 21 days →
          </button>
          <button
            onClick={handleExplore}
            className="w-full py-3 px-6 rounded-xl font-semibold text-base border-2 bg-white transition-colors hover:bg-gray-50"
            style={{ borderColor: '#534AB7', color: '#534AB7' }}
          >
            Explore all tracks instead
          </button>
        </div>
      </div>
    </div>
  )
}
