import { create } from 'zustand'
import { getActiveJourney } from './journeyService'

export const useJourneyStore = create((set) => ({
  journey:      null,
  currentDay:   1,
  streak:       0,
  completedDays: [],   // array of completed day numbers (integers)
  isLoading:    true,

  hydrate: async (userId) => {
    set({ isLoading: true })
    console.log('journeyStore hydrate — userId:', userId)
    const journey = await getActiveJourney(userId)
    console.log('journeyStore hydrate — getActiveJourney result:', journey)
    if (!journey) {
      set({ journey: null, isLoading: false })
      return
    }
    set({
      journey,
      currentDay:    journey.current_day,
      streak:        journey.streak_count,
      completedDays: Array.from({ length: Math.max(0, journey.current_day - 1) }, (_, i) => i + 1),
      isLoading:     false,
    })
  },

  // Optimistic update — Supabase write happens in handleDayViewComplete
  markDayComplete: (dayNumber) => set(state => ({
    currentDay:    Math.min(dayNumber + 1, 21),
    streak:        state.streak + 1,
    completedDays: [...state.completedDays, dayNumber],
    journey: state.journey
      ? { ...state.journey, current_day: Math.min(dayNumber + 1, 21), streak_count: state.journey.streak_count + 1 }
      : null,
  })),

  reset: () => set({
    journey:       null,
    currentDay:    1,
    streak:        0,
    completedDays: [],
    isLoading:     false,
  }),
}))
