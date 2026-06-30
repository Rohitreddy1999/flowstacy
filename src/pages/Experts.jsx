import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Data ─────────────────────────────────────────────────────────────────────

const FILTERS = [
  { id: 'all',      label: 'All tracks' },
  { id: 'fitness',  label: 'Fitness' },
  { id: 'mindset',  label: 'Mindset' },
  { id: 'music',    label: 'Music' },
  { id: 'drawing',  label: 'Drawing' },
]

const EXPERTS = [
  {
    id: 'marcus',
    initials: 'MV',
    color: '#534AB7',
    name: 'Marcus V.',
    title: 'Strength & conditioning coach',
    rating: 4.9,
    reviews: 127,
    tags: ['Strength training', 'Calisthenics', 'Beginner programs'],
    badge: '✓ 10 yrs experience · 200+ clients',
    badgeColor: '#1D9E75',
    originalPrice: '$85',
    discountedPrice: '$67',
    featured: true,
    tracks: ['fitness'],
    bio: "I've trained everyone from complete beginners to semi-pro athletes. I don't believe in crash programs — I believe in building people who last. If you finished your 21 days, you're already my kind of person.",
    stats: { clients: '200+', sessions: '1,400+', rating: '4.9' },
    offers: [
      { emoji: '📹', name: 'Free intro call',         duration: '15 min',                          price: 'Free', original: null   },
      { emoji: '👤', name: '1-on-1 coaching session', duration: '60 min',                          price: '$67',  original: '$85'  },
      { emoji: '📅', name: '8-week program',          duration: 'Custom plan + weekly check-ins',  price: '$253', original: '$320' },
    ],
  },
  {
    id: 'sonal',
    initials: 'SR',
    color: '#0D9488',
    name: 'Sonal R.',
    title: 'Mindset & habit coach',
    rating: 4.8,
    reviews: 89,
    tags: ['Morning routines', 'Habit stacking', 'Mindset'],
    badge: '✓ Certified life coach · 5 yrs',
    badgeColor: '#1D9E75',
    originalPrice: '$65',
    discountedPrice: '$51',
    featured: false,
    tracks: ['mindset'],
    bio: "I help people go from knowing what to do to actually doing it every day. The 21-day mantra is exactly what I wish existed when I started my journey.",
    stats: { clients: '150+', sessions: '800+', rating: '4.8' },
    offers: [
      { emoji: '📹', name: 'Free intro call',    duration: '15 min',                      price: 'Free', original: null   },
      { emoji: '👤', name: '1-on-1 session',     duration: '45 min',                      price: '$51',  original: '$65'  },
      { emoji: '🔄', name: 'Monthly coaching',   duration: '4 sessions + daily check-ins',price: '$174', original: '$220' },
    ],
  },
  {
    id: 'david',
    initials: 'DJ',
    color: '#E8604A',
    name: 'David J.',
    title: 'Guitar & music theory teacher',
    rating: 4.7,
    reviews: 54,
    tags: ['Guitar', 'Music theory', 'Songwriting'],
    badge: '★ 15 yrs performing · self-taught',
    badgeColor: '#BA7517',
    originalPrice: '$55',
    discountedPrice: '$43',
    featured: false,
    tracks: ['music'],
    bio: "No music school. Just 15 years of obsession, touring, and teaching. I've helped 50+ beginners go from their first chord to writing their own songs.",
    stats: { clients: '50+', sessions: '300+', rating: '4.7' },
    offers: [
      { emoji: '📹', name: 'Free intro call', duration: '15 min',                      price: 'Free', original: null   },
      { emoji: '👤', name: '1-on-1 lesson',   duration: '45 min',                      price: '$43',  original: '$55'  },
      { emoji: '🎵', name: '6-week course',   duration: 'From chords to your first song', price: '$142', original: '$180' },
    ],
  },
]

// ── Expert card (list view) ───────────────────────────────────────────────────

function ExpertCard({ expert, onViewProfile }) {
  return (
    <div
      className="relative border rounded-xl p-4 space-y-3 bg-white"
      style={{ borderColor: '#e5e5e5' }}
    >
      {/* Top match label */}
      {expert.featured && (
        <div
          className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-semibold"
          style={{ backgroundColor: '#EEEDFE', color: '#534AB7' }}
        >
          Top match
        </div>
      )}

      {/* Avatar + name + rating */}
      <div className="flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
          style={{ backgroundColor: expert.color }}
        >
          {expert.initials}
        </div>
        <div className="flex-1 min-w-0 pr-14">
          <p className="font-semibold text-gray-900 text-sm">{expert.name}</p>
          <p className="text-xs text-gray-400">{expert.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            ⭐ {expert.rating} ({expert.reviews} reviews)
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {expert.tags.map(tag => (
          <span
            key={tag}
            className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Verification badge */}
      <p className="text-xs font-medium" style={{ color: expert.badgeColor }}>
        {expert.badge}
      </p>

      {/* Price + CTA */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <div>
          <span className="text-xs text-gray-400 line-through mr-1">{expert.originalPrice}</span>
          <span className="text-sm font-bold text-gray-900">{expert.discountedPrice}</span>
          <span className="text-xs text-gray-400"> first session</span>
        </div>
        <button
          onClick={() => onViewProfile(expert.id)}
          className="px-4 py-2 rounded-xl text-white text-xs font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#534AB7' }}
        >
          View profile
        </button>
      </div>
    </div>
  )
}

// ── Expert profile (detail view) ──────────────────────────────────────────────

function ExpertProfile({ expert, onBack }) {
  return (
    <div className="space-y-6 pb-8">

      {/* Back */}
      <button
        onClick={onBack}
        className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        ← Back to experts
      </button>

      {/* Avatar + name */}
      <div className="flex flex-col items-center text-center gap-3">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
          style={{ backgroundColor: expert.color }}
        >
          {expert.initials}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{expert.name}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{expert.title}</p>
          <p className="text-xs font-semibold mt-1" style={{ color: expert.badgeColor }}>
            {expert.badge}
          </p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-gray-700 leading-relaxed italic">
        "{expert.bio}"
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'clients',  value: expert.stats.clients },
          { label: 'sessions', value: expert.stats.sessions },
          { label: 'rating',   value: expert.stats.rating },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="text-center rounded-xl p-3"
            style={{ backgroundColor: '#f9f9f9' }}
          >
            <p className="text-lg font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Offers */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          What they offer
        </p>
        <div className="space-y-3">
          {expert.offers.map((offer, i) => (
            <div
              key={i}
              className="flex items-center justify-between border rounded-xl p-4"
              style={{ borderColor: '#e5e5e5' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{offer.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{offer.name}</p>
                  <p className="text-xs text-gray-400">{offer.duration}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-3">
                {offer.original && (
                  <p className="text-xs text-gray-400 line-through">{offer.original}</p>
                )}
                <p
                  className="text-sm font-bold"
                  style={{ color: offer.price === 'Free' ? '#1D9E75' : '#1a1a1a' }}
                >
                  {offer.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Book button */}
      <div>
        <button
          className="w-full py-3 rounded-xl text-white font-semibold text-base transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#534AB7' }}
        >
          Book free intro call
        </button>
        <p className="text-xs text-center mt-2" style={{ color: '#1D9E75' }}>
          🎁 21% graduate discount applied automatically
        </p>
      </div>

    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function Experts() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const navigate = useNavigate()

  const selectedExpert = EXPERTS.find(e => e.id === selectedId)

  const filtered = activeFilter === 'all'
    ? EXPERTS
    : EXPERTS.filter(e => e.tracks.includes(activeFilter))

  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
        <button
          onClick={() => navigate('/home')}
          className="text-sm font-medium flex items-center gap-1"
          style={{ color: '#534AB7' }}
        >
          ← Back
        </button>
        <span className="text-sm font-semibold" style={{ color: '#1D9E75' }}>
          Graduated 🏆
        </span>
      </nav>

      <div className="max-w-[480px] mx-auto px-6 py-6">

        {selectedExpert ? (
          <ExpertProfile
            expert={selectedExpert}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <div className="space-y-5">

            {/* Heading */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Meet the experts</h1>
              <p className="text-sm text-gray-400">You earned this. Now go further.</p>
            </div>

            {/* Discount banner */}
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ backgroundColor: '#E1F5EE' }}
            >
              <span className="text-xl shrink-0">🎁</span>
              <div>
                <p className="text-sm font-bold text-gray-900">21% graduate discount</p>
                <p className="text-xs text-gray-500 mt-0.5">Applied automatically to your first session</p>
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className="shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
                  style={
                    activeFilter === f.id
                      ? { backgroundColor: '#534AB7', color: 'white', borderColor: '#534AB7' }
                      : { backgroundColor: 'white', color: '#6b7280', borderColor: '#e5e5e5' }
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Expert list */}
            <div className="space-y-4 pb-8">
              {filtered.length > 0 ? (
                filtered.map(expert => (
                  <ExpertCard
                    key={expert.id}
                    expert={expert}
                    onViewProfile={setSelectedId}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-sm">No experts for this track yet.</p>
                  <p className="text-gray-300 text-xs mt-1">Check back soon — we're growing.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
