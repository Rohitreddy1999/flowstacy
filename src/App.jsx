import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
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
import LoadingScreen from './components/LoadingScreen'

function Root() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localStorage.getItem('flowstate_selected_subtrack')) {
        navigate('/home', { replace: true })
      } else {
        setLoading(false)
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [navigate])

  if (loading) return <LoadingScreen />
  return <Onboarding />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/discovery" element={<Discovery />} />
      <Route path="/recommendation" element={<Recommendation />} />
      <Route path="/sub-track-select" element={<SubTrackSelect />} />
      <Route path="/home" element={<Home />} />
      <Route path="/track/:trackId" element={<TrackDetail />} />
      <Route path="/community" element={<Community />} />
      <Route path="/graduation" element={<Graduation />} />
      <Route path="/experts" element={<Experts />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default App
