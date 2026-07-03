import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuroraBackground from '../components/AuroraBackground'
import BackButton from '../components/BackButton'

const FILTERS = [
  { id: 'all',     label: 'All tracks' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'mindset', label: 'Mindset' },
  { id: 'music',   label: 'Music' },
  { id: 'drawing', label: 'Drawing' },
]

const EXPERTS = [
  {
    id: 'marcus', initials: 'MV', color: '#534AB7', name: 'Marcus V.', title: 'Strength & conditioning coach',
    rating: 4.9, reviews: 127, tags: ['Strength training', 'Calisthenics', 'Beginner programs'],
    badge: '✓ 10 yrs experience · 200+ clients', badgeColor: 'var(--fs-teal-300)',
    originalPrice: '$85', discountedPrice: '$67', featured: true, tracks: ['fitness'],
    bio: "I've trained everyone from complete beginners to semi-pro athletes. I don't believe in crash programs — I believe in building people who last. If you finished your 21 days, you're already my kind of person.",
    stats: { clients: '200+', sessions: '1,400+', rating: '4.9' },
    offers: [
      { emoji: '📹', name: 'Free intro call',         duration: '15 min',                         price: 'Free', original: null   },
      { emoji: '👤', name: '1-on-1 coaching session', duration: '60 min',                         price: '$67',  original: '$85'  },
      { emoji: '📅', name: '8-week program',          duration: 'Custom plan + weekly check-ins', price: '$253', original: '$320' },
    ],
  },
  {
    id: 'sonal', initials: 'SR', color: '#0D9488', name: 'Sonal R.', title: 'Mindset & habit coach',
    rating: 4.8, reviews: 89, tags: ['Morning routines', 'Habit stacking', 'Mindset'],
    badge: '✓ Certified life coach · 5 yrs', badgeColor: 'var(--fs-teal-300)',
    originalPrice: '$65', discountedPrice: '$51', featured: false, tracks: ['mindset'],
    bio: "I help people go from knowing what to do to actually doing it every day. The 21-day mantra is exactly what I wish existed when I started my journey.",
    stats: { clients: '150+', sessions: '800+', rating: '4.8' },
    offers: [
      { emoji: '📹', name: 'Free intro call',  duration: '15 min',                       price: 'Free', original: null   },
      { emoji: '👤', name: '1-on-1 session',   duration: '45 min',                       price: '$51',  original: '$65'  },
      { emoji: '🔄', name: 'Monthly coaching', duration: '4 sessions + daily check-ins', price: '$174', original: '$220' },
    ],
  },
  {
    id: 'david', initials: 'DJ', color: '#E8604A', name: 'David J.', title: 'Guitar & music theory teacher',
    rating: 4.7, reviews: 54, tags: ['Guitar', 'Music theory', 'Songwriting'],
    badge: '★ 15 yrs performing · self-taught', badgeColor: '#F59E0B',
    originalPrice: '$55', discountedPrice: '$43', featured: false, tracks: ['music'],
    bio: "No music school. Just 15 years of obsession, touring, and teaching. I've helped 50+ beginners go from their first chord to writing their own songs.",
    stats: { clients: '50+', sessions: '300+', rating: '4.7' },
    offers: [
      { emoji: '📹', name: 'Free intro call', duration: '15 min',                          price: 'Free', original: null   },
      { emoji: '👤', name: '1-on-1 lesson',   duration: '45 min',                          price: '$43',  original: '$55'  },
      { emoji: '🎵', name: '6-week course',   duration: 'From chords to your first song',  price: '$142', original: '$180' },
    ],
  },
]

function ExpertCard({ expert, onViewProfile }) {
  return (
    <div className="fs-card" style={{ padding: 16, position: 'relative' }}>
      {expert.featured && (
        <span className="fs-badge fs-badge-purple" style={{ position: 'absolute', top: 12, right: 12 }}>Top match</span>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: expert.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
          {expert.initials}
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingRight: expert.featured ? 80 : 0 }}>
          <p style={{ fontWeight: 500, color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-sm)' }}>{expert.name}</p>
          <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)' }}>{expert.title}</p>
          <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)', marginTop: 2 }}>⭐ {expert.rating} ({expert.reviews} reviews)</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {expert.tags.map(tag => (
          <span key={tag} className="fs-badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--fs-text-secondary)', border: '1px solid var(--fs-border)' }}>{tag}</span>
        ))}
      </div>
      <p style={{ color: expert.badgeColor, fontSize: 'var(--fs-text-xs)', fontWeight: 500, marginBottom: 12 }}>{expert.badge}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--fs-border)' }}>
        <div>
          <span style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)', textDecoration: 'line-through', marginRight: 4 }}>{expert.originalPrice}</span>
          <span style={{ fontWeight: 700, color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-sm)' }}>{expert.discountedPrice}</span>
          <span style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)' }}> first session</span>
        </div>
        <button onClick={() => onViewProfile(expert.id)} className="fs-btn-primary" style={{ padding: '8px 16px', fontSize: 'var(--fs-text-xs)' }}>
          View profile
        </button>
      </div>
    </div>
  )
}

function ExpertProfile({ expert, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 32 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-sm)', textAlign: 'left', padding: 0 }}>
        ← Back to experts
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
        <div style={{ width: 76, height: 76, borderRadius: '50%', background: expert.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 24, fontWeight: 700 }}>
          {expert.initials}
        </div>
        <div>
          <h2 style={{ fontWeight: 500, color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-xl)', marginBottom: 4 }}>{expert.name}</h2>
          <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)', marginBottom: 4 }}>{expert.title}</p>
          <p style={{ color: expert.badgeColor, fontSize: 'var(--fs-text-xs)', fontWeight: 500 }}>{expert.badge}</p>
        </div>
      </div>
      <p style={{ color: 'var(--fs-text-secondary)', fontStyle: 'italic', fontSize: 'var(--fs-text-sm)', lineHeight: 1.7 }}>"{expert.bio}"</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[{ label: 'clients', value: expert.stats.clients }, { label: 'sessions', value: expert.stats.sessions }, { label: 'rating', value: expert.stats.rating }].map(({ label, value }) => (
          <div key={label} className="fs-card" style={{ padding: 12, textAlign: 'center' }}>
            <p style={{ fontWeight: 700, color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-lg)', marginBottom: 2 }}>{value}</p>
            <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)' }}>{label}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="fs-label" style={{ marginBottom: 12 }}>WHAT THEY OFFER</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {expert.offers.map((offer, i) => (
            <div key={i} className="fs-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>{offer.emoji}</span>
                <div>
                  <p style={{ fontWeight: 500, color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-sm)' }}>{offer.name}</p>
                  <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)' }}>{offer.duration}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                {offer.original && <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)', textDecoration: 'line-through' }}>{offer.original}</p>}
                <p style={{ fontWeight: 700, fontSize: 'var(--fs-text-sm)', color: offer.price === 'Free' ? 'var(--fs-teal-300)' : 'var(--fs-text-primary)' }}>{offer.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <button onClick={() => console.log(`Booking initiated for ${expert.name}`)} className="fs-btn-primary" style={{ width: '100%', marginBottom: 8 }}>
          Book free intro call
        </button>
        <p style={{ textAlign: 'center', fontSize: 'var(--fs-text-xs)', color: 'var(--fs-teal-300)' }}>🎁 21% graduate discount applied automatically</p>
      </div>
    </div>
  )
}

export default function Experts() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedId, setSelectedId]     = useState(null)
  const navigate = useNavigate()

  const selectedExpert = EXPERTS.find(e => e.id === selectedId)
  const filtered = activeFilter === 'all' ? EXPERTS : EXPERTS.filter(e => e.tracks.includes(activeFilter))

  return (
    <>
      <AuroraBackground />
      <div style={{ minHeight: '100vh', maxWidth: 480, margin: '0 auto' }}>
        <nav className="fs-topbar">
          <button
            onClick={() => navigate('/home')}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '22px', cursor: 'pointer', padding: '8px', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            ←
          </button>
          <button
            onClick={() => navigate('/settings')}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '20px', cursor: 'pointer', padding: '8px', lineHeight: 1 }}
          >
            ⚙
          </button>
        </nav>

        <div style={{ padding: '24px 20px' }}>
          {selectedExpert ? (
            <ExpertProfile expert={selectedExpert} onBack={() => setSelectedId(null)} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h1 className="fs-heading-md" style={{ marginBottom: 4 }}>Meet the experts</h1>
                <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)' }}>You earned this. Now go further.</p>
              </div>

              <div className="fs-card fs-card-teal" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>🎁</span>
                <div>
                  <p style={{ fontWeight: 500, color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-sm)' }}>21% graduate discount</p>
                  <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)', marginTop: 2 }}>Applied automatically to your first session</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                {FILTERS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    className={activeFilter === f.id ? 'fs-badge fs-badge-purple' : 'fs-badge'}
                    style={{
                      flexShrink: 0, cursor: 'pointer', padding: '6px 14px',
                      ...(activeFilter !== f.id ? { background: 'rgba(255,255,255,0.05)', color: 'var(--fs-text-secondary)', border: '1px solid var(--fs-border)' } : {}),
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 32 }}>
                {filtered.length > 0 ? (
                  filtered.map(expert => <ExpertCard key={expert.id} expert={expert} onViewProfile={setSelectedId} />)
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)' }}>No experts for this track yet.</p>
                    <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)', marginTop: 4 }}>Check back soon — we're growing.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
