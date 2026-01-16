import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'dashboard-habits'

const defaultHabits = [
  { id: 1, name: 'Exercise', icon: '🏃', streak: 5, completedToday: false },
  { id: 2, name: 'Read', icon: '📖', streak: 12, completedToday: true },
  { id: 3, name: 'Meditate', icon: '🧘', streak: 3, completedToday: false },
  { id: 4, name: 'Water', icon: '💧', streak: 8, completedToday: true },
]

function loadHabits() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const { habits, lastDate } = JSON.parse(stored)
      const today = new Date().toDateString()

      // Reset completedToday if it's a new day
      if (lastDate !== today) {
        return habits.map(h => ({
          ...h,
          completedToday: false,
          // Reset streak if missed yesterday (simplified logic)
        }))
      }
      return habits
    }
  } catch {
    // Ignore errors
  }
  return defaultHabits
}

export function useHabits() {
  const [habits, setHabits] = useState(loadHabits)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      habits,
      lastDate: new Date().toDateString(),
    }))
  }, [habits])

  const toggleHabit = useCallback((id) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit

        const completedToday = !habit.completedToday
        return {
          ...habit,
          completedToday,
          streak: completedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1),
        }
      })
    )
  }, [])

  const addHabit = useCallback((name, icon = '✨') => {
    if (!name.trim()) return

    setHabits((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: name.trim(),
        icon,
        streak: 0,
        completedToday: false,
      },
    ])
  }, [])

  const deleteHabit = useCallback((id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }, [])

  const completedCount = habits.filter((h) => h.completedToday).length
  const totalCount = habits.length

  return {
    habits,
    completedCount,
    totalCount,
    toggleHabit,
    addHabit,
    deleteHabit,
  }
}
