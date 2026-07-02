import { useNavigate, useSearchParams } from 'react-router-dom'
import AuroraBackground from '../components/AuroraBackground'
import BackButton from '../components/BackButton'

export default function Bridge() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isRestart = searchParams.get('restart') === 'true'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 24px' }}>
      <AuroraBackground />

      <div style={{ maxWidth: 480, margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>

        <BackButton onClick={() => navigate('/onboarding')} />

        <div style={{ textAlign: 'center', margin: '16px 0 32px' }}>
          <span className="fs-logo" style={{ fontSize: 22 }}>flowstate</span>
        </div>

        <div style={{ marginBottom: 32 }}>
          <p className="fs-label fs-label-purple" style={{ marginBottom: 8 }}>Almost there</p>
          <h1 className="fs-heading-lg" style={{ marginBottom: 12 }}>
            {isRestart ? 'Ready for your next 21 days?' : 'Before you begin'}
          </h1>
          <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)', lineHeight: 1.6, marginBottom: 6 }}>
            {isRestart
              ? "You've proven you can do this. What do you want to work on next?"
              : "We'd love to ask you a few quick questions to understand what you're really looking for. The more honest you are, the better we can help."}
          </p>
          <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)' }}>Takes less than 2 minutes.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>

          <button
            onClick={() => navigate('/discovery')}
            className="fs-card fs-card-purple"
            style={{ padding: 20, textAlign: 'left', border: 'none', cursor: 'pointer', width: '100%' }}
          >
            <p className="fs-label fs-label-purple" style={{ marginBottom: 12 }}>Recommended</p>
            <span style={{ fontSize: 28, display: 'block', marginBottom: 10 }}>💬</span>
            <p style={{ fontWeight: 500, color: 'var(--fs-text-primary)', marginBottom: 4, fontSize: 'var(--fs-text-base)' }}>
              Answer a few questions
            </p>
            <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)', lineHeight: 1.5 }}>
              We'll use your answers to suggest the best track for you.
            </p>
          </button>

          <button
            onClick={() => navigate('/track-select')}
            className="fs-card"
            style={{ padding: 20, textAlign: 'left', border: 'none', cursor: 'pointer', width: '100%' }}
          >
            <span style={{ fontSize: 28, display: 'block', marginBottom: 10 }}>🎯</span>
            <p style={{ fontWeight: 500, color: 'var(--fs-text-primary)', marginBottom: 4, fontSize: 'var(--fs-text-base)' }}>
              Skip, I know what I want
            </p>
            <p style={{ color: 'var(--fs-text-secondary)', fontSize: 'var(--fs-text-sm)', lineHeight: 1.5 }}>
              Go straight to choosing your track and sub-track directly.
            </p>
          </button>
        </div>

        <p style={{ color: 'var(--fs-text-tertiary)', fontSize: 'var(--fs-text-xs)', textAlign: 'center', marginTop: 'auto' }}>
          You can always come back and answer these later.
        </p>
      </div>
    </div>
  )
}
