import { Link, useParams } from 'react-router-dom'

export default function TrackDetail() {
  const { trackId } = useParams()

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-md mx-auto space-y-6">
        <Link to="/home" className="text-sm font-medium hover:underline" style={{ color: '#534AB7' }}>
          ← Back to Today
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Track Detail</h1>
        <p className="text-sm font-mono bg-gray-100 px-3 py-1 rounded inline-block text-gray-500">
          trackId: {trackId}
        </p>
        <p className="text-gray-500 text-lg">
          The full 21-day curriculum for your selected track. Browse daily lessons, habit stacks, video content, and expert guidance — all in one place.
        </p>
        <div className="space-y-3">
          {[1, 2, 3].map((day) => (
            <div key={day} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-700">Day {day}</p>
                <p className="text-gray-400 text-sm">— Content coming soon —</p>
              </div>
              <span className="text-gray-300 text-xl">›</span>
            </div>
          ))}
        </div>
        <Link
          to="/community"
          className="block w-full py-3 px-6 rounded-xl text-white font-semibold text-lg text-center transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#534AB7' }}
        >
          Next: Community →
        </Link>
      </div>
    </div>
  )
}
