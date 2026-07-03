import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AuroraBackground from '../components/AuroraBackground'

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
      navigate(hasSubtrack ? '/home' : '/bridge')
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/home` },
    })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 24px' }}>
      <AuroraBackground />

      <div style={{ maxWidth: 420, margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="fs-logo" style={{ fontSize: 22 }}>flowstate</span>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h1 className="fs-heading-md" style={{ marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)' }}>Sign in to continue your journey</p>
        </div>

        {isReturning && (
          <div className="fs-card fs-card-purple" style={{ padding: '12px 16px', marginBottom: 20 }}>
            <p style={{ color: 'var(--fs-purple-300)', fontSize: 'var(--fs-text-sm)' }}>
              Welcome back — just sign in to continue your journey
            </p>
          </div>
        )}

        <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="fs-input"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="fs-input"
          />

          {error && (
            <p style={{ color: '#F87171', fontSize: 'var(--fs-text-xs)', paddingLeft: 4 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="fs-btn-primary"
            style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={{ textAlign: 'right', marginBottom: 24 }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)' }}>
            Forgot password?
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--fs-border)' }} />
          <span style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--fs-border)' }} />
        </div>

        <button
          onClick={handleGoogle}
          className="fs-btn-secondary"
          style={{ width: '100%' }}
        >
          🅖 Continue with Google
        </button>

        <p style={{ textAlign: 'center', fontSize: 'var(--fs-text-sm)', color: 'var(--fs-text-tertiary)', marginTop: 'auto', paddingTop: 40 }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--fs-purple-300)', fontWeight: 500 }}>
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}
