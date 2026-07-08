import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function InputField({ label, type, value, onChange, onKeyDown, placeholder, rightSlot }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: '28px' }}>
      <label style={{
        display: 'block',
        fontFamily: '"Hanken Grotesk", sans-serif',
        fontSize: '10px',
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: focused ? 'rgba(61,245,166,0.7)' : 'rgba(255,255,255,0.3)',
        marginBottom: '10px',
        transition: 'color 0.2s',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            borderBottom: focused
              ? '1px solid rgba(61,245,166,0.55)'
              : '1px solid rgba(255,255,255,0.12)',
            color: '#EAFFF5',
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: '15px',
            fontWeight: 400,
            padding: '10px 0',
            paddingRight: rightSlot ? '32px' : '0',
            outline: 'none',
            transition: 'border-color 0.2s',
            width: '100%',
          }}
          autoComplete="off"
          autoCapitalize="none"
        />
        {rightSlot && (
          <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error('Incorrect email or password')
      setLoading(false)
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    const { data: journey } = await supabase
      .from('user_journeys')
      .select('id, subtrack_id, is_active')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .single()

    navigate(journey?.subtrack_id ? '/home' : '/bridge', { replace: true })
  }

  const stagger = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
  }

  return (
    <div style={{
      minHeight: '100%',
      background: '#07090D',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Ambient Surge glow — barely there */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '300px',
        background: 'radial-gradient(ellipse at center, rgba(61,245,166,0.05) 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate(-1)}
        style={{
          alignSelf: 'flex-start',
          marginTop: '52px',
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.35)',
          cursor: 'pointer',
          padding: '8px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </motion.button>

      {/* Wordmark */}
      <motion.h1
        {...stagger}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 900,
          fontSize: '24px',
          letterSpacing: '-0.02em',
          color: 'rgba(255,255,255,0.9)',
          margin: '32px 0 40px',
          userSelect: 'none',
        }}
      >
        FLOWSTACY
      </motion.h1>

      {/* Card */}
      <motion.div
        {...stagger}
        transition={{ duration: 0.45, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '400px',
          background: '#0F141A',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '20px',
          padding: '32px 28px 28px',
        }}
      >
        {/* Heading */}
        <h2 style={{
          fontFamily: '"Hanken Grotesk", sans-serif',
          fontWeight: 600,
          fontSize: '22px',
          color: 'rgba(255,255,255,0.95)',
          margin: '0 0 8px',
          letterSpacing: '-0.01em',
        }}>
          Welcome back.
        </h2>
        <p style={{
          fontFamily: '"Hanken Grotesk", sans-serif',
          fontSize: '13.5px',
          color: 'rgba(255,255,255,0.4)',
          margin: '0 0 32px',
          lineHeight: 1.5,
        }}>
          Sign in to continue your 21 days.
        </p>

        {/* Email */}
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="your@email.com"
        />

        {/* Password */}
        <InputField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="••••••••"
          rightSlot={
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
              tabIndex={-1}
            >
              <EyeIcon open={showPassword} />
            </button>
          }
        />

        {/* Forgot password */}
        <div style={{ textAlign: 'right', marginTop: '-16px', marginBottom: '32px' }}>
          <button
            onClick={() => toast('Password reset coming soon')}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: '"Hanken Grotesk", sans-serif',
              fontSize: '12px',
              color: 'rgba(61,245,166,0.6)',
              cursor: 'pointer',
              padding: '4px 0',
            }}
          >
            Forgot password?
          </button>
        </div>

        {/* Continue CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            height: '52px',
            background: loading ? 'rgba(61,245,166,0.4)' : '#3DF5A6',
            border: 'none',
            borderRadius: '26px',
            color: '#07090D',
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: '15px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '20px',
            transition: 'background 0.2s',
            letterSpacing: '0.01em',
          }}
        >
          {loading ? 'Signing in...' : 'Continue'}
        </motion.button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          <span style={{
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.25)',
          }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
        </div>

        {/* Google */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => toast('Google sign in coming soon')}
          style={{
            width: '100%',
            height: '48px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '24px',
            color: 'rgba(255,255,255,0.55)',
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="rgba(255,255,255,0.4)"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="rgba(255,255,255,0.4)"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="rgba(255,255,255,0.4)"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="rgba(255,255,255,0.4)"/>
          </svg>
          Continue with Google
        </motion.button>
      </motion.div>

      {/* Sign up link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        style={{
          marginTop: '28px',
          textAlign: 'center',
          paddingBottom: '40px',
        }}
      >
        <span style={{
          fontFamily: '"Hanken Grotesk", sans-serif',
          fontSize: '13.5px',
          color: 'rgba(255,255,255,0.3)',
        }}>
          New here?{' '}
        </span>
        <button
          onClick={() => navigate('/signup')}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: '13.5px',
            fontWeight: 500,
            color: '#82D4FF',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Start your 21 days.
        </button>
      </motion.div>
    </div>
  )
}
