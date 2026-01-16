import { useState, useEffect } from 'react'

const STORAGE_KEY = 'dashboard-theme'

export const themes = [
  { id: 'dark', name: 'Dark', icon: '🌙' },
  { id: 'light', name: 'Light', icon: '☀️' },
  { id: 'nord', name: 'Nord', icon: '❄️' },
  { id: 'dracula', name: 'Dracula', icon: '🧛' },
  { id: 'solarized', name: 'Solarized', icon: '🌅' },
  { id: 'forest', name: 'Forest', icon: '🌲' },
]

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored || 'dark'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const cycleTheme = () => {
    const currentIndex = themes.findIndex((t) => t.id === theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex].id)
  }

  const setThemeById = (themeId) => {
    if (themes.some((t) => t.id === themeId)) {
      setTheme(themeId)
    }
  }

  const currentTheme = themes.find((t) => t.id === theme) || themes[0]

  return { theme, currentTheme, themes, cycleTheme, setThemeById }
}
