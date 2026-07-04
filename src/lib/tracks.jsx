export const TRACKS = [
  {
    id: 'fitness',
    name: 'Body & Fitness',
    tagline: 'Show up. Move. Become someone who never skips.',
    color: '#534AB7',
    lightColor: 'rgba(83,74,183,0.15)',
    borderColor: 'rgba(157,146,248,0.3)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round"
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
    name: 'Daily Discipline',
    tagline: "Master the boring things. That's where the magic lives.",
    color: '#0F6E56',
    lightColor: 'rgba(15,110,86,0.12)',
    borderColor: 'rgba(93,202,165,0.3)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round"
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
    name: 'Learn an Instrument',
    tagline: "You don't need talent. You need 21 days and one song.",
    color: '#993C1D',
    lightColor: 'rgba(153,60,29,0.12)',
    borderColor: 'rgba(216,90,48,0.3)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round"
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
    name: 'Journaling',
    tagline: 'Write it down. Find out who you actually are.',
    color: '#993556',
    lightColor: 'rgba(153,53,86,0.12)',
    borderColor: 'rgba(212,83,126,0.3)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
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
    name: 'Drawing & Sketching',
    tagline: "You don't need to be an artist. You just need to start.",
    color: '#854F0B',
    lightColor: 'rgba(133,79,11,0.12)',
    borderColor: 'rgba(239,159,39,0.3)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z"/>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
        <path d="M2 2l7.586 7.586"/>
        <circle cx="11" cy="11" r="2"/>
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
