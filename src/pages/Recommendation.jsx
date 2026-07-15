import { useEffect, useState } from 'react'
import TrackSelectScreen from '../components/TrackSelectScreen'

export default function Recommendation() {
  const [recommendedTrack, setRecommendedTrack] = useState(null)

  useEffect(() => {
    const scoresRaw = localStorage.getItem('flowstacy_scores')
    if (scoresRaw) {
      const scores = JSON.parse(scoresRaw)
      const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
      if (top && top[1] > 0) setRecommendedTrack(top[0].toLowerCase())
    }
  }, [])

  return <TrackSelectScreen recommendedTrack={recommendedTrack} backTo="/discovery" />
}
