export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <span className="text-2xl font-semibold tracking-tight" style={{ color: '#534AB7' }}>
        flowstate
      </span>
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: '#534AB7', animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
