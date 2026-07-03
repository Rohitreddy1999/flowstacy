import { useLocation, useNavigate } from 'react-router-dom'
import { HiHome, HiUserGroup, HiChartBar, HiUser } from 'react-icons/hi2'

const TABS = [
  { path: '/home',      Icon: HiHome,      label: 'Home'      },
  { path: '/community', Icon: HiUserGroup, label: 'Community' },
  { path: '/progress',  Icon: HiChartBar,  label: 'Progress'  },
  { path: '/profile',   Icon: HiUser,      label: 'Profile'   },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        background: 'rgba(10, 8, 18, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '0.5px solid rgba(255,255,255,0.08)',
        padding: '8px 0 24px',
        zIndex: 100,
      }}
    >
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
              gap: 3,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
            }}
          >
            <Icon
              size={24}
              color={active ? '#9D92F8' : 'rgba(255,255,255,0.35)'}
            />
            <span
              style={{
                fontSize: 10,
                color: active ? '#9D92F8' : 'rgba(255,255,255,0.35)',
                fontWeight: active ? 500 : 400,
              }}
            >
              {label}
            </span>
            {active && (
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#9D92F8',
                  marginTop: 2,
                }}
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
