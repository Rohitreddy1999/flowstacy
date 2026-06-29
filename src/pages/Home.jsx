import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Day 1 of 21</p>
            <h1 className="text-2xl font-bold text-gray-800">Today's Flow</h1>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#534AB7' }}>
            R
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="h-2 rounded-full" style={{ backgroundColor: '#534AB7', width: '4.76%' }}></div>
        </div>

        <p className="text-gray-500">
          Your daily home base. Each day you'll find your habit check-ins, today's reflection prompt, and your progress through the 21-day track.
        </p>

        <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
          <p className="font-semibold text-gray-700">📋 Today's Tasks</p>
          <p className="text-gray-400 text-sm">— Daily habits will appear here —</p>
        </div>

        <Link
          to="/track/mindful-momentum"
          className="block w-full py-3 px-6 rounded-xl text-white font-semibold text-lg text-center transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#534AB7' }}
        >
          View My Track →
        </Link>

        <div className="flex justify-around pt-2">
          <Link to="/community" className="text-sm text-gray-400 hover:underline">Community</Link>
          <Link to="/experts" className="text-sm text-gray-400 hover:underline">Experts</Link>
          <Link to="/graduation" className="text-sm text-gray-400 hover:underline">Graduation</Link>
        </div>
      </div>
    </div>
  )
}
