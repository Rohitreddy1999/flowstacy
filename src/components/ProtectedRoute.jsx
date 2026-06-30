import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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
      <div className="flex items-center justify-center h-screen font-medium" style={{ color: '#534AB7' }}>
        Loading...
      </div>
    )
  }

  return user ? children : null
}
