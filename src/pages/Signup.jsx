import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const SURGE = '#3DF5A6'
const ABYSS = '#07090D'
const HK    = '"Hanken Grotesk", sans-serif'

export default function Signup() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const getPasswordStrength = (pwd) => {
    if (pwd.length === 0) return null
    if (pwd.length < 6) return {
      label: 'Too short',
      color: '#E24B4A',
      width: '25%'
    }
    if (pwd.length < 8) return {
      label: 'Weak',
      color: '#EF9F27',
      width: '50%'
    }
    if (pwd.match(/[A-Z]/) && pwd.match(/[0-9]/))
      return {
        label: 'Strong',
        color: '#1D9E75',
        width: '100%'
      }
    return {
      label: 'Medium',
      color: '#9D92F8',
      width: '75%'
    }
  }

  const strength = getPasswordStrength(password)

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    // Email already registered — Supabase silently returns empty identities
    if (data?.user?.identities?.length === 0) {
      toast.error('An account with this email already exists. Please sign in.')
      setLoading(false)
      return
    }

    // Email confirmation required — no session yet
    if (!data?.session) {
      toast.success('Account created! Check your email to verify, then sign in.')
      navigate('/login')
      return
    }

    toast.success('Account created!')
    navigate('/onboarding')
  }

  const inputWrapStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    transition: 'border-color 0.2s, background 0.2s',
  }

  const inputStyle = {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    padding: '14px 16px',
    outline: 'none',
    width: '100%',
    fontFamily: HK,
  }

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '500',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: '8px',
    fontFamily: HK,
  }

  return (
    <div style={{
      minHeight: '100%',
      background: '#0A0812',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 28px',
      maxWidth: '480px',
      margin: '0 auto',
      position: 'relative',
      fontFamily: HK
    }}>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate('/login')}
        style={{
          position: 'absolute',
          top: '52px',
          left: '24px',
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.6)',
          fontSize: '24px',
          cursor: 'pointer',
          padding: '8px',
          lineHeight: 1,
          zIndex: 10
        }}
      >
        ←
      </motion.button>

      {/* Logo and heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          textAlign: 'center',
          marginTop: '100px',
          marginBottom: '40px'
        }}
      >
        <motion.h1
          animate={{
            textShadow: [
              '0 0 20px rgba(61,245,166,0.3)',
              '0 0 40px rgba(61,245,166,0.6)',
              '0 0 20px rgba(61,245,166,0.3)'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            fontSize: '40px',
            fontWeight: '700',
            color: 'white',
            letterSpacing: '-0.02em',
            margin: '0 0 16px',
            fontFamily: HK
          }}
        >
          FLOWSTACY
        </motion.h1>
        <p style={{
          fontSize: '22px',
          fontWeight: '500',
          color: 'white',
          margin: '0 0 8px',
          fontFamily: HK
        }}>
          Start your journey
        </p>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.4)',
          margin: 0,
          fontFamily: HK
        }}>
          Create your free account
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {/* Full name */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Full name</label>
          <div
            style={inputWrapStyle}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(61,245,166,0.5)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Your name"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Email</label>
          <div
            style={inputWrapStyle}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(61,245,166,0.5)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: '8px' }}>
          <label style={labelStyle}>Password</label>
          <div
            style={inputWrapStyle}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(61,245,166,0.5)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              style={inputStyle}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                padding: '8px 12px',
                fontSize: '16px',
                flexShrink: 0
              }}
            >
              {showPassword ? '👁' : '👁‍🗨'}
            </button>
          </div>
        </div>

        {/* Password strength */}
        {strength && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginBottom: '24px' }}
          >
            <div style={{
              height: '3px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginBottom: '6px'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: strength.width }}
                transition={{ duration: 0.3 }}
                style={{
                  height: '100%',
                  background: strength.color,
                  borderRadius: '2px'
                }}
              />
            </div>
            <span style={{
              fontSize: '12px',
              color: strength.color
            }}>
              {strength.label}
            </span>
          </motion.div>
        )}

        {/* Confirm password */}
        <div style={{ marginBottom: '28px' }}>
          <label style={labelStyle}>Confirm password</label>
          <div
            style={{
              ...inputWrapStyle,
              borderColor: confirmPassword && confirmPassword !== password
                ? '#E24B4A'
                : 'rgba(255,255,255,0.08)'
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(61,245,166,0.5)'}
            onBlur={e => e.currentTarget.style.borderColor =
              confirmPassword !== password ? '#E24B4A' : 'rgba(255,255,255,0.08)'}
          >
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              onKeyDown={e =>
                e.key === 'Enter' && handleSignup()}
              placeholder="Repeat password"
              style={inputStyle}
            />
            <button
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                padding: '8px 12px',
                fontSize: '16px',
                flexShrink: 0
              }}
            >
              {showConfirm ? '👁' : '👁‍🗨'}
            </button>
          </div>
          {confirmPassword && confirmPassword !== password && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontSize: '12px',
                color: '#E24B4A',
                margin: '6px 0 0',
                fontFamily: HK
              }}
            >
              Passwords do not match
            </motion.p>
          )}
        </div>

        {/* Create account button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSignup}
          disabled={loading}
          style={{
            width: '100%',
            height: '56px',
            background: loading
              ? 'rgba(61,245,166,0.4)'
              : SURGE,
            border: 'none',
            borderRadius: '28px',
            color: ABYSS,
            fontSize: '16px',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '16px',
            boxShadow: '0 0 30px rgba(61,245,166,0.2)',
            transition: 'all 0.2s',
            fontFamily: HK
          }}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </motion.button>

        {/* Terms */}
        <p style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.25)',
          textAlign: 'center',
          lineHeight: 1.5,
          marginBottom: '32px',
          fontFamily: HK
        }}>
          By creating an account you agree to our{' '}
          <span style={{ color: SURGE }}>
            Terms of Service
          </span>
          {' '}and{' '}
          <span style={{ color: SURGE }}>
            Privacy Policy
          </span>
        </p>
      </motion.div>

      {/* Sign in link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          textAlign: 'center',
          padding: '0 0 40px'
        }}
      >
        <span style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.35)'
        }}>
          Already have an account?{' '}
        </span>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'none',
            border: 'none',
            color: SURGE,
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            padding: 0,
            fontFamily: HK
          }}
        >
          Sign in
        </button>
      </motion.div>
    </div>
  )
}
