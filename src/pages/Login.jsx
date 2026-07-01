import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isReturning = searchParams.get('returning') === 'true'
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSignIn(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      const hasSubtrack = localStorage.getItem('flowstate_selected_subtrack')
      navigate(hasSubtrack ? '/home' : '/discovery')
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/home` },
    })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10">
      <div className="max-w-[420px] mx-auto w-full flex flex-col flex-1">

        {/* Logo */}
        <div className="text-center mb-10">
          <span className="text-2xl font-semibold tracking-tight" style={{ color: '#534AB7' }}>
            flowstate
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-400">Sign in to continue your journey</p>
        </div>

        {/* Returning-session banner */}
        {isReturning && (
          <div className="rounded-xl px-4 py-3 mb-6" style={{ backgroundColor: '#EEEDFE' }}>
            <p className="text-sm font-medium" style={{ color: '#534AB7' }}>
              Welcome back — just sign in to continue your journey
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-4 mb-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full text-sm text-gray-800 focus:outline-none"
            style={{ border: '1px solid #e5e5e5', borderRadius: '12px', padding: '12px 16px' }}
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full text-sm text-gray-800 focus:outline-none"
            style={{ border: '1px solid #e5e5e5', borderRadius: '12px', padding: '12px 16px' }}
          />

          {error && (
            <p className="text-xs text-red-500 px-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold text-base transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#534AB7', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* Forgot password */}
        <div className="text-right mb-6">
          <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Forgot password?
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="w-full py-3 rounded-xl text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          style={{ border: '1px solid #e5e5e5' }}
        >
          🅖 Continue with Google
        </button>

        {/* Sign up link */}
        <p className="text-center text-sm text-gray-400 mt-auto pt-10">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold" style={{ color: '#534AB7' }}>
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}
