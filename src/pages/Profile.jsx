import { useNavigate } from 'react-router-dom'
import { HiCog6Tooth } from 'react-icons/hi2'
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
          <button
            onClick={() => navigate('/settings')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
          >
            <HiCog6Tooth size={20} color="rgba(255,255,255,0.6)" />
          </button>
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
