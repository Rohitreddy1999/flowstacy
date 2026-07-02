export default function BackButton({ onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={className}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '8px 4px', display: 'flex', alignItems: 'center', gap: 6,
        color: 'rgba(255,255,255,0.4)', fontSize: 13,
        transition: 'color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
    >
      ← Back
    </button>
  )
}
