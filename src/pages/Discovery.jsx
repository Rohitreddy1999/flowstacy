import { Link } from 'react-router-dom'

export default function Discovery() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#534AB7' }}>Step 1 of 2</p>
        <h1 className="text-3xl font-bold text-gray-800">Discovery Questions</h1>
        <p className="text-gray-500 text-lg">
          Answer a short set of questions about your goals, lifestyle, and what areas of life you want to improve. Your answers shape your personal 21-day track.
        </p>
        <div className="bg-gray-50 rounded-xl p-6 text-left space-y-3 text-gray-400 text-sm">
          <p>🎯 What's your primary goal right now?</p>
          <p>⏰ How much time can you dedicate daily?</p>
          <p>💪 What's your current energy level?</p>
          <p className="italic">— Questions will appear here —</p>
        </div>
        <Link
          to="/recommendation"
          className="block w-full py-3 px-6 rounded-xl text-white font-semibold text-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#534AB7' }}
        >
          Next →
        </Link>
      </div>
    </div>
  )
}
