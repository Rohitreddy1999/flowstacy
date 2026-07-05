import { supabase } from './supabase'

export const SUBTRACK_NAMES = {
  gym: 'Gym & Weightlifting', calisthenics: 'Calisthenics', running: 'Running & Stamina',
  sport: 'Sport & Athletics', yoga: 'Yoga & Flexibility',
  morning: 'Morning Routine', reading: 'Daily Reading', steps: '10,000 Steps',
  meditation: 'Meditation', detox: 'Digital Detox',
  guitar: 'Guitar', piano: 'Piano & Keyboard', drums: 'Drums & Rhythm', vocals: 'Vocals & Singing',
  self: 'Self-Discovery', gratitude: 'Gratitude Practice', stream: 'Stream of Consciousness', goals: 'Goal Setting & Vision',
  fundamentals: 'Sketching Fundamentals', portrait: 'Portrait Drawing', urban: 'Urban Sketching', nature: 'Nature & Animals',
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function resolveSubtrack(storedValue) {
  if (!storedValue) return null
  if (UUID_RE.test(storedValue)) {
    const { data } = await supabase
      .from('subtracks')
      .select('id, name, tracks(name, color)')
      .eq('id', storedValue)
      .single()
    return data
  }
  const displayName = SUBTRACK_NAMES[storedValue] || storedValue
  return getSubtrackByName(displayName)
}

export async function getDayContent(subtracks_id, dayNumber) {
  const { data, error } = await supabase
    .from('curriculum_days')
    .select('*')
    .eq('subtrack_id', subtracks_id)
    .eq('day_number', dayNumber)
    .single()

  if (error) {
    console.error('Error fetching day content:', error)
    return null
  }
  return data
}

export async function getSubtrackByName(name) {
  const { data, error } = await supabase
    .from('subtracks')
    .select('*, tracks(*)')
    .ilike('name', name)
    .single()

  if (error) {
    console.error('Error fetching subtrack:', error)
    return null
  }
  return data
}

export async function getSubtracksByTrack(trackSlug) {
  const { data, error } = await supabase
    .from('subtracks')
    .select('*, tracks!inner(*)')
    .eq('tracks.slug', trackSlug)

  if (error) {
    console.error('Error fetching subtracks:', error)
    return null
  }
  return data
}
