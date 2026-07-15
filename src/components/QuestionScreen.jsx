import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ABYSS = '#07090D'
const FATHOM = '#0F141A'
const SURGE = '#3DF5A6'
const ARC_LIGHT = '#EAFFF5'

export default function QuestionScreen({
  stepNumber,
  totalSteps,
  question,
  subtext,
  options,
  multiSelect,
  maxSelect = 2,
  onContinue,
  onBack,
  openText,
  openTextPlaceholder,
  continueLabel,
  slideDir = 1,
}) {
  const [selected, setSelected] = useState([])
  const [textValue, setTextValue] = useState('')
  const [textFocused, setTextFocused] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    setSelected([])
    setTextValue('')
  }, [stepNumber])

  const toggleOption = (id) => {
    if (multiSelect) {
      if (selected.includes(id)) {
        setSelected(selected.filter(s => s !== id))
      } else if (selected.length < maxSelect) {
        setSelected([...selected, id])
      } else {
        setShake(true)
        setTimeout(() => setShake(false), 500)
      }
    } else {
      setSelected([id])
    }
  }

  const canContinue = openText
    ? textValue.trim().length >= 3
    : selected.length > 0

  const handleContinue = () => {
    if (!canContinue) return
    onContinue(openText ? textValue : selected)
  }

  const ghostNum = String(stepNumber).padStart(2, '0')

  return (
    <motion.div
      initial={{ x: slideDir * 100 + '%', filter: 'blur(6px)' }}
      animate={{ x: 0, filter: 'blur(0px)' }}
      exit={{ x: slideDir * -100 + '%', filter: 'blur(6px)' }}
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
      {/* Background ghost number — drifts upward on mount */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: -10, opacity: 0.15 }}
        transition={{ duration: 5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          right: '-16px',
          top: '24px',
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
        {ghostNum}
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
          onClick={onBack}
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

        {/* Progress dots — active pill stretches via spring */}
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === stepNumber - 1 ? 20 : 5,
                background: i < stepNumber ? SURGE : 'rgba(255,255,255,0.15)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ height: '5px', borderRadius: '3px' }}
            />
          ))}
        </div>

        <div style={{ width: '26px' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '0 24px 180px', position: 'relative', zIndex: 1 }}>

        {/* Question heading — fades in on mount */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '28px' }}
        >
          <h1 style={{
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: '24px',
            color: 'rgba(255,255,255,0.95)',
            lineHeight: 1.32,
            margin: '0 0 10px',
            letterSpacing: '-0.022em',
          }}>
            {question}
          </h1>
          {subtext && (
            <p style={{
              fontFamily: '"Hanken Grotesk", sans-serif',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.3)',
              margin: 0,
              lineHeight: 1.5,
            }}>
              {subtext}
            </p>
          )}
        </motion.div>

        {/* Open text — Q6 */}
        {openText ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              animate={{
                borderColor: textFocused
                  ? 'rgba(61,245,166,0.4)'
                  : 'rgba(255,255,255,0.07)',
              }}
              transition={{ duration: 0.2 }}
              style={{
                background: FATHOM,
                border: '1.5px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                padding: '16px 18px',
              }}
            >
              <textarea
                value={textValue}
                onChange={e => setTextValue(e.target.value)}
                onFocus={() => setTextFocused(true)}
                onBlur={() => setTextFocused(false)}
                placeholder={openTextPlaceholder}
                rows={5}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: '"Hanken Grotesk", sans-serif',
                  fontSize: '15px',
                  lineHeight: 1.65,
                  resize: 'none',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </motion.div>
            <p style={{
              fontFamily: '"Hanken Grotesk", sans-serif',
              fontSize: '11.5px',
              color: 'rgba(255,255,255,0.18)',
              marginTop: '12px',
              letterSpacing: '0.02em',
              textAlign: 'center',
            }}>
              Nobody else sees this. Just be honest.
            </p>
          </motion.div>
        ) : (
          /* Option cards — shake container when max exceeded */
          <motion.div
            animate={shake ? { x: [0, -9, 9, -7, 7, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}
          >
            {options.map((option, i) => {
              const isSelected = selected.includes(option.id)
              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: i * 0.08,
                    type: 'spring',
                    stiffness: 320,
                    damping: 26,
                  }}
                  whileTap={{ scale: 0.984 }}
                  onClick={() => toggleOption(option.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px 18px',
                    background: isSelected ? 'rgba(61,245,166,0.04)' : FATHOM,
                    border: isSelected
                      ? `1.5px solid ${SURGE}`
                      : '1.5px solid rgba(255,255,255,0.07)',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: '12px',
                    position: 'relative',
                    overflow: 'hidden',
                    outline: 'none',
                    transition: 'background 150ms ease',
                  }}
                >
                  {/* Surge left-glow on selected */}
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
                          background: 'radial-gradient(ellipse at 0% 50%, rgba(61,245,166,0.07) 0%, transparent 70%)',
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                  </AnimatePresence>

                  <span style={{
                    fontFamily: '"Hanken Grotesk", sans-serif',
                    fontSize: '14px',
                    fontWeight: isSelected ? 500 : 400,
                    color: isSelected ? ARC_LIGHT : 'rgba(255,255,255,0.58)',
                    lineHeight: 1.5,
                    flex: 1,
                    position: 'relative',
                    zIndex: 1,
                    transition: 'color 150ms ease',
                  }}>
                    {option.label}
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
                          width: '20px',
                          height: '20px',
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
                        <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke={ABYSS} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              )
            })}

            {multiSelect && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (options?.length ?? 0) * 0.08 + 0.1 }}
                style={{
                  fontFamily: '"Hanken Grotesk", sans-serif',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.18)',
                  textAlign: 'center',
                  marginTop: '4px',
                  letterSpacing: '0.03em',
                }}
              >
                Pick up to {maxSelect}
              </motion.p>
            )}
          </motion.div>
        )}
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
        {!canContinue && (
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
              {continueLabel || 'Continue'}
            </span>
          </div>
        )}

        {/* Active CTA — slides up when first selection made */}
        <AnimatePresence>
          {canContinue && (
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
              {continueLabel || 'Continue'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
