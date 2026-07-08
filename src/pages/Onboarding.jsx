import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const LIFE_STAGES = [
  {
    id: 'student',
    title: 'Still studying',
    description: 'Figuring out who I am and what I want',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  {
    id: 'career',
    title: 'Building my career',
    description: 'Finding my footing in the real world',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
  {
    id: 'family',
    title: 'Juggling family life',
    description: 'Carving out time for myself',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: 'reinventing',
    title: 'Reinventing myself',
    description: 'Starting a fresh new chapter',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/>
        <polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
      </svg>
    ),
  },
]

const TOTAL_STEPS = 5

export default function Onboarding() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const handleContinue = () => {
    if (!selected) return
    localStorage.setItem('flowstate_life_stage', selected)
    navigate('/bridge')
  }

  return (
    <div style={{
      minHeight: '100%',
      background: '#07090D',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>

      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '52px 24px 20px',
      }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/welcome')}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.35)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </motion.button>

        {/* Step dots */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === 0 ? '16px' : '5px',
                height: '5px',
                borderRadius: '3px',
                background: i === 0 ? '#EAFFF5' : 'rgba(255,255,255,0.15)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        <div style={{ width: '26px' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '8px 24px 160px' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '32px' }}
        >
          <h1 style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: '26px',
            color: 'rgba(255,255,255,0.95)',
            lineHeight: 1.25,
            margin: '0 0 10px',
            letterSpacing: '-0.02em',
          }}>
            Before we begin —<br />
            where are you in<br />
            life right now?
          </h1>
          <p style={{
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: '13.5px',
            color: 'rgba(255,255,255,0.35)',
            margin: 0,
            lineHeight: 1.5,
          }}>
            Just so we speak your language.
          </p>
        </motion.div>

        {/* Option cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {LIFE_STAGES.map((option, i) => {
            const isSelected = selected === option.id
            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setSelected(option.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px 16px',
                  background: isSelected ? 'rgba(61,245,166,0.06)' : '#0F141A',
                  border: isSelected
                    ? '1px solid rgba(61,245,166,0.45)'
                    : '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  gap: '14px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Surge glow on selected */}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at left center, rgba(61,245,166,0.07) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }} />
                )}

                {/* Icon well */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(61,245,166,0.12)' : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? '#3DF5A6' : 'rgba(255,255,255,0.4)',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}>
                  {option.icon}
                </div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontFamily: '"Hanken Grotesk", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: isSelected ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.75)',
                    margin: '0 0 2px',
                    transition: 'color 0.2s',
                  }}>
                    {option.title}
                  </p>
                  <p style={{
                    fontFamily: '"Hanken Grotesk", sans-serif',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.35)',
                    margin: 0,
                    lineHeight: 1.4,
                  }}>
                    {option.description}
                  </p>
                </div>

                {/* Checkmark */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#3DF5A6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="#07090D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        padding: '16px 24px 44px',
        background: 'linear-gradient(to bottom, transparent, #07090D 40%)',
        pointerEvents: 'none',
      }}>
        <motion.button
          whileTap={{ scale: selected ? 0.97 : 1 }}
          onClick={handleContinue}
          animate={{
            opacity: selected ? 1 : 0.2,
            y: selected ? 0 : 4,
          }}
          transition={{ duration: 0.25 }}
          style={{
            width: '100%',
            height: '52px',
            background: '#3DF5A6',
            border: 'none',
            borderRadius: '26px',
            color: '#07090D',
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: '15px',
            fontWeight: 600,
            cursor: selected ? 'pointer' : 'not-allowed',
            marginBottom: '10px',
            pointerEvents: 'auto',
            letterSpacing: '0.01em',
          }}
        >
          Continue
        </motion.button>

        <button
          onClick={() => {
            localStorage.setItem('flowstate_life_stage', 'skipped')
            navigate('/bridge')
          }}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            fontFamily: '"Hanken Grotesk", sans-serif',
            color: 'rgba(255,255,255,0.2)',
            fontSize: '13px',
            cursor: 'pointer',
            padding: '8px',
            pointerEvents: 'auto',
          }}
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
