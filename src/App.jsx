import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { useTheme } from './hooks/useTheme'
import ClockWidget from './components/ClockWidget'
import WeatherWidget from './components/WeatherWidget'
import CalendarWidget from './components/CalendarWidget'
import TodoWidget from './components/TodoWidget'
import HealthWidget from './components/HealthWidget'
import BooksWidget from './components/BooksWidget'
import PomodoroWidget from './components/PomodoroWidget'
import QuoteWidget from './components/QuoteWidget'
import HabitsWidget from './components/HabitsWidget'
import NotesWidget from './components/NotesWidget'
import GitHubWidget from './components/GitHubWidget'
import SpotifyWidget from './components/SpotifyWidget'
import MonarchWidget from './components/MonarchWidget'
import CountdownWidget from './components/CountdownWidget'

function ThemePicker({ currentTheme, themes, onSelect, isOpen, onToggle }) {
  return (
    <div className="theme-picker">
      <button
        className="theme-toggle"
        onClick={onToggle}
        aria-label="Change theme"
        title={currentTheme.name}
      >
        {currentTheme.icon}
      </button>
      {isOpen && (
        <div className="theme-picker__dropdown">
          {themes.map((t) => (
            <button
              key={t.id}
              className={`theme-picker__option ${t.id === currentTheme.id ? 'theme-picker__option--active' : ''}`}
              onClick={() => {
                onSelect(t.id)
                onToggle()
              }}
            >
              <span className="theme-picker__icon">{t.icon}</span>
              <span className="theme-picker__name">{t.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleChange)
    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [])

  return { isFullscreen, toggleFullscreen }
}

function App() {
  const { currentTheme, themes, setThemeById } = useTheme()
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false)
  const { isFullscreen, toggleFullscreen } = useFullscreen()

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1 className="dashboard__title">Personal Dashboard</h1>
        <div className="dashboard__controls">
          <button
            className="dashboard__control-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? '⊙' : '⛶'}
          </button>
          <ThemePicker
            currentTheme={currentTheme}
            themes={themes}
            onSelect={setThemeById}
            isOpen={isThemePickerOpen}
            onToggle={() => setIsThemePickerOpen(!isThemePickerOpen)}
          />
        </div>
      </header>

      <main className="dashboard__grid">
        <ClockWidget />

        <WeatherWidget />

        <CalendarWidget className="grid-span-2" />

        <TodoWidget className="grid-row-span-2" />

        <MonarchWidget className="grid-row-span-2" />

        <HealthWidget />

        <PomodoroWidget />

        <HabitsWidget />

        <SpotifyWidget />

        <BooksWidget />

        <GitHubWidget />

        <NotesWidget />

        <QuoteWidget />

        <CountdownWidget />
      </main>
    </div>
  )
}

export default App
