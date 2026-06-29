import { Link } from 'react-router-dom'

export default function Experts() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Expert Marketplace</h1>
        <p className="text-gray-500 text-lg">
          Go deeper with verified coaches, nutritionists, therapists, and wellness experts. Book 1-on-1 sessions or join live group workshops.
        </p>
        <div className="space-y-3">
          {[
            { name: 'Dr. Priya Sharma', role: 'Mindfulness Coach' },
            { name: 'Marcus Webb', role: 'Habit & Performance Coach' },
            { name: 'Elena Torres', role: 'Nutritionist' },
          ].map((expert) => (
            <div key={expert.name} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0" style={{ backgroundColor: '#534AB7' }}>
                {expert.name[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-700">{expert.name}</p>
                <p className="text-gray-400 text-sm">{expert.role}</p>
              </div>
            </div>
          ))}
        </div>
        <Link
          to="/graduation"
          className="block w-full py-3 px-6 rounded-xl text-white font-semibold text-lg text-center transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#534AB7' }}
        >
          Next: Graduation →
        </Link>
      </div>
    </div>
  )
}
