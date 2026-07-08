export const TRACKS = [
  {
    id: 'fitness',
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
    id: 'discipline',
    name: 'Focus',
    label: 'FOCUS',
    tagline: 'Master the small things. That\'s where everything compounds.',
    color: '#3DF5A6',
    lightColor: 'rgba(61,245,166,0.08)',
    borderColor: 'rgba(61,245,166,0.5)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round"
        strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    subtracks: [
      { id: 'morning', name: 'Morning Routine',
        desc: 'Design a powerful morning ritual',
        available: false },
      { id: 'reading', name: 'Daily Reading',
        desc: 'Read 10 pages every single day',
        available: false },
      { id: 'steps', name: '10,000 Steps',
        desc: 'Walk your way to clarity',
        available: false },
      { id: 'meditation', name: 'Meditation',
        desc: '5 minutes of stillness that compounds',
        available: false },
      { id: 'detox', name: 'Digital Detox',
        desc: 'Take back control from your phone',
        available: false }
    ]
  },
  {
    id: 'instrument',
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
    id: 'journal',
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
    id: 'drawing',
    name: 'Calm',
    label: 'CALM',
    tagline: 'Slow down deliberately. Everything gets clearer.',
    color: '#3DF5A6',
    lightColor: 'rgba(61,245,166,0.08)',
    borderColor: 'rgba(61,245,166,0.5)',
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
      { id: 'sketching', name: 'Sketching Fundamentals',
        desc: 'Lines, shapes, shading basics',
        available: false },
      { id: 'portrait', name: 'Portrait Drawing',
        desc: 'Learn to draw faces',
        available: false },
      { id: 'urban', name: 'Urban Sketching',
        desc: 'Draw buildings and streets',
        available: false },
      { id: 'nature', name: 'Nature & Animals',
        desc: 'Bring the natural world to life',
        available: false }
    ]
  }
]
