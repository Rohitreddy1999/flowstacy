import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiArrowLeft,
  HiChevronRight,
  HiSparkles,
  HiLightBulb,
  HiBell,
  HiInformationCircle,
  HiShieldCheck,
  HiArrowRightOnRectangle,
} from 'react-icons/hi2'
import AuroraBackground from '../components/AuroraBackground'
import { supabase } from '../lib/supabase'

const OPTION_ROWS = [
  {
    key: 'track',
    label: 'My track',
    description: 'Change your current 21-day track',
    Icon: HiSparkles,
    iconColor: '#9D92F8',
    path: '/sub-track-select',
  },
  {
    key: 'discovery',
    label: 'Discovery questions',
    description: 'Retake the questions to update your profile',
    Icon: HiLightBulb,
    iconColor: '#0D9488',
    path: '/discovery',
  },
  {
    key: 'notifications',
    label: 'Notification settings',
    description: 'Set your daily reminder time',
    Icon: HiBell,
    iconColor: '#F59E0B',
    action: 'toast',
  },
  {
    key: 'about',
    label: 'About Flowstate',
    description: 'Version 1.0 — built for the ones who show up',
    Icon: HiInformationCircle,
    iconColor: '#3B82F6',
    action: 'modal',
  },
  {
    key: 'privacy',
    label: 'Privacy policy',
    description: 'How we handle your data',
    Icon: HiShieldCheck,
    iconColor: '#10B981',
    action: 'privacy',
  },
]

export default function Settings() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user)
    })
  }, [])

  function getInitials(u) {
    if (!u) return '?'
    const name = u.user_metadata?.full_name || u.email || ''
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  function handleRow(row) {
    if (row.path) {
      navigate(row.path)
    } else if (row.action === 'toast') {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2500)
    } else if (row.action === 'modal') {
      setShowAboutModal(true)
    } else if (row.action === 'privacy') {
      console.log('Privacy policy — coming soon')
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    localStorage.clear()
    navigate('/login')
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'You'
  const email = user?.email || ''
  const initials = getInitials(user)

  return (
    <>
      <AuroraBackground />

      {/* Toast */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            top: 60,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 200,
            background: 'rgba(30,27,48,0.97)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: '10px 20px',
            color: 'rgba(255,255,255,0.85)',
            fontSize: 13,
            whiteSpace: 'nowrap',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          Coming soon — notifications are on the way
        </div>
      )}

      {/* About modal */}
      {showAboutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowAboutModal(false)}
        >
          <div
            className="fs-card"
            style={{ padding: 28, textAlign: 'center', maxWidth: 320, width: '100%' }}
            onClick={e => e.stopPropagation()}
          >
            <p style={{ fontSize: 32, marginBottom: 12 }}>⚡</p>
            <p style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 6 }}>Flowstate</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 4 }}>Version 1.0</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
              Built for the ones who show up.
            </p>
            <button
              onClick={() => setShowAboutModal(false)}
              className="fs-btn-ghost"
              style={{ width: '100%' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="fs-page">
        {/* Top bar */}
        <nav className="fs-topbar">
          <button
            onClick={() => navigate('/home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
          >
            <HiArrowLeft size={20} color="rgba(255,255,255,0.6)" />
          </button>
          <span style={{ fontSize: 17, fontWeight: 500, color: 'white' }}>Settings</span>
          <div style={{ width: 28 }} />
        </nav>

        {/* Profile section */}
        <div style={{ padding: '28px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #534AB7, #9D92F8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: 600,
              color: 'white',
              marginBottom: 4,
            }}
          >
            {initials}
          </div>
          <p style={{ fontSize: 17, fontWeight: 600, color: 'white' }}>{displayName}</p>
          {email && (
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{email}</p>
          )}
          <button
            className="fs-btn-ghost"
            style={{ marginTop: 4, fontSize: 13, padding: '6px 16px' }}
          >
            Edit profile
          </button>
        </div>

        {/* Options list */}
        <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
          {OPTION_ROWS.map(row => (
            <button
              key={row.key}
              onClick={() => handleRow(row)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                width: '100%',
                padding: '16px 20px',
                background: 'transparent',
                border: 'none',
                borderBottom: '0.5px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `${row.iconColor}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <row.Icon size={18} color={row.iconColor} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 15, color: 'white', fontWeight: 400, marginBottom: 2 }}>{row.label}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{row.description}</p>
              </div>
              <HiChevronRight size={18} color="rgba(255,255,255,0.25)" />
            </button>
          ))}
        </div>

        {/* Divider + Sign out */}
        <div style={{ padding: '24px 20px 0' }}>
          <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.06)', marginBottom: 8 }} />
          <button
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              width: '100%',
              padding: '16px 0',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(226,75,74,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(226,75,74,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <HiArrowRightOnRectangle size={18} color="#E24B4A" />
            </div>
            <span style={{ fontSize: 15, color: '#E24B4A', fontWeight: 400 }}>Sign out</span>
          </button>
        </div>

      </div>
    </>
  )
}
