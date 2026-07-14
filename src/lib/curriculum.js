import { supabase } from './supabase'

export const SUBTRACK_NAMES = {
  gym:        'Gym & Weightlifting',
  breathwork: 'Breathwork Fundamentals',
}

// Static short-key → Supabase UUID map (avoids network lookup for subtrack resolution)
export const SUBTRACK_IDS = {
  gym:        'e50741ee-e792-4220-8e68-4f231dc44bc3',
  breathwork: '5e2368f6-0d47-4722-b0df-5a1478ca0cee',
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
