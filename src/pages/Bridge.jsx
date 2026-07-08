import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const TOTAL_STEPS = 5
const CURRENT_STEP = 2

export default function Bridge() {
  const navigate = useNavigate()

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
          onClick={() => navigate('/onboarding')}
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
                width: i === CURRENT_STEP - 1 ? '16px' : '5px',
                height: '5px',
                borderRadius: '3px',
                background: i < CURRENT_STEP ? '#EAFFF5' : 'rgba(255,255,255,0.15)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        <div style={{ width: '26px' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '8px 24px 40px' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '32px' }}
        >
          <p style={{
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)',
            margin: '0 0 12px',
          }}>
            One more thing
          </p>
          <h1 style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: '26px',
            color: 'rgba(255,255,255,0.95)',
            lineHeight: 1.25,
            margin: '0 0 10px',
            letterSpacing: '-0.02em',
          }}>
            How would you like<br />
            to find your track?
          </h1>
          <p style={{
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: '13.5px',
            color: 'rgba(255,255,255,0.35)',
            margin: 0,
            lineHeight: 1.6,
          }}>
            Answer a few questions and we match you. Or jump straight in.
          </p>
        </motion.div>

        {/* Path cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Guided discovery — Glacial accent */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.985 }}
            onClick={() => navigate('/discovery')}
            style={{
              width: '100%',
              padding: '20px',
              background: 'rgba(130,212,255,0.05)',
              border: '1px solid rgba(130,212,255,0.2)',
              borderRadius: '18px',
              cursor: 'pointer',
              textAlign: 'left',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Glacial ambient glow */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at top left, rgba(130,212,255,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            {/* Recommended badge */}
            <div style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              fontFamily: '"Hanken Grotesk", sans-serif',
              fontSize: '9px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: '#82D4FF',
              background: 'rgba(130,212,255,0.1)',
              border: '1px solid rgba(130,212,255,0.2)',
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
                background: 'rgba(130,212,255,0.1)',
                border: '1px solid rgba(130,212,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#82D4FF',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              </div>
              <div style={{ flex: 1, paddingRight: '72px' }}>
                <p style={{
                  fontFamily: '"Hanken Grotesk", sans-serif',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.9)',
                  margin: '0 0 4px',
                }}>
                  Answer a few questions
                </p>
                <p style={{
                  fontFamily: '"Hanken Grotesk", sans-serif',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.38)',
                  margin: '0 0 12px',
                  lineHeight: 1.55,
                }}>
                  We use your answers to suggest the perfect track for you.
                </p>
                <p style={{
                  fontFamily: '"Hanken Grotesk", sans-serif',
                  fontSize: '12px',
                  color: 'rgba(130,212,255,0.65)',
                  margin: 0,
                }}>
                  Takes less than 2 minutes
                </p>
              </div>
            </div>
          </motion.button>

          {/* Direct path — neutral */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.985 }}
            onClick={() => navigate('/track-select')}
            style={{
              width: '100%',
              padding: '20px',
              background: '#0F141A',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '18px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
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
                color: 'rgba(255,255,255,0.35)',
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
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.75)',
                  margin: '0 0 4px',
                }}>
                  I know what I want
                </p>
                <p style={{
                  fontFamily: '"Hanken Grotesk", sans-serif',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.35)',
                  margin: 0,
                  lineHeight: 1.55,
                }}>
                  Browse all tracks and choose what calls to you directly.
                </p>
              </div>
            </div>
          </motion.button>
        </div>

        <p style={{
          fontFamily: '"Hanken Grotesk", sans-serif',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.15)',
          textAlign: 'center',
          marginTop: '24px',
          lineHeight: 1.5,
        }}>
          You can always retake the questions later from settings.
        </p>
      </div>
    </div>
  )
}
