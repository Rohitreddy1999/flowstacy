export const TRACKS = [
  {
    id: 'move',
    name: 'Move',
    label: 'MOVE',
    tagline: 'Show up. Move. Become someone who never stops.',
    color: '#3DF5A6',
    lightColor: 'rgba(61,245,166,0.08)',
    borderColor: 'rgba(61,245,166,0.5)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M6.5 6.5h11M6.5 17.5h11M3 10.5h18M3 13.5h18"/>
        <rect x="1" y="8" width="4" height="8" rx="1"/>
        <rect x="19" y="8" width="4" height="8" rx="1"/>
      </svg>
    ),
    subtracks: [
      { id: 'gym', name: 'Gym & Weightlifting',
        desc: 'Build strength with progressive resistance',
        available: true },
      { id: 'calisthenics', name: 'Calisthenics',
        desc: 'Master your bodyweight',
        available: false },
      { id: 'running', name: 'Running & Stamina',
        desc: 'Build the habit of running every day',
        available: false },
      { id: 'sport', name: 'Sport & Athletics',
        desc: 'Train consistently for your sport',
        available: false },
      { id: 'yoga', name: 'Yoga & Flexibility',
        desc: 'Move better, feel better',
        available: false }
    ]
  },
  {
    id: 'rhythm',
    name: 'Rhythm',
    label: 'RHYTHM',
    tagline: "You don't need talent. Just 21 days and one song.",
    color: '#3DF5A6',
    lightColor: 'rgba(61,245,166,0.08)',
    borderColor: 'rgba(61,245,166,0.5)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>
    ),
    subtracks: [
      { id: 'guitar', name: 'Guitar',
        desc: 'From first chord to first song',
        available: false },
      { id: 'piano', name: 'Piano & Keyboard',
        desc: 'Learn keys and music theory',
        available: false },
      { id: 'drums', name: 'Drums & Rhythm',
        desc: 'Build timing from the ground up',
        available: false },
      { id: 'vocals', name: 'Vocals & Singing',
        desc: 'Train your voice with confidence',
        available: false }
    ]
  },
  {
    id: 'express',
    name: 'Express',
    label: 'EXPRESS',
    tagline: 'Write it down. Find out who you actually are.',
    color: '#3DF5A6',
    lightColor: 'rgba(61,245,166,0.08)',
    borderColor: 'rgba(61,245,166,0.5)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    subtracks: [
      { id: 'discovery', name: 'Self-Discovery',
        desc: 'Deep prompts that reveal who you are',
        available: false },
      { id: 'gratitude', name: 'Gratitude Practice',
        desc: 'Shift how you see everything',
        available: false },
      { id: 'stream', name: 'Stream of Consciousness',
        desc: 'Free writing with no rules',
        available: false },
      { id: 'goals', name: 'Goal Setting & Vision',
        desc: 'Clarify what you want',
        available: false }
    ]
  },
  {
    id: 'calm',
    name: 'Calm',
    label: 'CALM',
    tagline: 'Slow down deliberately. Everything gets clearer.',
    color: '#82D4FF',
    lightColor: 'rgba(130,212,255,0.08)',
    borderColor: 'rgba(130,212,255,0.5)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    subtracks: [
      { id: 'breathwork', name: 'Breathwork Fundamentals',
        desc: 'Build a daily breath practice that changes your nervous system',
        available: true },
      { id: 'meditation', name: 'Meditation',
        desc: '5 minutes of stillness that compounds',
        available: false },
      { id: 'yoga', name: 'Yoga & Flexibility',
        desc: 'Move better, feel better',
        available: false }
    ]
  },
  {
    id: 'mindful',
    name: 'Mindful',
    label: 'MINDFUL',
    tagline: "Go inward. That's where everything changes.",
    color: '#FF4FD8',
    lightColor: 'rgba(255,79,216,0.08)',
    borderColor: 'rgba(255,79,216,0.5)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
    subtracks: [
      { id: 'focus', name: 'Deep Focus',
        desc: 'Train your attention like a muscle',
        available: false },
      { id: 'journaling', name: 'Daily Journaling',
        desc: 'Write your way to clarity',
        available: false }
    ]
  }
]
