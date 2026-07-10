import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TRACKS } from '../lib/tracks'
import { supabase } from '../lib/supabase'

export default function SubTrackSelect() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const trackId = localStorage.getItem('flowstacy_selected_track')
  const track = TRACKS.find(t => t.id === trackId) || TRACKS[0]

  const handleContinue = async () => {
    if (!selected) return

    // Write to localStorage as primary (existing behavior)
    localStorage.setItem('flowstacy_selected_subtrack', selected)
    localStorage.setItem('flowstacy_selected_track', trackId)

    // Write to Supabase as source of truth
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
      const { error } = await supabase
        .from('user_journeys')
        .upsert({
          user_id: session.user.id,
          subtrack_id: selected,
          current_day: 1,
          is_active: true,
          streak_count: 0,
          grace_used: false,
          graduated: false,
          started_at: new Date().toISOString()
        }, { onConflict: 'user_id' })

      if (error) {
        console.error('Journey upsert failed:', error)
      } else {
        console.log('Journey written to Supabase successfully')
      }
    }

    navigate('/home', { replace: true })
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
          onClick={() => navigate(-1)}
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

        {/* Track context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '32px' }}
        >
          {/* Track pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: `${track.color}20`,
            border: `1px solid ${track.borderColor}`,
            borderRadius: '20px',
            padding: '6px 12px',
            marginBottom: '16px'
          }}>
            <div style={{
              color: track.color,
              display: 'flex',
              alignItems: 'center'
            }}>
              {track.icon}
            </div>
            <span style={{
              fontSize: '13px',
              color: track.color,
              fontWeight: '500'
            }}>
              {track.name}
            </span>
          </div>

          <h1 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: 'white',
            lineHeight: 1.25,
            margin: '0 0 8px',
            letterSpacing: '-0.01em'
          }}>
            Pick your focus
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.38)',
            margin: 0,
            lineHeight: 1.5
          }}>
            Choose what you want to work on
            for the next 21 days.
          </p>
        </motion.div>

        {/* Subtrack cards */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {track.subtracks.map((sub, i) => {
            const isSelected = selected === sub.id
            const isAvailable = sub.available

            return (
              <motion.button
                key={sub.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                whileTap={isAvailable ? { scale: 0.99 } : {}}
                onClick={() => isAvailable && setSelected(sub.id)}
                style={{
                  width: '100%',
                  minHeight: '68px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  background: isSelected
                    ? track.lightColor
                    : isAvailable
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(255,255,255,0.02)',
                  border: isSelected
                    ? `1px solid ${track.borderColor}`
                    : '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '14px',
                  cursor: isAvailable ? 'pointer' : 'default',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  opacity: isAvailable ? 1 : 0.45,
                  gap: '12px'
                }}
              >
                {/* Available dot indicator */}
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isAvailable
                    ? isSelected
                      ? track.color
                      : 'rgba(255,255,255,0.2)'
                    : 'rgba(255,255,255,0.1)',
                  flexShrink: 0,
                  transition: 'all 0.2s'
                }} />

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '3px'
                  }}>
                    <p style={{
                      fontSize: '15px',
                      fontWeight: '500',
                      color: isAvailable
                        ? 'white'
                        : 'rgba(255,255,255,0.4)',
                      margin: 0
                    }}>
                      {sub.name}
                    </p>
                    {!isAvailable && (
                      <span style={{
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.25)',
                        background: 'rgba(255,255,255,0.06)',
                        padding: '2px 7px',
                        borderRadius: '10px',
                        letterSpacing: '0.05em'
                      }}>
                        SOON
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.3)',
                    margin: 0
                  }}>
                    {sub.desc}
                  </p>
                </div>

                {/* Checkmark */}
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
          whileTap={{ scale: selected ? 0.98 : 1 }}
          onClick={handleContinue}
          style={{
            width: '100%',
            height: '54px',
            background: selected ? track.color : 'rgba(255,255,255,0.06)',
            border: 'none',
            borderRadius: '27px',
            color: selected ? 'white' : 'rgba(255,255,255,0.2)',
            fontSize: '16px',
            fontWeight: '500',
            cursor: selected ? 'pointer' : 'not-allowed',
            boxShadow: selected ? `0 0 30px ${track.color}50` : 'none',
            transition: 'all 0.3s'
          }}
        >
          Begin my 21 days →
        </motion.button>
      </div>
    </div>
  )
}
