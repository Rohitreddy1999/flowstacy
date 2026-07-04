import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Onboarding() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const options = [
    {
      id: 'student',
      title: 'Still studying',
      description: 'Figuring out who I am and what I want',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor"
          strokeWidth="1.5" strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      )
    },
    {
      id: 'career',
      title: 'Building my career',
      description: 'Finding my footing in the real world',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor"
          strokeWidth="1.5" strokeLinecap="round"
          strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
          <line x1="12" y1="12" x2="12" y2="16"/>
          <line x1="10" y1="14" x2="14" y2="14"/>
        </svg>
      )
    },
    {
      id: 'family',
      title: 'Juggling family life',
      description: 'Carving out time for myself',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor"
          strokeWidth="1.5" strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
    {
      id: 'reinventing',
      title: 'Reinventing myself',
      description: 'Starting a fresh new chapter',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor"
          strokeWidth="1.5" strokeLinecap="round"
          strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10"/>
          <polyline points="1 20 1 14 7 14"/>
          <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
        </svg>
      )
    }
  ]

  const handleContinue = () => {
    if (!selected) return
    localStorage.setItem('flowstate_life_stage', selected)
    navigate('/bridge')
  }

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
        <div style={{
          width: '16.6%',
          height: '2px',
          background: '#534AB7'
        }} />
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
          onClick={() => navigate('/welcome')}
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
          1 of 6
        </span>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '24px 28px 120px'
      }}>

        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '36px' }}
        >
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: 'white',
            lineHeight: 1.25,
            margin: '0 0 10px',
            letterSpacing: '-0.01em'
          }}>
            Before we begin —<br />
            where are you in<br />
            life right now?
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.38)',
            margin: 0
          }}>
            Just so we speak your language.
          </p>
        </motion.div>

        {/* Option cards */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {options.map((option, i) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelected(option.id)}
              style={{
                width: '100%',
                height: '72px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 18px',
                background: selected === option.id
                  ? 'rgba(83,74,183,0.12)'
                  : 'rgba(255,255,255,0.04)',
                border: selected === option.id
                  ? '1px solid rgba(157,146,248,0.5)'
                  : '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                gap: '14px'
              }}
            >
              {/* Icon container */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: selected === option.id
                  ? 'rgba(83,74,183,0.2)'
                  : 'rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: selected === option.id
                  ? '#9D92F8'
                  : 'rgba(255,255,255,0.5)',
                flexShrink: 0,
                transition: 'all 0.2s'
              }}>
                {option.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  color: 'white',
                  margin: '0 0 2px'
                }}>
                  {option.title}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.38)',
                  margin: 0
                }}>
                  {option.description}
                </p>
              </div>

              {/* Checkmark */}
              {selected === option.id && (
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
                    background: '#534AB7',
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
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bottom — fixed buttons */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        padding: '16px 28px 40px',
        background: 'linear-gradient(transparent, #0A0812 40%)'
      }}>
        <motion.button
          whileTap={{ scale: selected ? 0.98 : 1 }}
          onClick={handleContinue}
          style={{
            width: '100%',
            height: '54px',
            background: selected
              ? '#534AB7'
              : 'rgba(255,255,255,0.06)',
            border: 'none',
            borderRadius: '27px',
            color: selected
              ? 'white'
              : 'rgba(255,255,255,0.2)',
            fontSize: '16px',
            fontWeight: '500',
            cursor: selected ? 'pointer' : 'not-allowed',
            marginBottom: '12px',
            boxShadow: selected
              ? '0 0 30px rgba(83,74,183,0.3)'
              : 'none',
            transition: 'all 0.3s'
          }}
        >
          Continue
        </motion.button>

        <button
          onClick={() => {
            localStorage.setItem(
              'flowstate_life_stage', 'skipped'
            )
            navigate('/bridge')
          }}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.22)',
            fontSize: '13px',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
