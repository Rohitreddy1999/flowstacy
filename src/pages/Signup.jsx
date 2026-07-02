import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AuroraBackground from '../components/AuroraBackground'

function getStrength(pwd) {
  if (!pwd) return null
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  if (score <= 1) return { label: 'Weak',   color: '#EF4444', width: '33%' }
  if (score <= 3) return { label: 'Medium', color: '#F59E0B', width: '66%' }
  return              { label: 'Strong', color: 'var(--fs-teal-300)', width: '100%' }
}

export default function Signup() {
  const navigate = useNavigate()
  const [fullName,        setFullName]        = useState('')
  const [email,           setEmail]           = useState('')
  const [password,        setPassword]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error,           setError]           = useState('')
  const [loading,         setLoading]         = useState(false)

  const strength = getStrength(password)

  async function handleSignUp(e) {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError("Passwords don't match."); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      const hasSubtrack = localStorage.getItem('flowstate_selected_subtrack')
      navigate(hasSubtrack ? '/home' : '/discovery')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 24px' }}>
      <AuroraBackground />

      <div style={{ maxWidth: 420, margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="fs-logo" style={{ fontSize: 22 }}>flowstate</span>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h1 className="fs-heading-md" style={{ marginBottom: 6 }}>Start your journey</h1>
          <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)' }}>Create your account — it's free</p>
        </div>

        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
          <input
            type="text"
            required
            placeholder="Full name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="fs-input"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="fs-input"
          />

          <div>
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="fs-input"
            />
            {strength && (
              <div style={{ marginTop: 8, paddingLeft: 4 }}>
                <div style={{ height: 2, background: 'var(--fs-border)', borderRadius: 1, overflow: 'hidden' }}>
                  <div style={{ height: 2, width: strength.width, backgroundColor: strength.color, transition: 'width 0.3s' }} />
                </div>
                <p style={{ fontSize: 'var(--fs-text-xs)', marginTop: 4, color: strength.color }}>{strength.label}</p>
              </div>
            )}
          </div>

          <input
            type="password"
            required
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
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
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={{ fontSize: 'var(--fs-text-xs)', color: 'var(--fs-text-tertiary)', textAlign: 'center', padding: '0 16px 20px', lineHeight: 1.6 }}>
          By creating an account you agree to our Terms of Service and Privacy Policy
        </p>

        <p style={{ textAlign: 'center', fontSize: 'var(--fs-text-sm)', color: 'var(--fs-text-tertiary)', marginTop: 'auto', paddingTop: 16 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--fs-purple-300)', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}
