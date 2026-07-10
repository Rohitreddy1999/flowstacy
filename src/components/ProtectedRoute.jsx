import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AuroraBackground from './AuroraBackground'

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [user,    setUser]    = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (!session) navigate('/login', { replace: true })
    })
  }, [navigate])

  if (loading) {
    return (
      <>
        <AuroraBackground />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <p style={{ color: 'var(--fs-purple-300)', fontSize: 'var(--fs-text-base)', fontWeight: 500 }}>Loading...</p>
        </div>
      </>
    )
  }

  return user ? children : null
}
