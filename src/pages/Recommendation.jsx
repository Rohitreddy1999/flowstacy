import { useLocation } from 'react-router-dom'
import TrackSelectScreen from '../components/TrackSelectScreen'

export default function Recommendation() {
  const { state } = useLocation()
  const scores = state?.scores ?? null
  let recommendedTrack = null
  if (scores) {
    const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
    if (top && top[1] > 0) recommendedTrack = top[0].toLowerCase()
  }
  return <TrackSelectScreen recommendedTrack={recommendedTrack} backTo="/discovery" />
}
