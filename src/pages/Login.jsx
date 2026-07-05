import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

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
    const { error } = await supabase.auth
      .signInWithPassword({ email, password })

    if (error) {
      toast.error('Incorrect email or password')
      setLoading(false)
      return
    }

    // After successful login, check Supabase for active journey
    const { data: { session } } = await supabase.auth.getSession()
    const { data: journey } = await supabase
      .from('user_journeys')
      .select('id, subtrack_id, is_active')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .single()

    if (journey && journey.subtrack_id) {
      navigate('/home', { replace: true })
    } else {
      navigate('/bridge', { replace: true })
    }
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
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate(-1)}
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

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          textAlign: 'center',
          marginTop: '120px',
          marginBottom: '48px'
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
          Welcome back
        </p>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.4)',
          margin: 0,
          lineHeight: 1.5
        }}>
          Sign in to continue your journey
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ flex: 1 }}
      >
        {/* Email field */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: '500',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: '10px'
          }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="your@email.com"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.15)',
              color: 'white',
              fontSize: '16px',
              padding: '10px 0',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s'
            }}
            onFocus={e =>
              e.target.style.borderBottomColor =
              'rgba(157,146,248,0.6)'}
            onBlur={e =>
              e.target.style.borderBottomColor =
              'rgba(255,255,255,0.15)'}
          />
        </div>

        {/* Password field */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: '500',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: '10px'
          }}>
            Password
          </label>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
                fontSize: '16px',
                padding: '10px 0',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
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

        {/* Forgot password */}
        <div style={{
          textAlign: 'right',
          marginBottom: '40px'
        }}>
          <button
            onClick={() => toast('Password reset coming soon')}
            style={{
              background: 'none',
              border: 'none',
              color: '#9D92F8',
              fontSize: '13px',
              cursor: 'pointer',
              padding: '4px 0'
            }}
          >
            Forgot password?
          </button>
        </div>

        {/* Sign in button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
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
            marginBottom: '20px',
            boxShadow: '0 0 30px rgba(83,74,183,0.3)',
            transition: 'all 0.2s'
          }}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </motion.button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'rgba(255,255,255,0.08)'
          }} />
          <span style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.25)'
          }}>or</span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'rgba(255,255,255,0.08)'
          }} />
        </div>

        {/* Google button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => toast('Google sign in coming soon')}
          style={{
            width: '100%',
            height: '52px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '28px',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <span style={{ fontSize: '18px' }}>G</span>
          Continue with Google
        </motion.button>
      </motion.div>

      {/* Sign up link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          textAlign: 'center',
          padding: '24px 0 40px'
        }}
      >
        <span style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.35)'
        }}>
          Don't have an account?{' '}
        </span>
        <button
          onClick={() => navigate('/signup')}
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
          Sign up
        </button>
      </motion.div>
    </div>
  )
}
