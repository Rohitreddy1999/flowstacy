import { Link } from 'react-router-dom'

export default function Community() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Community Feed</h1>
        <p className="text-gray-500 text-lg">
          Connect with others on the same 21-day journey. Share wins, ask questions, react to posts, and stay accountable alongside your cohort.
        </p>
        <div className="space-y-3">
          {['Alex shared a win 🎉', 'Jordan asked a question 🤔', 'Sam posted a reflection 💭'].map((post) => (
            <div key={post} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-gray-700 text-sm">{post}</p>
              <p className="text-gray-400 text-xs mt-1">— Post content coming soon —</p>
            </div>
          ))}
        </div>
        <Link
          to="/experts"
          className="block w-full py-3 px-6 rounded-xl text-white font-semibold text-lg text-center transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#534AB7' }}
        >
          Next: Experts →
        </Link>
      </div>
    </div>
  )
}
