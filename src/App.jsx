import { Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/discovery" element={<Discovery />} />
      <Route path="/recommendation" element={<Recommendation />} />
      <Route path="/home" element={<Home />} />
      <Route path="/track/:trackId" element={<TrackDetail />} />
      <Route path="/community" element={<Community />} />
      <Route path="/graduation" element={<Graduation />} />
      <Route path="/experts" element={<Experts />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/sub-track-select" element={<SubTrackSelect />} />
    </Routes>
  )
}

export default App
