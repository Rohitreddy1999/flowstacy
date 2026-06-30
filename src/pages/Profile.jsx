import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'

export default function Profile() {
  const navigate = useNavigate()

  async function handleSignOut() {
    await supabase.auth.signOut()
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <nav className="border-b border-gray-100 px-6 py-4 sticky top-0 bg-white z-10">
        <span className="text-lg font-semibold tracking-tight" style={{ color: '#534AB7' }}>
          flowstate
        </span>
      </nav>

      <div className="max-w-[480px] mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-sm text-gray-400">
            Coming soon — your profile and settings will live here.
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full py-3 rounded-xl font-semibold text-base bg-white transition-colors hover:bg-red-50"
          style={{ border: '1px solid #EF4444', color: '#EF4444' }}
        >
          Sign out
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
