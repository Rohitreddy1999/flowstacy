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
  continueLabel
}) {
  const [selected, setSelected] = useState([])
  const [textValue, setTextValue] = useState('')

  useEffect(() => {
    setSelected([])
    setTextValue('')
  }, [stepNumber])

  const progress = (stepNumber / totalSteps) * 100

  const toggleOption = (id) => {
    if (multiSelect) {
      if (selected.includes(id)) {
        setSelected(selected.filter(s => s !== id))
      } else {
        if (selected.length < 2) {
          setSelected([...selected, id])
        }
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
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            height: '2px',
            background: '#534AB7'
          }}
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
          onClick={onBack}
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
          {stepNumber} of {totalSteps}
        </span>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '24px 28px 140px'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={stepNumber}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Question heading */}
            <div style={{ marginBottom: '36px' }}>
              <h1 style={{
                fontSize: '26px',
                fontWeight: '600',
                color: 'white',
                lineHeight: 1.3,
                margin: '0 0 10px',
                letterSpacing: '-0.01em'
              }}>
                {question}
              </h1>
              {subtext && (
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.38)',
                  margin: 0,
                  lineHeight: 1.5
                }}>
                  {subtext}
                </p>
              )}
            </div>

            {/* Options or open text */}
            {openText ? (
              <div>
                <textarea
                  value={textValue}
                  onChange={e => setTextValue(e.target.value)}
                  placeholder={openTextPlaceholder}
                  style={{
                    width: '100%',
                    minHeight: '140px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '16px',
                    color: 'white',
                    fontSize: '16px',
                    lineHeight: 1.6,
                    resize: 'none',
                    outline: 'none',
                    fontFamily: 'system-ui',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e =>
                    e.target.style.borderColor =
                    'rgba(157,146,248,0.4)'}
                  onBlur={e =>
                    e.target.style.borderColor =
                    'rgba(255,255,255,0.08)'}
                />
                <p style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.2)',
                  marginTop: '10px',
                  fontStyle: 'italic'
                }}>
                  Nobody else sees this. Just be honest.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                {options.map((option, i) => {
                  const isSelected = selected.includes(option.id)
                  return (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: i * 0.07,
                        duration: 0.35
                      }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => toggleOption(option.id)}
                      style={{
                        width: '100%',
                        minHeight: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 16px',
                        background: isSelected
                          ? 'rgba(83,74,183,0.12)'
                          : 'rgba(255,255,255,0.04)',
                        border: isSelected
                          ? '1px solid rgba(157,146,248,0.5)'
                          : '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        gap: '12px'
                      }}
                    >
                      <span style={{
                        fontSize: '20px',
                        flexShrink: 0,
                        width: '28px',
                        textAlign: 'center'
                      }}>
                        {option.emoji}
                      </span>

                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: 'white',
                          margin: '0 0 2px',
                          lineHeight: 1.3
                        }}>
                          {option.text}
                        </p>
                      </div>

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
                  )
                })}

                {multiSelect && (
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.2)',
                    textAlign: 'center',
                    marginTop: '4px'
                  }}>
                    Select all that you feel
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed bottom button */}
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
          whileTap={{ scale: canContinue ? 0.98 : 1 }}
          onClick={handleContinue}
          style={{
            width: '100%',
            height: '54px',
            background: canContinue
              ? '#534AB7'
              : 'rgba(255,255,255,0.06)',
            border: 'none',
            borderRadius: '27px',
            color: canContinue
              ? 'white'
              : 'rgba(255,255,255,0.2)',
            fontSize: '16px',
            fontWeight: '500',
            cursor: canContinue ? 'pointer' : 'not-allowed',
            boxShadow: canContinue
              ? '0 0 30px rgba(83,74,183,0.3)'
              : 'none',
            transition: 'all 0.3s'
          }}
        >
          {continueLabel || 'Continue'}
        </motion.button>
      </div>
    </div>
  )
}
