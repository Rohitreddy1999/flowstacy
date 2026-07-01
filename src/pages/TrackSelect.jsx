import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'

const TRACKS = [
  {
    id: 'fitness',
    emoji: '💪',
    title: 'Body & Fitness',
    desc: 'Show up. Move. Become someone who never skips.',
    color: '#534AB7',
  },
  {
    id: 'discipline',
    emoji: '☀️',
    title: 'Daily Discipline',
    desc: "Master the boring things. That's where the magic lives.",
    color: '#0F6E56',
  },
  {
    id: 'instrument',
    emoji: '🎵',
    title: 'Learn an Instrument',
    desc: "You don't need talent. You need 21 days and one song.",
    color: '#993C1D',
  },
  {
    id: 'journal',
    emoji: '📓',
    title: 'Journaling & Self-Discovery',
    desc: 'Write it down. Find out who you actually are.',
    color: '#993556',
  },
  {
    id: 'drawing',
    emoji: '✏️',
    title: 'Drawing & Sketching',
    desc: "You don't need to be an artist. You just need to start.",
    color: '#854F0B',
  },
]

function TrackCard({ track, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative w-full text-left rounded-xl p-5 border transition-all duration-150 focus:outline-none"
      style={{
        borderWidth: isSelected ? '2px' : '1px',
        borderColor: isSelected ? track.color : '#e5e5e5',
        backgroundColor: isSelected ? `${track.color}14` : '#ffffff',
        borderRadius: '12px',
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = track.color
          e.currentTarget.style.backgroundColor = `${track.color}14`
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
          className="absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
          style={{ backgroundColor: track.color }}
        >
          ✓
        </span>
      )}
      <div className="flex items-start gap-4 pr-6">
        <span className="text-3xl leading-none shrink-0">{track.emoji}</span>
        <div>
          <p className="font-semibold text-gray-900 mb-1">{track.title}</p>
          <p className="text-sm text-gray-500 leading-relaxed">{track.desc}</p>
        </div>
      </div>
    </button>
  )
}

export default function TrackSelect() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  function handleContinue() {
    if (!selected) return
    localStorage.setItem('flowstate_selected_track', selected)
    navigate('/sub-track-select', { state: { from: 'track-select' } })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10">
      <div className="max-w-[480px] mx-auto w-full flex flex-col flex-1">

        {/* Back button */}
        <BackButton onClick={() => navigate('/bridge')} className="self-start mb-6" />

        {/* Heading */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Choose your path
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            What do you want to work on?
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Pick the track that calls to you. You can always try others after you graduate.
          </p>
        </div>

        {/* Track cards */}
        <div className="space-y-4 mb-8 flex-1">
          {TRACKS.map(track => (
            <TrackCard
              key={track.id}
              track={track}
              isSelected={selected === track.id}
              onClick={() => setSelected(track.id)}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          disabled={!selected}
          className="w-full py-3 rounded-xl text-white font-semibold text-base transition-opacity"
          style={{
            backgroundColor: selected ? '#534AB7' : '#c4c4c4',
            cursor: selected ? 'pointer' : 'not-allowed',
          }}
        >
          Let's go →
        </button>
      </div>
    </div>
  )
}
