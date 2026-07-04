import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Bridge() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0812',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '480px',
      margin: '0 auto',
      position: 'relative'
    }}>

      {/* Progress bar */}
      <div style={{
        width: '100%',
        height: '2px',
        background: 'rgba(255,255,255,0.06)'
      }}>
        <motion.div
          initial={{ width: '16.6%' }}
          animate={{ width: '33%' }}
          transition={{ duration: 0.5 }}
          style={{ height: '2px', background: '#534AB7' }}
        />
      </div>

      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px'
      }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/onboarding')}
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
        <span style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.05em'
        }}>
          2 of 6
        </span>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '24px 28px 40px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p style={{
            fontSize: '11px',
            fontWeight: '500',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            margin: '0 0 12px'
          }}>
            One more thing
          </p>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: 'white',
            lineHeight: 1.25,
            margin: '0 0 10px',
            letterSpacing: '-0.01em'
          }}>
            How would you like<br />
            to find your track?
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.38)',
            margin: '0 0 36px',
            lineHeight: 1.6
          }}>
            Answer a few questions and we match you.
            Or jump straight in.
          </p>
        </motion.div>

        {/* Two path cards */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>

          {/* Recommended path */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/discovery')}
            style={{
              width: '100%',
              padding: '20px',
              background: 'rgba(83,74,183,0.1)',
              border: '1px solid rgba(157,146,248,0.25)',
              borderRadius: '16px',
              cursor: 'pointer',
              textAlign: 'left',
              position: 'relative'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              fontSize: '10px',
              fontWeight: '500',
              letterSpacing: '0.06em',
              color: '#9D92F8',
              background: 'rgba(83,74,183,0.2)',
              padding: '3px 8px',
              borderRadius: '20px'
            }}>
              RECOMMENDED
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(83,74,183,0.2)',
                border: '1px solid rgba(157,146,248,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#9D92F8'
              }}>
                <svg width="20" height="20"
                  viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: 'white',
                  margin: '0 0 4px'
                }}>
                  Answer a few questions
                </p>
                <p style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.4)',
                  margin: '0 0 10px',
                  lineHeight: 1.5
                }}>
                  We use your answers to suggest
                  the perfect track for you.
                </p>
                <p style={{
                  fontSize: '12px',
                  color: 'rgba(157,146,248,0.7)',
                  margin: 0
                }}>
                  Takes less than 2 minutes
                </p>
              </div>
            </div>
          </motion.button>

          {/* Skip path */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/track-select')}
            style={{
              width: '100%',
              padding: '20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: 'rgba(255,255,255,0.4)'
              }}>
                <svg width="20" height="20"
                  viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                </svg>
              </div>
              <div>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: 'white',
                  margin: '0 0 4px'
                }}>
                  I know what I want
                </p>
                <p style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.38)',
                  margin: 0,
                  lineHeight: 1.5
                }}>
                  Browse all tracks and choose
                  what calls to you directly.
                </p>
              </div>
            </div>
          </motion.button>
        </div>

        <p style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.18)',
          textAlign: 'center',
          marginTop: '24px',
          lineHeight: 1.5
        }}>
          You can always retake the questions
          later from settings.
        </p>
      </div>
    </div>
  )
}
