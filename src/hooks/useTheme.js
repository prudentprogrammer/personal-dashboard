import { useState, useEffect } from 'react'

const STORAGE_KEY = 'dashboard-theme'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored || 'dark'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggleTheme }
}
