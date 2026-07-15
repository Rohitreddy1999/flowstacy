import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const ABYSS = '#07090D'
const FATHOM = '#0F141A'
const SURGE = '#3DF5A6'
const ARC_LIGHT = '#EAFFF5'

const LIFE_STAGES = [
  { id: 'student',     title: 'Still studying' },
  { id: 'career',      title: 'Building my career' },
  { id: 'family',      title: 'Juggling family life' },
  { id: 'reinventing', title: 'Reinventing myself' },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const handleContinue = () => {
    if (!selected) return
    localStorage.setItem('flowstacy_life_stage', selected)
    navigate('/bridge')
  }

  return (
    <motion.div
      initial={{ x: '100%', filter: 'blur(6px)' }}
      animate={{ x: 0, filter: 'blur(0px)' }}
      exit={{ x: '-100%', filter: 'blur(6px)' }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      style={{
        minHeight: '100%',
        background: ABYSS,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background question number */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: -10, opacity: 0.15 }}
        transition={{ duration: 5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          right: '-16px',
          top: '30px',
          fontFamily: '"Hanken Grotesk", sans-serif',
          fontWeight: 800,
          fontSize: '200px',
          color: ARC_LIGHT,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        01
      </motion.div>

      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '52px 24px 20px',
        position: 'relative',
        zIndex: 1,
      }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/welcome')}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.3)',
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

        <div style={{ width: '26px' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '8px 24px 180px', position: 'relative', zIndex: 1 }}>

        {/* Heading block */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '36px' }}
        >
          <h1 style={{
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: '26px',
            color: 'rgba(255,255,255,0.95)',
            lineHeight: 1.28,
            margin: '0 0 10px',
            letterSpacing: '-0.022em',
          }}>
            Before we begin —<br />
            where are you in<br />
            life right now?
          </h1>
          <p style={{
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: '14px',
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
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.08 + i * 0.08,
                  type: 'spring',
                  stiffness: 320,
                  damping: 26,
                }}
                whileTap={{ scale: 0.983 }}
                onClick={() => setSelected(option.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 20px',
                  background: isSelected ? 'rgba(61,245,166,0.04)' : FATHOM,
                  border: isSelected
                    ? `1.5px solid ${SURGE}`
                    : '1.5px solid rgba(255,255,255,0.07)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'background 150ms ease',
                  outline: 'none',
                }}
              >
                {/* Surge radial glow */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(ellipse at 0% 50%, rgba(61,245,166,0.08) 0%, transparent 65%)',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </AnimatePresence>

                <span style={{
                  fontFamily: '"Hanken Grotesk", sans-serif',
                  fontSize: '15px',
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? ARC_LIGHT : 'rgba(255,255,255,0.6)',
                  transition: 'color 150ms ease',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  {option.title}
                </span>

                {/* Checkmark — spring in/out */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 520, damping: 20 }}
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: SURGE,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke={ABYSS} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
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
        background: `linear-gradient(to bottom, transparent, ${ABYSS} 38%)`,
        pointerEvents: 'none',
        zIndex: 10,
      }}>
        {/* Disabled placeholder — 40% opacity, no interaction */}
        {!selected && (
          <div style={{
            width: '100%',
            height: '54px',
            background: SURGE,
            borderRadius: '27px',
            opacity: 0.4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px',
          }}>
            <span style={{
              fontFamily: '"Hanken Grotesk", sans-serif',
              fontSize: '15px',
              fontWeight: 700,
              color: ABYSS,
            }}>
              Continue
            </span>
          </div>
        )}

        {/* Active CTA — slides up from below */}
        <AnimatePresence>
          {selected && (
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleContinue}
              style={{
                width: '100%',
                height: '54px',
                background: SURGE,
                border: 'none',
                borderRadius: '27px',
                color: ABYSS,
                fontFamily: '"Hanken Grotesk", sans-serif',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                marginBottom: '10px',
                pointerEvents: 'auto',
                letterSpacing: '0.01em',
                display: 'block',
              }}
            >
              Continue
            </motion.button>
          )}
        </AnimatePresence>

        <button
          onClick={() => {
            localStorage.setItem('flowstacy_life_stage', 'skipped')
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
    </motion.div>
  )
}
