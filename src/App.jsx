import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
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
import Profile from './pages/Profile'
import SubTrackSelect from './pages/SubTrackSelect'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'
import PhoneFrame from './components/PhoneFrame'

function AppRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"            element={<LoadingScreen />} />

        <Route path="/welcome"           element={<Welcome />} />
        <Route path="/onboarding"        element={<Onboarding />} />
        <Route path="/bridge"            element={<Bridge />} />
        <Route path="/track-select"      element={<TrackSelect />} />
        <Route path="/login"             element={<Login />} />
        <Route path="/signup"            element={<Signup />} />
        <Route path="/discovery"         element={<Discovery />} />
        <Route path="/recommendation"    element={<Recommendation />} />
        <Route path="/sub-track-select"  element={<SubTrackSelect />} />
        <Route path="/track/:trackId"    element={<TrackDetail />} />

        <Route path="/home"       element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/community"  element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/progress"   element={<ProtectedRoute><Progress /></ProtectedRoute>} />
        <Route path="/progress-preview" element={<Progress />} />
        <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/graduation" element={<ProtectedRoute><Graduation /></ProtectedRoute>} />
        <Route path="/experts"    element={<ProtectedRoute><Experts /></ProtectedRoute>} />
        <Route path="/settings"   element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <PhoneFrame>
      <InstallPrompt />
      <AppRoutes />
    </PhoneFrame>
  )
}

export default App
