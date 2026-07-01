import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function WelcomeBackScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <p className="text-2xl font-semibold mb-6" style={{ color: '#534AB7' }}>
          flowstate
        </p>
        <p className="text-3xl font-bold text-gray-900 mb-2">Welcome back 👋</p>
        <p className="text-sm text-gray-400 mb-6">Continuing your journey...</p>
        <div className="flex justify-center gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: '#534AB7', animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function RootRedirect() {
  const navigate = useNavigate()
  const [showWelcomeBack, setShowWelcomeBack] = useState(false)

  useEffect(() => {
    async function checkUserState() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        const lifeStage = localStorage.getItem('flowstate_life_stage')
        navigate(lifeStage ? '/login?returning=true' : '/onboarding', { replace: true })
        return
      }

      const subtrack = localStorage.getItem('flowstate_selected_subtrack')
      if (!subtrack) {
        navigate('/bridge', { replace: true })
        return
      }

      const currentDay = parseInt(localStorage.getItem('flowstate_current_day') || '1', 10)
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
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p className="text-2xl font-semibold" style={{ color: '#534AB7' }}>
          flowstate
        </p>
        <p className="text-gray-400 text-sm mt-2">Loading your journey...</p>
      </div>
    </div>
  )
}
