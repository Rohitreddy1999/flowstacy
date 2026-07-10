import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const SURGE   = '#3DF5A6'
const ABYSS   = '#07090D'
const HK      = '"Hanken Grotesk", sans-serif'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100%',
      background: '#0A0812',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '80px 28px 48px',
      maxWidth: '480px',
      margin: '0 auto',
      boxSizing: 'border-box',
      fontFamily: HK
    }}>

      {/* Top — logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center' }}
      >
        <motion.h1
          animate={{
            textShadow: [
              '0 0 20px rgba(61,245,166,0.3)',
              '0 0 40px rgba(61,245,166,0.6)',
              '0 0 20px rgba(61,245,166,0.3)'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            fontSize: '36px',
            fontWeight: '700',
            color: 'white',
            letterSpacing: '-0.02em',
            margin: 0,
            fontFamily: HK
          }}
        >
          FLOWSTACY
        </motion.h1>
      </motion.div>

      {/* Middle — main message */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{ textAlign: 'center' }}
      >
        <h2 style={{
          fontSize: '30px',
          fontWeight: '600',
          color: 'white',
          lineHeight: 1.2,
          margin: '0 0 16px',
          letterSpacing: '-0.01em',
          fontFamily: HK
        }}>
          The 21 days that<br />change everything.
        </h2>
        <p style={{
          fontSize: '15px',
          color: 'rgba(255,255,255,0.45)',
          lineHeight: 1.6,
          margin: 0,
          maxWidth: '280px',
          marginLeft: 'auto',
          marginRight: 'auto',
          fontFamily: HK
        }}>
          Most people know what they want to become.
          FLOWSTACY gives them the structure to
          actually get there.
        </p>
      </motion.div>

      {/* Bottom — buttons */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{ width: '100%' }}
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/signup')}
          style={{
            width: '100%',
            height: '56px',
            background: SURGE,
            border: 'none',
            borderRadius: '28px',
            color: ABYSS,
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            marginBottom: '12px',
            boxShadow: '0 0 30px rgba(61,245,166,0.25)',
            letterSpacing: '0.01em',
            fontFamily: HK
          }}
        >
          Begin your journey →
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/login')}
          style={{
            width: '100%',
            height: '52px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '28px',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '15px',
            cursor: 'pointer',
            marginBottom: '20px',
            fontFamily: HK
          }}
        >
          I already have an account
        </motion.button>

        <p style={{
          textAlign: 'center',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.2)',
          margin: 0,
          fontFamily: HK
        }}>
          Free to start · No credit card required
        </p>
      </motion.div>
    </div>
  )
}
