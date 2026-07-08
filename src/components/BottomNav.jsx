import { useLocation, useNavigate } from 'react-router-dom'
import { HiHome, HiUserGroup, HiChartBar, HiCog6Tooth } from 'react-icons/hi2'

const TABS = [
  { path: '/home',      Icon: HiHome,       label: 'Home'      },
  { path: '/community', Icon: HiUserGroup,  label: 'Community' },
  { path: '/progress',  Icon: HiChartBar,   label: 'Progress'  },
  { path: '/settings',  Icon: HiCog6Tooth,  label: 'Settings'  },
]

const SURGE    = '#3DF5A6'
const ARC_LIGHT = '#EAFFF5'

export default function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      display: 'flex',
      background: 'rgba(7,9,13,0.96)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '8px 0 24px',
      zIndex: 100,
    }}>
      {TABS.map(({ path, Icon, label }) => {
        const active = pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
              position: 'relative',
            }}
          >
            {/* Surge-tinted well behind active icon */}
            {active && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 44, height: 34,
                background: 'rgba(61,245,166,0.1)',
                borderRadius: 10,
              }} />
            )}

            <Icon
              size={22}
              color={active ? ARC_LIGHT : 'rgba(255,255,255,0.3)'}
              style={{ position: 'relative', zIndex: 1 }}
            />
            <span style={{
              fontSize: 10,
              fontFamily: '"Hanken Grotesk", sans-serif',
              color: active ? SURGE : 'rgba(255,255,255,0.3)',
              fontWeight: active ? 600 : 400,
              letterSpacing: active ? '0.02em' : '0',
              position: 'relative', zIndex: 1,
            }}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
