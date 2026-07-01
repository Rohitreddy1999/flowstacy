export default function BackButton({ onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`text-sm font-medium flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors ${className}`}
      style={{ padding: '16px' }}
    >
      ← Back
    </button>
  )
}
