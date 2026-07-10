import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TRACKS } from '../lib/tracks'

export default function Recommendation() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [recommended, setRecommended] = useState([])

  useEffect(() => {
    const scoresRaw = localStorage.getItem('flowstacy_scores')
    if (scoresRaw) {
      const scores = JSON.parse(scoresRaw)
      const sorted = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([track]) => track)
      setRecommended(sorted)
      setSelected(sorted[0])
    }
  }, [])

  const handleContinue = () => {
    if (!selected) return
    localStorage.setItem('flowstacy_selected_track', selected)
    navigate('/sub-track-select')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0812',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '480px',
      margin: '0 auto'
    }}>

      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '52px 20px 16px'
      }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/discovery')}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '22px',
            cursor: 'pointer',
            padding: '8px',
            lineHeight: 1
          }}
        >
          ←
        </motion.button>
      </div>

      <div style={{ padding: '0 28px 140px' }}>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '32px' }}
        >
          <p style={{
            fontSize: '11px',
            fontWeight: '500',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            margin: '0 0 10px'
          }}>
            Your match
          </p>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: 'white',
            lineHeight: 1.25,
            margin: '0 0 8px',
            letterSpacing: '-0.01em'
          }}>
            Here's what we think —<br />
            but you know yourself best.
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.38)',
            margin: 0,
            lineHeight: 1.5
          }}>
            We've highlighted what resonated most
            from your answers. Choose whatever
            calls to you.
          </p>
        </motion.div>

        {/* Track cards */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {TRACKS.map((track, i) => {
            const isSelected = selected === track.id
            const isRecommended = recommended.includes(track.id)
            const isTopMatch = recommended[0] === track.id

            return (
              <motion.button
                key={track.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelected(track.id)}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: isSelected
                    ? track.lightColor
                    : 'rgba(255,255,255,0.03)',
                  border: isSelected
                    ? `1px solid ${track.borderColor}`
                    : '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  position: 'relative',
                  transition: 'all 0.2s'
                }}
              >
                {/* Recommended badge */}
                {isRecommended && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    fontSize: '10px',
                    fontWeight: '500',
                    letterSpacing: '0.05em',
                    color: isTopMatch
                      ? track.color
                      : 'rgba(255,255,255,0.4)',
                    background: isTopMatch
                      ? track.lightColor
                      : 'rgba(255,255,255,0.06)',
                    border: isTopMatch
                      ? `1px solid ${track.borderColor}`
                      : '1px solid rgba(255,255,255,0.08)',
                    padding: '3px 8px',
                    borderRadius: '20px'
                  }}>
                    {isTopMatch ? '✦ TOP MATCH' : 'GOOD FIT'}
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  paddingRight: isRecommended ? '80px' : '0'
                }}>
                  {/* Icon */}
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: isSelected
                      ? `${track.color}25`
                      : 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected
                      ? track.color
                      : 'rgba(255,255,255,0.4)',
                    flexShrink: 0,
                    transition: 'all 0.2s'
                  }}>
                    {track.icon}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '15px',
                      fontWeight: '500',
                      color: 'white',
                      margin: '0 0 3px'
                    }}>
                      {track.name}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.35)',
                      margin: 0,
                      lineHeight: 1.4
                    }}>
                      {track.tagline}
                    </p>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 20
                      }}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: track.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <svg width="10" height="8"
                        viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Fixed continue button */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        padding: '16px 28px 40px',
        background: 'linear-gradient(transparent, #0A0812 35%)'
      }}>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          style={{
            width: '100%',
            height: '54px',
            background: selected ? '#534AB7' : 'rgba(255,255,255,0.06)',
            border: 'none',
            borderRadius: '27px',
            color: selected ? 'white' : 'rgba(255,255,255,0.2)',
            fontSize: '16px',
            fontWeight: '500',
            cursor: selected ? 'pointer' : 'not-allowed',
            boxShadow: selected ? '0 0 30px rgba(83,74,183,0.3)' : 'none',
            transition: 'all 0.3s'
          }}
        >
          Start this track →
        </motion.button>
      </div>
    </div>
  )
}
