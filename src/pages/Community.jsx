import { useState } from 'react'

const TOTAL = 21

// ── Sample data ───────────────────────────────────────────────────────────────

const SQUAD_POSTS = [
  {
    id: 's1', initials: 'AK', name: 'Arjun K.', color: '#534AB7',
    time: '2 hours ago', streak: 8,
    track: 'Body & Fitness', day: 8,
    reflection: 'Goblet squats hit different today. Legs are shaking but I showed up.',
    reactions: { fire: 12, fist: 8, star: 5 },
  },
  {
    id: 's2', initials: 'PS', name: 'Priya S.', color: '#0D9488',
    time: '4 hours ago', streak: 8,
    track: 'Daily Discipline', day: 8,
    reflection: 'No phone for the first 30 minutes this morning. Felt weird. Then felt incredible.',
    reactions: { fire: 18, fist: 6, star: 9 },
  },
  {
    id: 's3', initials: 'RJ', name: 'Raj J.', color: '#E8604A',
    time: '6 hours ago', streak: 7,
    track: 'Body & Fitness', day: 7,
    reflection: "Missed yesterday but came back today. Proud I didn't give up.",
    reactions: { fire: 24, fist: 15, star: 7 },
  },
]

const GLOBAL_POSTS = [
  {
    id: 'g1', initials: 'ML', name: 'Maria L.', color: '#EC4899',
    time: '1 hour ago', streak: 14,
    track: 'Journaling', day: 14,
    reflection: 'Wrote a letter to my 15-year-old self today. Cried a little. Worth it.',
    reactions: { fire: 47, fist: 22, star: 31 },
  },
  {
    id: 'g2', initials: 'JT', name: 'James T.', color: '#F59E0B',
    time: '3 hours ago', streak: 19,
    track: 'Drawing & Sketching', day: 19,
    reflection: "Day 19. Two days left. I can actually draw now. Still can't believe it.",
    reactions: { fire: 89, fist: 43, star: 67 },
  },
  {
    id: 'g3', initials: 'AR', name: 'Aisha R.', color: '#10B981',
    time: '5 hours ago', streak: 21,
    track: 'Learn an Instrument', day: 21,
    reflection: 'Day 21. I played my song for my mom today. She cried. I cried. Flow State changed something in me.',
    reactions: { fire: 134, fist: 98, star: 112 },
  },
]

const LEADERBOARD = [
  { rank: 1, initials: 'AK', name: 'Arjun K.',  color: '#534AB7', track: 'Body & Fitness',    streak: 8, completed: 8, isMe: false },
  { rank: 2, initials: 'RJ', name: 'Raj J.',    color: '#E8604A', track: 'Body & Fitness',    streak: 7, completed: 7, isMe: false },
  { rank: 3, initials: 'PS', name: 'Priya S.',  color: '#0D9488', track: 'Daily Discipline',  streak: 8, completed: 8, isMe: false },
  { rank: 4, initials: 'RM', name: 'You',       color: '#534AB7', track: 'Body & Fitness',    streak: 1, completed: 1, isMe: true  },
]

const REACTION_TYPES = [
  { key: 'fire', emoji: '🔥', label: 'fired me up' },
  { key: 'fist', emoji: '👊', label: 'respect' },
  { key: 'star', emoji: '⭐', label: 'inspired' },
]

const RANK_MEDALS = ['🥇', '🥈', '🥉']

const TABS = [
  { id: 'squad',       label: 'My Squad' },
  { id: 'global',      label: 'Global Feed' },
  { id: 'leaderboard', label: 'Leaderboard' },
]

// ── Shared sub-components ─────────────────────────────────────────────────────

function ProgressDots({ day }) {
  return (
    <div className="flex flex-wrap gap-1 mt-3">
      {Array.from({ length: TOTAL }, (_, i) => {
        const pos = i + 1
        const bg = pos < day ? '#10B981' : pos === day ? '#534AB7' : '#e5e5e5'
        return <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: bg }} />
      })}
    </div>
  )
}

function PostCard({ post, myReactions, onToggle }) {
  const pct = Math.round((post.day / TOTAL) * 100)

  return (
    <div className="border border-gray-100 rounded-xl p-4 space-y-4">

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: post.color }}
          >
            {post.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{post.name}</p>
            <p className="text-xs text-gray-400">{post.time}</p>
          </div>
        </div>
        <span className="text-xs text-gray-500 shrink-0">🔥 {post.streak} day streak</span>
      </div>

      {/* Progress card */}
      <div className="bg-gray-50 rounded-xl px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
          {post.track}
        </p>
        <p className="text-lg font-bold text-gray-900">Day {post.day} complete</p>
        <p className="text-xs text-gray-400 mt-0.5">{pct}% through the journey</p>
        <ProgressDots day={post.day} />
      </div>

      {/* Reflection */}
      <p className="text-sm text-gray-700 italic leading-relaxed">"{post.reflection}"</p>

      {/* Reactions */}
      <div className="flex items-center gap-2 flex-wrap">
        {REACTION_TYPES.map(({ key, emoji, label }) => {
          const active = !!myReactions[`${post.id}_${key}`]
          const count = post.reactions[key] + (active ? 1 : 0)
          return (
            <button
              key={key}
              onClick={() => onToggle(post.id, key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
              style={{
                backgroundColor: active ? '#EEEDFE' : 'white',
                borderColor:     active ? '#534AB7' : '#e5e5e5',
                color:           active ? '#534AB7' : '#9ca3af',
              }}
            >
              <span>{emoji}</span>
              <span>{count}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          )
        })}
        <button className="ml-auto text-xs text-gray-400 hover:text-gray-600 transition-colors">
          Reply
        </button>
      </div>

    </div>
  )
}

// ── Tab panels ────────────────────────────────────────────────────────────────

function SquadTab({ myReactions, onToggle }) {
  return (
    <div className="space-y-4 pb-8">
      {/* Compose bar */}
      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ backgroundColor: '#534AB7' }}
        >
          RM
        </div>
        <span className="text-sm text-gray-400">Share how Day 1 went...</span>
      </div>

      {/* Squad header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Your Squad — Tampa, FL
        </p>
        <p className="text-xs text-gray-400">3 active today</p>
      </div>

      {SQUAD_POSTS.map(post => (
        <PostCard key={post.id} post={post} myReactions={myReactions} onToggle={onToggle} />
      ))}
    </div>
  )
}

function GlobalTab({ myReactions, onToggle }) {
  return (
    <div className="space-y-4 pb-8">
      {GLOBAL_POSTS.map(post => (
        <PostCard key={post.id} post={post} myReactions={myReactions} onToggle={onToggle} />
      ))}
    </div>
  )
}

function LeaderboardTab() {
  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
          Tampa Squad — Week 1
        </p>
        <p className="text-xs text-gray-400">Ranked by consistency — not performance</p>
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {LEADERBOARD.map(entry => (
          <div
            key={entry.rank}
            className="flex items-center gap-3 p-4 rounded-xl border transition-colors"
            style={
              entry.isMe
                ? { backgroundColor: '#EEEDFE', borderColor: '#534AB7' }
                : { backgroundColor: 'white',   borderColor: '#f0f0f0' }
            }
          >
            {/* Rank badge */}
            <div className="w-7 text-center shrink-0">
              {entry.rank <= 3
                ? <span className="text-lg">{RANK_MEDALS[entry.rank - 1]}</span>
                : <span className="text-sm font-bold text-gray-400">#{entry.rank}</span>
              }
            </div>

            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: entry.color }}
            >
              {entry.initials}
            </div>

            {/* Name + track */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">
                {entry.name}
                {entry.isMe && <span className="ml-1 text-xs font-normal text-gray-400">(you)</span>}
              </p>
              <p className="text-xs text-gray-400 truncate">{entry.track}</p>
            </div>

            {/* Stats */}
            <div className="text-right shrink-0">
              <p className="text-sm font-bold" style={{ color: '#534AB7' }}>
                {entry.completed} days
              </p>
              <p className="text-xs text-gray-400">🔥 {entry.streak} streak</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-300 text-center pt-1">
        Ranked by consistency — not performance
      </p>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function Community() {
  const [activeTab, setActiveTab]   = useState('squad')
  const [myReactions, setMyReactions] = useState({})

  function toggleReaction(postId, type) {
    const key = `${postId}_${type}`
    setMyReactions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
        <span className="text-lg font-semibold tracking-tight" style={{ color: '#534AB7' }}>
          flowstate
        </span>
        <span className="text-xl cursor-pointer">🔔</span>
      </nav>

      <div className="max-w-[480px] mx-auto px-6 pt-6 space-y-5">

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Community</h1>
          <p className="text-sm text-gray-400">You are not alone in this</p>
        </div>

        {/* Tab strip */}
        <div className="flex border-b border-gray-100">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 pb-3 text-sm font-medium transition-colors"
              style={{
                color:        activeTab === tab.id ? '#534AB7' : '#9ca3af',
                borderBottom: activeTab === tab.id
                  ? '2px solid #534AB7'
                  : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active tab content */}
        {activeTab === 'squad'       && <SquadTab myReactions={myReactions} onToggle={toggleReaction} />}
        {activeTab === 'global'      && <GlobalTab myReactions={myReactions} onToggle={toggleReaction} />}
        {activeTab === 'leaderboard' && <LeaderboardTab />}

      </div>
    </div>
  )
}
