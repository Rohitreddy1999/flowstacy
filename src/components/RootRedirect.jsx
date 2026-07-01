import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function RootRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    async function checkUserState() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        const lifeStage = localStorage.getItem('flowstate_life_stage')
        navigate(lifeStage ? '/login' : '/onboarding', { replace: true })
        return
      }

      const subtrack = localStorage.getItem('flowstate_selected_subtrack')
      navigate(subtrack ? '/home' : '/bridge', { replace: true })
    }

    checkUserState()
  }, [navigate])

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
