import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const ABYSS = '#07090D'
const FATHOM = '#0F141A'
const SURGE = '#3DF5A6'
const GLACIAL = '#82D4FF'
const ARC_LIGHT = '#EAFFF5'

export default function Bridge() {
  const navigate = useNavigate()
  const [guidedHovered, setGuidedHovered] = useState(false)
  const [directHovered, setDirectHovered] = useState(false)

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
          onClick={() => navigate('/onboarding')}
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
      <div style={{ flex: 1, padding: '8px 24px 40px', position: 'relative', zIndex: 1 }}>

        {/* Heading block */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '36px' }}
        >
          <p style={{
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.22)',
            margin: '0 0 14px',
          }}>
            One more thing
          </p>
          <h1 style={{
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: '26px',
            color: 'rgba(255,255,255,0.95)',
            lineHeight: 1.28,
            margin: '0 0 10px',
            letterSpacing: '-0.022em',
          }}>
            How would you like<br />
            to find your track?
          </h1>
          <p style={{
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.35)',
            margin: 0,
            lineHeight: 1.6,
          }}>
            Answer a few questions and we match you. Or jump straight in.
          </p>
        </motion.div>

        {/* Path cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Guided discovery — neutral default, SURGE glow on hover */}
          <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.12,
              type: 'spring',
              stiffness: 320,
              damping: 26,
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/discovery')}
            onMouseEnter={() => setGuidedHovered(true)}
            onMouseLeave={() => setGuidedHovered(false)}
            style={{
              width: '100%',
              padding: '22px 20px',
              background: guidedHovered ? 'rgba(61,245,166,0.04)' : FATHOM,
              border: guidedHovered
                ? '1.5px solid rgba(61,245,166,0.28)'
                : '1.5px solid rgba(255,255,255,0.07)',
              borderRadius: '20px',
              cursor: 'pointer',
              textAlign: 'left',
              position: 'relative',
              overflow: 'hidden',
              outline: 'none',
              transition: 'background 200ms ease, border-color 200ms ease',
            }}
          >
            {/* Surge glow — only on hover */}
            <AnimatePresence>
              {guidedHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at top left, rgba(61,245,166,0.09) 0%, transparent 65%)',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </AnimatePresence>

            {/* Recommended badge */}
            <div style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              fontFamily: '"Hanken Grotesk", sans-serif',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: SURGE,
              background: 'rgba(61,245,166,0.1)',
              border: '1px solid rgba(61,245,166,0.22)',
              padding: '3px 8px',
              borderRadius: '20px',
            }}>
              RECOMMENDED
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(61,245,166,0.1)',
                border: '1px solid rgba(61,245,166,0.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: SURGE,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              </div>
              <div style={{ flex: 1, paddingRight: '80px' }}>
                <p style={{
                  fontFamily: '"Hanken Grotesk", sans-serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.9)',
                  margin: '0 0 5px',
                }}>
                  Answer a few questions
                </p>
                <p style={{
                  fontFamily: '"Hanken Grotesk", sans-serif',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.38)',
                  margin: '0 0 14px',
                  lineHeight: 1.55,
                }}>
                  We use your answers to suggest the perfect track for you.
                </p>
                <p style={{
                  fontFamily: '"Hanken Grotesk", sans-serif',
                  fontSize: '12px',
                  color: 'rgba(61,245,166,0.65)',
                  margin: 0,
                }}>
                  Takes less than 2 minutes
                </p>
              </div>
            </div>
          </motion.button>

          {/* Direct path — neutral glow on hover */}
          <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.20,
              type: 'spring',
              stiffness: 320,
              damping: 26,
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/track-select')}
            onMouseEnter={() => setDirectHovered(true)}
            onMouseLeave={() => setDirectHovered(false)}
            style={{
              width: '100%',
              padding: '22px 20px',
              background: directHovered ? 'rgba(255,255,255,0.03)' : FATHOM,
              border: directHovered
                ? '1.5px solid rgba(255,255,255,0.14)'
                : '1.5px solid rgba(255,255,255,0.07)',
              borderRadius: '20px',
              cursor: 'pointer',
              textAlign: 'left',
              outline: 'none',
              position: 'relative',
              overflow: 'hidden',
              transition: 'background 200ms ease, border-color 200ms ease',
            }}
          >
            <AnimatePresence>
              {directHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at top left, rgba(255,255,255,0.04) 0%, transparent 65%)',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </AnimatePresence>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: 'rgba(255,255,255,0.3)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </div>
              <div>
                <p style={{
                  fontFamily: '"Hanken Grotesk", sans-serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.72)',
                  margin: '0 0 5px',
                }}>
                  I know what I want
                </p>
                <p style={{
                  fontFamily: '"Hanken Grotesk", sans-serif',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.32)',
                  margin: 0,
                  lineHeight: 1.55,
                }}>
                  Browse all tracks and choose what calls to you directly.
                </p>
              </div>
            </div>
          </motion.button>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.13)',
            textAlign: 'center',
            marginTop: '28px',
            lineHeight: 1.5,
          }}
        >
          You can always retake the questions later from settings.
        </motion.p>
      </div>
    </motion.div>
  )
}
