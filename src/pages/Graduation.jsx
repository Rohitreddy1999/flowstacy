import { Link } from 'react-router-dom'

export default function Graduation() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">🎓</div>
        <h1 className="text-4xl font-bold" style={{ color: '#534AB7' }}>Congratulations!</h1>
        <p className="text-gray-500 text-lg">
          You've completed your 21-day Flowstate journey. Celebrate your progress, download your certificate, and choose your next track to keep the momentum going.
        </p>
        <div className="bg-gray-50 rounded-xl p-6 space-y-2">
          <p className="font-semibold text-gray-700">🏆 21 Days Completed</p>
          <p className="text-gray-400 text-sm">Track: Mindful Momentum</p>
          <p className="text-gray-400 text-sm">— Certificate & stats coming soon —</p>
        </div>
        <Link
          to="/"
          className="block w-full py-3 px-6 rounded-xl text-white font-semibold text-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#534AB7' }}
        >
          Start a New Journey →
        </Link>
      </div>
    </div>
  )
}
