import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AuroraBackground from './AuroraBackground'

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [user,    setUser]    = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate('/login', { replace: true })
        return
      }

      // Check if user has an active journey in Supabase
      const { data: journey } = await supabase
        .from('user_journeys')
        .select('id, subtrack_id')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .single()

      if (!journey || !journey.subtrack_id) {
        // Authenticated but no journey -- send back to onboarding
        navigate('/onboarding', { replace: true })
        return
      }

      setUser(session.user)
      setLoading(false)
    })
  }, [navigate])

  if (loading) {
    return (
      <>
        <AuroraBackground />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <p style={{ color: 'var(--fs-purple-300)', fontSize: 'var(--fs-text-base)', fontWeight: 500 }}>Loading...</p>
        </div>
      </>
    )
  }

  return user ? children : null
}
