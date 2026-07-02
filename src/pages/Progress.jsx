import AuroraBackground from '../components/AuroraBackground'
import BottomNav from '../components/BottomNav'

export default function Progress() {
  return (
    <>
      <AuroraBackground />
      <div className="fs-page">
        <nav className="fs-topbar">
          <span className="fs-logo">flowstate</span>
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
