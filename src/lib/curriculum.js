import { supabase } from './supabase'

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
