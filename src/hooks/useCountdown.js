import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'dashboard-countdowns'

function getStoredCountdowns() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function calculateTimeLeft(targetDate) {
  const now = new Date()
  const target = new Date(targetDate)
  const diff = target - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isPast: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return { days, hours, minutes, isPast: false }
}

export function useCountdown() {
  const [countdowns, setCountdowns] = useState(() => getStoredCountdowns())
  const [, setTick] = useState(0)

  // Update every minute to refresh time left
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1)
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(countdowns))
  }, [countdowns])

  const addCountdown = useCallback((name, date, icon = '📅') => {
    const newCountdown = {
      id: Date.now().toString(),
      name,
      date,
      icon,
      createdAt: new Date().toISOString(),
    }
    setCountdowns(prev => [...prev, newCountdown])
  }, [])

  const removeCountdown = useCallback((id) => {
    setCountdowns(prev => prev.filter(c => c.id !== id))
  }, [])

  const updateCountdown = useCallback((id, updates) => {
    setCountdowns(prev => prev.map(c =>
      c.id === id ? { ...c, ...updates } : c
    ))
  }, [])

  // Add calculated time left to each countdown
  const countdownsWithTimeLeft = countdowns.map(countdown => ({
    ...countdown,
    timeLeft: calculateTimeLeft(countdown.date),
  })).sort((a, b) => new Date(a.date) - new Date(b.date))

  return {
    countdowns: countdownsWithTimeLeft,
    addCountdown,
    removeCountdown,
    updateCountdown,
  }
}
