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
    <div
      className="fixed bottom-0 left-0 right-0 flex"
      style={{
        backgroundColor: 'white',
        borderTop: '1px solid #e5e5e5',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(({ path, emoji, label }) => {
        const active = pathname === path
        const color = active ? '#534AB7' : '#9ca3af'
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex-1 flex flex-col items-center justify-center py-2 transition-colors"
            style={{ color }}
          >
            <span className="text-xl leading-none mb-1">{emoji}</span>
            <span className="text-xs font-medium">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
