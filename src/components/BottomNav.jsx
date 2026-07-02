import { useLocation, useNavigate } from 'react-router-dom'

const TABS = [
  { path: '/home',      emoji: '🏠', label: 'Home'      },
  { path: '/community', emoji: '👥', label: 'Community' },
  { path: '/progress',  emoji: '📊', label: 'Progress'  },
  { path: '/profile',   emoji: '👤', label: 'Profile'   },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fs-bottom-nav">
      {TABS.map(({ path, emoji, label }) => {
        const active = pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`fs-nav-item${active ? ' active' : ''}`}
            style={{ background: 'none', border: 'none' }}
          >
            <span className="fs-nav-item-icon">{emoji}</span>
            <span className="fs-nav-item-label">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
