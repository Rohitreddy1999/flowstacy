import { Link } from 'react-router-dom'

export default function Recommendation() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#534AB7' }}>Step 2 of 2</p>
        <h1 className="text-3xl font-bold text-gray-800">Your Recommended Track</h1>
        <p className="text-gray-500 text-lg">
          Based on your discovery answers, we've matched you with the perfect 21-day program. Review your track and commit to the journey.
        </p>
        <div className="rounded-xl border-2 p-6 text-left space-y-2" style={{ borderColor: '#534AB7' }}>
          <p className="font-bold text-gray-800 text-lg">✨ Recommended: Mindful Momentum</p>
          <p className="text-gray-500 text-sm">21 days · 15 min/day · Beginner-friendly</p>
          <p className="text-gray-400 text-sm mt-2">Build focus, reduce stress, and create a daily rhythm that sticks.</p>
        </div>
        <Link
          to="/home"
          className="block w-full py-3 px-6 rounded-xl text-white font-semibold text-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#534AB7' }}
        >
          Start My Journey →
        </Link>
      </div>
    </div>
  )
}
