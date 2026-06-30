import BottomNav from '../components/BottomNav'

export default function Progress() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <nav className="border-b border-gray-100 px-6 py-4 sticky top-0 bg-white z-10">
        <span className="text-lg font-semibold tracking-tight" style={{ color: '#534AB7' }}>
          flowstate
        </span>
      </nav>

      <div className="max-w-[480px] mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
        <p className="text-sm text-gray-400">
          Coming soon — your full 21-day journey will live here.
        </p>
      </div>

      <BottomNav />
    </div>
  )
}
