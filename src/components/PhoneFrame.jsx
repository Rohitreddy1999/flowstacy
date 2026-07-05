import { useEffect, useState } from 'react'

export default function PhoneFrame({ children }) {
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth > 480
  )

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 480)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!isDesktop) return children

  return (
    <div style={{
      minHeight: '100vh',
      background: '#06040F',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 0',
    }}>
      {/* Ambient glow behind phone */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '700px',
        background: 'radial-gradient(ellipse at center, rgba(83,74,183,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        borderRadius: '50%',
      }} />

      {/* Phone frame */}
      <div style={{
        position: 'relative',
        width: '393px',
        height: '852px',
        background: '#0A0812',
        borderRadius: '48px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: `
          0 0 0 1px rgba(255,255,255,0.05),
          0 30px 80px rgba(0,0,0,0.6),
          0 0 60px rgba(83,74,183,0.1)
        `,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Notch */}
        <div style={{
          position: 'absolute',
          top: '14px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '34px',
          background: '#06040F',
          borderRadius: '20px',
          zIndex: 100,
        }} />

        {/* App content -- scrolls inside the frame */}
        <div
          className="phone-frame-content"
          style={{
            flex: 1,
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {children}
        </div>
      </div>

      {/* Side text -- left */}
      <div style={{
        position: 'absolute',
        left: 'calc(50% - 280px)',
        transform: 'translateX(-100%)',
        textAlign: 'right',
        paddingRight: '48px',
      }}>
        <p style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          21 days
        </p>
        <p style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.35)',
          lineHeight: 1.6,
          maxWidth: '160px',
        }}>
          One habit. Full commitment. Real transformation.
        </p>
      </div>

      {/* Side text -- right */}
      <div style={{
        position: 'absolute',
        right: 'calc(50% - 280px)',
        transform: 'translateX(100%)',
        textAlign: 'left',
        paddingLeft: '48px',
      }}>
        <p style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          flowstacy
        </p>
        <p style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.35)',
          lineHeight: 1.6,
          maxWidth: '160px',
        }}>
          Best experienced on mobile. Install from your browser.
        </p>
      </div>
    </div>
  )
}
