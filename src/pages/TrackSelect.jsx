import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TRACKS } from '../lib/tracks'

const TOTAL_STEPS = 5
const CURRENT_STEP = 4

export default function TrackSelect() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const handleContinue = () => {
    if (!selected) return
    localStorage.setItem('flowstacy_selected_track', selected)
    navigate('/sub-track-select')
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
          onClick={() => navigate('/bridge')}
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
            What do you want<br />to transform?
          </h1>
          <p style={{
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: '13.5px',
            color: 'rgba(255,255,255,0.35)',
            margin: 0,
            lineHeight: 1.5,
          }}>
            Pick the track that calls to you. You can always try others after you graduate.
          </p>
        </motion.div>

        {/* Track cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {TRACKS.map((track, i) => {
            const isSelected = selected === track.id
            return (
              <motion.button
                key={track.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setSelected(track.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
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
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: isSelected ? 'rgba(61,245,166,0.12)' : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? '#3DF5A6' : 'rgba(255,255,255,0.4)',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}>
                  {track.icon}
                </div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: isSelected ? '#3DF5A6' : 'rgba(255,255,255,0.5)',
                    margin: '0 0 3px',
                    transition: 'color 0.2s',
                  }}>
                    {track.label}
                  </p>
                  <p style={{
                    fontFamily: '"Hanken Grotesk", sans-serif',
                    fontSize: '12.5px',
                    color: 'rgba(255,255,255,0.38)',
                    margin: 0,
                    lineHeight: 1.45,
                  }}>
                    {track.tagline}
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
            pointerEvents: 'auto',
            letterSpacing: '0.01em',
          }}
        >
          Lock it in.
        </motion.button>
      </div>
    </div>
  )
}
