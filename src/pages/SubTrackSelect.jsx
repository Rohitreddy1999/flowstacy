import { useState } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import AuroraBackground from '../components/AuroraBackground'
import BackButton from '../components/BackButton'

const MAIN_TRACKS = [
  { id: 'fitness',    emoji: '💪', title: 'Body & Fitness' },
  { id: 'discipline', emoji: '☀️', title: 'Daily Discipline' },
  { id: 'instrument', emoji: '🎵', title: 'Learn an Instrument' },
  { id: 'journal',    emoji: '📓', title: 'Journaling & Self-Discovery' },
  { id: 'drawing',    emoji: '✏️', title: 'Drawing & Sketching' },
]

const SUB_TRACKS = {
  fitness: [
    { id: 'gym',          emoji: '🏋️', title: 'Gym & Weightlifting',    desc: 'Build strength with progressive resistance training' },
    { id: 'calisthenics', emoji: '🤸', title: 'Calisthenics',           desc: 'Master your bodyweight — no equipment needed' },
    { id: 'running',      emoji: '🏃', title: 'Running & Stamina',      desc: 'Build the habit of running every day' },
    { id: 'sport',        emoji: '🎾', title: 'Sport & Athletics',      desc: 'Pick your sport and train consistently for it' },
    { id: 'yoga',         emoji: '🧘', title: 'Yoga & Flexibility',     desc: 'Move better, feel better, recover faster' },
  ],
  discipline: [
    { id: 'morning',    emoji: '☀️', title: 'Morning Routine',  desc: 'Design and stick to a powerful morning ritual' },
    { id: 'reading',    emoji: '📚', title: 'Daily Reading',    desc: 'Read 10 pages every single day without fail' },
    { id: 'steps',      emoji: '🚶', title: '10,000 Steps',     desc: 'Walk your way to a healthier body and clearer mind' },
    { id: 'meditation', emoji: '🧘', title: 'Meditation',       desc: '5 minutes a day of stillness that compounds over time' },
    { id: 'detox',      emoji: '📵', title: 'Digital Detox',    desc: 'Take back control from your phone and social media' },
  ],
  instrument: [
    { id: 'guitar',  emoji: '🎸', title: 'Guitar',           desc: 'From your first chord to your first full song' },
    { id: 'piano',   emoji: '🎹', title: 'Piano & Keyboard', desc: 'Learn the fundamentals of keys and music theory' },
    { id: 'drums',   emoji: '🥁', title: 'Drums & Rhythm',   desc: 'Build timing and rhythm from the ground up' },
    { id: 'vocals',  emoji: '🎤', title: 'Vocals & Singing', desc: 'Train your voice and learn to sing with confidence' },
  ],
  journal: [
    { id: 'self',      emoji: '📓', title: 'Self-Discovery',          desc: 'Deep prompts that help you understand who you truly are' },
    { id: 'gratitude', emoji: '🙏', title: 'Gratitude Practice',      desc: 'Daily gratitude that shifts how you see everything' },
    { id: 'stream',    emoji: '💭', title: 'Stream of Consciousness', desc: 'Free writing with no rules — just honesty' },
    { id: 'goals',     emoji: '🎯', title: 'Goal Setting & Vision',   desc: 'Clarify what you want and build a plan to get it' },
  ],
  drawing: [
    { id: 'fundamentals', emoji: '✏️', title: 'Sketching Fundamentals', desc: 'Lines, shapes, shading — the building blocks' },
    { id: 'portrait',     emoji: '👤', title: 'Portrait Drawing',       desc: 'Learn to draw faces and capture people' },
    { id: 'urban',        emoji: '🏙️', title: 'Urban Sketching',        desc: 'Draw buildings, streets and the world around you' },
    { id: 'nature',       emoji: '🐾', title: 'Nature & Animals',       desc: 'Bring the natural world to life on paper' },
  ],
}

function SelectCard({ isSelected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={isSelected ? 'fs-card fs-card-purple' : 'fs-card'}
      style={{ padding: '14px 16px', textAlign: 'left', cursor: 'pointer', width: '100%', position: 'relative', border: 'none' }}
    >
      {isSelected && (
        <span style={{ position: 'absolute', top: 10, right: 10, width: 16, height: 16, borderRadius: '50%', background: 'var(--fs-purple-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'white' }}>✓</span>
      )}
      {children}
    </button>
  )
}

export default function SubTrackSelect() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const isExplore = searchParams.get('mode') === 'explore'
  const backTarget = location.state?.from === 'track-select' ? '/track-select' : '/recommendation'

  const recommendedTrack = localStorage.getItem('flowstate_selected_track') || 'fitness'
  const [exploreTrack, setExploreTrack] = useState(null)
  const [selected, setSelected] = useState(null)

  const activeTrack = isExplore ? exploreTrack : recommendedTrack
  const subOptions = activeTrack ? SUB_TRACKS[activeTrack] : null

  function handleSelectMainTrack(id) {
    setExploreTrack(id)
    setSelected(null)
    localStorage.setItem('flowstate_selected_track', id)
  }

  function handleBegin() {
    if (!selected) return
    localStorage.setItem('flowstate_selected_subtrack', selected)
    navigate('/home')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 24px' }}>
      <AuroraBackground />

      <div style={{ maxWidth: 480, margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>

        <BackButton onClick={() => navigate(backTarget)} />

        <div style={{ margin: '16px 0 28px' }}>
          <p className="fs-label fs-label-purple" style={{ marginBottom: 8 }}>You're on your way</p>
          <h1 className="fs-heading-md" style={{ marginBottom: 8 }}>
            {isExplore ? 'Explore all tracks' : 'Pick your focus'}
          </h1>
          <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)', lineHeight: 1.6 }}>
            Choose what you want to work on for the next 21 days. You can always try others after you graduate.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, marginBottom: 20 }}>

          {isExplore && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {MAIN_TRACKS.map(track => (
                <SelectCard key={track.id} isSelected={exploreTrack === track.id} onClick={() => handleSelectMainTrack(track.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 22 }}>{track.emoji}</span>
                    <p style={{ fontWeight: 500, color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-sm)' }}>{track.title}</p>
                  </div>
                </SelectCard>
              ))}
            </div>
          )}

          {subOptions && (
            <>
              {isExplore && (
                <div style={{ height: 1, background: 'var(--fs-border)', margin: '4px 0 12px' }} />
              )}
              <p className="fs-label" style={{ marginBottom: 10 }}>
                {isExplore ? 'NOW PICK YOUR FOCUS' : 'PICK YOUR FOCUS'}
              </p>
              {subOptions.map(opt => (
                <SelectCard key={opt.id} isSelected={selected === opt.id} onClick={() => setSelected(opt.id)}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{opt.emoji}</span>
                    <div>
                      <p style={{ fontWeight: 500, color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-sm)', marginBottom: 3 }}>{opt.title}</p>
                      <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-xs)', lineHeight: 1.5 }}>{opt.desc}</p>
                    </div>
                  </div>
                </SelectCard>
              ))}
            </>
          )}
        </div>

        <button onClick={handleBegin} disabled={!selected} className="fs-btn-primary" style={{ width: '100%' }}>
          Let's begin →
        </button>
      </div>
    </div>
  )
}
