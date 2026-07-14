import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'
import { useJourneyStore } from './lib/journeyStore'
import LoadingScreen from './components/LoadingScreen'
import Welcome from './pages/Welcome'
import InstallPrompt from './components/InstallPrompt'
import Onboarding from './pages/Onboarding'
import Bridge from './pages/Bridge'
import TrackSelect from './pages/TrackSelect'
import Discovery from './pages/Discovery'
import Recommendation from './pages/Recommendation'
import Home from './pages/Home'
import TrackDetail from './pages/TrackDetail'
import Community from './pages/Community'
import Graduation from './pages/Graduation'
import Experts from './pages/Experts'
import Progress from './pages/Progress'
import SubTrackSelect from './pages/SubTrackSelect'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'
import PhoneFrame from './components/PhoneFrame'
import BottomNav from './components/BottomNav'

function AppShell({ children }) {
  return (
    <div style={{ position: 'relative', height: '100dvh' }}>
      <div className="hide-scrollbar" style={{
        height: 'calc(100dvh - 80px)',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        {children}
      </div>
      <BottomNav />
    </div>
  )
}

function AppRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Boot */}
        <Route path="/" element={<LoadingScreen />} />

        {/* Public / onboarding — no nav */}
        <Route path="/welcome"          element={<Welcome />} />
        <Route path="/login"            element={<Login />} />
        <Route path="/signup"           element={<Signup />} />
        <Route path="/onboarding"       element={<Onboarding />} />
        <Route path="/bridge"           element={<Bridge />} />
        <Route path="/track-select"     element={<TrackSelect />} />
        <Route path="/sub-track-select" element={<SubTrackSelect />} />
        <Route path="/discovery"        element={<Discovery />} />
        <Route path="/recommendation"   element={<Recommendation />} />

        {/* App tabs — protected, wrapped in AppShell for BottomNav */}
        <Route path="/home" element={
          <ProtectedRoute>
            <AppShell><Home /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/journey" element={
          <ProtectedRoute>
            <AppShell><Progress /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/community" element={
          <ProtectedRoute>
            <AppShell><Community /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <AppShell><Settings /></AppShell>
          </ProtectedRoute>
        } />

        {/* Nested / detail screens — protected, no nav */}
        <Route path="/track/:trackId" element={<TrackDetail />} />
        <Route path="/graduation" element={<ProtectedRoute><Graduation /></ProtectedRoute>} />
        <Route path="/experts"    element={<ProtectedRoute><Experts /></ProtectedRoute>} />

        {/* Dev previews — no auth */}
        <Route path="/progress-preview"   element={<Progress />} />
        <Route path="/graduation-preview" element={<Graduation />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

const STALE_KEYS = [
  'flowstacy_current_day',
  'flowstacy_completed_days',
  'flowstacy_streak',
  'flowstacy_reflections',
  'flowstacy_selected_track',
  'flowstacy_selected_subtrack',
]

function App() {
  useEffect(() => {
    // Task 4: clear stale localStorage keys once on app load
    STALE_KEYS.forEach(k => localStorage.removeItem(k))

    // Hydrate store if a session already exists (returning user)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) useJourneyStore.getState().hydrate(session.user.id)
    })

    // Keep store in sync with auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        useJourneyStore.getState().hydrate(session.user.id)
      }
      if (event === 'SIGNED_OUT') {
        useJourneyStore.getState().reset()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <PhoneFrame>
      <InstallPrompt />
      <AppRoutes />
    </PhoneFrame>
  )
}

export default App
