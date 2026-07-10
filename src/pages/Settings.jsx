import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import AuroraBackground from '../components/AuroraBackground'
import PageTransition from '../components/PageTransition'

export default function Settings() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    navigate('/login')
  }

  const initials = user?.user_metadata?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'FS'

  const menuSections = [
    {
      title: 'Your journey',
      items: [
        {
          icon: '✦',
          label: 'My track',
          desc: 'Change your current 21-day track',
          color: '#9D92F8',
          action: () => navigate('/sub-track-select')
        },
        {
          icon: '◈',
          label: 'Discovery questions',
          desc: 'Retake the questions to update your match',
          color: '#5DCAA5',
          action: () => navigate('/discovery')
        },
        {
          icon: '❋',
          label: 'Life stage',
          desc: 'Update where you are in life right now',
          color: '#9D92F8',
          action: () => navigate('/onboarding')
        }
      ]
    },
    {
      title: 'Explore',
      items: [
        {
          icon: '⊞',
          label: 'All tracks',
          desc: 'Browse all available tracks and sub-tracks',
          color: '#5DCAA5',
          action: () => navigate('/track-select')
        },
        {
          icon: '★',
          label: 'Expert marketplace',
          desc: 'Connect with verified experts in your field',
          color: '#EF9F27',
          action: () => navigate('/experts')
        },
        {
          icon: '♟',
          label: 'Community',
          desc: 'See what your squad is working on',
          color: '#5DCAA5',
          action: () => navigate('/community')
        }
      ]
    },
    {
      title: 'App',
      items: [
        {
          icon: '◎',
          label: 'Notifications',
          desc: 'Set your daily reminder time',
          color: '#EF9F27',
          action: () => toast('Coming soon — notification settings')
        },
        {
          icon: '◉',
          label: 'About Flowstacy',
          desc: 'Version 1.0 — built for the ones who show up',
          color: '#9D92F8',
          action: () => toast('Flowstacy v1.0 — Built for the ones who show up every day.')
        }
      ]
    }
  ]

  return (
    <PageTransition>
    <div style={{
      minHeight: '100vh',
      background: '#0A0812',
      color: 'white',
      maxWidth: '480px',
      margin: '0 auto',
      position: 'relative',
      paddingBottom: 100
    }}>
      <AuroraBackground />

      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10,8,18,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '0.5px solid rgba(255,255,255,0.06)',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span style={{
          fontSize: '17px',
          fontWeight: '500',
          color: 'white'
        }}>You</span>
      </div>

      <div style={{
        margin: '24px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '20px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        border: '0.5px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #534AB7, #1D9E75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: '600',
          color: 'white',
          flexShrink: 0
        }}>
          {initials}
        </div>
        <div>
          <p style={{
            fontSize: '16px',
            fontWeight: '500',
            color: 'white',
            margin: '0 0 4px'
          }}>
            {user?.user_metadata?.full_name || 'Flowstacy User'}
          </p>
          <p style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.4)',
            margin: 0
          }}>
            {user?.email}
          </p>
        </div>
      </div>

      {menuSections.map((section, si) => (
        <div key={si} style={{margin: '0 20px 24px'}}>
          <p style={{
            fontSize: '11px',
            fontWeight: '500',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            margin: '0 0 8px 4px'
          }}>
            {section.title}
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '16px',
            border: '0.5px solid rgba(255,255,255,0.08)',
            overflow: 'hidden'
          }}>
            {section.items.map((item, ii) => (
              <button
                key={ii}
                onClick={item.action}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 16px',
                  background: 'none',
                  border: 'none',
                  borderBottom: ii < section.items.length - 1
                    ? '0.5px solid rgba(255,255,255,0.06)'
                    : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e =>
                  e.currentTarget.style.background =
                  'rgba(255,255,255,0.04)'}
                onMouseLeave={e =>
                  e.currentTarget.style.background = 'none'}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: `${item.color}20`,
                  border: `0.5px solid ${item.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  color: item.color,
                  flexShrink: 0
                }}>
                  {item.icon}
                </div>
                <div style={{flex: 1}}>
                  <p style={{
                    fontSize: '15px',
                    color: 'white',
                    margin: '0 0 2px',
                    fontWeight: '400'
                  }}>
                    {item.label}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.35)',
                    margin: 0
                  }}>
                    {item.desc}
                  </p>
                </div>
                <span style={{
                  color: 'rgba(255,255,255,0.2)',
                  fontSize: '18px'
                }}>›</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div style={{margin: '0 20px'}}>
        <button
          onClick={handleSignOut}
          style={{
            width: '100%',
            padding: '14px',
            background: 'rgba(226,75,74,0.1)',
            border: '0.5px solid rgba(226,75,74,0.3)',
            borderRadius: '16px',
            color: '#E24B4A',
            fontSize: '15px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
        >
          Sign out
        </button>
      </div>
    </div>
    </PageTransition>
  )
}
