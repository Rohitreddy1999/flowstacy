import { Link, useParams } from 'react-router-dom'
import AuroraBackground from '../components/AuroraBackground'

export default function TrackDetail() {
  const { trackId } = useParams()

  return (
    <>
      <AuroraBackground />
      <div style={{ minHeight: '100%', padding: '40px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Link to="/home" style={{ color: 'var(--fs-purple-300)', fontSize: 'var(--fs-text-sm)', textDecoration: 'none' }}>
            ← Back to Today
          </Link>
          <h1 className="fs-heading-md">Track Detail</h1>
          <span className="fs-badge fs-badge-purple" style={{ alignSelf: 'flex-start' }}>
            trackId: {trackId}
          </span>
          <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-base)', lineHeight: 1.6 }}>
            The full 21-day curriculum for your selected track. Browse daily lessons, habit stacks, video content, and expert guidance — all in one place.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3].map(day => (
              <div key={day} className="fs-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: 500, color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-sm)' }}>Day {day}</p>
                  <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)' }}>— Content coming soon —</p>
                </div>
                <span style={{ color: 'var(--fs-text-tertiary)', fontSize: 20 }}>›</span>
              </div>
            ))}
          </div>
          <Link
            to="/community"
            className="fs-btn-primary"
            style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '14px 24px' }}
          >
            Next: Community →
          </Link>
        </div>
      </div>
    </>
  )
}
