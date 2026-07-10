import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useAnimationControls } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function LoadingScreen() {
  const navigate = useNavigate()
  const [taglineVisible, setTaglineVisible] = useState(false)

  const wordmarkControls = useAnimationControls()
  const boltControls = useAnimationControls()
  const flashControls = useAnimationControls()
  const strikeGlowControls = useAnimationControls()

  useEffect(() => {
    const navTimer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate(localStorage.getItem('flowstacy_life_stage') ? '/login' : '/welcome')
        return
      }
      const { data: journey } = await supabase
        .from('user_journeys')
        .select('id, subtrack_id, is_active')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .single()
      navigate(journey?.subtrack_id ? '/home' : '/bridge', { replace: true })
    }, 3000)

    async function runSequence() {
      // Phase 1 — wordmark appears dim, like an unpowered circuit
      await new Promise(r => setTimeout(r, 300))
      await wordmarkControls.start({
        opacity: 0.2,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      })

      // Hold dim — user reads the name but feels something missing
      await new Promise(r => setTimeout(r, 280))

      // Phase 2 — LIGHTNING STRIKES (all run in parallel)
      boltControls.start({
        opacity: [0, 1, 1, 0],
        transition: { duration: 0.24, times: [0, 0.08, 0.5, 1], ease: 'linear' },
      })
      flashControls.start({
        opacity: [0, 0.5, 0],
        transition: { duration: 0.2, times: [0, 0.12, 1], ease: 'linear' },
      })
      strikeGlowControls.start({
        opacity: [0, 1, 0.5, 0],
        scale: [0.6, 1.8, 1.3, 1],
        transition: { duration: 0.55, times: [0, 0.1, 0.4, 1] },
      })

      // Wordmark: shake and power on
      await wordmarkControls.start({
        opacity:  [0.2,  1,    0.9,  1,    1,    1,    1,    1   ],
        x:        [0,   -10,   12,  -8,    9,   -4,    3,    0   ],
        y:        [0,    3,    -4,   2,   -2,    1,   -1,    0   ],
        filter: [
          'brightness(1)',
          'brightness(4)',
          'brightness(2)',
          'brightness(1.4)',
          'brightness(1)',
          'brightness(1)',
          'brightness(1)',
          'brightness(1)',
        ],
        transition: { duration: 0.6, ease: 'easeOut' },
      })

      // Phase 3 — tagline drifts in after everything settles
      setTaglineVisible(true)
    }

    runSequence()
    return () => clearTimeout(navTimer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        position: 'absolute',
        inset: 0,
        background: '#07090D',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        zIndex: 999,
      }}
    >
      {/* Base Surge glow — ambient, blooms on mount */}
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          width: '580px',
          height: '260px',
          background: 'radial-gradient(ellipse at center, rgba(61,245,166,0.13) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      {/* Strike glow — explodes on lightning impact then vanishes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={strikeGlowControls}
        style={{
          position: 'absolute',
          width: '600px',
          height: '300px',
          background: 'radial-gradient(ellipse at center, rgba(61,245,166,0.65) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Full-screen flash on impact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={flashControls}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#EAFFF5',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      {/* Lightning bolt — top of screen down to wordmark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={boltControls}
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <svg
          width="64"
          height="400"
          viewBox="0 0 64 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="boltGlow" x="-80%" y="-5%" width="260%" height="110%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Surge-colored outer glow */}
          <polyline
            points="32,0 25,105 42,105 18,225 40,225 22,340 32,400"
            stroke="rgba(61,245,166,0.55)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#boltGlow)"
          />
          {/* Arc-Light bright core */}
          <polyline
            points="32,0 25,105 42,105 18,225 40,225 22,340 32,400"
            stroke="#EAFFF5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      {/* Wordmark + tagline */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px',
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={wordmarkControls}
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 900,
            fontSize: '52px',
            letterSpacing: '-0.03em',
            color: 'rgba(255,255,255,0.95)',
            margin: 0,
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          FLOWSTACY
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={taglineVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontWeight: 400,
            fontSize: '13px',
            color: 'rgba(255,255,255,0.45)',
            margin: 0,
            letterSpacing: '0.03em',
            userSelect: 'none',
          }}
        >
          21 days. One decision.
        </motion.p>
      </div>
    </motion.div>
  )
}
