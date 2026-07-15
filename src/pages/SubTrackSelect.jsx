import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TRACKS } from '../lib/tracks'
import { getSubtracksByTrack } from '../lib/curriculum'
import { supabase } from '../lib/supabase'
import { useJourneyStore } from '../lib/journeyStore'

const ABYSS = '#07090D'
const FATHOM = '#0F141A'
const SURGE = '#3DF5A6'
const ARC_LIGHT = '#EAFFF5'

// New per-track icons — keyed by track id, not touching tracks.jsx
const TRACK_ICONS = {
  move: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  rhythm: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
  ),
  express: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 2C6 2 2 6 2 11s4 9 9 9a2 2 0 0 0 2-2c0-.5-.2-.9-.5-1.3-.3-.3-.5-.7-.5-1.2a1.5 1.5 0 0 1 1.5-1.5H16a4 4 0 0 0 4-4C20 6.5 16 2 11 2z"/>
      <circle cx="7" cy="10" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="9" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="13" cy="6" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="16" cy="9" r="1.2" fill="currentColor" stroke="none"/>
    </svg>
  ),
  calm: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.59 4.59A2 2 0 1111 8H2"/>
      <path d="M10.59 19.41A2 2 0 1014 16H2"/>
      <path d="M15.73 3.73A2.5 2.5 0 1119.5 7H2"/>
    </svg>
  ),
  mindful: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
}

export default function SubTrackSelect() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [subtracks, setSubtracks] = useState([])

  const trackSlug = localStorage.getItem('flowstacy_selected_track')
  const track = TRACKS.find(t => t.id === trackSlug) || TRACKS[0]

  useEffect(() => {
    if (!trackSlug) return
    getSubtracksByTrack(trackSlug).then(data => { if (data) setSubtracks(data) })
  }, [trackSlug])

  const handleContinue = async () => {
    if (!selected) return

    localStorage.setItem('flowstacy_selected_subtrack', selected)
    localStorage.setItem('flowstacy_selected_track', trackSlug)

    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
      const userId = session.user.id
      const subtractId = selected
      console.log('SubTrackSelect — userId:', userId, 'subtrack_id:', subtractId)

      await supabase
        .from('user_journeys')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('is_active', true)
        .neq('subtrack_id', subtractId)

      const { data: newJourney, error } = await supabase
        .from('user_journeys')
        .upsert({
          user_id: userId,
          subtrack_id: subtractId,
          current_day: 1,
          is_active: true,
          streak_count: 0,
          grace_used: false,
          graduated: false,
          started_at: new Date().toISOString(),
        }, { onConflict: 'user_id,subtrack_id' })
        .select()
        .single()

      if (error) {
        console.error('createJourney failed:', error.message, error.details, error.hint)
        return
      }
      console.log('Journey created/resumed — id:', newJourney?.id, newJourney)

      await useJourneyStore.getState().hydrate(userId)
    }

    navigate('/home', { replace: true })
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
      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '52px 24px 20px',
        position: 'relative',
        zIndex: 1,
      }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
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
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '0 24px 180px', position: 'relative', zIndex: 1 }}>

        {/* Track pill + heading */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '32px' }}
        >
          {/* Track pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            background: 'rgba(61,245,166,0.08)',
            border: '1px solid rgba(61,245,166,0.2)',
            borderRadius: '20px',
            padding: '5px 12px 5px 10px',
            marginBottom: '18px',
            color: SURGE,
          }}>
            {TRACK_ICONS[track.id] ?? null}
            <span style={{
              fontFamily: '"Hanken Grotesk", sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: SURGE,
              letterSpacing: '0.04em',
            }}>
              {track.name}
            </span>
          </div>

          <h1 style={{
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: '26px',
            color: 'rgba(255,255,255,0.95)',
            lineHeight: 1.28,
            margin: '0 0 10px',
            letterSpacing: '-0.022em',
          }}>
            Pick your focus
          </h1>
          <p style={{
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.35)',
            margin: 0,
            lineHeight: 1.55,
          }}>
            Choose what you want to work on for the next 21 days.
          </p>
        </motion.div>

        {/* Subtrack cards — name only per spec */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {subtracks.map((sub, i) => {
            const isSelected = selected === sub.id
            return (
              <motion.button
                key={sub.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: i * 0.08,
                  type: 'spring',
                  stiffness: 320,
                  damping: 26,
                }}
                whileTap={{ scale: 0.984 }}
                onClick={() => { console.log('subtrack selected:', sub.id, sub.name); setSelected(sub.id) }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '20px 18px',
                  background: isSelected ? 'rgba(61,245,166,0.04)' : FATHOM,
                  border: isSelected
                    ? `1.5px solid ${SURGE}`
                    : '1.5px solid rgba(255,255,255,0.07)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  position: 'relative',
                  overflow: 'hidden',
                  outline: 'none',
                  transition: 'background 150ms ease',
                  gap: '14px',
                }}
              >
                {/* Surge left glow on selected */}
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
                        background: 'radial-gradient(ellipse at 0% 50%, rgba(61,245,166,0.07) 0%, transparent 65%)',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Dot indicator */}
                <motion.div
                  animate={{
                    background: isSelected ? SURGE : 'rgba(255,255,255,0.18)',
                    scale: isSelected ? 1.15 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 1,
                  }}
                />

                {/* Subtrack name only */}
                <span style={{
                  fontFamily: '"Hanken Grotesk", sans-serif',
                  fontSize: '15px',
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? ARC_LIGHT : 'rgba(255,255,255,0.72)',
                  flex: 1,
                  position: 'relative',
                  zIndex: 1,
                  transition: 'color 150ms ease',
                }}>
                  {sub.name}
                </span>

                {/* Checkmark — springs in */}
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
