import { useNavigate, useSearchParams } from 'react-router-dom'
import BackButton from '../components/BackButton'

export default function Bridge() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isRestart = searchParams.get('restart') === 'true'

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10">
      <div className="max-w-[480px] mx-auto w-full flex flex-col flex-1">

        {/* Back button */}
        <BackButton onClick={() => navigate('/onboarding')} className="self-start -ml-4 mb-2" />

        {/* Logo */}
        <div className="text-center mb-10">
          <span className="text-2xl font-semibold tracking-tight" style={{ color: '#534AB7' }}>
            flowstate
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Almost there
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            {isRestart ? 'Ready for your next 21 days?' : 'Before you begin'}
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed mb-3">
            {isRestart
              ? "You've proven you can do this. What do you want to work on next?"
              : "We'd love to ask you a few quick questions to understand what you're really looking for. The more honest you are, the better we can help."}
          </p>
          <p className="text-xs text-gray-400">Takes less than 2 minutes.</p>
        </div>

        {/* Path cards */}
        <div className="space-y-4 mb-8">

          {/* Recommended path */}
          <button
            onClick={() => navigate('/discovery')}
            className="relative w-full text-left rounded-xl p-5 transition-opacity hover:opacity-90"
            style={{ border: '2px solid #534AB7', backgroundColor: '#EEEDFE', borderRadius: '12px' }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#534AB7' }}>
              Recommended
            </p>
            <span className="text-3xl block mb-3">💬</span>
            <p className="font-semibold text-gray-900 mb-1">Answer a few questions</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              We'll use your answers to suggest the best track for you.
            </p>
          </button>

          {/* Skip path */}
          <button
            onClick={() => navigate('/track-select')}
            className="relative w-full text-left rounded-xl p-5 bg-white border transition-colors hover:bg-gray-50"
            style={{ borderColor: '#e5e5e5', borderRadius: '12px' }}
          >
            <span className="text-3xl block mb-3">🎯</span>
            <p className="font-semibold text-gray-900 mb-1">Skip, I know what I want</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Go straight to choosing your track and sub-track directly.
            </p>
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-auto">
          You can always come back and answer these later.
        </p>
      </div>
    </div>
  )
}
