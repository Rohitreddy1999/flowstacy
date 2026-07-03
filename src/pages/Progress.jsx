import { useNavigate } from 'react-router-dom'
import AuroraBackground from '../components/AuroraBackground'
import BottomNav from '../components/BottomNav'
import PageTransition from '../components/PageTransition'

export default function Progress() {
  const navigate = useNavigate()
  return (
    <PageTransition>
      <AuroraBackground />
      <div className="fs-page">
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
        <div style={{ padding: '32px 20px' }}>
          <h1 className="fs-heading-md" style={{ marginBottom: 8 }}>Your Progress</h1>
          <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)' }}>
            Coming soon — your full 21-day journey will live here.
          </p>
        </div>
      </div>
      <BottomNav />
    </PageTransition>
  )
}
