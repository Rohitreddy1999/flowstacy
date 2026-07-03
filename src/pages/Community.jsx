import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuroraBackground from '../components/AuroraBackground'
import BottomNav from '../components/BottomNav'

const TOTAL = 21

const SQUAD_POSTS = [
  { id: 's1', initials: 'AK', name: 'Arjun K.',  color: '#534AB7', time: '2 hours ago', streak: 8,  track: 'Body & Fitness',   day: 8,  reflection: 'Goblet squats hit different today. Legs are shaking but I showed up.',                                                  reactions: { fire: 12, fist: 8,  star: 5  } },
  { id: 's2', initials: 'PS', name: 'Priya S.',  color: '#0D9488', time: '4 hours ago', streak: 8,  track: 'Daily Discipline', day: 8,  reflection: 'No phone for the first 30 minutes this morning. Felt weird. Then felt incredible.',                                    reactions: { fire: 18, fist: 6,  star: 9  } },
  { id: 's3', initials: 'RJ', name: 'Raj J.',    color: '#E8604A', time: '6 hours ago', streak: 7,  track: 'Body & Fitness',   day: 7,  reflection: "Missed yesterday but came back today. Proud I didn't give up.",                                                        reactions: { fire: 24, fist: 15, star: 7  } },
]

const GLOBAL_POSTS = [
  { id: 'g1', initials: 'ML', name: 'Maria L.',  color: '#EC4899', time: '1 hour ago',  streak: 14, track: 'Journaling',          day: 14, reflection: 'Wrote a letter to my 15-year-old self today. Cried a little. Worth it.',                                             reactions: { fire: 47, fist: 22, star: 31 } },
  { id: 'g2', initials: 'JT', name: 'James T.',  color: '#F59E0B', time: '3 hours ago', streak: 19, track: 'Drawing & Sketching', day: 19, reflection: "Day 19. Two days left. I can actually draw now. Still can't believe it.",                                            reactions: { fire: 89, fist: 43, star: 67 } },
  { id: 'g3', initials: 'AR', name: 'Aisha R.',  color: '#10B981', time: '5 hours ago', streak: 21, track: 'Learn an Instrument', day: 21, reflection: 'Day 21. I played my song for my mom today. She cried. I cried. Flow State changed something in me.',               reactions: { fire: 134,fist: 98, star: 112} },
]

const LEADERBOARD = [
  { rank: 1, initials: 'AK', name: 'Arjun K.', color: '#534AB7', track: 'Body & Fitness',   streak: 8, completed: 8, isMe: false },
  { rank: 2, initials: 'RJ', name: 'Raj J.',   color: '#E8604A', track: 'Body & Fitness',   streak: 7, completed: 7, isMe: false },
  { rank: 3, initials: 'PS', name: 'Priya S.', color: '#0D9488', track: 'Daily Discipline', streak: 8, completed: 8, isMe: false },
  { rank: 4, initials: 'RM', name: 'You',      color: '#534AB7', track: 'Body & Fitness',   streak: 1, completed: 1, isMe: true  },
]

const REACTION_TYPES = [
  { key: 'fire', emoji: '🔥', label: 'fired me up' },
  { key: 'fist', emoji: '👊', label: 'respect' },
  { key: 'star', emoji: '⭐', label: 'inspired' },
]

const RANK_MEDALS = ['🥇', '🥈', '🥉']
const TABS = [{ id: 'squad', label: 'My Squad' }, { id: 'global', label: 'Global Feed' }, { id: 'leaderboard', label: 'Leaderboard' }]

function ProgressDots({ day }) {
  return (
    <div className="fs-dots-container" style={{ marginTop: 12 }}>
      {Array.from({ length: TOTAL }, (_, i) => {
        const pos = i + 1
        return <div key={i} className={`fs-dot ${pos < day ? 'fs-dot-completed' : pos === day ? 'fs-dot-today' : 'fs-dot-future'}`} style={{ width: 8, height: 8 }} />
      })}
    </div>
  )
}

function PostCard({ post, myReactions, onToggle }) {
  const pct = Math.round((post.day / TOTAL) * 100)
  return (
    <div className="fs-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: post.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
            {post.initials}
          </div>
          <div>
            <p style={{ fontWeight: 500, color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-sm)' }}>{post.name}</p>
            <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)' }}>{post.time}</p>
          </div>
        </div>
        <span style={{ color: 'var(--fs-teal-300)', fontSize: 'var(--fs-text-xs)', flexShrink: 0 }}>🔥 {post.streak} streak</span>
      </div>

      <div className="fs-card" style={{ padding: '12px 14px', marginBottom: 14 }}>
        <p className="fs-label fs-label-purple" style={{ marginBottom: 4 }}>{post.track}</p>
        <p style={{ fontWeight: 500, color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-base)', marginBottom: 2 }}>Day {post.day} complete</p>
        <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)' }}>{pct}% through the journey</p>
        <ProgressDots day={post.day} />
      </div>

      <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 14 }}>
        "{post.reflection}"
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {REACTION_TYPES.map(({ key, emoji, label }) => {
          const active = !!myReactions[`${post.id}_${key}`]
          const count = post.reactions[key] + (active ? 1 : 0)
          return (
            <button
              key={key}
              onClick={() => onToggle(post.id, key)}
              className={active ? 'fs-reaction active' : 'fs-reaction'}
            >
              <span>{emoji}</span>
              <span>{count}</span>
              <span style={{ display: 'none' }}>{label}</span>
            </button>
          )
        })}
        <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)' }}>
          Reply
        </button>
      </div>
    </div>
  )
}

function SquadTab({ myReactions, onToggle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 32 }}>
      <div className="fs-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--fs-purple-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700 }}>RM</div>
        <span style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-sm)' }}>Share how Day 1 went...</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p className="fs-label">YOUR SQUAD — TAMPA, FL</p>
        <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)' }}>3 active today</p>
      </div>
      {SQUAD_POSTS.map(post => <PostCard key={post.id} post={post} myReactions={myReactions} onToggle={onToggle} />)}
    </div>
  )
}

function GlobalTab({ myReactions, onToggle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 32 }}>
      {GLOBAL_POSTS.map(post => <PostCard key={post.id} post={post} myReactions={myReactions} onToggle={onToggle} />)}
    </div>
  )
}

function LeaderboardTab() {
  return (
    <div style={{ paddingBottom: 32 }}>
      <div style={{ marginBottom: 16 }}>
        <p className="fs-label" style={{ marginBottom: 4 }}>TAMPA SQUAD — WEEK 1</p>
        <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)' }}>Ranked by consistency — not performance</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {LEADERBOARD.map(entry => (
          <div
            key={entry.rank}
            className={entry.isMe ? 'fs-card fs-card-purple' : 'fs-card'}
            style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <div style={{ width: 28, textAlign: 'center', flexShrink: 0 }}>
              {entry.rank <= 3
                ? <span style={{ fontSize: 18 }}>{RANK_MEDALS[entry.rank - 1]}</span>
                : <span style={{ fontWeight: 700, color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-sm)' }}>#{entry.rank}</span>
              }
            </div>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: entry.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
              {entry.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 500, color: 'var(--fs-text-primary)', fontSize: 'var(--fs-text-sm)' }}>
                {entry.name}
                {entry.isMe && <span style={{ color: 'var(--fs-text-tertiary)', fontWeight: 400, fontSize: 'var(--fs-text-xs)', marginLeft: 4 }}>(you)</span>}
              </p>
              <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.track}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontWeight: 700, color: 'var(--fs-purple-300)', fontSize: 'var(--fs-text-sm)' }}>{entry.completed} days</p>
              <p style={{ color: 'var(--fs-teal-300)', fontSize: 'var(--fs-text-xs)' }}>🔥 {entry.streak} streak</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Community() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab]     = useState('squad')
  const [myReactions, setMyReactions] = useState({})

  function toggleReaction(postId, type) {
    const key = `${postId}_${type}`
    setMyReactions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      <AuroraBackground />
      <div className="fs-page">
        <nav className="fs-topbar">
          <button
            onClick={() => navigate('/home')}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '22px', cursor: 'pointer', padding: '8px', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            ←
          </button>
          <button
            onClick={() => navigate('/settings')}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '20px', cursor: 'pointer', padding: '8px', lineHeight: 1 }}
          >
            ⚙
          </button>
        </nav>

        <div style={{ padding: '24px 20px 0' }}>
          <h1 className="fs-heading-md" style={{ marginBottom: 4 }}>Community</h1>
          <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)', marginBottom: 20 }}>You are not alone in this</p>

          <div style={{ display: 'flex', borderBottom: '1px solid var(--fs-border)', marginBottom: 20 }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1, paddingBottom: 12, background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 'var(--fs-text-sm)', fontWeight: 500, transition: 'color 0.2s',
                  color: activeTab === tab.id ? 'var(--fs-purple-300)' : 'var(--fs-text-tertiary)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--fs-purple-500)' : '2px solid transparent',
                  marginBottom: -1,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 20px' }}>
          {activeTab === 'squad'       && <SquadTab myReactions={myReactions} onToggle={toggleReaction} />}
          {activeTab === 'global'      && <GlobalTab myReactions={myReactions} onToggle={toggleReaction} />}
          {activeTab === 'leaderboard' && <LeaderboardTab />}
        </div>
      </div>
      <BottomNav />
    </>
  )
}
