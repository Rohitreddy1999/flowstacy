import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function LoadingScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        const subtrack = localStorage.getItem('flowstate_selected_subtrack')
        if (subtrack) {
          navigate('/home')
        } else {
          navigate('/bridge')
        }
      } else {
        const lifeStage = localStorage.getItem('flowstate_life_stage')
        if (lifeStage) {
          navigate('/login')
        } else {
          navigate('/onboarding')
        }
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0A0812',
        overflow: 'hidden',
      }}
    >
      {/* Aurora glow — top center */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(83,74,183,0.5) 0%, transparent 70%)',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Aurora glow — bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{
          position: 'absolute',
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(29,158,117,0.25) 0%, transparent 70%)',
          bottom: '25%',
          right: '10%',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Center content */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            fontSize: 42,
            fontWeight: 600,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            textShadow: '0 0 40px rgba(157,146,248,0.8), 0 0 80px rgba(83,74,183,0.4)',
            lineHeight: 1,
          }}
        >
          flowstate
        </motion.span>

        {/* Pulsing dot */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{ marginTop: 32 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.4, 1],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#9D92F8',
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}
