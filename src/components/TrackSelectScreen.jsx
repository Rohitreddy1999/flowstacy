import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const ABYSS = '#07090D'
const FATHOM = '#0F141A'
const SURGE = '#3DF5A6'
const GLACIAL = '#82D4FF'
const PLASMA = '#FF4FD8'
const ARC_LIGHT = '#EAFFF5'

const TRACKS = [
  {
    id: 'move',
    name: 'Move',
    tagline: 'Your body knows before your brain does. Start there.',
    color: SURGE,
    icon: (
      // Activity pulse — physical movement
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    id: 'rhythm',
    name: 'Rhythm',
    tagline: "You don't need an instrument. Just 21 days and one ear.",
    color: SURGE,
    icon: (
      // Music notes
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>
    ),
  },
  {
    id: 'express',
    name: 'Express',
    tagline: "You've been seeing it for years. Now put it on paper.",
    color: PLASMA,
    icon: (
      // Paint palette — kidney shape + filled paint blobs
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 2C6 2 2 6 2 11s4 9 9 9a2 2 0 0 0 2-2c0-.5-.2-.9-.5-1.3-.3-.3-.5-.7-.5-1.2a1.5 1.5 0 0 1 1.5-1.5H16a4 4 0 0 0 4-4C20 6.5 16 2 11 2z"/>
        <circle cx="7" cy="10" r="1.2" fill="currentColor" stroke="none"/>
        <circle cx="9" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
        <circle cx="13" cy="6" r="1.2" fill="currentColor" stroke="none"/>
        <circle cx="16" cy="9" r="1.2" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: 'calm',
    name: 'Calm',
    tagline: 'Not less. Just quieter. So you can finally hear yourself.',
    color: GLACIAL,
    icon: (
      // Wind — breathwork and breath control
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.59 4.59A2 2 0 1111 8H2"/>
        <path d="M10.59 19.41A2 2 0 1014 16H2"/>
        <path d="M15.73 3.73A2.5 2.5 0 1119.5 7H2"/>
      </svg>
    ),
  },
  {
    id: 'mindful',
    name: 'Mindful',
    tagline: "You already know what's good. Learn to feel it again.",
    color: PLASMA,
    icon: (
      // Eye — awareness and inner reflection
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
]

export default function TrackSelectScreen({ recommendedTrack = null, backTo = '/bridge' }) {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(recommendedTrack)

  const handleContinue = () => {
    if (!selected) return
    localStorage.setItem('flowstacy_selected_track', selected)
    navigate('/sub-track-select')
  }

  const isRecommendedMode = !!recommendedTrack

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
          onClick={() => navigate(backTo)}
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

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '32px' }}
        >
          {isRecommendedMode ? (
            <>
              <p style={{
                fontFamily: '"Hanken Grotesk", sans-serif',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.22)',
                margin: '0 0 14px',
              }}>
                Your match
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
                Here's what we think —<br />
                but you know yourself best.
              </h1>
              <p style={{
                fontFamily: '"Hanken Grotesk", sans-serif',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.35)',
                margin: 0,
                lineHeight: 1.55,
              }}>
                We've highlighted what resonated most. Choose whatever calls to you.
              </p>
            </>
          ) : (
            <>
              <h1 style={{
                fontFamily: '"Hanken Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: '26px',
                color: 'rgba(255,255,255,0.95)',
                lineHeight: 1.28,
                margin: '0 0 10px',
                letterSpacing: '-0.022em',
              }}>
                What do you want<br />to transform?
              </h1>
              <p style={{
                fontFamily: '"Hanken Grotesk", sans-serif',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.35)',
                margin: 0,
                lineHeight: 1.55,
              }}>
                Pick the track that calls to you.
              </p>
            </>
          )}
        </motion.div>

        {/* Track cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {TRACKS.map((track, i) => {
            const isSelected = selected === track.id
            const isRecommended = track.id === recommendedTrack

            return (
              <motion.button
                key={track.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: i * 0.08,
                  type: 'spring',
                  stiffness: 320,
                  damping: 26,
                }}
                whileTap={{ scale: 0.984 }}
                onClick={() => setSelected(track.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '18px',
                  background: isSelected
                    ? 'rgba(61,245,166,0.05)'
                    : isRecommended
                      ? 'rgba(61,245,166,0.02)'
                      : FATHOM,
                  border: isSelected
                    ? `1.5px solid ${SURGE}`
                    : isRecommended
                      ? '1.5px solid rgba(61,245,166,0.22)'
                      : '1.5px solid rgba(255,255,255,0.07)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  position: 'relative',
                  overflow: 'hidden',
                  outline: 'none',
                  transition: 'background 150ms ease',
                  boxShadow: isRecommended
                    ? '0 0 28px rgba(61,245,166,0.07)'
                    : 'none',
                }}
              >
                {/* Radial glow — selected or recommended */}
                <AnimatePresence>
                  {(isSelected || isRecommended) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: isSelected
                          ? 'radial-gradient(ellipse at 0% 50%, rgba(61,245,166,0.08) 0%, transparent 65%)'
                          : 'radial-gradient(ellipse at 0% 50%, rgba(61,245,166,0.04) 0%, transparent 60%)',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* RECOMMENDED badge */}
                {isRecommended && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
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
                )}

                {/* Track icon */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: isSelected
                    ? 'rgba(61,245,166,0.12)'
                    : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? SURGE : 'rgba(255,255,255,0.38)',
                  flexShrink: 0,
                  marginRight: '14px',
                  transition: 'all 0.2s',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  {track.icon}
                </div>

                {/* Track name + one-liner */}
                <div style={{
                  flex: 1,
                  paddingRight: isRecommended ? '90px' : '0',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <p style={{
                    fontFamily: '"Hanken Grotesk", sans-serif',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: isSelected ? ARC_LIGHT : 'rgba(255,255,255,0.88)',
                    margin: '0 0 3px',
                    transition: 'color 150ms ease',
                  }}>
                    {track.name}
                  </p>
                  <p style={{
                    fontFamily: '"Hanken Grotesk", sans-serif',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.32)',
                    margin: 0,
                    lineHeight: 1.45,
                  }}>
                    {track.tagline}
                  </p>
                </div>

                {/* Checkmark — springs in on select */}
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
          }}>
            <span style={{
              fontFamily: '"Hanken Grotesk", sans-serif',
              fontSize: '15px',
              fontWeight: 700,
              color: ABYSS,
            }}>
              Begin my 21 days →
            </span>
          </div>
        )}

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
                pointerEvents: 'auto',
                letterSpacing: '0.01em',
              }}
            >
              Begin my 21 days →
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
