import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

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
    const { error } = await supabase.auth.signUp({
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

    toast.success('Account created!')
    navigate('/onboarding')
  }

  const inputStyle = {
    flex: 1,
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    color: 'white',
    fontSize: '16px',
    padding: '10px 0',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '500',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: '10px'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0812',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 28px',
      maxWidth: '480px',
      margin: '0 auto',
      position: 'relative'
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
              '0 0 20px rgba(157,146,248,0.4)',
              '0 0 40px rgba(157,146,248,0.8)',
              '0 0 20px rgba(157,146,248,0.4)'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            fontSize: '40px',
            fontWeight: '600',
            color: 'white',
            letterSpacing: '-0.02em',
            margin: '0 0 16px'
          }}
        >
          flowstate
        </motion.h1>
        <p style={{
          fontSize: '22px',
          fontWeight: '500',
          color: 'white',
          margin: '0 0 8px'
        }}>
          Start your journey
        </p>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.4)',
          margin: 0
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
        <div style={{ marginBottom: '28px' }}>
          <label style={labelStyle}>Full name</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Your name"
            style={inputStyle}
            onFocus={e =>
              e.target.style.borderBottomColor =
              'rgba(157,146,248,0.6)'}
            onBlur={e =>
              e.target.style.borderBottomColor =
              'rgba(255,255,255,0.15)'}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: '28px' }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={inputStyle}
            onFocus={e =>
              e.target.style.borderBottomColor =
              'rgba(157,146,248,0.6)'}
            onBlur={e =>
              e.target.style.borderBottomColor =
              'rgba(255,255,255,0.15)'}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '8px' }}>
          <label style={labelStyle}>Password</label>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              style={inputStyle}
              onFocus={e =>
                e.target.style.borderBottomColor =
                'rgba(157,146,248,0.6)'}
              onBlur={e =>
                e.target.style.borderBottomColor =
                'rgba(255,255,255,0.15)'}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 0,
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                padding: '8px',
                fontSize: '16px'
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
        <div style={{ marginBottom: '36px' }}>
          <label style={labelStyle}>Confirm password</label>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              onKeyDown={e =>
                e.key === 'Enter' && handleSignup()}
              placeholder="Repeat password"
              style={{
                ...inputStyle,
                borderBottomColor: confirmPassword &&
                  confirmPassword !== password
                  ? '#E24B4A'
                  : 'rgba(255,255,255,0.15)'
              }}
              onFocus={e =>
                e.target.style.borderBottomColor =
                'rgba(157,146,248,0.6)'}
              onBlur={e =>
                e.target.style.borderBottomColor =
                confirmPassword !== password
                ? '#E24B4A'
                : 'rgba(255,255,255,0.15)'}
            />
            <button
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: 'absolute',
                right: 0,
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                padding: '8px',
                fontSize: '16px'
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
                margin: '6px 0 0'
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
              ? 'rgba(83,74,183,0.5)'
              : '#534AB7',
            border: 'none',
            borderRadius: '28px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '16px',
            boxShadow: '0 0 30px rgba(83,74,183,0.3)',
            transition: 'all 0.2s'
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
          marginBottom: '32px'
        }}>
          By creating an account you agree to our{' '}
          <span style={{ color: '#9D92F8' }}>
            Terms of Service
          </span>
          {' '}and{' '}
          <span style={{ color: '#9D92F8' }}>
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
            color: '#9D92F8',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            padding: 0
          }}
        >
          Sign in
        </button>
      </motion.div>
    </div>
  )
}
