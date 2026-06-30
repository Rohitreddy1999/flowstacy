import { Routes, Route } from 'react-router-dom'
import RootRedirect from './components/RootRedirect'
import Onboarding from './pages/Onboarding'
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
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Root — smart redirect based on auth + localStorage state */}
      <Route path="/"            element={<RootRedirect />} />

      {/* Public / onboarding routes */}
      <Route path="/onboarding"        element={<Onboarding />} />
      <Route path="/login"             element={<Login />} />
      <Route path="/signup"            element={<Signup />} />
      <Route path="/discovery"         element={<Discovery />} />
      <Route path="/recommendation"    element={<Recommendation />} />
      <Route path="/sub-track-select"  element={<SubTrackSelect />} />
      <Route path="/track/:trackId"    element={<TrackDetail />} />

      {/* Protected routes */}
      <Route path="/home"       element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/community"  element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path="/progress"   element={<ProtectedRoute><Progress /></ProtectedRoute>} />
      <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/graduation" element={<ProtectedRoute><Graduation /></ProtectedRoute>} />
      <Route path="/experts"    element={<ProtectedRoute><Experts /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
