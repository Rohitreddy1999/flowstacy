import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function QuestionScreen({
  stepNumber,
  totalSteps,
  question,
  subtext,
  options,
  multiSelect,
  onContinue,
  onBack,
  openText,
  openTextPlaceholder,
  continueLabel,
}) {
  const [selected, setSelected] = useState([])
  const [textValue, setTextValue] = useState('')
  const [textFocused, setTextFocused] = useState(false)

  useEffect(() => {
    setSelected([])
    setTextValue('')
  }, [stepNumber])

  const toggleOption = (id) => {
    if (multiSelect) {
      setSelected(prev =>
        prev.includes(id)
          ? prev.filter(s => s !== id)
          : prev.length < 2 ? [...prev, id] : prev
      )
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
          onClick={onBack}
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
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === stepNumber - 1 ? '16px' : '5px',
                height: '5px',
                borderRadius: '3px',
                background: i < stepNumber ? '#EAFFF5' : 'rgba(255,255,255,0.15)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        <div style={{ width: '26px' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '0 24px 160px', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={stepNumber}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Ghost number — sits behind question */}
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '16px',
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 900,
              fontSize: '120px',
              lineHeight: 1,
              color: 'rgba(255,255,255,0.04)',
              letterSpacing: '-0.04em',
              userSelect: 'none',
              pointerEvents: 'none',
            }}>
              {ghostNum}
            </div>

            {/* Question */}
            <div style={{ marginBottom: '28px', position: 'relative' }}>
              <h1 style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                color: 'rgba(255,255,255,0.95)',
                lineHeight: 1.3,
                margin: '0 0 10px',
                letterSpacing: '-0.02em',
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
            </div>

            {/* Options or open text */}
            {openText ? (
              <div>
                <div style={{
                  background: '#0F141A',
                  border: textFocused
                    ? '1px solid rgba(130,212,255,0.35)'
                    : '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '16px',
                  padding: '16px',
                  transition: 'border-color 0.2s',
                }}>
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
                </div>
                <p style={{
                  fontFamily: '"Hanken Grotesk", sans-serif',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.18)',
                  marginTop: '10px',
                  letterSpacing: '0.02em',
                }}>
                  Nobody else sees this. Just be honest.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {options.map((option, i) => {
                  const isSelected = selected.includes(option.id)
                  return (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.055, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => toggleOption(option.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '14px 16px',
                        background: isSelected ? 'rgba(61,245,166,0.06)' : '#0F141A',
                        border: isSelected
                          ? '1px solid rgba(61,245,166,0.4)'
                          : '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.18s ease',
                        gap: '12px',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'radial-gradient(ellipse at left center, rgba(61,245,166,0.06) 0%, transparent 70%)',
                          pointerEvents: 'none',
                        }} />
                      )}

                      <span style={{
                        fontFamily: '"Hanken Grotesk", sans-serif',
                        fontSize: '13.5px',
                        fontWeight: isSelected ? 500 : 400,
                        color: isSelected ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.6)',
                        lineHeight: 1.5,
                        flex: 1,
                        transition: 'color 0.18s',
                      }}>
                        {option.label}
                      </span>

                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: '#3DF5A6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4l3 3 5-6" stroke="#07090D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  )
                })}

                {multiSelect && (
                  <p style={{
                    fontFamily: '"Hanken Grotesk", sans-serif',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.2)',
                    textAlign: 'center',
                    marginTop: '4px',
                    letterSpacing: '0.03em',
                  }}>
                    Pick up to 2
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
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
          whileTap={{ scale: canContinue ? 0.97 : 1 }}
          onClick={handleContinue}
          animate={{ opacity: canContinue ? 1 : 0.2, y: canContinue ? 0 : 4 }}
          transition={{ duration: 0.2 }}
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
            cursor: canContinue ? 'pointer' : 'not-allowed',
            pointerEvents: 'auto',
            letterSpacing: '0.01em',
          }}
        >
          {continueLabel || 'Continue'}
        </motion.button>
      </div>
    </div>
  )
}
