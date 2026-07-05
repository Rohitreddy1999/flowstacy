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

// Static short-key → Supabase UUID map (avoids network lookup for subtrack resolution)
export const SUBTRACK_IDS = {
  gym:          '029740fe-cc23-42f1-9719-59e028cfe510',
  calisthenics: '3705dfe2-4f51-45cc-883a-d0c490514742',
  running:      '0c06fdd1-7f85-417b-aba2-82adaa612d87',
  sport:        'cb5caac1-f711-4868-8348-28ea71576c6a',
  yoga:         '1811f7e3-feab-4558-9509-9bc30869b4d3',
  morning:      'fbdffddc-0b06-444c-bede-0da1a166b5b2',
  reading:      '4ea52f42-d9a0-4dce-9f74-84d4f1bcf1b4',
  steps:        'f90c8ce1-c048-4e2a-bfb1-598d27c86702',
  meditation:   '2c5b56a7-9406-4a83-8084-ba2ad46c9327',
  detox:        '9458059f-fd68-47de-8a22-8dd6d737d7f8',
  guitar:       'd051f9b4-380e-4f69-bc0a-3a9c642288f4',
  piano:        '256a9220-25a9-4e34-9dda-92b9bbea6b2d',
  drums:        'ea652739-99d1-4e24-9dac-f046d033d2dc',
  vocals:       '1a3cb385-ecc3-44f4-abaf-812133336722',
  self:         '0e7d9759-7d35-44c7-807d-e8d7215db275',
  gratitude:    '183c1bb2-7e36-4543-afff-c956b441dd14',
  stream:       'c40d7a23-0e61-4ccc-87a8-f6ec0d4a578d',
  goals:        '7dc2e39f-e87f-42ed-bcb0-2e74aa734728',
  fundamentals: '3b6b0567-2b17-4978-a296-8f6a0ca2661d',
  portrait:     'fea0f99f-3ab2-4173-8edc-e651b2976c0e',
  urban:        'a1feec79-48cc-415c-93da-f44cfd293323',
  nature:       'c9da4820-51e6-476d-af0f-03eb0af9eefe',
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
