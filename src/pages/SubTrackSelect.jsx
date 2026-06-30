import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SUB_TRACKS = {
  fitness: [
    { id: 'gym',        emoji: '🏋️', title: 'Gym & Weightlifting',  desc: 'Build strength with progressive resistance training' },
    { id: 'calisthenics', emoji: '🤸', title: 'Calisthenics',        desc: 'Master your bodyweight — no equipment needed' },
    { id: 'running',    emoji: '🏃', title: 'Running & Stamina',     desc: 'Build the habit of running every day' },
    { id: 'sport',      emoji: '🎾', title: 'Sport & Athletics',     desc: 'Pick your sport and train consistently for it' },
    { id: 'yoga',       emoji: '🧘', title: 'Yoga & Flexibility',    desc: 'Move better, feel better, recover faster' },
  ],
  discipline: [
    { id: 'morning',    emoji: '☀️', title: 'Morning Routine',       desc: 'Design and stick to a powerful morning ritual' },
    { id: 'reading',    emoji: '📚', title: 'Daily Reading',         desc: 'Read 10 pages every single day without fail' },
    { id: 'steps',      emoji: '🚶', title: '10,000 Steps',          desc: 'Walk your way to a healthier body and clearer mind' },
    { id: 'meditation', emoji: '🧘', title: 'Meditation',            desc: '5 minutes a day of stillness that compounds over time' },
    { id: 'detox',      emoji: '📵', title: 'Digital Detox',         desc: 'Take back control from your phone and social media' },
  ],
  instrument: [
    { id: 'guitar',     emoji: '🎸', title: 'Guitar',                desc: 'From your first chord to your first full song' },
    { id: 'piano',      emoji: '🎹', title: 'Piano & Keyboard',      desc: 'Learn the fundamentals of keys and music theory' },
    { id: 'drums',      emoji: '🥁', title: 'Drums & Rhythm',        desc: 'Build timing and rhythm from the ground up' },
    { id: 'vocals',     emoji: '🎤', title: 'Vocals & Singing',      desc: 'Train your voice and learn to sing with confidence' },
  ],
  journal: [
    { id: 'self',       emoji: '📓', title: 'Self-Discovery',        desc: 'Deep prompts that help you understand who you truly are' },
    { id: 'gratitude',  emoji: '🙏', title: 'Gratitude Practice',    desc: 'Daily gratitude that shifts how you see everything' },
    { id: 'stream',     emoji: '💭', title: 'Stream of Consciousness', desc: 'Free writing with no rules — just honesty' },
    { id: 'goals',      emoji: '🎯', title: 'Goal Setting & Vision', desc: 'Clarify what you want and build a plan to get it' },
  ],
  drawing: [
    { id: 'fundamentals', emoji: '✏️', title: 'Sketching Fundamentals', desc: 'Lines, shapes, shading — the building blocks' },
    { id: 'portrait',   emoji: '👤', title: 'Portrait Drawing',      desc: 'Learn to draw faces and capture people' },
    { id: 'urban',      emoji: '🏙️', title: 'Urban Sketching',       desc: 'Draw buildings, streets and the world around you' },
    { id: 'nature',     emoji: '🐾', title: 'Nature & Animals',      desc: 'Bring the natural world to life on paper' },
  ],
}

export default function SubTrackSelect() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const trackKey = localStorage.getItem('flowstate_selected_track') || 'fitness'
  const options = SUB_TRACKS[trackKey] ?? SUB_TRACKS.fitness

  function handleBegin() {
    if (!selected) return
    localStorage.setItem('flowstate_selected_subtrack', selected)
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10">
      <div className="max-w-[480px] mx-auto w-full flex flex-col flex-1">

        {/* Back button */}
        <button
          onClick={() => navigate('/recommendation')}
          className="self-start text-sm font-medium flex items-center gap-1 mb-8"
          style={{ color: '#534AB7' }}
        >
          ← Back
        </button>

        {/* Heading */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            You're on your way
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pick your focus</h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Choose what you want to work on for the next 21 days. You can always try
            others after you graduate.
          </p>
        </div>

        {/* Sub-track cards */}
        <div className="space-y-3 mb-8 flex-1">
          {options.map(opt => {
            const isSelected = selected === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className="relative w-full text-left rounded-xl p-4 border transition-all duration-150 focus:outline-none"
                style={{
                  borderColor:     isSelected ? '#534AB7' : '#e5e5e5',
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
                <div className="flex items-start gap-4">
                  <span className="text-2xl leading-none mt-0.5 shrink-0">{opt.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">{opt.title}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{opt.desc}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* CTA */}
        <button
          onClick={handleBegin}
          disabled={!selected}
          className="w-full py-3 rounded-xl text-white font-semibold text-base transition-opacity"
          style={{ backgroundColor: selected ? '#534AB7' : '#c4c4c4', cursor: selected ? 'pointer' : 'not-allowed' }}
        >
          Let's begin →
        </button>

      </div>
    </div>
  )
}
