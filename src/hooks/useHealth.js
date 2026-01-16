import { useMemo } from 'react'
import { healthData } from '../data/mockData'

export function useHealth() {
  const metrics = useMemo(() => ({
    steps: {
      ...healthData.steps,
      progress: Math.min((healthData.steps.current / healthData.steps.goal) * 100, 100),
      icon: '👣',
      label: 'Steps',
      color: 'var(--accent)',
      displayValue: healthData.steps.current.toLocaleString(),
      displayGoal: healthData.steps.goal.toLocaleString(),
    },
    water: {
      ...healthData.water,
      progress: Math.min((healthData.water.current / healthData.water.goal) * 100, 100),
      icon: '💧',
      label: 'Water',
      color: '#38bdf8',
      displayValue: `${healthData.water.current} cups`,
      displayGoal: `${healthData.water.goal} cups`,
    },
    sleep: {
      ...healthData.sleep,
      progress: Math.min((healthData.sleep.hours / 8) * 100, 100),
      icon: '😴',
      label: 'Sleep',
      color: '#a78bfa',
      displayValue: `${healthData.sleep.hours}h`,
      displayGoal: healthData.sleep.quality,
    },
    calories: {
      ...healthData.calories,
      progress: Math.min((healthData.calories.consumed / healthData.calories.goal) * 100, 100),
      icon: '🔥',
      label: 'Calories',
      color: '#fb923c',
      displayValue: healthData.calories.consumed.toString(),
      displayGoal: healthData.calories.goal.toString(),
    },
  }), [])

  return { metrics }
}
