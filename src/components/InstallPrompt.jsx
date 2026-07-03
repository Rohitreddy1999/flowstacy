import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)

      const dismissed = localStorage.getItem('pwa-install-dismissed')
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000)
      }
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowPrompt(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (!showPrompt) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '90px',
      left: '16px',
      right: '16px',
      zIndex: 1000,
      background: 'rgba(15, 12, 26, 0.98)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      border: '0.5px solid rgba(157, 146, 248, 0.3)',
      padding: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: '#534AB7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          flexShrink: 0
        }}>
          ◎
        </div>
        <div>
          <p style={{
            fontSize: '15px',
            fontWeight: '500',
            color: 'white',
            margin: '0 0 2px'
          }}>
            Add to home screen
          </p>
          <p style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.4)',
            margin: 0
          }}>
            Install Flowstate for the full experience
          </p>
        </div>
      </div>
      <div style={{
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={handleInstall}
          style={{
            flex: 1,
            padding: '11px',
            background: '#534AB7',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Install app
        </button>
        <button
          onClick={handleDismiss}
          style={{
            padding: '11px 16px',
            background: 'rgba(255,255,255,0.08)',
            border: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Not now
        </button>
      </div>
    </div>
  )
}
