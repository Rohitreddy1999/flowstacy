import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AuroraBackground from './AuroraBackground'

function WelcomeBackScreen() {
  return (
    <>
      <AuroraBackground />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <p className="fs-logo" style={{ fontSize: 22, display: 'block', marginBottom: 24 }}>FLOWSTACY</p>
          <p className="fs-heading-sm" style={{ marginBottom: 8, fontWeight: 400 }}>Welcome back 👋</p>
          <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)', marginBottom: 24 }}>Continuing your journey...</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--fs-purple-500)', animation: 'loading-dot-pulse 1.5s ease-in-out infinite', animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default function RootRedirect() {
  const navigate = useNavigate()
  const [showWelcomeBack, setShowWelcomeBack] = useState(false)

  useEffect(() => {
    async function checkUserState() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        const lifeStage = localStorage.getItem('flowstacy_life_stage')
        navigate(lifeStage ? '/login?returning=true' : '/onboarding', { replace: true })
        return
      }
      const subtrack = localStorage.getItem('flowstacy_selected_subtrack')
      if (!subtrack) { navigate('/bridge', { replace: true }); return }
      const currentDay = parseInt(localStorage.getItem('flowstacy_current_day') || '1', 10)
      if (currentDay > 1) {
        setShowWelcomeBack(true)
        setTimeout(() => navigate('/home', { replace: true }), 2000)
      } else {
        navigate('/home', { replace: true })
      }
    }
    checkUserState()
  }, [navigate])

  if (showWelcomeBack) return <WelcomeBackScreen />

  return (
    <>
      <AuroraBackground />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <p className="fs-logo" style={{ fontSize: 22, display: 'block', marginBottom: 8 }}>FLOWSTACY</p>
          <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-sm)' }}>Loading your journey...</p>
        </div>
      </div>
    </>
  )
}
