import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AuroraBackground from '../components/AuroraBackground'
import BottomNav from '../components/BottomNav'

export default function Profile() {
  const navigate = useNavigate()

  async function handleSignOut() {
    await supabase.auth.signOut()
    localStorage.clear()
    navigate('/login')
  }

  return (
    <>
      <AuroraBackground />
      <div className="fs-page">
        <nav className="fs-topbar">
          <span className="fs-logo">flowstate</span>
        </nav>
        <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <h1 className="fs-heading-md" style={{ marginBottom: 8 }}>Profile</h1>
            <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)' }}>
              Coming soon — your profile and settings will live here.
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="fs-btn-secondary"
            style={{ width: '100%', borderColor: '#EF4444', color: '#F87171' }}
          >
            Sign out
          </button>
        </div>
      </div>
      <BottomNav />
    </>
  )
}
