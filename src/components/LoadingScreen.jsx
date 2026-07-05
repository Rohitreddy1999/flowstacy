import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function LoadingScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(async () => {
      // Check auth session
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        // No session -- send to welcome or login
        const lifeStage = localStorage.getItem('flowstate_life_stage')
        navigate(lifeStage ? '/login' : '/welcome')
        return
      }

      // Session exists -- check Supabase for active journey
      const { data: journey, error } = await supabase
        .from('user_journeys')
        .select('id, subtrack_id, current_day, is_active')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .single()

      if (error) console.error('Journey check failed:', error)

      if (journey && journey.subtrack_id) {
        // Returning user with active journey -- go straight to home
        navigate('/home', { replace: true })
      } else {
        // Logged in but no journey -- send through onboarding
        navigate('/bridge', { replace: true })
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0A0812',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <motion.h1
        initial={{
          opacity: 0,
          scale: 0.9
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        transition={{
          duration: 1.2,
          ease: 'easeOut'
        }}
        style={{
          fontSize: '52px',
          fontWeight: '600',
          color: 'white',
          letterSpacing: '-0.02em',
          margin: 0,
          userSelect: 'none'
        }}
      >
        <motion.span
          animate={{
            textShadow: [
              '0 0 20px rgba(157,146,248,0.4), 0 0 60px rgba(83,74,183,0.2)',
              '0 0 40px rgba(157,146,248,0.9), 0 0 80px rgba(83,74,183,0.6), 0 0 120px rgba(83,74,183,0.3)',
              '0 0 20px rgba(157,146,248,0.4), 0 0 60px rgba(83,74,183,0.2)'
            ],
            scale: [1, 1.02, 1],
            y: [0, -3, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{ display: 'inline-block' }}
        >
          flowstate
        </motion.span>
      </motion.h1>
    </div>
  )
}
