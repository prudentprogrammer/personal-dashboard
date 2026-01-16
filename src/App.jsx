import './App.css'
import { useTheme } from './hooks/useTheme'
import ClockWidget from './components/ClockWidget'
import WeatherWidget from './components/WeatherWidget'
import CalendarWidget from './components/CalendarWidget'
import TodoWidget from './components/TodoWidget'
import HealthWidget from './components/HealthWidget'
import BooksWidget from './components/BooksWidget'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1 className="dashboard__title">Personal Dashboard</h1>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>

      <main className="dashboard__grid">
        <ClockWidget />

        <WeatherWidget />

        <CalendarWidget className="grid-span-2" />

        <TodoWidget className="grid-row-span-2" />

        <HealthWidget />

        <BooksWidget className="grid-span-2" />
      </main>
    </div>
  )
}

export default App
