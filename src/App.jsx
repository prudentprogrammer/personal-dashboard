import { useState, useEffect, useCallback, useMemo } from 'react'
import './App.css'
import { useTheme } from './hooks/useTheme'
import { useWeather } from './hooks/useWeather'
import { useDashboardMode } from './hooks/useDashboardMode'
import Sidebar from './components/Sidebar'
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
import StatCards from './components/StatCards'

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

const NAME_KEY = 'dashboard-user-name'

function useGreeting() {
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) || '')
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const saveName = useCallback((newName) => {
    setName(newName)
    localStorage.setItem(NAME_KEY, newName)
  }, [])

  const greeting = useMemo(() => {
    const hour = time.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }, [time])

  const formattedDate = useMemo(() => {
    return time.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }, [time])

  return { greeting, name, saveName, formattedDate }
}

function Greeting({ greeting, name, saveName, formattedDate, weather, weatherIcons, convertTemp, unit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(name)

  const handleSubmit = (e) => {
    e.preventDefault()
    saveName(editName)
    setIsEditing(false)
  }

  return (
    <div className="greeting">
      <h1 className="greeting__title">
        {greeting}{name ? `, ${name}` : ''}
        <button
          className="greeting__edit-btn"
          onClick={() => {
            setEditName(name)
            setIsEditing(true)
          }}
          title={name ? "Edit your name" : "Set your name"}
        >
          {name ? '✎' : '+'}
        </button>
      </h1>
      <p className="greeting__subtitle">
        <span className="greeting__date">{formattedDate}</span>
        {weather && (
          <>
            <span className="greeting__separator">•</span>
            <span className="greeting__weather">
              {weatherIcons[weather.current.condition]} {convertTemp(weather.current.temp)}°{unit}
            </span>
          </>
        )}
      </p>
      {isEditing && (
        <div className="greeting__edit-overlay" onClick={() => setIsEditing(false)}>
          <form
            className="greeting__edit-form"
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              placeholder="Enter your name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="greeting__edit-input"
              autoFocus
            />
            <button type="submit" className="greeting__edit-save">Save</button>
          </form>
        </div>
      )}
    </div>
  )
}

function App() {
  const { currentTheme, themes, setThemeById } = useTheme()
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false)
  const { isFullscreen, toggleFullscreen } = useFullscreen()
  const { greeting, name, saveName, formattedDate } = useGreeting()
  const { weather, weatherIcons, convertTemp, unit } = useWeather()
  const { mode, setMode, isWidgetVisible } = useDashboardMode()

  return (
    <div className="dashboard-layout">
      <Sidebar currentMode={mode} onModeChange={setMode} userName={name} />

      <div className="dashboard">
        <header className="dashboard__header">
          <Greeting
            greeting={greeting}
            name={name}
            saveName={saveName}
            formattedDate={formattedDate}
            weather={weather}
            weatherIcons={weatherIcons}
            convertTemp={convertTemp}
            unit={unit}
          />
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
          {isWidgetVisible('clock') && <ClockWidget />}
          {isWidgetVisible('weather') && <WeatherWidget />}
          {isWidgetVisible('calendar') && <CalendarWidget className="grid-span-2" />}
          {isWidgetVisible('todo') && <TodoWidget className="grid-row-span-2" />}
          {isWidgetVisible('monarch') && <MonarchWidget className="grid-row-span-2" />}
          {isWidgetVisible('health') && <HealthWidget />}
          {isWidgetVisible('pomodoro') && <PomodoroWidget />}
          {isWidgetVisible('habits') && <HabitsWidget />}
          {isWidgetVisible('spotify') && <SpotifyWidget />}
          {isWidgetVisible('books') && <BooksWidget />}
          {isWidgetVisible('github') && <GitHubWidget />}
          {isWidgetVisible('notes') && <NotesWidget />}
          {isWidgetVisible('quote') && <QuoteWidget />}
          {isWidgetVisible('countdown') && <CountdownWidget />}
        </main>

        <StatCards />
      </div>
    </div>
  )
}

export default App
