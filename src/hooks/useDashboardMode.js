import { useState, useCallback } from 'react'

const STORAGE_KEY = 'dashboard-mode'

export const MODES = {
  HOME: 'home',
  WORK: 'work',
  PERSONAL: 'personal',
}

export const modeConfig = {
  [MODES.HOME]: {
    name: 'Home',
    icon: '🏠',
    description: 'All widgets',
  },
  [MODES.WORK]: {
    name: 'Work',
    icon: '💼',
    description: 'Focus on productivity',
  },
  [MODES.PERSONAL]: {
    name: 'Personal',
    icon: '🌟',
    description: 'Life & wellness',
  },
}

// Widget categories for each mode
export const modeWidgets = {
  [MODES.HOME]: [
    'clock', 'weather', 'calendar', 'todo', 'monarch', 'health',
    'pomodoro', 'habits', 'spotify', 'books', 'github', 'notes',
    'quote', 'countdown'
  ],
  [MODES.WORK]: [
    'clock', 'weather', 'calendar', 'todo', 'pomodoro', 'github',
    'notes', 'quote'
  ],
  [MODES.PERSONAL]: [
    'clock', 'weather', 'calendar', 'monarch', 'health', 'habits',
    'spotify', 'books', 'quote', 'countdown'
  ],
}

function getStoredMode() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored && Object.values(MODES).includes(stored) ? stored : MODES.HOME
  } catch {
    return MODES.HOME
  }
}

export function useDashboardMode() {
  const [mode, setMode] = useState(getStoredMode)

  const setModeAndStore = useCallback((newMode) => {
    setMode(newMode)
    localStorage.setItem(STORAGE_KEY, newMode)
  }, [])

  const isWidgetVisible = useCallback((widgetId) => {
    return modeWidgets[mode].includes(widgetId)
  }, [mode])

  return {
    mode,
    setMode: setModeAndStore,
    isWidgetVisible,
    modeConfig: modeConfig[mode],
    allModes: MODES,
  }
}
