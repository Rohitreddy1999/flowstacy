import { useNavigate } from 'react-router-dom'
import { HiCog6Tooth } from 'react-icons/hi2'
import AuroraBackground from '../components/AuroraBackground'
import BottomNav from '../components/BottomNav'

export default function Progress() {
  const navigate = useNavigate()
  return (
    <>
      <AuroraBackground />
      <div className="fs-page">
        <nav className="fs-topbar">
          <span className="fs-logo">flowstate</span>
          <button
            onClick={() => navigate('/settings')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
          >
            <HiCog6Tooth size={20} color="rgba(255,255,255,0.6)" />
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
    </>
  )
}
