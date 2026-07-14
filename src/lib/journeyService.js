import { supabase } from './supabase'

export async function getActiveJourney(userId) {
  const { data, error } = await supabase
    .from('user_journeys')
    .select('*, subtracks(*, tracks(*))')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('getActiveJourney error:', error.message, error.details, error.hint)
    return null
  }
  return data
}

export async function createJourney(userId, subtractId) {
  const { data, error } = await supabase
    .from('user_journeys')
    .insert({
      user_id: userId,
      subtrack_id: subtractId,
      current_day: 1,
      streak_count: 0,
      grace_used: false,
      graduated: false,
      is_active: true,
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('createJourney error:', error.message, error.details, error.hint)
    return null
  }
  return data
}

export async function completeDay(journeyId, userId, dayNumber, feeling, reflectionNote) {
  const { error: insertError } = await supabase
    .from('daily_completions')
    .insert({
      journey_id: journeyId,
      user_id: userId,
      day_number: dayNumber,
      feeling,
      reflection_note: reflectionNote,
      completed_at: new Date().toISOString(),
    })

  if (insertError) {
    console.error('completeDay insert error:', insertError.message, insertError.details, insertError.hint)
    return false
  }

  const newStreak = await calculateStreak(journeyId)

  const { error: updateError } = await supabase
    .from('user_journeys')
    .update({ current_day: dayNumber + 1, streak_count: newStreak })
    .eq('id', journeyId)

  if (updateError) {
    console.error('completeDay update error:', updateError.message, updateError.details, updateError.hint)
    return false
  }

  return true
}

// Counts consecutive completed day numbers from the most recent day backwards.
export async function calculateStreak(journeyId) {
  const { data, error } = await supabase
    .from('daily_completions')
    .select('day_number')
    .eq('journey_id', journeyId)
    .order('day_number', { ascending: false })

  if (error || !data || data.length === 0) return 0

  const days = data.map(r => r.day_number)
  let streak = 1
  for (let i = 0; i < days.length - 1; i++) {
    if (days[i] - days[i + 1] === 1) {
      streak++
    } else {
      break
    }
  }
  return streak
}
