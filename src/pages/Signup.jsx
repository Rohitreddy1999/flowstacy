import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function getStrength(pwd) {
  if (!pwd) return null
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  if (score <= 1) return { label: 'Weak',   color: '#EF4444', width: '33%' }
  if (score <= 3) return { label: 'Medium', color: '#F59E0B', width: '66%' }
  return              { label: 'Strong', color: '#10B981', width: '100%' }
}

const INPUT_STYLE = { border: '1px solid #e5e5e5', borderRadius: '12px', padding: '12px 16px' }

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

    if (password !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

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
      navigate('/discovery')
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Start your journey</h1>
          <p className="text-sm text-gray-400">Create your account — it's free</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-4 mb-4">
          <input
            type="text"
            required
            placeholder="Full name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full text-sm text-gray-800 focus:outline-none"
            style={INPUT_STYLE}
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full text-sm text-gray-800 focus:outline-none"
            style={INPUT_STYLE}
          />

          {/* Password + strength */}
          <div>
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full text-sm text-gray-800 focus:outline-none"
              style={INPUT_STYLE}
            />
            {strength && (
              <div className="mt-2 px-1">
                <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                  <div
                    className="h-1 rounded-full transition-all duration-300"
                    style={{ width: strength.width, backgroundColor: strength.color }}
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: strength.color }}>{strength.label}</p>
              </div>
            )}
          </div>

          <input
            type="password"
            required
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full text-sm text-gray-800 focus:outline-none"
            style={INPUT_STYLE}
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
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        {/* Terms */}
        <p className="text-xs text-gray-400 text-center px-4 leading-relaxed mb-6">
          By creating an account you agree to our Terms of Service and Privacy Policy
        </p>

        {/* Sign in link */}
        <p className="text-center text-sm text-gray-400 mt-auto pt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold" style={{ color: '#534AB7' }}>
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}
